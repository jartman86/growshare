import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { notifyNewReview } from '@/lib/notifications'

// Create a new review
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { plotId, toolId, rating, title, content, comment } = body

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Determine review type based on what ID is provided
    if (toolId) {
      return await createToolReview(currentUser, toolId, rating, title, content || comment)
    } else if (plotId) {
      return await createPlotReview(currentUser, plotId, rating, title, content || comment)
    } else {
      return NextResponse.json(
        { error: 'Either plotId or toolId is required' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}

// Create a tool rental review
async function createToolReview(
  currentUser: { id: string; firstName: string | null; lastName: string | null },
  toolId: string,
  rating: number,
  title: string | undefined,
  content: string | undefined
) {
  // Check if tool exists
  const tool = await prisma.tool.findUnique({
    where: { id: toolId },
    include: { owner: true },
  })

  if (!tool) {
    return NextResponse.json({ error: 'Tool not found' }, { status: 404 })
  }

  // Can't review your own tool
  if (tool.ownerId === currentUser.id) {
    return NextResponse.json(
      { error: 'You cannot review your own tool' },
      { status: 400 }
    )
  }

  // Find a completed rental for this tool by this user
  const completedRental = await prisma.toolRental.findFirst({
    where: {
      toolId,
      renterId: currentUser.id,
      status: 'COMPLETED',
    },
  })

  if (!completedRental) {
    return NextResponse.json(
      { error: 'You must complete a rental before reviewing this tool' },
      { status: 403 }
    )
  }

  // Check if user already reviewed this rental
  const existingReview = await prisma.review.findFirst({
    where: {
      toolRentalId: completedRental.id,
      authorId: currentUser.id,
    },
  })

  if (existingReview) {
    return NextResponse.json(
      { error: 'You have already reviewed this tool rental' },
      { status: 400 }
    )
  }

  // Create review in transaction
  const review = await prisma.$transaction(async (tx) => {
    const newReview = await tx.review.create({
      data: {
        type: 'TOOL_RENTAL',
        toolRentalId: completedRental.id,
        authorId: currentUser.id,
        rating,
        title: title || null,
        content: content || '',
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        toolRental: {
          select: {
            id: true,
            tool: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    // Award points for leaving a review
    await tx.user.update({
      where: { id: currentUser.id },
      data: { totalPoints: { increment: 10 } },
    })

    // Create activity
    await tx.userActivity.create({
      data: {
        userId: currentUser.id,
        type: 'REVIEW_CREATED',
        title: 'Review submitted',
        description: `Reviewed ${tool.name}`,
        points: 10,
      },
    })

    return newReview
  })

  // Send notification to tool owner
  try {
    await notifyNewReview(
      tool.ownerId,
      tool.name,
      `${currentUser.firstName} ${currentUser.lastName}`,
      rating,
      toolId
    )
  } catch {
    // Notification failure is not critical
  }

  return NextResponse.json(review, { status: 201 })
}

// Create a plot review
async function createPlotReview(
  currentUser: { id: string; firstName: string | null; lastName: string | null },
  plotId: string,
  rating: number,
  title: string | undefined,
  content: string | undefined
) {
  // Check if plot exists
  const plot = await prisma.plot.findUnique({
    where: { id: plotId },
  })

  if (!plot) {
    return NextResponse.json({ error: 'Plot not found' }, { status: 404 })
  }

  // Can't review your own plot
  if (plot.ownerId === currentUser.id) {
    return NextResponse.json(
      { error: 'You cannot review your own plot' },
      { status: 400 }
    )
  }

  // Verify user has a completed booking for this plot
  const completedBooking = await prisma.booking.findFirst({
    where: {
      plotId,
      renterId: currentUser.id,
      status: 'COMPLETED',
    },
  })

  if (!completedBooking) {
    return NextResponse.json(
      { error: 'You must complete a booking before reviewing this plot' },
      { status: 403 }
    )
  }

  // Use transaction to ensure all operations succeed or fail together
  let review
  try {
    review = await prisma.$transaction(async (tx) => {
      // Create review (database constraint will prevent duplicates)
      const newReview = await tx.review.create({
        data: {
          type: 'PLOT',
          plotId,
          authorId: currentUser.id,
          rating,
          title: title || null,
          content: content || '',
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          plot: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      })

      // Calculate new average rating for the plot
      const allReviews = await tx.review.findMany({
        where: { plotId },
        select: { rating: true },
      })

      const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

      // Update plot with new average rating
      await tx.plot.update({
        where: { id: plotId },
        data: { averageRating },
      })

      // Award points for leaving a review
      await tx.user.update({
        where: { id: currentUser.id },
        data: { totalPoints: { increment: 10 } },
      })

      // Create activity
      await tx.userActivity.create({
        data: {
          userId: currentUser.id,
          type: 'REVIEW_CREATED',
          title: 'Review submitted',
          description: `Reviewed ${plot.title}`,
          points: 10,
        },
      })

      return newReview
    })
  } catch (txError: unknown) {
    // Check if error is due to unique constraint violation
    if (txError && typeof txError === 'object' && 'code' in txError && txError.code === 'P2002') {
      return NextResponse.json(
        { error: 'You have already reviewed this plot' },
        { status: 400 }
      )
    }
    throw txError // Re-throw if it's a different error
  }

  // Send notification to plot owner (outside transaction - allowed to fail)
  if (plot.ownerId !== currentUser.id) {
    try {
      await notifyNewReview(
        plot.ownerId,
        plot.title,
        `${currentUser.firstName} ${currentUser.lastName}`,
        rating,
        plotId
      )
    } catch {
      // Notification failure is not critical
    }
  }

  return NextResponse.json(review, { status: 201 })
}

// Get reviews for a plot, tool, or user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const plotId = searchParams.get('plotId')
    const toolId = searchParams.get('toolId')
    const authorId = searchParams.get('authorId')
    const limit = searchParams.get('limit')

    // Using Record type for dynamic property assignment, then cast to ReviewWhereInput
    const where: Record<string, unknown> = {}

    if (plotId) {
      where.plotId = plotId
    }

    if (toolId) {
      // For tool reviews, we need to find reviews through toolRental
      where.toolRental = {
        toolId: toolId,
      }
    }

    if (authorId) {
      where.authorId = authorId
    }

    const reviews = await prisma.review.findMany({
      where: where as Prisma.ReviewWhereInput,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            isVerified: true,
          },
        },
        plot: {
          select: {
            id: true,
            title: true,
            city: true,
            state: true,
            images: true,
          },
        },
        toolRental: {
          select: {
            id: true,
            tool: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit ? parseInt(limit) : undefined,
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

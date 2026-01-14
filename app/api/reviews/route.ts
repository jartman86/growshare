import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

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
    const { plotId, rating, comment } = body

    // Validate required fields
    if (!plotId || !rating) {
      return NextResponse.json(
        { error: 'Plot ID and rating are required' },
        { status: 400 }
      )
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

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

    // Check if user already reviewed this plot
    const existingReview = await prisma.review.findFirst({
      where: {
        plotId,
        authorId: currentUser.id,
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this plot' },
        { status: 400 }
      )
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        type: 'PLOT',
        plotId,
        authorId: currentUser.id,
        rating,
        content: comment || '',
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
    const allReviews = await prisma.review.findMany({
      where: { plotId },
      select: { rating: true },
    })

    const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

    // Update plot with new average rating
    await prisma.plot.update({
      where: { id: plotId },
      data: { averageRating },
    })

    // Award points for leaving a review
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { totalPoints: { increment: 10 } },
    })

    // Create activity
    await prisma.userActivity.create({
      data: {
        userId: currentUser.id,
        type: 'REVIEW_CREATED',
        title: 'Review submitted',
        description: `Reviewed ${plot.title}`,
        points: 10,
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}

// Get reviews for a plot or user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const plotId = searchParams.get('plotId')
    const authorId = searchParams.get('authorId')
    const limit = searchParams.get('limit')

    const where: any = {}

    if (plotId) {
      where.plotId = plotId
    }

    if (authorId) {
      where.authorId = authorId
    }

    const reviews = await prisma.review.findMany({
      where,
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
        booking: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
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

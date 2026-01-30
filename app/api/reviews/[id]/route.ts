import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// Get a specific review
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const review = await prisma.review.findUnique({
      where: { id },
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
      },
    })

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    return NextResponse.json(review)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch review' },
      { status: 500 }
    )
  }
}

// Update a review
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
    const { rating, comment, response: ownerResponse } = body

    // Get existing review with plot info
    const existingReview = await prisma.review.findUnique({
      where: { id },
      include: {
        plot: {
          select: {
            ownerId: true,
          },
        },
      },
    })

    if (!existingReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    // Handle owner response
    if (ownerResponse !== undefined) {
      // Check if user is the plot owner
      if (!existingReview.plot || existingReview.plot.ownerId !== currentUser.id) {
        return NextResponse.json(
          { error: 'Only the plot owner can respond to reviews' },
          { status: 403 }
        )
      }

      // Validate response content
      if (typeof ownerResponse !== 'string' || ownerResponse.trim().length === 0) {
        return NextResponse.json(
          { error: 'Response cannot be empty' },
          { status: 400 }
        )
      }

      if (ownerResponse.length > 2000) {
        return NextResponse.json(
          { error: 'Response cannot exceed 2000 characters' },
          { status: 400 }
        )
      }

      // Update with owner response
      const updatedReview = await prisma.review.update({
        where: { id },
        data: {
          response: ownerResponse.trim(),
          respondedAt: new Date(),
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
              ownerId: true,
              owner: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      })

      return NextResponse.json(updatedReview)
    }

    // Handle regular review update (by review author)
    if (existingReview.authorId !== currentUser.id) {
      return NextResponse.json(
        { error: 'You can only update your own reviews' },
        { status: 403 }
      )
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Update review
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        ...(rating && { rating }),
        ...(comment !== undefined && { content: comment }),
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

    // Recalculate average rating if rating changed
    if (rating && existingReview.plotId) {
      const allReviews = await prisma.review.findMany({
        where: { plotId: existingReview.plotId },
        select: { rating: true },
      })

      const averageRating = allReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / allReviews.length

      await prisma.plot.update({
        where: { id: existingReview.plotId },
        data: { averageRating },
      })
    }

    return NextResponse.json(updatedReview)
  } catch {
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    )
  }
}

// Delete a review
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Get existing review
    const existingReview = await prisma.review.findUnique({
      where: { id },
    })

    if (!existingReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    // Check if user owns this review
    if (existingReview.authorId !== currentUser.id) {
      return NextResponse.json(
        { error: 'You can only delete your own reviews' },
        { status: 403 }
      )
    }

    // Delete review
    await prisma.review.delete({
      where: { id },
    })

    // Recalculate average rating
    if (existingReview.plotId) {
      const remainingReviews = await prisma.review.findMany({
        where: { plotId: existingReview.plotId },
        select: { rating: true },
      })

      const averageRating = remainingReviews.length > 0
        ? remainingReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / remainingReviews.length
        : null

      await prisma.plot.update({
        where: { id: existingReview.plotId },
        data: { averageRating },
      })
    }

    // Deduct points for deleting review
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { totalPoints: { decrement: 10 } },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    )
  }
}

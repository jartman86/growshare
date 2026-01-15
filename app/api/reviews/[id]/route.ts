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
        booking: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    })

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    return NextResponse.json(review)
  } catch (error) {
    console.error('Error fetching review:', error)
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
    const { rating, comment } = body

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
    if (rating) {
      const allReviews = await prisma.review.findMany({
        where: { plotId: existingReview.plotId },
        select: { rating: true },
      })

      const averageRating = allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / allReviews.length

      await prisma.plot.update({
        where: { id: existingReview.plotId },
        data: { averageRating },
      })
    }

    return NextResponse.json(updatedReview)
  } catch (error) {
    console.error('Error updating review:', error)
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
    const remainingReviews = await prisma.review.findMany({
      where: { plotId: existingReview.plotId },
      select: { rating: true },
    })

    const averageRating = remainingReviews.length > 0
      ? remainingReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / remainingReviews.length
      : null

    await prisma.plot.update({
      where: { id: existingReview.plotId },
      data: { averageRating },
    })

    // Deduct points for deleting review
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { totalPoints: { decrement: 10 } },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// POST - Create or update a vote
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reviewId } = await params
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
    const { value } = body

    // Validate vote value
    if (value !== 1 && value !== -1) {
      return NextResponse.json(
        { error: 'Vote value must be 1 (helpful) or -1 (not helpful)' },
        { status: 400 }
      )
    }

    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    })

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    // Can't vote on your own review
    if (review.authorId === currentUser.id) {
      return NextResponse.json(
        { error: 'You cannot vote on your own review' },
        { status: 400 }
      )
    }

    // Check for existing vote
    const existingVote = await prisma.reviewVote.findUnique({
      where: {
        userId_reviewId: {
          userId: currentUser.id,
          reviewId,
        },
      },
    })

    let helpfulDelta = 0
    let notHelpfulDelta = 0

    if (existingVote) {
      if (existingVote.value === value) {
        // Same vote, remove it (toggle off)
        await prisma.reviewVote.delete({
          where: { id: existingVote.id },
        })

        if (value === 1) {
          helpfulDelta = -1
        } else {
          notHelpfulDelta = -1
        }
      } else {
        // Different vote, update it
        await prisma.reviewVote.update({
          where: { id: existingVote.id },
          data: { value },
        })

        if (value === 1) {
          helpfulDelta = 1
          notHelpfulDelta = -1
        } else {
          helpfulDelta = -1
          notHelpfulDelta = 1
        }
      }
    } else {
      // New vote
      await prisma.reviewVote.create({
        data: {
          reviewId,
          userId: currentUser.id,
          value,
        },
      })

      if (value === 1) {
        helpfulDelta = 1
      } else {
        notHelpfulDelta = 1
      }
    }

    // Update review vote counts
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        helpfulCount: { increment: helpfulDelta },
        notHelpfulCount: { increment: notHelpfulDelta },
      },
      select: {
        id: true,
        helpfulCount: true,
        notHelpfulCount: true,
      },
    })

    // Get user's current vote (if any)
    const userVote = await prisma.reviewVote.findUnique({
      where: {
        userId_reviewId: {
          userId: currentUser.id,
          reviewId,
        },
      },
      select: { value: true },
    })

    return NextResponse.json({
      ...updatedReview,
      userVote: userVote?.value || null,
    })
  } catch (error) {
    console.error('Error voting on review:', error)
    return NextResponse.json(
      { error: 'Failed to vote on review' },
      { status: 500 }
    )
  }
}

// GET - Get user's vote for a review
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reviewId } = await params
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ userVote: null })
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ userVote: null })
    }

    const vote = await prisma.reviewVote.findUnique({
      where: {
        userId_reviewId: {
          userId: currentUser.id,
          reviewId,
        },
      },
      select: { value: true },
    })

    return NextResponse.json({ userVote: vote?.value || null })
  } catch (error) {
    console.error('Error getting vote:', error)
    return NextResponse.json(
      { error: 'Failed to get vote' },
      { status: 500 }
    )
  }
}

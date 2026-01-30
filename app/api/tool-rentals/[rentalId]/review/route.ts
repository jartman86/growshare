import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ensureUser } from '@/lib/ensure-user'

interface RouteParams {
  params: Promise<{ rentalId: string }>
}

// Create a review for a tool rental
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const currentUser = await ensureUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { rentalId } = await params
    const body = await request.json()
    const { rating, title, content } = body

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    if (!content || content.trim().length < 10) {
      return NextResponse.json(
        { error: 'Review content must be at least 10 characters' },
        { status: 400 }
      )
    }

    // Get the rental and verify ownership
    const rental = await prisma.toolRental.findUnique({
      where: { id: rentalId },
      include: {
        tool: {
          select: {
            ownerId: true,
          },
        },
      },
    })

    if (!rental) {
      return NextResponse.json({ error: 'Rental not found' }, { status: 404 })
    }

    if (rental.renterId !== currentUser.id) {
      return NextResponse.json(
        { error: 'You can only review your own rentals' },
        { status: 403 }
      )
    }

    // Check if rental is completed (either status is COMPLETED or rental period has ended)
    const isCompleted = rental.status === 'COMPLETED' || rental.endDate < new Date()

    if (!isCompleted) {
      return NextResponse.json(
        { error: 'You can only review completed rentals' },
        { status: 400 }
      )
    }

    // Check if already reviewed
    const existingReview = await prisma.review.findFirst({
      where: {
        toolRentalId: rentalId,
        authorId: currentUser.id,
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this rental' },
        { status: 400 }
      )
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        type: 'TOOL_RENTAL',
        authorId: currentUser.id,
        toolRentalId: rentalId,
        rating,
        title,
        content: content.trim(),
      },
    })

    // Award points for leaving a review
    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        totalPoints: { increment: 15 },
      },
    })

    // Create activity
    await prisma.userActivity.create({
      data: {
        userId: currentUser.id,
        type: 'REVIEW_SUBMITTED',
        title: 'Left a Tool Review',
        description: `Reviewed tool rental`,
        points: 15,
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { createRefund, centsToDollars } from '@/lib/stripe'
import { rateLimit, getClientIdentifier, rateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'
import { validateRequest, refundRequestSchema } from '@/lib/validations'

// Calculate refund percentage based on days until booking start
function calculateRefundPercentage(startDate: Date): number {
  const now = new Date()
  const msPerDay = 1000 * 60 * 60 * 24
  const daysUntilStart = Math.ceil((startDate.getTime() - now.getTime()) / msPerDay)

  if (daysUntilStart >= 7) {
    return 100 // Full refund: 7+ days before start
  } else if (daysUntilStart >= 3) {
    return 50 // Partial refund: 3-6 days before start
  } else {
    return 0 // No refund: less than 3 days before start
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limit: 10 refund attempts per minute
    const rateLimitResult = rateLimit(
      getClientIdentifier(request, userId),
      RATE_LIMITS.payment
    )
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult)
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()

    // Validate request body
    const validation = validateRequest(refundRequestSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { bookingId } = validation.data

    // Get booking with payment intent
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        plot: {
          include: {
            owner: {
              select: { id: true },
            },
          },
        },
        paymentIntent: true,
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Verify user is the renter or plot owner
    const isRenter = booking.renterId === currentUser.id
    const isOwner = booking.plot.ownerId === currentUser.id

    if (!isRenter && !isOwner) {
      return NextResponse.json(
        { error: 'You do not have permission to process refunds for this booking' },
        { status: 403 }
      )
    }

    // Check if booking was paid
    if (!booking.paidAt || !booking.paymentIntent) {
      return NextResponse.json(
        { error: 'This booking has not been paid and cannot be refunded' },
        { status: 400 }
      )
    }

    // Check if already refunded
    if (booking.paymentIntent.status === 'REFUNDED') {
      return NextResponse.json(
        { error: 'This booking has already been refunded' },
        { status: 400 }
      )
    }

    // Check if payment succeeded
    if (booking.paymentIntent.status !== 'SUCCEEDED') {
      return NextResponse.json(
        { error: 'Only successful payments can be refunded' },
        { status: 400 }
      )
    }

    // Calculate refund amount
    const refundPercentage = calculateRefundPercentage(booking.startDate)

    if (refundPercentage === 0) {
      return NextResponse.json({
        success: false,
        refundAmount: 0,
        refundPercentage: 0,
        message: 'No refund available - cancellation is less than 3 days before start date',
      })
    }

    const refundAmount = Math.round(booking.paymentIntent.amount * (refundPercentage / 100))

    // Process refund via Stripe
    const refund = await createRefund(
      booking.paymentIntent.stripePaymentIntentId,
      refundAmount
    )

    // Update payment intent status
    await prisma.paymentIntent.update({
      where: { id: booking.paymentIntent.id },
      data: {
        status: 'REFUNDED',
        metadata: {
          ...((booking.paymentIntent.metadata as object) || {}),
          refundId: refund.id,
          refundAmount,
          refundPercentage,
          refundedAt: new Date().toISOString(),
        },
      },
    })

    return NextResponse.json({
      success: true,
      refundAmount: centsToDollars(refundAmount),
      refundPercentage,
      refundId: refund.id,
      message: `Successfully refunded ${refundPercentage}% ($${centsToDollars(refundAmount).toFixed(2)})`,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to process refund' },
      { status: 500 }
    )
  }
}

// GET endpoint to check refund eligibility
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('bookingId')

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    // Get booking with payment intent
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        plot: true,
        paymentIntent: true,
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Verify user is the renter or plot owner
    const isRenter = booking.renterId === currentUser.id
    const isOwner = booking.plot.ownerId === currentUser.id

    if (!isRenter && !isOwner) {
      return NextResponse.json(
        { error: 'You do not have permission to view this booking' },
        { status: 403 }
      )
    }

    // Check refund eligibility
    if (!booking.paidAt || !booking.paymentIntent) {
      return NextResponse.json({
        eligible: false,
        reason: 'Booking has not been paid',
      })
    }

    if (booking.paymentIntent.status === 'REFUNDED') {
      const metadata = booking.paymentIntent.metadata as { refundAmount?: number } | null
      return NextResponse.json({
        eligible: false,
        reason: 'Already refunded',
        refundedAmount: metadata?.refundAmount ? centsToDollars(metadata.refundAmount) : null,
      })
    }

    if (booking.paymentIntent.status !== 'SUCCEEDED') {
      return NextResponse.json({
        eligible: false,
        reason: 'Payment did not succeed',
      })
    }

    const refundPercentage = calculateRefundPercentage(booking.startDate)
    const refundAmount = Math.round(booking.paymentIntent.amount * (refundPercentage / 100))

    return NextResponse.json({
      eligible: refundPercentage > 0,
      refundPercentage,
      refundAmount: centsToDollars(refundAmount),
      originalAmount: centsToDollars(booking.paymentIntent.amount),
      daysUntilStart: Math.ceil(
        (booking.startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      ),
      policy: {
        '7+ days': '100% refund',
        '3-6 days': '50% refund',
        '<3 days': 'No refund',
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to check refund eligibility' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { notifyBookingApproved, notifyBookingRejected, notifyBookingCancelled, notifyRefundProcessed } from '@/lib/notifications'
import { createRefund, centsToDollars } from '@/lib/stripe'

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

// Update booking status (approve, reject, cancel)
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

    const bookingId = id
    const body = await request.json()
    const { status } = body

    // Validate status
    const validStatuses = ['APPROVED', 'REJECTED', 'CANCELLED']
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be APPROVED, REJECTED, or CANCELLED' },
        { status: 400 }
      )
    }

    // Get booking with plot, renter info, and payment intent
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        plot: {
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                stripeOnboardingComplete: true,
              },
            },
          },
        },
        renter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        paymentIntent: true,
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Permission checks
    const isOwner = booking.plot.ownerId === currentUser.id
    const isRenter = booking.renterId === currentUser.id

    if (status === 'APPROVED' || status === 'REJECTED') {
      // Only plot owners can approve or reject
      if (!isOwner) {
        return NextResponse.json(
          { error: 'Only the plot owner can approve or reject bookings' },
          { status: 403 }
        )
      }

      // Can only approve/reject pending bookings
      if (booking.status !== 'PENDING') {
        return NextResponse.json(
          { error: `Cannot ${status.toLowerCase()} a ${booking.status.toLowerCase()} booking` },
          { status: 400 }
        )
      }

      // Require Stripe Connect setup to approve bookings
      if (status === 'APPROVED' && !booking.plot.owner.stripeOnboardingComplete) {
        return NextResponse.json(
          {
            error: 'Please set up your payout account before approving bookings. Go to Dashboard > Payments to complete setup.',
            requiresConnectSetup: true,
          },
          { status: 400 }
        )
      }
    } else if (status === 'CANCELLED') {
      // Both owner and renter can cancel
      if (!isOwner && !isRenter) {
        return NextResponse.json(
          { error: 'You do not have permission to cancel this booking' },
          { status: 403 }
        )
      }

      // Can only cancel pending or approved bookings
      if (!['PENDING', 'APPROVED'].includes(booking.status)) {
        return NextResponse.json(
          { error: `Cannot cancel a ${booking.status.toLowerCase()} booking` },
          { status: 400 }
        )
      }
    }

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        plot: {
          select: {
            id: true,
            title: true,
            city: true,
            state: true,
            images: true,
          },
        },
        renter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
        paymentIntent: {
          select: {
            status: true,
            metadata: true,
          },
        },
      },
    })

    // Award points and create activities based on status change
    if (status === 'APPROVED') {
      // Award points to plot owner for approving
      await prisma.user.update({
        where: { id: booking.plot.ownerId },
        data: { totalPoints: { increment: 15 } },
      })

      // Create activity for owner
      await prisma.userActivity.create({
        data: {
          userId: booking.plot.ownerId,
          type: 'BOOKING_APPROVED',
          title: 'Booking approved',
          description: `Approved booking for ${booking.plot.title}`,
          points: 15,
        },
      })

      // Create activity for renter
      await prisma.userActivity.create({
        data: {
          userId: booking.renterId,
          type: 'BOOKING_APPROVED',
          title: 'Booking confirmed',
          description: `Your booking for ${booking.plot.title} has been approved`,
          points: 0,
        },
      })

      // Send notification to renter
      try {
        await notifyBookingApproved(booking.renterId, booking.plot.title, bookingId)
      } catch (error) {
        console.error('Failed to send notification:', error)
      }
    } else if (status === 'REJECTED') {
      // Create activity for renter
      await prisma.userActivity.create({
        data: {
          userId: booking.renterId,
          type: 'BOOKING_REJECTED',
          title: 'Booking declined',
          description: `Your booking request for ${booking.plot.title} was declined`,
          points: 0,
        },
      })

      // Send notification to renter
      try {
        await notifyBookingRejected(booking.renterId, booking.plot.title, bookingId)
      } catch (error) {
        console.error('Failed to send notification:', error)
      }
    } else if (status === 'CANCELLED') {
      // Process refund if booking was paid
      let refundInfo: { refundAmount: number; refundPercentage: number; refundId: string } | null = null

      if (booking.paidAt && booking.paymentIntent && booking.paymentIntent.status === 'SUCCEEDED') {
        const refundPercentage = calculateRefundPercentage(booking.startDate)

        if (refundPercentage > 0) {
          try {
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

            refundInfo = {
              refundAmount: centsToDollars(refundAmount),
              refundPercentage,
              refundId: refund.id,
            }

            // Notify renter about the refund
            try {
              await notifyRefundProcessed(
                booking.renterId,
                centsToDollars(refundAmount),
                booking.plot.title,
                bookingId,
                refundPercentage
              )
            } catch (error) {
              console.error('Failed to send refund notification:', error)
            }
          } catch (error) {
            console.error('Failed to process refund:', error)
            // Continue with cancellation even if refund fails - log for manual processing
          }
        }
      }

      // Create activity for the user who cancelled
      await prisma.userActivity.create({
        data: {
          userId: currentUser.id,
          type: 'BOOKING_CANCELLED',
          title: 'Booking cancelled',
          description: refundInfo
            ? `Cancelled booking for ${booking.plot.title} (${refundInfo.refundPercentage}% refund: $${refundInfo.refundAmount.toFixed(2)})`
            : `Cancelled booking for ${booking.plot.title}`,
          points: 0,
        },
      })

      // Create activity for the other party
      const otherUserId = isOwner ? booking.renterId : booking.plot.ownerId
      await prisma.userActivity.create({
        data: {
          userId: otherUserId,
          type: 'BOOKING_CANCELLED',
          title: 'Booking cancelled',
          description: refundInfo
            ? `Booking for ${booking.plot.title} was cancelled (${refundInfo.refundPercentage}% refund processed)`
            : `Booking for ${booking.plot.title} was cancelled`,
          points: 0,
        },
      })

      // Send notification to the other party
      try {
        const cancelledBy = isOwner
          ? `${booking.plot.owner.firstName} ${booking.plot.owner.lastName}`
          : `${booking.renter.firstName} ${booking.renter.lastName}`
        await notifyBookingCancelled(otherUserId, booking.plot.title, bookingId, cancelledBy)
      } catch (error) {
        console.error('Failed to send notification:', error)
      }
    }

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}

// Get a specific booking by ID
export async function GET(
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

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        plot: {
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        renter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Only owner or renter can view the booking
    const isOwner = booking.plot.ownerId === currentUser.id
    const isRenter = booking.renterId === currentUser.id

    if (!isOwner && !isRenter) {
      return NextResponse.json(
        { error: 'You do not have permission to view this booking' },
        { status: 403 }
      )
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ensureUser } from '@/lib/ensure-user'

interface RouteParams {
  params: Promise<{ bookingId: string }>
}

// Create a dispute for a booking
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const currentUser = await ensureUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bookingId } = await params
    const body = await request.json()
    const { reason, description, evidence, requestedAmount } = body

    // Validate required fields
    if (!reason || !description) {
      return NextResponse.json(
        { error: 'Reason and description are required' },
        { status: 400 }
      )
    }

    // Get the booking and verify user is a party to it
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        plot: {
          select: {
            ownerId: true,
          },
        },
        dispute: true,
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check if user is renter or plot owner
    const isRenter = booking.renterId === currentUser.id
    const isOwner = booking.plot.ownerId === currentUser.id

    if (!isRenter && !isOwner) {
      return NextResponse.json(
        { error: 'You can only file disputes for your own bookings' },
        { status: 403 }
      )
    }

    // Check if dispute already exists
    if (booking.dispute) {
      return NextResponse.json(
        { error: 'A dispute has already been filed for this booking' },
        { status: 400 }
      )
    }

    // Create the dispute
    const dispute = await prisma.bookingDispute.create({
      data: {
        bookingId,
        filedById: currentUser.id,
        reason,
        description,
        evidence: evidence || [],
        requestedAmount,
      },
    })

    // Create notification for the other party
    const otherPartyId = isRenter ? booking.plot.ownerId : booking.renterId
    await prisma.notification.create({
      data: {
        userId: otherPartyId,
        type: 'SYSTEM',
        title: 'Dispute Filed',
        content: `A dispute has been filed for booking #${bookingId.slice(-6).toUpperCase()}. Please review and respond.`,
        link: `/bookings/${bookingId}/dispute`,
      },
    })

    return NextResponse.json(dispute, { status: 201 })
  } catch (error) {
    console.error('Error creating dispute:', error)
    return NextResponse.json(
      { error: 'Failed to create dispute' },
      { status: 500 }
    )
  }
}

// Get dispute for a booking
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const currentUser = await ensureUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bookingId } = await params

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        plot: {
          select: {
            ownerId: true,
            title: true,
          },
        },
        dispute: {
          include: {
            filedBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
            resolvedBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            messages: {
              include: {
                sender: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                  },
                },
              },
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check if user has access (renter, owner, or admin)
    const isRenter = booking.renterId === currentUser.id
    const isOwner = booking.plot.ownerId === currentUser.id
    const isAdmin = currentUser.role.includes('ADMIN')

    if (!isRenter && !isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (!booking.dispute) {
      return NextResponse.json({ error: 'No dispute found for this booking' }, { status: 404 })
    }

    // Filter out internal messages for non-admins
    const dispute = {
      ...booking.dispute,
      messages: isAdmin
        ? booking.dispute.messages
        : booking.dispute.messages.filter((m) => !m.isInternal),
    }

    return NextResponse.json({
      dispute,
      booking: {
        id: booking.id,
        plotTitle: booking.plot.title,
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalAmount: booking.totalAmount,
        status: booking.status,
      },
      userRole: isAdmin ? 'admin' : isOwner ? 'owner' : 'renter',
    })
  } catch (error) {
    console.error('Error fetching dispute:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dispute' },
      { status: 500 }
    )
  }
}

// Update dispute (add message, resolve - admin only for resolution)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const currentUser = await ensureUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bookingId } = await params
    const body = await request.json()
    const { message, resolution, resolutionNotes, resolvedAmount, status } = body

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        plot: {
          select: {
            ownerId: true,
          },
        },
        dispute: true,
      },
    })

    if (!booking || !booking.dispute) {
      return NextResponse.json({ error: 'Dispute not found' }, { status: 404 })
    }

    const isRenter = booking.renterId === currentUser.id
    const isOwner = booking.plot.ownerId === currentUser.id
    const isAdmin = currentUser.role.includes('ADMIN')

    if (!isRenter && !isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Add a message if provided
    if (message) {
      await prisma.disputeMessage.create({
        data: {
          disputeId: booking.dispute.id,
          senderId: currentUser.id,
          content: message.content,
          attachments: message.attachments || [],
          isInternal: message.isInternal && isAdmin,
        },
      })
    }

    // Handle resolution (admin only)
    if (resolution && isAdmin) {
      await prisma.bookingDispute.update({
        where: { id: booking.dispute.id },
        data: {
          status: 'RESOLVED',
          resolution,
          resolutionNotes,
          resolvedAmount,
          resolvedById: currentUser.id,
          resolvedAt: new Date(),
        },
      })

      // Notify both parties
      const notifications = [
        {
          userId: booking.renterId,
          type: 'SYSTEM' as const,
          title: 'Dispute Resolved',
          content: `Your dispute for booking #${bookingId.slice(-6).toUpperCase()} has been resolved.`,
          link: `/bookings/${bookingId}/dispute`,
        },
        {
          userId: booking.plot.ownerId,
          type: 'SYSTEM' as const,
          title: 'Dispute Resolved',
          content: `The dispute for booking #${bookingId.slice(-6).toUpperCase()} has been resolved.`,
          link: `/bookings/${bookingId}/dispute`,
        },
      ]

      await prisma.notification.createMany({
        data: notifications,
      })
    }

    // Handle status update (admin or parties for certain transitions)
    if (status && (isAdmin || (status === 'UNDER_REVIEW' && (isRenter || isOwner)))) {
      await prisma.bookingDispute.update({
        where: { id: booking.dispute.id },
        data: { status },
      })
    }

    // Fetch updated dispute
    const updatedDispute = await prisma.bookingDispute.findUnique({
      where: { id: booking.dispute.id },
      include: {
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    return NextResponse.json(updatedDispute)
  } catch (error) {
    console.error('Error updating dispute:', error)
    return NextResponse.json(
      { error: 'Failed to update dispute' },
      { status: 500 }
    )
  }
}

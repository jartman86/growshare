import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { RSVPStatus } from '@prisma/client'

// POST /api/community-events/[id]/rsvp - RSVP to event
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const event = await prisma.communityEvent.findUnique({
      where: { id },
      include: {
        _count: {
          select: { attendees: { where: { status: 'GOING' } } },
        },
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Check if event is cancelled
    if (event.isCancelled) {
      return NextResponse.json(
        { error: 'This event has been cancelled' },
        { status: 400 }
      )
    }

    // Check if event has passed
    if (new Date(event.startDate) < new Date()) {
      return NextResponse.json(
        { error: 'This event has already started' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const status = (body.status as RSVPStatus) || 'GOING'

    // Check capacity if RSVPing as GOING
    if (status === 'GOING' && event.capacity) {
      const currentAttendees = event._count.attendees
      if (currentAttendees >= event.capacity) {
        return NextResponse.json(
          { error: 'Event is at full capacity' },
          { status: 400 }
        )
      }
    }

    // Check if already RSVPed
    const existingRSVP = await prisma.communityEventRSVP.findUnique({
      where: {
        eventId_userId: {
          eventId: id,
          userId: currentUser.id,
        },
      },
    })

    let rsvp
    if (existingRSVP) {
      // Update existing RSVP
      rsvp = await prisma.communityEventRSVP.update({
        where: { id: existingRSVP.id },
        data: { status },
      })
    } else {
      // Create new RSVP
      rsvp = await prisma.communityEventRSVP.create({
        data: {
          eventId: id,
          userId: currentUser.id,
          status,
        },
      })

      // Award points for first RSVP
      if (status === 'GOING') {
        await prisma.user.update({
          where: { id: currentUser.id },
          data: { totalPoints: { increment: 5 } },
        })

        await prisma.userActivity.create({
          data: {
            userId: currentUser.id,
            type: 'EVENT_RSVP',
            title: 'RSVPed to event',
            description: `RSVPed to "${event.title}"`,
            points: 5,
          },
        })
      }
    }

    // Get updated attendee count
    const updatedCount = await prisma.communityEventRSVP.count({
      where: { eventId: id, status: 'GOING' },
    })

    return NextResponse.json({
      rsvp,
      attendeeCount: updatedCount,
      spotsLeft: event.capacity ? event.capacity - updatedCount : null,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to RSVP' },
      { status: 500 }
    )
  }
}

// DELETE /api/community-events/[id]/rsvp - Cancel RSVP
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const rsvp = await prisma.communityEventRSVP.findUnique({
      where: {
        eventId_userId: {
          eventId: id,
          userId: currentUser.id,
        },
      },
    })

    if (!rsvp) {
      return NextResponse.json(
        { error: 'No RSVP found' },
        { status: 404 }
      )
    }

    await prisma.communityEventRSVP.delete({
      where: { id: rsvp.id },
    })

    // Get updated attendee count
    const updatedCount = await prisma.communityEventRSVP.count({
      where: { eventId: id, status: 'GOING' },
    })

    const event = await prisma.communityEvent.findUnique({
      where: { id },
      select: { capacity: true },
    })

    return NextResponse.json({
      success: true,
      attendeeCount: updatedCount,
      spotsLeft: event?.capacity ? event.capacity - updatedCount : null,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to cancel RSVP' },
      { status: 500 }
    )
  }
}

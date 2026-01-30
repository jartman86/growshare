import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// GET /api/community-events/[id] - Get single event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get current user for RSVP status
    const { userId } = await auth()
    let currentUserId: string | null = null

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
        select: { id: true },
      })
      currentUserId = user?.id || null
    }

    const event = await prisma.communityEvent.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            username: true,
            bio: true,
          },
        },
        _count: {
          select: { attendees: { where: { status: 'GOING' } } },
        },
        attendees: {
          where: { status: 'GOING' },
          take: 10,
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                username: true,
              },
            },
          },
        },
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Check user's RSVP status if logged in
    let userRSVP = null
    if (currentUserId) {
      const rsvp = await prisma.communityEventRSVP.findUnique({
        where: {
          eventId_userId: {
            eventId: id,
            userId: currentUserId,
          },
        },
      })
      userRSVP = rsvp?.status || null
    }

    const transformedEvent = {
      ...event,
      attendeeCount: event._count.attendees,
      spotsLeft: event.capacity ? event.capacity - event._count.attendees : null,
      userRSVP,
      recentAttendees: event.attendees.map((a) => a.user),
      _count: undefined,
      attendees: undefined,
    }

    return NextResponse.json(transformedEvent)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}

// PATCH /api/community-events/[id] - Update event
export async function PATCH(
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
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Only organizer can update
    if (event.organizerId !== currentUser.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    const body = await request.json()
    const updatedEvent = await prisma.communityEvent.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        image: body.image,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        location: body.location,
        address: body.address,
        city: body.city,
        state: body.state,
        latitude: body.latitude,
        longitude: body.longitude,
        isVirtual: body.isVirtual,
        virtualLink: body.virtualLink,
        capacity: body.capacity,
        price: body.price,
        tags: body.tags,
        requirements: body.requirements,
        whatToBring: body.whatToBring,
        isCancelled: body.isCancelled,
      },
      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    })

    return NextResponse.json(updatedEvent)
  } catch {
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
}

// DELETE /api/community-events/[id] - Delete event
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

    const event = await prisma.communityEvent.findUnique({
      where: { id },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Only organizer can delete
    if (event.organizerId !== currentUser.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    await prisma.communityEvent.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}

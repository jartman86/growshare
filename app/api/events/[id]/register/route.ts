import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ensureUser } from '@/lib/ensure-user'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ensureUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { id } = await params

    const event = await prisma.courseEvent.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            attendees: true,
          },
        },
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Check if event is in the past
    if (event.startTime < new Date()) {
      return NextResponse.json(
        { error: 'Cannot register for past events' },
        { status: 400 }
      )
    }

    // Check capacity
    if (event.maxAttendees && event._count.attendees >= event.maxAttendees) {
      return NextResponse.json(
        { error: 'Event is at full capacity' },
        { status: 400 }
      )
    }

    // Check if already registered
    const existingRegistration = await prisma.eventAttendee.findUnique({
      where: {
        eventId_userId: {
          eventId: id,
          userId: user.id,
        },
      },
    })

    if (existingRegistration) {
      return NextResponse.json({
        success: true,
        message: 'Already registered',
        alreadyRegistered: true,
      })
    }

    // Create registration
    await prisma.eventAttendee.create({
      data: {
        eventId: id,
        userId: user.id,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully registered',
      alreadyRegistered: false,
    })
  } catch (error) {
    console.error('Error registering for event:', error)
    return NextResponse.json(
      { error: 'Failed to register' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ensureUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { id } = await params

    const event = await prisma.courseEvent.findUnique({
      where: { id },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Check if event is in the past
    if (event.startTime < new Date()) {
      return NextResponse.json(
        { error: 'Cannot unregister from past events' },
        { status: 400 }
      )
    }

    // Delete registration
    await prisma.eventAttendee.deleteMany({
      where: {
        eventId: id,
        userId: user.id,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully unregistered',
    })
  } catch (error) {
    console.error('Error unregistering from event:', error)
    return NextResponse.json(
      { error: 'Failed to unregister' },
      { status: 500 }
    )
  }
}

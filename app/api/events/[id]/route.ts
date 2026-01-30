import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ensureUser } from '@/lib/ensure-user'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const event = await prisma.courseEvent.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnailUrl: true,
          },
        },
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

    // Check user's registration status if authenticated
    const { userId: clerkId } = await auth()
    let isRegistered = false

    if (clerkId) {
      const user = await ensureUser()
      if (user) {
        const registration = await prisma.eventAttendee.findUnique({
          where: {
            eventId_userId: {
              eventId: id,
              userId: user.id,
            },
          },
        })
        isRegistered = !!registration
      }
    }

    return NextResponse.json({
      event: {
        ...event,
        isRegistered,
        spotsLeft: event.maxAttendees
          ? event.maxAttendees - event._count.attendees
          : null,
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}

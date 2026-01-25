import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ensureUser } from '@/lib/ensure-user'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const month = searchParams.get('month') // Format: YYYY-MM
    const type = searchParams.get('type') // Event type filter
    const courseId = searchParams.get('courseId')
    const upcoming = searchParams.get('upcoming') === 'true'

    // Build date filter
    let dateFilter: any = {}
    if (month) {
      const [year, monthNum] = month.split('-').map(Number)
      const startOfMonth = new Date(year, monthNum - 1, 1)
      const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59)
      dateFilter = {
        startTime: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      }
    } else if (upcoming) {
      dateFilter = {
        startTime: {
          gte: new Date(),
        },
      }
    }

    // Build where clause
    const where: any = {
      ...dateFilter,
    }

    if (type) {
      where.type = type
    }

    if (courseId) {
      where.courseId = courseId
    }

    const events = await prisma.courseEvent.findMany({
      where,
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
          },
        },
        _count: {
          select: {
            attendees: true,
          },
        },
      },
      orderBy: { startTime: 'asc' },
      take: upcoming ? 10 : undefined,
    })

    // Check user's registration status if authenticated
    const { userId: clerkId } = await auth()
    let userRegistrations: Set<string> = new Set()

    if (clerkId) {
      const user = await ensureUser()
      if (user) {
        const registrations = await prisma.eventAttendee.findMany({
          where: {
            userId: user.id,
            eventId: { in: events.map(e => e.id) },
          },
          select: { eventId: true },
        })
        userRegistrations = new Set(registrations.map(r => r.eventId))
      }
    }

    const eventsWithStatus = events.map(event => ({
      ...event,
      isRegistered: userRegistrations.has(event.id),
      spotsLeft: event.maxAttendees
        ? event.maxAttendees - event._count.attendees
        : null,
    }))

    return NextResponse.json({ events: eventsWithStatus })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { CommunityEventCategory, Prisma } from '@prisma/client'

// GET /api/community-events - List community events
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category') as CommunityEventCategory | null
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const upcoming = searchParams.get('upcoming') === 'true'
    const featured = searchParams.get('featured') === 'true'
    const organizerId = searchParams.get('organizerId')
    const limit = searchParams.get('limit')

    // Build where clause
    const where: Prisma.CommunityEventWhereInput = {
      isPublished: true,
      isCancelled: false,
    }

    if (category) {
      where.category = category
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' }
    }

    if (state) {
      where.state = state
    }

    if (upcoming) {
      where.startDate = { gte: new Date() }
    }

    if (featured) {
      where.isFeatured = true
    }

    if (organizerId) {
      where.organizerId = organizerId
    }

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

    const events = await prisma.communityEvent.findMany({
      where,
      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            username: true,
          },
        },
        _count: {
          select: { attendees: { where: { status: 'GOING' } } },
        },
        ...(currentUserId && {
          attendees: {
            where: { userId: currentUserId },
            select: { status: true },
          },
        }),
      },
      orderBy: { startDate: 'asc' },
      take: limit ? parseInt(limit) : undefined,
    })

    // Transform response
    const transformedEvents = events.map((event) => ({
      ...event,
      attendeeCount: event._count.attendees,
      spotsLeft: event.capacity ? event.capacity - event._count.attendees : null,
      userRSVP: currentUserId && event.attendees?.length > 0 ? event.attendees[0].status : null,
      _count: undefined,
      attendees: undefined,
    }))

    return NextResponse.json(transformedEvents)
  } catch (error) {
    console.error('Error fetching community events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

// POST /api/community-events - Create a community event
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const {
      title,
      description,
      category,
      image,
      startDate,
      endDate,
      timezone,
      location,
      address,
      city,
      state,
      latitude,
      longitude,
      isVirtual,
      virtualLink,
      capacity,
      price,
      tags,
      requirements,
      whatToBring,
    } = body

    // Validate required fields
    if (!title || !description || !category || !startDate || !location || !address || !city || !state) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate category
    const validCategories = Object.values(CommunityEventCategory)
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Create event
    const event = await prisma.communityEvent.create({
      data: {
        organizerId: currentUser.id,
        title,
        description,
        category,
        image: image || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        timezone: timezone || 'America/Los_Angeles',
        location,
        address,
        city,
        state,
        latitude: latitude || null,
        longitude: longitude || null,
        isVirtual: isVirtual || false,
        virtualLink: virtualLink || null,
        capacity: capacity || null,
        price: price || 0,
        tags: tags || [],
        requirements: requirements || [],
        whatToBring: whatToBring || [],
      },
      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            username: true,
          },
        },
      },
    })

    // Award points for creating an event
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { totalPoints: { increment: 15 } },
    })

    await prisma.userActivity.create({
      data: {
        userId: currentUser.id,
        type: 'EVENT_CREATED',
        title: 'Created community event',
        description: `Created "${title}"`,
        points: 15,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating community event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}

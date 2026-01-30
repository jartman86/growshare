import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ensureUser } from '@/lib/ensure-user'

export async function GET(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ensureUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.isInstructor) {
      return NextResponse.json({ error: 'Not an instructor' }, { status: 403 })
    }

    const events = await prisma.courseEvent.findMany({
      where: { instructorId: user.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        _count: {
          select: {
            attendees: true,
          },
        },
      },
      orderBy: { startTime: 'desc' },
    })

    return NextResponse.json({ events })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ensureUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.isInstructor) {
      return NextResponse.json({ error: 'Not an instructor' }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      description,
      type,
      courseId,
      startTime,
      endTime,
      timezone,
      meetingUrl,
      maxAttendees,
    } = body

    // Validate required fields
    if (!title || title.trim().length < 3) {
      return NextResponse.json(
        { error: 'Title must be at least 3 characters' },
        { status: 400 }
      )
    }

    if (!type) {
      return NextResponse.json(
        { error: 'Event type is required' },
        { status: 400 }
      )
    }

    if (!startTime || !endTime) {
      return NextResponse.json(
        { error: 'Start and end times are required' },
        { status: 400 }
      )
    }

    const start = new Date(startTime)
    const end = new Date(endTime)

    if (start >= end) {
      return NextResponse.json(
        { error: 'End time must be after start time' },
        { status: 400 }
      )
    }

    if (start < new Date()) {
      return NextResponse.json(
        { error: 'Cannot create events in the past' },
        { status: 400 }
      )
    }

    // If courseId is provided, verify instructor owns the course
    if (courseId) {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
      })

      if (!course || course.instructorId !== user.id) {
        return NextResponse.json(
          { error: 'Course not found or not owned by you' },
          { status: 400 }
        )
      }
    }

    const event = await prisma.courseEvent.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        type,
        courseId: courseId || null,
        instructorId: user.id,
        startTime: start,
        endTime: end,
        timezone: timezone || 'America/New_York',
        meetingUrl: meetingUrl || null,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      event,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}

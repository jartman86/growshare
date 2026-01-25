import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// Get blocked dates for a plot
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ plotId: string }> }
) {
  try {
    const { plotId } = await params

    const blockedDates = await prisma.plotBlockedDate.findMany({
      where: { plotId },
      orderBy: { startDate: 'asc' },
    })

    return NextResponse.json(blockedDates)
  } catch (error) {
    console.error('Error fetching blocked dates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blocked dates' },
      { status: 500 }
    )
  }
}

// Add a blocked date range
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ plotId: string }> }
) {
  try {
    const { plotId } = await params
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

    // Verify plot exists and user is the owner
    const plot = await prisma.plot.findUnique({
      where: { id: plotId },
      select: { ownerId: true },
    })

    if (!plot) {
      return NextResponse.json({ error: 'Plot not found' }, { status: 404 })
    }

    if (plot.ownerId !== currentUser.id) {
      return NextResponse.json(
        { error: 'Only the plot owner can block dates' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { startDate, endDate, reason } = body

    // Validate dates
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    if (end <= start) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    // Check for existing bookings in this range
    const existingBookings = await prisma.booking.findMany({
      where: {
        plotId,
        status: { in: ['PENDING', 'APPROVED', 'ACTIVE'] },
        OR: [
          {
            AND: [
              { startDate: { lte: end } },
              { endDate: { gte: start } },
            ],
          },
        ],
      },
    })

    if (existingBookings.length > 0) {
      return NextResponse.json(
        { error: 'Cannot block dates that have existing bookings' },
        { status: 400 }
      )
    }

    // Create blocked date
    const blockedDate = await prisma.plotBlockedDate.create({
      data: {
        plotId,
        startDate: start,
        endDate: end,
        reason: reason || null,
      },
    })

    return NextResponse.json(blockedDate, { status: 201 })
  } catch (error) {
    console.error('Error creating blocked date:', error)
    return NextResponse.json(
      { error: 'Failed to block dates' },
      { status: 500 }
    )
  }
}

// Delete a blocked date range
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ plotId: string }> }
) {
  try {
    const { plotId } = await params
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

    // Verify plot exists and user is the owner
    const plot = await prisma.plot.findUnique({
      where: { id: plotId },
      select: { ownerId: true },
    })

    if (!plot) {
      return NextResponse.json({ error: 'Plot not found' }, { status: 404 })
    }

    if (plot.ownerId !== currentUser.id) {
      return NextResponse.json(
        { error: 'Only the plot owner can unblock dates' },
        { status: 403 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const blockedDateId = searchParams.get('id')

    if (!blockedDateId) {
      return NextResponse.json(
        { error: 'Blocked date ID required' },
        { status: 400 }
      )
    }

    // Verify blocked date belongs to this plot
    const blockedDate = await prisma.plotBlockedDate.findFirst({
      where: {
        id: blockedDateId,
        plotId,
      },
    })

    if (!blockedDate) {
      return NextResponse.json(
        { error: 'Blocked date not found' },
        { status: 404 }
      )
    }

    await prisma.plotBlockedDate.delete({
      where: { id: blockedDateId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting blocked date:', error)
    return NextResponse.json(
      { error: 'Failed to unblock dates' },
      { status: 500 }
    )
  }
}

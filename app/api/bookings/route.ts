import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// Create a new booking request
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
    const { plotId, startDate, endDate, message } = body

    // Validate required fields
    if (!plotId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Plot ID, start date, and end date are required' },
        { status: 400 }
      )
    }

    // Check if plot exists
    const plot = await prisma.plot.findUnique({
      where: { id: plotId },
    })

    if (!plot) {
      return NextResponse.json({ error: 'Plot not found' }, { status: 404 })
    }

    // Can't book your own plot
    if (plot.ownerId === currentUser.id) {
      return NextResponse.json(
        { error: 'You cannot book your own plot' },
        { status: 400 }
      )
    }

    // Check for overlapping bookings
    const start = new Date(startDate)
    const end = new Date(endDate)

    const overlappingBookings = await prisma.booking.findMany({
      where: {
        plotId,
        status: {
          in: ['PENDING', 'APPROVED', 'ACTIVE'],
        },
        OR: [
          {
            AND: [
              { startDate: { lte: start } },
              { endDate: { gte: start } },
            ],
          },
          {
            AND: [
              { startDate: { lte: end } },
              { endDate: { gte: end } },
            ],
          },
          {
            AND: [
              { startDate: { gte: start } },
              { endDate: { lte: end } },
            ],
          },
        ],
      },
    })

    if (overlappingBookings.length > 0) {
      return NextResponse.json(
        { error: 'This plot is already booked for the selected dates' },
        { status: 400 }
      )
    }

    // Calculate duration in months
    const durationMs = end.getTime() - start.getTime()
    const durationMonths = Math.ceil(durationMs / (1000 * 60 * 60 * 24 * 30))

    // Calculate total price
    const totalAmount = plot.pricePerMonth * durationMonths

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        plotId,
        renterId: currentUser.id,
        startDate: start,
        endDate: end,
        status: plot.instantBook ? 'APPROVED' : 'PENDING',
        monthlyRate: plot.pricePerMonth,
        totalAmount,
        securityDeposit: plot.securityDeposit || null,
      },
      include: {
        plot: {
          select: {
            id: true,
            title: true,
            city: true,
            state: true,
            pricePerMonth: true,
          },
        },
        renter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    // Award points for booking
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { totalPoints: { increment: 25 } },
    })

    // Create activity
    await prisma.userActivity.create({
      data: {
        userId: currentUser.id,
        type: 'BOOKING_CREATED',
        title: plot.instantBook ? 'Booking confirmed' : 'Booking requested',
        description: `${plot.title} in ${plot.city}, ${plot.state}`,
        points: 25,
      },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

// Get user's bookings
export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') // 'renter' or 'owner'

    let bookings

    if (type === 'owner') {
      // Get bookings for plots owned by user
      bookings = await prisma.booking.findMany({
        where: {
          plot: {
            ownerId: currentUser.id,
          },
        },
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
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } else {
      // Get bookings made by user (as renter)
      bookings = await prisma.booking.findMany({
        where: {
          renterId: currentUser.id,
        },
        include: {
          plot: {
            select: {
              id: true,
              title: true,
              city: true,
              state: true,
              images: true,
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
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

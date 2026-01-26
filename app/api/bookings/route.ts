import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notifyBookingRequest } from '@/lib/notifications'
import { ensureUser, ensureVerifiedUser, EmailNotVerifiedError } from '@/lib/ensure-user'

// Create a new booking request
export async function POST(request: NextRequest) {
  try {
    const currentUser = await ensureVerifiedUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    // Parse and validate dates
    const start = new Date(startDate)
    const end = new Date(endDate)
    const now = new Date()

    // Validate dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    // Start date cannot be in the past (allow same day)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    if (start < today) {
      return NextResponse.json(
        { error: 'Start date cannot be in the past' },
        { status: 400 }
      )
    }

    // End date must be after start date
    if (end <= start) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    // Dates must be within reasonable bounds (max 10 years in future)
    const maxFutureDate = new Date()
    maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 10)
    if (start > maxFutureDate || end > maxFutureDate) {
      return NextResponse.json(
        { error: 'Booking dates cannot be more than 10 years in the future' },
        { status: 400 }
      )
    }

    // Calculate duration in months
    const durationMs = end.getTime() - start.getTime()
    const durationMonths = Math.ceil(durationMs / (1000 * 60 * 60 * 24 * 30))

    // Validate against plot's minimum lease requirement
    if (plot.minimumLease && durationMonths < plot.minimumLease) {
      return NextResponse.json(
        { error: `This plot requires a minimum lease of ${plot.minimumLease} months` },
        { status: 400 }
      )
    }

    // Check for overlapping bookings
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

    // Calculate total price (durationMonths already calculated above)
    const totalAmount = plot.pricePerMonth * durationMonths

    // Use transaction to ensure all database operations succeed or fail together
    const booking = await prisma.$transaction(async (tx) => {
      // Create booking
      const newBooking = await tx.booking.create({
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
      await tx.user.update({
        where: { id: currentUser.id },
        data: { totalPoints: { increment: 25 } },
      })

      // Create activity
      await tx.userActivity.create({
        data: {
          userId: currentUser.id,
          type: 'BOOKING_CREATED',
          title: plot.instantBook ? 'Booking confirmed' : 'Booking requested',
          description: `${plot.title} in ${plot.city}, ${plot.state}`,
          points: 25,
        },
      })

      return newBooking
    })

    // Send notification to plot owner (unless instant book)
    if (!plot.instantBook) {
      try {
        await notifyBookingRequest(
          plot.ownerId,
          plot.title,
          `${currentUser.firstName} ${currentUser.lastName}`,
          booking.id
        )
      } catch (error) {
        console.error('Failed to send booking notification:', error)
        // Don't fail the booking if notification fails
      }
    }

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    if (error instanceof EmailNotVerifiedError) {
      return NextResponse.json(
        { error: error.message, requiresVerification: true },
        { status: 403 }
      )
    }
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
    const currentUser = await ensureUser()
    console.log('[BOOKINGS] ensureUser returned:', currentUser?.id, currentUser?.email)

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') // 'renter' or 'owner'
    console.log('[BOOKINGS] type:', type, 'userId:', currentUser.id)

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
          paymentIntent: {
            select: {
              status: true,
              failureMessage: true,
              metadata: true,
            },
          },
          dispute: {
            select: {
              id: true,
              status: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } else {
      // Get bookings made by user (as renter)
      const rawBookings = await prisma.booking.findMany({
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
          paymentIntent: {
            select: {
              status: true,
              failureMessage: true,
              metadata: true,
            },
          },
          dispute: {
            select: {
              id: true,
              status: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      // Get all reviews by this user for their booked plots
      const plotIds = rawBookings.map((booking: any) => booking.plot.id)
      const userReviews = await prisma.review.findMany({
        where: {
          authorId: currentUser.id,
          plotId: { in: plotIds },
        },
        select: {
          plotId: true,
        },
      })

      // Create a Set of reviewed plot IDs for fast lookup
      const reviewedPlotIds = new Set(userReviews.map((review: any) => review.plotId))

      // Add hasReviewed flag
      bookings = rawBookings.map((booking: any) => ({
        ...booking,
        hasReviewed: reviewedPlotIds.has(booking.plot.id),
      }))
    }

    console.log('[BOOKINGS] Found', bookings.length, 'bookings')
    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

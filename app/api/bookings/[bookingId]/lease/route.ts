import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { generateLeaseHTML, getLeaseDataFromBooking } from '@/lib/lease-generator'

// GET - Get lease document for a booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
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

    const { bookingId } = await params

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        plot: {
          select: {
            ownerId: true,
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Only renter or owner can view the lease
    const isOwner = booking.plot.ownerId === currentUser.id
    const isRenter = booking.renterId === currentUser.id

    if (!isOwner && !isRenter) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Only show lease for approved or active bookings
    if (!['APPROVED', 'ACTIVE', 'COMPLETED'].includes(booking.status)) {
      return NextResponse.json(
        { error: 'Lease not available for this booking status' },
        { status: 400 }
      )
    }

    // Get lease data
    const leaseData = await getLeaseDataFromBooking(prisma, bookingId)

    if (!leaseData) {
      return NextResponse.json(
        { error: 'Could not generate lease data' },
        { status: 500 }
      )
    }

    // Check if PDF format is requested
    const format = request.nextUrl.searchParams.get('format')

    if (format === 'html') {
      // Return HTML for viewing in browser
      const html = generateLeaseHTML(leaseData)
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html',
        },
      })
    }

    // Default: return JSON with lease data and HTML
    const html = generateLeaseHTML(leaseData)
    return NextResponse.json({
      bookingId,
      leaseData,
      html,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching lease:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lease' },
      { status: 500 }
    )
  }
}

// POST - Generate and save lease document (triggered on booking approval)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
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

    const { bookingId } = await params

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        plot: {
          select: {
            ownerId: true,
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Only owner can generate the lease
    if (booking.plot.ownerId !== currentUser.id) {
      return NextResponse.json({ error: 'Only plot owner can generate lease' }, { status: 403 })
    }

    // Get lease data and generate HTML
    const leaseData = await getLeaseDataFromBooking(prisma, bookingId)

    if (!leaseData) {
      return NextResponse.json(
        { error: 'Could not generate lease data' },
        { status: 500 }
      )
    }

    // Update booking with lease URL
    const leaseUrl = `/api/bookings/${bookingId}/lease?format=html`

    await prisma.booking.update({
      where: { id: bookingId },
      data: { leaseUrl },
    })

    return NextResponse.json({
      success: true,
      leaseUrl,
      message: 'Lease document generated successfully',
    }, { status: 201 })
  } catch (error) {
    console.error('Error generating lease:', error)
    return NextResponse.json(
      { error: 'Failed to generate lease' },
      { status: 500 }
    )
  }
}

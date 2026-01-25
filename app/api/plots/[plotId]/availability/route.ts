import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ plotId: string }> }
) {
  try {
    const { plotId } = await params
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('start')
    const endDate = searchParams.get('end')

    // Default to next 12 months if no dates specified
    const start = startDate ? new Date(startDate) : new Date()
    const end = endDate
      ? new Date(endDate)
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)

    // Verify plot exists
    const plot = await prisma.plot.findUnique({
      where: { id: plotId },
      select: {
        id: true,
        title: true,
        pricePerMonth: true,
        minimumLease: true,
        instantBook: true,
      },
    })

    if (!plot) {
      return NextResponse.json({ error: 'Plot not found' }, { status: 404 })
    }

    // Get bookings that overlap with the date range
    const bookings = await prisma.booking.findMany({
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
      select: {
        id: true,
        startDate: true,
        endDate: true,
        status: true,
      },
      orderBy: { startDate: 'asc' },
    })

    // Get blocked dates that overlap with the date range
    const blockedDates = await prisma.plotBlockedDate.findMany({
      where: {
        plotId,
        OR: [
          {
            AND: [
              { startDate: { lte: end } },
              { endDate: { gte: start } },
            ],
          },
        ],
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        reason: true,
      },
      orderBy: { startDate: 'asc' },
    })

    return NextResponse.json({
      plot: {
        id: plot.id,
        title: plot.title,
        pricePerMonth: plot.pricePerMonth,
        minimumLease: plot.minimumLease,
        instantBook: plot.instantBook,
      },
      bookings: bookings.map((b) => ({
        id: b.id,
        startDate: b.startDate.toISOString(),
        endDate: b.endDate.toISOString(),
        status: b.status,
      })),
      blockedDates: blockedDates.map((bd) => ({
        id: bd.id,
        startDate: bd.startDate.toISOString(),
        endDate: bd.endDate.toISOString(),
        reason: bd.reason,
      })),
    })
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}

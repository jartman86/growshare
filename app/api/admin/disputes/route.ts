import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ensureUser } from '@/lib/ensure-user'

// Get all disputes (admin only)
export async function GET(request: NextRequest) {
  try {
    const currentUser = await ensureUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!currentUser.role.includes('ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where = status && status !== 'ALL' ? { status: status as any } : {}

    const [disputes, total] = await Promise.all([
      prisma.bookingDispute.findMany({
        where,
        include: {
          booking: {
            include: {
              plot: {
                select: {
                  id: true,
                  title: true,
                },
              },
              renter: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
            },
          },
          filedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              messages: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.bookingDispute.count({ where }),
    ])

    const formattedDisputes = disputes.map((d) => ({
      id: d.id,
      bookingId: d.bookingId,
      plotTitle: d.booking.plot.title,
      reason: d.reason,
      status: d.status,
      requestedAmount: d.requestedAmount,
      filedBy: d.filedBy,
      renter: d.booking.renter,
      messageCount: d._count.messages,
      createdAt: d.createdAt.toISOString(),
      resolvedAt: d.resolvedAt?.toISOString(),
    }))

    return NextResponse.json({
      disputes: formattedDisputes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch disputes' },
      { status: 500 }
    )
  }
}

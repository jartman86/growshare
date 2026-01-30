import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ensureUser } from '@/lib/ensure-user'
import { Prisma } from '@prisma/client'

// GET /api/disputes - List all disputes for the current user
export async function GET(request: NextRequest) {
  try {
    const currentUser = await ensureUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const role = searchParams.get('role') // 'filed' or 'received' or 'all'

    // Build where clause
    const whereClause: Prisma.BookingDisputeWhereInput = {}

    if (status && status !== 'all') {
      whereClause.status = status as Prisma.EnumDisputeStatusFilter
    }

    // Filter by role
    if (role === 'filed') {
      // Disputes filed by the user
      whereClause.filedById = currentUser.id
    } else if (role === 'received') {
      // Disputes where user is the other party (plot owner or renter) but not the filer
      whereClause.AND = [
        { filedById: { not: currentUser.id } },
        {
          OR: [
            { booking: { plot: { ownerId: currentUser.id } } },
            { booking: { renterId: currentUser.id } },
          ],
        },
      ]
    } else {
      // All disputes the user is involved in
      whereClause.OR = [
        { filedById: currentUser.id },
        { booking: { plot: { ownerId: currentUser.id } } },
        { booking: { renterId: currentUser.id } },
      ]
    }

    const disputes = await prisma.bookingDispute.findMany({
      where: whereClause,
      include: {
        booking: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            totalAmount: true,
            status: true,
            renterId: true,
            renter: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
            plot: {
              select: {
                id: true,
                title: true,
                images: true,
                ownerId: true,
                owner: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                  },
                },
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
    })

    // Add user's role in each dispute
    const disputesWithRole = disputes.map((dispute) => {
      const isOwner = dispute.booking.plot.ownerId === currentUser.id
      const isRenter = dispute.booking.renterId === currentUser.id
      const isFiler = dispute.filedById === currentUser.id

      return {
        ...dispute,
        userRole: isFiler ? 'filer' : isOwner ? 'owner' : isRenter ? 'renter' : 'unknown',
        otherParty: isFiler
          ? isOwner
            ? dispute.booking.renter
            : dispute.booking.plot.owner
          : dispute.filedBy,
      }
    })

    return NextResponse.json(disputesWithRole)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch disputes' },
      { status: 500 }
    )
  }
}

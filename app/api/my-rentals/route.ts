import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ensureUser } from '@/lib/ensure-user'

// Get user's tool rentals
export async function GET(request: NextRequest) {
  try {
    const currentUser = await ensureUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // active, completed, all

    const now = new Date()

    // Build where clause
    const where: any = {
      renterId: currentUser.id,
    }

    if (status === 'active') {
      where.status = { in: ['PENDING', 'APPROVED', 'ACTIVE'] }
      where.endDate = { gte: now }
    } else if (status === 'completed') {
      where.OR = [
        { status: 'COMPLETED' },
        { status: 'RETURNED' },
        { endDate: { lt: now } },
      ]
    }

    const rentals = await prisma.toolRental.findMany({
      where,
      include: {
        tool: {
          include: {
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
        reviews: {
          where: {
            authorId: currentUser.id,
          },
          select: {
            id: true,
            rating: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const formattedRentals = rentals.map((rental) => ({
      id: rental.id,
      toolId: rental.tool.id,
      toolName: rental.tool.name,
      toolImage: rental.tool.images[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      ownerId: rental.tool.owner.id,
      ownerName: `${rental.tool.owner.firstName} ${rental.tool.owner.lastName}`,
      ownerAvatar: rental.tool.owner.avatar,
      startDate: rental.startDate.toISOString(),
      endDate: rental.endDate.toISOString(),
      dailyRate: rental.dailyRate,
      totalCost: rental.totalCost,
      depositAmount: rental.depositAmount,
      status: rental.status.toLowerCase(),
      pickedUpAt: rental.pickedUpAt?.toISOString(),
      returnedAt: rental.returnedAt?.toISOString(),
      hasReview: rental.reviews.length > 0,
      reviewId: rental.reviews[0]?.id,
      daysRemaining: rental.endDate > now
        ? Math.ceil((rental.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : 0,
    }))

    return NextResponse.json(formattedRentals)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch rentals' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/admin-auth'

export async function GET() {
  try {
    const admin = await isAdmin()

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get counts in parallel
    const [
      totalUsers,
      totalPlots,
      activePlots,
      totalBookings,
      activeBookings,
      pendingBookings,
      totalRevenue,
      recentUsers,
      recentBookings,
      usersByRole,
      verifiedUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.plot.count(),
      prisma.plot.count({ where: { status: 'ACTIVE' } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'ACTIVE' } }),
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.booking.aggregate({
        _sum: { totalAmount: true },
        where: { status: { in: ['APPROVED', 'ACTIVE', 'COMPLETED'] } },
      }),
      prisma.user.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.booking.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.user.groupBy({
        by: ['role'],
        _count: true,
      }),
      prisma.user.count({ where: { isVerified: true } }),
    ])

    // Calculate role counts
    const roleCounts: Record<string, number> = {}
    usersByRole.forEach((item: { role: string[]; _count: number }) => {
      item.role.forEach((role: string) => {
        roleCounts[role] = (roleCounts[role] || 0) + item._count
      })
    })

    return NextResponse.json({
      users: {
        total: totalUsers,
        verified: verifiedUsers,
        newThisWeek: recentUsers,
        byRole: roleCounts,
      },
      plots: {
        total: totalPlots,
        active: activePlots,
      },
      bookings: {
        total: totalBookings,
        active: activeBookings,
        pending: pendingBookings,
        newThisWeek: recentBookings,
      },
      revenue: {
        total: totalRevenue._sum.totalAmount || 0,
      },
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

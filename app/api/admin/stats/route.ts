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
      allUsers,
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
      prisma.user.findMany({
        select: { role: true },
      }),
      prisma.user.count({ where: { isVerified: true } }),
    ])

    // Calculate role counts from all users
    const roleCounts: Record<string, number> = {}
    allUsers.forEach((user: { role: string[] }) => {
      user.role.forEach((role: string) => {
        roleCounts[role] = (roleCounts[role] || 0) + 1
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
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

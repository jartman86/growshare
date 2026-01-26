import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ensureUser } from '@/lib/ensure-user'

export async function GET(request: NextRequest) {
  try {
    const user = await ensureUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!user.isInstructor) {
      return NextResponse.json({ error: 'Not an instructor' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'all' // all, month, year

    // Get instructor's courses
    const courses = await prisma.course.findMany({
      where: { instructorId: user.id },
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnailUrl: true,
        price: true,
        accessType: true,
        isPublished: true,
        _count: {
          select: {
            progress: true,
            purchases: true,
          },
        },
      },
    })

    const courseIds = courses.map(c => c.id)

    // Calculate date range
    const now = new Date()
    let dateFilter = {}
    if (period === 'month') {
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      dateFilter = { purchasedAt: { gte: firstOfMonth } }
    } else if (period === 'year') {
      const firstOfYear = new Date(now.getFullYear(), 0, 1)
      dateFilter = { purchasedAt: { gte: firstOfYear } }
    }

    // Get all purchases
    const purchases = await prisma.coursePurchase.findMany({
      where: {
        courseId: { in: courseIds },
        status: 'COMPLETED',
        ...dateFilter,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { purchasedAt: 'desc' },
    })

    // Calculate earnings by course
    const earningsByCourse = courses.map(course => {
      const coursePurchases = purchases.filter(p => p.courseId === course.id)
      const totalEarnings = coursePurchases.reduce((sum, p) => sum + p.instructorEarnings, 0)
      const totalSales = coursePurchases.length

      return {
        courseId: course.id,
        title: course.title,
        slug: course.slug,
        thumbnailUrl: course.thumbnailUrl,
        price: course.price,
        accessType: course.accessType,
        isPublished: course.isPublished,
        students: course._count.progress,
        totalSales,
        totalEarnings,
      }
    })

    // Calculate monthly earnings for chart (last 12 months)
    const monthlyEarnings = []
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)

      const monthPurchases = purchases.filter(p => {
        const purchaseDate = new Date(p.purchasedAt)
        return purchaseDate >= date && purchaseDate <= endDate
      })

      const earnings = monthPurchases.reduce((sum, p) => sum + p.instructorEarnings, 0)
      const sales = monthPurchases.length

      monthlyEarnings.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        earnings,
        sales,
      })
    }

    // Calculate totals
    const totalEarnings = purchases.reduce((sum, p) => sum + p.instructorEarnings, 0)
    const totalSales = purchases.length
    const totalPlatformFees = purchases.reduce((sum, p) => sum + p.platformFee, 0)
    const totalGross = purchases.reduce((sum, p) => sum + p.amount, 0)

    // Recent transactions (last 20)
    const recentTransactions = purchases.slice(0, 20).map(p => ({
      id: p.id,
      courseTitle: p.course.title,
      courseSlug: p.course.slug,
      studentName: `${p.user.firstName || ''} ${p.user.lastName || ''}`.trim() || 'Student',
      studentAvatar: p.user.avatar,
      amount: p.amount,
      platformFee: p.platformFee,
      earnings: p.instructorEarnings,
      date: p.purchasedAt.toISOString(),
    }))

    // Pending payouts (simplified - in real app would track actual payouts)
    const thisMonthEarnings = monthlyEarnings[monthlyEarnings.length - 1]?.earnings || 0
    const pendingPayout = thisMonthEarnings // Assume current month is pending

    // Calculate trends
    const lastMonthEarnings = monthlyEarnings[monthlyEarnings.length - 2]?.earnings || 0
    const earningsTrend = lastMonthEarnings > 0
      ? ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100
      : 0

    const lastMonthSales = monthlyEarnings[monthlyEarnings.length - 2]?.sales || 0
    const currentMonthSales = monthlyEarnings[monthlyEarnings.length - 1]?.sales || 0
    const salesTrend = lastMonthSales > 0
      ? ((currentMonthSales - lastMonthSales) / lastMonthSales) * 100
      : 0

    return NextResponse.json({
      summary: {
        totalEarnings,
        totalSales,
        totalGross,
        totalPlatformFees,
        pendingPayout,
        thisMonthEarnings,
        lastMonthEarnings,
        earningsTrend,
        salesTrend,
        currentMonthSales,
        lastMonthSales,
        averagePerSale: totalSales > 0 ? totalEarnings / totalSales : 0,
      },
      earningsByCourse: earningsByCourse.sort((a, b) => b.totalEarnings - a.totalEarnings),
      monthlyEarnings,
      recentTransactions,
      period,
    })
  } catch (error) {
    console.error('Error fetching earnings:', error)
    return NextResponse.json({ error: 'Failed to fetch earnings' }, { status: 500 })
  }
}

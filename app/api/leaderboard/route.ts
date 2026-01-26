import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || 'all'
    const limit = parseInt(searchParams.get('limit') || '50')

    // Calculate date filter based on timeframe
    let dateFilter: Date | null = null
    if (timeframe === 'week') {
      dateFilter = new Date()
      dateFilter.setDate(dateFilter.getDate() - 7)
    } else if (timeframe === 'month') {
      dateFilter = new Date()
      dateFilter.setMonth(dateFilter.getMonth() - 1)
    }

    // For timeframe filtering, we need to sum up activity points within the period
    // For 'all' time, we just use the totalPoints on the user
    if (timeframe === 'all') {
      const users = await prisma.user.findMany({
        where: {
          status: 'ACTIVE',
          totalPoints: { gt: 0 },
        },
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
          totalPoints: true,
          level: true,
          createdAt: true,
          _count: {
            select: {
              badges: true,
              cropJournals: true,
              posts: true,
            },
          },
        },
        orderBy: {
          totalPoints: 'desc',
        },
        take: limit,
      })

      const formattedUsers = users.map((user, index) => ({
        id: user.id,
        rank: index + 1,
        username: user.username || `user-${user.id.slice(0, 6)}`,
        displayName: `${user.firstName} ${user.lastName}`.trim() || 'Anonymous',
        avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
        totalPoints: user.totalPoints,
        level: user.level,
        achievementCount: user._count.badges,
        activityCount: user._count.cropJournals + user._count.posts,
        joinedAt: user.createdAt.toISOString(),
      }))

      return NextResponse.json(formattedUsers)
    }

    // For week/month timeframes, aggregate recent activity points
    const activities = await prisma.userActivity.groupBy({
      by: ['userId'],
      where: {
        createdAt: { gte: dateFilter! },
        points: { gt: 0 },
      },
      _sum: {
        points: true,
      },
      orderBy: {
        _sum: {
          points: 'desc',
        },
      },
      take: limit,
    })

    const userIds = activities.map((a) => a.userId)

    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds },
        status: 'ACTIVE',
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        totalPoints: true,
        level: true,
        createdAt: true,
        _count: {
          select: {
            badges: true,
            cropJournals: true,
            posts: true,
          },
        },
      },
    })

    const userMap = new Map(users.map((u) => [u.id, u]))

    const formattedUsers = activities
      .map((activity, index) => {
        const user = userMap.get(activity.userId)
        if (!user) return null
        return {
          id: user.id,
          rank: index + 1,
          username: user.username || `user-${user.id.slice(0, 6)}`,
          displayName: `${user.firstName} ${user.lastName}`.trim() || 'Anonymous',
          avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
          totalPoints: activity._sum.points || 0, // Points in this timeframe
          allTimePoints: user.totalPoints,
          level: user.level,
          achievementCount: user._count.badges,
          activityCount: user._count.cropJournals + user._count.posts,
          joinedAt: user.createdAt.toISOString(),
        }
      })
      .filter(Boolean)

    return NextResponse.json(formattedUsers)
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}

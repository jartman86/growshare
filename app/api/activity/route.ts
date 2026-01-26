import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAuth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const filter = searchParams.get('filter') || 'all'

    // Get current user for personalized feed (optional)
    const { userId: clerkId } = getAuth(request)
    let currentUser = null
    if (clerkId) {
      currentUser = await prisma.user.findUnique({
        where: { clerkId },
        select: { id: true },
      })
    }

    // Build filter based on type
    let typeFilter = {}
    if (filter === 'achievements') {
      typeFilter = { type: 'BADGE_EARNED' }
    } else if (filter === 'tools') {
      typeFilter = { type: { in: ['PLOT_RENTED', 'PRODUCE_SOLD'] } }
    } else if (filter === 'forum') {
      typeFilter = { type: 'POST_CREATED' }
    }

    // Fetch recent activities
    const activities = await prisma.userActivity.findMany({
      where: {
        ...typeFilter,
        // Only show activities with points (meaningful actions)
      },
      select: {
        id: true,
        type: true,
        title: true,
        description: true,
        points: true,
        metadata: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    })

    // Format activities for the frontend
    const formattedActivities = activities.map((activity) => {
      const typeInfo = getActivityTypeInfo(activity.type)
      return {
        id: activity.id,
        userId: activity.user.id,
        userName: `${activity.user.firstName} ${activity.user.lastName}`.trim() || 'Anonymous',
        userAvatar: activity.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.user.id}`,
        type: typeInfo.type,
        action: activity.title || typeInfo.defaultAction,
        target: activity.description,
        icon: typeInfo.icon,
        color: typeInfo.color,
        points: activity.points,
        timestamp: activity.createdAt.toISOString(),
      }
    })

    return NextResponse.json(formattedActivities)
  } catch (error) {
    console.error('Error fetching activity feed:', error)
    return NextResponse.json({ error: 'Failed to fetch activity feed' }, { status: 500 })
  }
}

function getActivityTypeInfo(type: string) {
  const typeMap: Record<string, { type: string; icon: string; color: string; defaultAction: string }> = {
    PLOT_LISTED: {
      type: 'listing',
      icon: '🏡',
      color: 'bg-blue-100 text-blue-700',
      defaultAction: 'listed a new plot',
    },
    PLOT_RENTED: {
      type: 'rental',
      icon: '🌱',
      color: 'bg-green-100 text-green-700',
      defaultAction: 'rented a plot',
    },
    BOOKING_CREATED: {
      type: 'booking',
      icon: '📅',
      color: 'bg-purple-100 text-purple-700',
      defaultAction: 'made a booking',
    },
    BOOKING_APPROVED: {
      type: 'booking',
      icon: '✅',
      color: 'bg-green-100 text-green-700',
      defaultAction: 'had a booking approved',
    },
    REVIEW_CREATED: {
      type: 'review',
      icon: '⭐',
      color: 'bg-yellow-100 text-yellow-700',
      defaultAction: 'left a review',
    },
    REVIEW_RECEIVED: {
      type: 'review',
      icon: '🌟',
      color: 'bg-yellow-100 text-yellow-700',
      defaultAction: 'received a review',
    },
    FIRST_HARVEST: {
      type: 'harvest',
      icon: '🌾',
      color: 'bg-amber-100 text-amber-700',
      defaultAction: 'recorded their first harvest',
    },
    JOURNAL_ENTRY: {
      type: 'journal',
      icon: '📔',
      color: 'bg-indigo-100 text-indigo-700',
      defaultAction: 'created a journal entry',
    },
    COURSE_COMPLETED: {
      type: 'learning',
      icon: '🎓',
      color: 'bg-blue-100 text-blue-700',
      defaultAction: 'completed a course',
    },
    BADGE_EARNED: {
      type: 'achievement',
      icon: '🏆',
      color: 'bg-yellow-100 text-yellow-700',
      defaultAction: 'earned a badge',
    },
    PRODUCE_SOLD: {
      type: 'marketplace_sale',
      icon: '💰',
      color: 'bg-emerald-100 text-emerald-700',
      defaultAction: 'made a sale',
    },
    MILESTONE_REACHED: {
      type: 'level_up',
      icon: '🎯',
      color: 'bg-purple-100 text-purple-700',
      defaultAction: 'reached a milestone',
    },
    POST_CREATED: {
      type: 'forum_post',
      icon: '💬',
      color: 'bg-sky-100 text-sky-700',
      defaultAction: 'posted in the community',
    },
    NEW_FOLLOWER: {
      type: 'follow',
      icon: '👥',
      color: 'bg-pink-100 text-pink-700',
      defaultAction: 'gained a new follower',
    },
  }

  return typeMap[type] || {
    type: 'activity',
    icon: '📌',
    color: 'bg-gray-100 text-gray-700',
    defaultAction: 'was active',
  }
}

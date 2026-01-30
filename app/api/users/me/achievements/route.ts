import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ensureUser } from '@/lib/ensure-user'

export async function GET() {
  try {
    const currentUser = await ensureUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user with badges and activities
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      include: {
        userBadges: {
          include: {
            badge: true,
          },
          orderBy: { earnedAt: 'desc' },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 100,
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get all available badges
    const allBadges = await prisma.badge.findMany({
      where: { isActive: true },
      orderBy: [{ tier: 'asc' }, { name: 'asc' }],
    })

    // Format earned badges
    const earnedBadges = user.userBadges.map((ub) => ({
      id: ub.badge.id,
      name: ub.badge.name,
      description: ub.badge.description,
      icon: ub.badge.icon,
      tier: ub.badge.tier.toLowerCase(),
      category: ub.badge.category.toLowerCase(),
      points: ub.badge.points,
      earnedAt: ub.earnedAt.toISOString(),
    }))

    // Format available badges (not earned)
    const earnedBadgeIds = new Set(user.userBadges.map((ub) => ub.badgeId))
    const availableBadges = allBadges
      .filter((b) => !earnedBadgeIds.has(b.id))
      .map((badge) => ({
        id: badge.id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        tier: badge.tier.toLowerCase(),
        category: badge.category.toLowerCase(),
        points: badge.points,
        criteria: badge.criteria,
      }))

    // Build milestones from activities
    const milestones = buildMilestones(user.activities, user.createdAt)

    // Calculate streak
    const streak = calculateStreak(user.activities)

    // Calculate stats
    const stats = {
      totalBadges: earnedBadges.length,
      availableBadges: availableBadges.length,
      totalPoints: user.totalPoints,
      level: user.level,
      currentStreak: streak.current,
      longestStreak: streak.longest,
      activeDays: countActiveDays(user.activities),
      memberSince: user.createdAt.toISOString(),
    }

    // Next badge to earn (closest to completion)
    const nextBadge = availableBadges.length > 0 ? availableBadges[0] : null

    return NextResponse.json({
      stats,
      earnedBadges,
      availableBadges,
      milestones,
      streak,
      nextBadge,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 })
  }
}

interface Activity {
  id: string
  type: string
  title: string
  description: string | null
  points: number
  createdAt: Date
}

function buildMilestones(activities: Activity[], memberSince: Date) {
  const milestones: {
    id: string
    icon: string
    title: string
    description: string
    date: string
    type: string
  }[] = []

  // Add member since milestone
  milestones.push({
    id: 'joined',
    icon: '🌱',
    title: 'Started Your Journey',
    description: 'Signed up and created your GrowShare profile',
    date: memberSince.toISOString(),
    type: 'account',
  })

  // Group activities by type and find first occurrences
  const firstOccurrences: Record<string, Activity> = {}
  const counts: Record<string, number> = {}

  activities.forEach((activity) => {
    // Count occurrences
    counts[activity.type] = (counts[activity.type] || 0) + 1

    // Track first occurrence
    if (!firstOccurrences[activity.type] || activity.createdAt < firstOccurrences[activity.type].createdAt) {
      firstOccurrences[activity.type] = activity
    }
  })

  // Add milestone for first plot rental
  if (firstOccurrences['BOOKING_CREATED']) {
    milestones.push({
      id: 'first_booking',
      icon: '📍',
      title: 'First Plot Rental',
      description: 'Booked your first garden plot',
      date: firstOccurrences['BOOKING_CREATED'].createdAt.toISOString(),
      type: 'booking',
    })
  }

  // Add milestone for first plot listed
  if (firstOccurrences['PLOT_LISTED']) {
    milestones.push({
      id: 'first_listing',
      icon: '🏡',
      title: 'Became a Landowner',
      description: 'Listed your first plot for rent',
      date: firstOccurrences['PLOT_LISTED'].createdAt.toISOString(),
      type: 'listing',
    })
  }

  // Add milestone for first harvest
  if (firstOccurrences['FIRST_HARVEST']) {
    milestones.push({
      id: 'first_harvest',
      icon: '🥕',
      title: 'First Harvest',
      description: firstOccurrences['FIRST_HARVEST'].description || 'Recorded your first harvest',
      date: firstOccurrences['FIRST_HARVEST'].createdAt.toISOString(),
      type: 'harvest',
    })
  }

  // Add milestone for first journal entry
  if (firstOccurrences['JOURNAL_ENTRY']) {
    milestones.push({
      id: 'first_journal',
      icon: '📝',
      title: 'Started Journaling',
      description: 'Created your first garden journal entry',
      date: firstOccurrences['JOURNAL_ENTRY'].createdAt.toISOString(),
      type: 'journal',
    })
  }

  // Add milestone for first course completed
  if (firstOccurrences['COURSE_COMPLETED']) {
    milestones.push({
      id: 'first_course',
      icon: '🎓',
      title: 'First Certification',
      description: firstOccurrences['COURSE_COMPLETED'].description || 'Completed your first course',
      date: firstOccurrences['COURSE_COMPLETED'].createdAt.toISOString(),
      type: 'course',
    })
  }

  // Add milestone for first review
  if (firstOccurrences['REVIEW_SUBMITTED'] || firstOccurrences['REVIEW_CREATED']) {
    const reviewActivity = firstOccurrences['REVIEW_SUBMITTED'] || firstOccurrences['REVIEW_CREATED']
    milestones.push({
      id: 'first_review',
      icon: '⭐',
      title: 'First Review',
      description: 'Left your first review',
      date: reviewActivity.createdAt.toISOString(),
      type: 'review',
    })
  }

  // Add milestone for joining a challenge
  if (firstOccurrences['CHALLENGE_JOINED']) {
    milestones.push({
      id: 'first_challenge',
      icon: '🏆',
      title: 'Challenge Accepted',
      description: firstOccurrences['CHALLENGE_JOINED'].description || 'Joined your first challenge',
      date: firstOccurrences['CHALLENGE_JOINED'].createdAt.toISOString(),
      type: 'challenge',
    })
  }

  // Add milestone for completing a challenge
  if (firstOccurrences['CHALLENGE_COMPLETED']) {
    milestones.push({
      id: 'challenge_completed',
      icon: '🎉',
      title: 'Challenge Champion',
      description: firstOccurrences['CHALLENGE_COMPLETED'].description || 'Completed your first challenge',
      date: firstOccurrences['CHALLENGE_COMPLETED'].createdAt.toISOString(),
      type: 'challenge',
    })
  }

  // Add milestone for joining a group
  if (firstOccurrences['GROUP_JOINED']) {
    milestones.push({
      id: 'first_group',
      icon: '👥',
      title: 'Community Member',
      description: firstOccurrences['GROUP_JOINED'].description || 'Joined your first community group',
      date: firstOccurrences['GROUP_JOINED'].createdAt.toISOString(),
      type: 'group',
    })
  }

  // Add count-based milestones
  if (counts['JOURNAL_ENTRY'] >= 10) {
    milestones.push({
      id: 'journal_10',
      icon: '📚',
      title: 'Dedicated Journalist',
      description: 'Created 10 journal entries',
      date: new Date().toISOString(),
      type: 'milestone',
    })
  }

  if (counts['FIRST_HARVEST'] >= 5) {
    milestones.push({
      id: 'harvest_5',
      icon: '🧺',
      title: 'Bountiful Harvests',
      description: 'Recorded 5 harvests',
      date: new Date().toISOString(),
      type: 'milestone',
    })
  }

  // Sort by date descending
  milestones.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return milestones
}

function calculateStreak(activities: Activity[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Get unique dates with activity
  const activityDates = new Set<string>()
  activities.forEach((activity) => {
    const date = new Date(activity.createdAt)
    date.setHours(0, 0, 0, 0)
    activityDates.add(date.toISOString().split('T')[0])
  })

  // Calculate current streak
  let currentStreak = 0
  let checkDate = new Date(today)

  // Check if there's activity today or yesterday (allow 1 day grace)
  const todayStr = today.toISOString().split('T')[0]
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  if (activityDates.has(todayStr)) {
    checkDate = new Date(today)
  } else if (activityDates.has(yesterdayStr)) {
    checkDate = new Date(yesterday)
  } else {
    // Streak is broken
    currentStreak = 0
  }

  if (activityDates.has(todayStr) || activityDates.has(yesterdayStr)) {
    while (activityDates.has(checkDate.toISOString().split('T')[0])) {
      currentStreak++
      checkDate.setDate(checkDate.getDate() - 1)
    }
  }

  // Calculate longest streak
  let longestStreak = 0
  let tempStreak = 0
  const sortedDates = Array.from(activityDates).sort()

  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      tempStreak = 1
    } else {
      const prevDate = new Date(sortedDates[i - 1])
      const currDate = new Date(sortedDates[i])
      const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        tempStreak++
      } else {
        tempStreak = 1
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak)
  }

  return {
    current: currentStreak,
    longest: longestStreak,
    isActiveToday: activityDates.has(todayStr),
  }
}

function countActiveDays(activities: Activity[]) {
  const uniqueDays = new Set<string>()
  activities.forEach((activity) => {
    uniqueDays.add(new Date(activity.createdAt).toISOString().split('T')[0])
  })
  return uniqueDays.size
}

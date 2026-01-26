'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  Trophy,
  Flame,
  Calendar,
  Star,
  Lock,
  ChevronRight,
  Loader2,
  ArrowLeft,
  Target,
  Zap,
  Award,
} from 'lucide-react'

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  tier: string
  category: string
  points: number
  earnedAt?: string
}

interface Milestone {
  id: string
  icon: string
  title: string
  description: string
  date: string
  type: string
}

interface Streak {
  current: number
  longest: number
  isActiveToday: boolean
}

interface Stats {
  totalBadges: number
  availableBadges: number
  totalPoints: number
  level: number
  currentStreak: number
  longestStreak: number
  activeDays: number
  memberSince: string
}

interface AchievementsData {
  stats: Stats
  earnedBadges: Badge[]
  availableBadges: Badge[]
  milestones: Milestone[]
  streak: Streak
  nextBadge: Badge | null
}

const tierColors: Record<string, { bg: string; text: string; border: string }> = {
  bronze: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-300 dark:border-amber-700',
  },
  silver: {
    bg: 'bg-gray-50 dark:bg-gray-700/50',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-gray-300 dark:border-gray-600',
  },
  gold: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    text: 'text-yellow-700 dark:text-yellow-400',
    border: 'border-yellow-300 dark:border-yellow-700',
  },
  platinum: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    text: 'text-purple-700 dark:text-purple-400',
    border: 'border-purple-300 dark:border-purple-700',
  },
}

export default function AchievementsPage() {
  const [data, setData] = useState<AchievementsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'badges' | 'milestones'>('badges')

  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/users/me/achievements')
      if (!response.ok) throw new Error('Failed to fetch achievements')
      const achievementsData = await response.json()
      setData(achievementsData)
    } catch (err) {
      setError('Failed to load achievements')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading achievements...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (error || !data) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Something went wrong'}</p>
            <button
              onClick={fetchAchievements}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/dashboard"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Achievements</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Track your progress and earn rewards</p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* Level & Points */}
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Level</p>
                  <p className="text-4xl font-bold">{data.stats.level}</p>
                </div>
                <Star className="h-10 w-10 text-emerald-200" />
              </div>
              <div className="mt-3 pt-3 border-t border-emerald-400/30">
                <p className="text-sm text-emerald-100">
                  <span className="font-semibold text-white">{data.stats.totalPoints.toLocaleString()}</span> total points
                </p>
              </div>
            </div>

            {/* Streak */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Current Streak</p>
                  <p className="text-4xl font-bold">{data.streak.current}</p>
                </div>
                <Flame className={`h-10 w-10 ${data.streak.isActiveToday ? 'text-yellow-300' : 'text-orange-200'}`} />
              </div>
              <div className="mt-3 pt-3 border-t border-orange-400/30">
                <p className="text-sm text-orange-100">
                  Longest: <span className="font-semibold text-white">{data.streak.longest} days</span>
                </p>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Badges Earned</p>
                  <p className="text-4xl font-bold">{data.stats.totalBadges}</p>
                </div>
                <Trophy className="h-10 w-10 text-purple-200" />
              </div>
              <div className="mt-3 pt-3 border-t border-purple-400/30">
                <p className="text-sm text-purple-100">
                  <span className="font-semibold text-white">{data.stats.availableBadges}</span> more to unlock
                </p>
              </div>
            </div>

            {/* Active Days */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Active Days</p>
                  <p className="text-4xl font-bold">{data.stats.activeDays}</p>
                </div>
                <Calendar className="h-10 w-10 text-blue-200" />
              </div>
              <div className="mt-3 pt-3 border-t border-blue-400/30">
                <p className="text-sm text-blue-100">
                  Since {formatDate(data.stats.memberSince)}
                </p>
              </div>
            </div>
          </div>

          {/* Next Badge to Earn */}
          {data.nextBadge && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                  <Target className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Next badge to earn</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-3xl">{data.nextBadge.icon}</span>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{data.nextBadge.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{data.nextBadge.description}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">+{data.nextBadge.points}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">points</p>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('badges')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'badges'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Trophy className="h-4 w-4 inline mr-2" />
              Badges ({data.stats.totalBadges})
            </button>
            <button
              onClick={() => setActiveTab('milestones')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'milestones'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Zap className="h-4 w-4 inline mr-2" />
              Journey ({data.milestones.length})
            </button>
          </div>

          {/* Badges Tab */}
          {activeTab === 'badges' && (
            <div className="space-y-8">
              {/* Earned Badges */}
              {data.earnedBadges.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Award className="h-5 w-5 text-yellow-600" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Earned Badges</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {data.earnedBadges.map((badge) => {
                      const tierStyle = tierColors[badge.tier] || tierColors.bronze
                      return (
                        <div
                          key={badge.id}
                          className={`relative rounded-xl p-4 border-2 ${tierStyle.bg} ${tierStyle.border} hover:shadow-lg transition-all`}
                        >
                          <div className="text-4xl mb-3">{badge.icon}</div>
                          <h3 className="font-bold text-gray-900 dark:text-white text-sm">{badge.name}</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {badge.description}
                          </p>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <span className={`text-xs font-semibold ${tierStyle.text}`}>
                              +{badge.points} pts
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${tierStyle.bg} ${tierStyle.text} capitalize`}>
                              {badge.tier}
                            </span>
                          </div>
                          {badge.earnedAt && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                              Earned {formatRelativeDate(badge.earnedAt)}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Available Badges */}
              {data.availableBadges.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Lock className="h-5 w-5 text-gray-500" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Available Badges</h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({data.availableBadges.length} to unlock)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {data.availableBadges.map((badge) => (
                      <div
                        key={badge.id}
                        className="relative rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 opacity-70 hover:opacity-100 transition-all"
                      >
                        <div className="absolute top-3 right-3">
                          <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="text-4xl mb-3 grayscale">{badge.icon}</div>
                        <h3 className="font-bold text-gray-700 dark:text-gray-300 text-sm">{badge.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {badge.description}
                        </p>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                            +{badge.points} pts
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 capitalize">
                            {badge.tier}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No badges */}
              {data.earnedBadges.length === 0 && data.availableBadges.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-12 text-center">
                  <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No badges yet</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Complete activities to earn your first badge
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Milestones Tab */}
          {activeTab === 'milestones' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Your Growing Journey</h2>

              {data.milestones.length === 0 ? (
                <div className="text-center py-12">
                  <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No milestones yet</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Start using GrowShare to unlock milestones
                  </p>
                </div>
              ) : (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 to-green-600 dark:from-emerald-600 dark:to-green-700" />

                  <div className="space-y-6">
                    {data.milestones.map((milestone, index) => (
                      <div key={milestone.id} className="relative flex gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-xl z-10 shadow-md">
                          {milestone.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {milestone.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {milestone.description}
                              </p>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
                              {formatRelativeDate(milestone.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

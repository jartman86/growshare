'use client'

import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  ArrowLeft,
  Trophy,
  Users,
  Calendar,
  Target,
  CheckCircle,
  Circle,
  Clock,
  Share2,
  MessageSquare,
  Award,
  Loader2,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'

interface Challenge {
  id: string
  title: string
  slug: string
  description: string
  longDescription: string | null
  coverImage: string
  difficulty: string
  season: string
  status: string
  isActive: boolean
  isUpcoming: boolean
  startDate: string
  endDate: string
  tasks: {
    id: string
    title: string
    description: string
    required: boolean
    points: number
  }[]
  pointsReward: number
  badge: {
    id: string
    name: string
    description: string
    icon: string
    tier: string
  } | null
  tags: string[]
  maxParticipants: number | null
  stats: {
    participants: number
    completed: number
    completionRate: number
  }
  leaderboard: {
    id: string
    name: string
    avatar: string | null
    progress: number
    status: string
    completedAt: string | null
  }[]
  creator: {
    id: string
    name: string
    avatar: string | null
  }
  userParticipation: {
    status: string
    progress: number
    progressData: { completedTasks?: string[] }
    joinedAt: string
    completedAt: string | null
  } | null
}

function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'advanced':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
    case 'expert':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
  }
}

function getSeasonColor(season: string): string {
  switch (season) {
    case 'spring':
      return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
    case 'summer':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'fall':
    case 'autumn':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
    case 'winter':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'year-round':
    case 'all-season':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
  }
}

export default function ChallengeDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { isSignedIn } = useAuth()

  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [joining, setJoining] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [updatingTask, setUpdatingTask] = useState<string | null>(null)

  useEffect(() => {
    async function fetchChallenge() {
      try {
        const response = await fetch(`/api/challenges/${slug}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError('not_found')
          } else {
            throw new Error('Failed to fetch challenge')
          }
          return
        }
        const data = await response.json()
        setChallenge(data)
      } catch (err) {
        setError('Failed to load challenge')
      } finally {
        setLoading(false)
      }
    }

    fetchChallenge()
  }, [slug])

  const handleJoin = async () => {
    if (!isSignedIn) {
      window.location.href = '/sign-in'
      return
    }

    setJoining(true)
    try {
      const response = await fetch(`/api/challenges/${slug}/participation`, {
        method: 'POST',
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join challenge')
      }

      setChallenge((prev) =>
        prev
          ? {
              ...prev,
              userParticipation: data.participation,
              stats: {
                ...prev.stats,
                participants: prev.stats.participants + 1,
              },
            }
          : null
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join challenge')
    } finally {
      setJoining(false)
    }
  }

  const handleLeave = async () => {
    setLeaving(true)
    try {
      const response = await fetch(`/api/challenges/${slug}/participation`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to leave challenge')
      }

      setChallenge((prev) =>
        prev
          ? {
              ...prev,
              userParticipation: null,
              stats: {
                ...prev.stats,
                participants: Math.max(0, prev.stats.participants - 1),
              },
            }
          : null
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to leave challenge')
    } finally {
      setLeaving(false)
    }
  }

  const handleToggleTask = async (taskId: string) => {
    if (!challenge?.userParticipation) return

    const completedTasks = challenge.userParticipation.progressData?.completedTasks || []
    const isCurrentlyCompleted = completedTasks.includes(taskId)

    setUpdatingTask(taskId)
    try {
      const response = await fetch(`/api/challenges/${slug}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          completed: !isCurrentlyCompleted,
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update progress')
      }

      setChallenge((prev) =>
        prev
          ? {
              ...prev,
              userParticipation: data.participation,
              stats: data.challengeCompleted
                ? {
                    ...prev.stats,
                    completed: prev.stats.completed + 1,
                    completionRate: Math.round(
                      ((prev.stats.completed + 1) / prev.stats.participants) * 100
                    ),
                  }
                : prev.stats,
            }
          : null
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
    } finally {
      setUpdatingTask(null)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading challenge...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (error === 'not_found' || !challenge) {
    notFound()
  }

  const isJoined = !!challenge.userParticipation && challenge.userParticipation.status !== 'dropped'
  const completedTasks = challenge.userParticipation?.progressData?.completedTasks || []
  const progress = challenge.userParticipation?.progress || 0

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getDuration = () => {
    const start = new Date(challenge.startDate)
    const end = new Date(challenge.endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    if (days < 7) return `${days} days`
    if (days < 30) return `${Math.ceil(days / 7)} weeks`
    return `${Math.ceil(days / 30)} months`
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Error Toast */}
        {error && error !== 'not_found' && (
          <div className="fixed top-4 right-4 z-50 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                ×
              </button>
            </div>
          </div>
        )}

        {/* Challenge Header */}
        <div className="relative h-80 bg-gray-200 dark:bg-gray-800">
          <Image
            src={challenge.coverImage}
            alt={challenge.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

          {/* Back Button */}
          <div className="absolute top-4 left-4">
            <Link
              href="/challenges"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg font-medium hover:bg-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Challenges
            </Link>
          </div>

          {/* Challenge Info */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl font-bold text-white mb-3">{challenge.title}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeasonColor(challenge.season)}`}>
                  {challenge.season.replace('-', ' ')}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
                {challenge.status === 'upcoming' && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    Coming Soon
                  </span>
                )}
                {challenge.status === 'completed' && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    Ended
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About This Challenge</h2>
                {challenge.longDescription && (
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{challenge.longDescription}</p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400">{challenge.description}</p>
              </div>

              {/* Tasks */}
              {challenge.tasks.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tasks</h2>
                    {isJoined && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {completedTasks.length} of {challenge.tasks.length} completed
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {challenge.tasks.map((task) => {
                      const isCompleted = completedTasks.includes(task.id)
                      const isUpdating = updatingTask === task.id

                      return (
                        <div
                          key={task.id}
                          className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-colors ${
                            isCompleted
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <button
                            onClick={() => handleToggleTask(task.id)}
                            className="flex-shrink-0 mt-0.5 disabled:opacity-50"
                            disabled={!isJoined || isUpdating || challenge.userParticipation?.status === 'completed'}
                          >
                            {isUpdating ? (
                              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                            ) : isCompleted ? (
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            ) : (
                              <Circle className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                            )}
                          </button>

                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className={`font-medium ${isCompleted ? 'text-green-900 dark:text-green-300' : 'text-gray-900 dark:text-white'}`}>
                                  {task.title}
                                </p>
                                {task.description && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {task.description}
                                  </p>
                                )}
                              </div>
                              {task.points > 0 && (
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <Trophy className="h-4 w-4 text-yellow-600" />
                                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {task.points} pts
                                  </span>
                                </div>
                              )}
                            </div>
                            {task.required && (
                              <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">Required</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Leaderboard */}
              {challenge.leaderboard.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Leaderboard</h2>
                  </div>
                  <div className="space-y-3">
                    {challenge.leaderboard.map((participant, index) => (
                      <div
                        key={participant.id}
                        className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                      >
                        <div className="w-8 h-8 flex items-center justify-center">
                          {index === 0 ? (
                            <span className="text-2xl">🥇</span>
                          ) : index === 1 ? (
                            <span className="text-2xl">🥈</span>
                          ) : index === 2 ? (
                            <span className="text-2xl">🥉</span>
                          ) : (
                            <span className="text-gray-500 font-semibold">{index + 1}</span>
                          )}
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
                          {participant.avatar ? (
                            <Image
                              src={participant.avatar}
                              alt={participant.name}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 font-semibold">
                              {participant.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{participant.name}</p>
                          {participant.status === 'completed' && (
                            <p className="text-xs text-green-600 dark:text-green-400">Completed</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white">{participant.progress}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Discussion */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Discussion</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Share your progress, ask questions, and connect with other participants
                </p>
                <button className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  View Discussion Forum →
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Action Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 sticky top-6">
                {!isJoined ? (
                  <>
                    <button
                      onClick={handleJoin}
                      disabled={joining || !challenge.isActive}
                      className={`w-full mb-4 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                        challenge.isActive
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {joining && <Loader2 className="h-4 w-4 animate-spin" />}
                      {challenge.isUpcoming
                        ? 'Coming Soon'
                        : challenge.isActive
                          ? 'Join Challenge'
                          : 'Challenge Ended'}
                    </button>
                    <button className="w-full px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                      <Share2 className="h-5 w-5" />
                      Share
                    </button>
                  </>
                ) : (
                  <>
                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Your Progress</span>
                        <span className="text-sm font-bold text-emerald-600">{progress}%</span>
                      </div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {challenge.userParticipation?.status === 'completed' ? (
                      <div className="w-full mb-3 px-6 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg font-semibold text-center">
                        🎉 Completed!
                      </div>
                    ) : (
                      <>
                        <div className="w-full mb-3 px-6 py-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg font-semibold text-center">
                          Participating
                        </div>
                        <button
                          onClick={handleLeave}
                          disabled={leaving}
                          className="w-full px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                        >
                          {leaving && <Loader2 className="h-4 w-4 animate-spin" />}
                          Leave Challenge
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Rewards */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-6 w-6 text-yellow-600" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Rewards</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{challenge.pointsReward} Points</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Completion reward</div>
                    </div>
                  </div>
                  {challenge.badge && (
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{challenge.badge.name}</div>
                        <div className="text-sm text-gray-700 dark:text-gray-400">
                          {challenge.badge.description}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Challenge Stats</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Participants</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{challenge.stats.participants}</span>
                    </div>
                    {challenge.maxParticipants && (
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{
                            width: `${Math.min((challenge.stats.participants / challenge.maxParticipants) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Completions</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{challenge.stats.completed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Success Rate</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{challenge.stats.completionRate}%</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Timeline</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Duration</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{getDuration()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Starts</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{formatDate(challenge.startDate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Ends</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{formatDate(challenge.endDate)}</span>
                  </div>
                </div>
              </div>

              {/* Creator */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Created by</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    {challenge.creator.avatar ? (
                      <Image
                        src={challenge.creator.avatar}
                        alt={challenge.creator.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 font-semibold text-lg">
                        {challenge.creator.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{challenge.creator.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Challenge Creator</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

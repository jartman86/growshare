'use client'

import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getChallengeBySlug, getDifficultyColor, getSeasonColor } from '@/lib/challenges-data'
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
} from 'lucide-react'
import { useState } from 'react'

export default function ChallengeDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const challenge = getChallengeBySlug(slug)

  const [completedTasks, setCompletedTasks] = useState<string[]>([])

  if (!challenge) {
    notFound()
  }

  const isJoined = false // For demo, could be true
  const requiredTasks = challenge.tasks.filter((t) => t.required)
  const completedCount = completedTasks.length
  const requiredCount = requiredTasks.filter((t) => completedTasks.includes(t.id)).length
  const progress = Math.round((requiredCount / requiredTasks.length) * 100)

  const handleToggleTask = (taskId: string) => {
    if (completedTasks.includes(taskId)) {
      setCompletedTasks(completedTasks.filter((id) => id !== taskId))
    } else {
      setCompletedTasks([...completedTasks, taskId])
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Challenge Header */}
        <div className="relative h-80 bg-gray-200">
          <img
            src={challenge.image}
            alt={challenge.title}
            className="w-full h-full object-cover"
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

          {/* Challenge Icon */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto flex items-end gap-6">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                {challenge.icon}
              </div>
              <div className="flex-1 pb-2">
                <h1 className="text-4xl font-bold text-white mb-2">{challenge.title}</h1>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getSeasonColor(challenge.season)}`}
                  >
                    {challenge.season}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}
                  >
                    {challenge.difficulty}
                  </span>
                  {challenge.type === 'team' && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      Team Challenge
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About This Challenge</h2>
                <p className="text-gray-700 mb-4">{challenge.longDescription}</p>
                <p className="text-sm text-gray-600">{challenge.description}</p>
              </div>

              {/* Requirements */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {challenge.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tasks */}
              <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Tasks</h2>
                  {isJoined && (
                    <div className="text-sm text-gray-600">
                      {completedCount} of {challenge.tasks.length} completed
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {challenge.tasks.map((task) => {
                    const isCompleted = completedTasks.includes(task.id)

                    return (
                      <div
                        key={task.id}
                        className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-colors ${
                          isCompleted
                            ? 'bg-green-50 border-green-200'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <button
                          onClick={() => handleToggleTask(task.id)}
                          className="flex-shrink-0 mt-0.5"
                          disabled={!isJoined}
                        >
                          {isCompleted ? (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          ) : (
                            <Circle className="h-6 w-6 text-gray-400" />
                          )}
                        </button>

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <p className={`font-medium ${isCompleted ? 'text-green-900' : 'text-gray-900'}`}>
                              {task.description}
                            </p>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Trophy className="h-4 w-4 text-yellow-600" />
                              <span className="text-sm font-semibold text-gray-900">
                                {task.points} pts
                              </span>
                            </div>
                          </div>
                          {task.required && (
                            <span className="text-xs text-orange-600 font-medium">Required</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Discussion */}
              <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="h-5 w-5 text-gray-600" />
                  <h2 className="text-xl font-bold text-gray-900">Discussion</h2>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Share your progress, ask questions, and connect with other participants
                </p>
                <button className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  View Discussion Forum →
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Action Card */}
              <div className="bg-white rounded-xl border p-6 sticky top-6">
                {!isJoined ? (
                  <>
                    <button
                      className={`w-full mb-4 px-6 py-3 rounded-lg font-semibold transition-colors ${
                        challenge.status === 'active'
                          ? 'bg-orange-600 text-white hover:bg-orange-700'
                          : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      }`}
                      disabled={challenge.status !== 'active'}
                    >
                      {challenge.status === 'upcoming'
                        ? 'Coming Soon'
                        : challenge.status === 'active'
                          ? 'Join Challenge'
                          : 'Challenge Ended'}
                    </button>
                    <button className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <Share2 className="h-5 w-5" />
                      Share
                    </button>
                  </>
                ) : (
                  <>
                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">Your Progress</span>
                        <span className="text-sm font-bold text-orange-600">{progress}%</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-600 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <button className="w-full mb-3 px-6 py-3 bg-green-100 text-green-700 rounded-lg font-semibold">
                      Participating
                    </button>
                    <button className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                      Leave Challenge
                    </button>
                  </>
                )}
              </div>

              {/* Rewards */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-6 w-6 text-yellow-600" />
                  <h3 className="text-lg font-bold text-gray-900">Rewards</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-semibold text-gray-900">{challenge.rewards.points} Points</div>
                      <div className="text-xs text-gray-600">Base reward</div>
                    </div>
                  </div>
                  {challenge.rewards.badges && (
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-900">Badges</div>
                        <div className="text-sm text-gray-700">
                          {challenge.rewards.badges.join(', ')}
                        </div>
                      </div>
                    </div>
                  )}
                  {challenge.rewards.title && (
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-900">Title</div>
                        <div className="text-sm text-gray-700">{challenge.rewards.title}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white rounded-xl border p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Challenge Stats</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Participants</span>
                      <span className="font-semibold text-gray-900">{challenge.participants}</span>
                    </div>
                    {challenge.maxParticipants && (
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{
                            width: `${(challenge.participants / challenge.maxParticipants) * 100}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Completions</span>
                    <span className="font-semibold text-gray-900">{challenge.completions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Success Rate</span>
                    <span className="font-semibold text-gray-900">
                      {challenge.participants > 0
                        ? Math.round((challenge.completions / challenge.participants) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-bold text-gray-900">Timeline</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold text-gray-900">{challenge.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Starts</span>
                    <span className="font-semibold text-gray-900">
                      {challenge.startDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Ends</span>
                    <span className="font-semibold text-gray-900">
                      {challenge.endDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
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

import Link from 'next/link'
import { Challenge, getDifficultyColor, getSeasonColor } from '@/lib/challenges-data'
import { Users, Trophy, Calendar, Target, Clock, CheckCircle } from 'lucide-react'

interface ChallengeCardProps {
  challenge: Challenge
  showJoinButton?: boolean
  userProgress?: number
}

export function ChallengeCard({
  challenge,
  showJoinButton = true,
  userProgress,
}: ChallengeCardProps) {
  const completionRate =
    challenge.participants > 0
      ? Math.round((challenge.completions / challenge.participants) * 100)
      : 0

  const isUserParticipating = userProgress !== undefined

  return (
    <Link
      href={`/challenges/${challenge.slug}`}
      className="block bg-white rounded-xl border hover:shadow-lg transition-all overflow-hidden group"
    >
      {/* Challenge Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={challenge.image}
          alt={challenge.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Icon Badge */}
        <div className="absolute top-3 left-3 w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-lg">
          {challenge.icon}
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {challenge.status === 'active' && (
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
              ACTIVE
            </span>
          )}
          {challenge.status === 'upcoming' && (
            <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
              UPCOMING
            </span>
          )}
          {challenge.status === 'completed' && (
            <span className="px-3 py-1 bg-gray-500 text-white text-xs font-bold rounded-full">
              COMPLETED
            </span>
          )}
        </div>

        {/* Progress Bar (if user is participating) */}
        {isUserParticipating && userProgress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/20">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${userProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeasonColor(challenge.season)}`}>
            {challenge.season}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
            {challenge.difficulty}
          </span>
          {challenge.type === 'team' && (
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              Team Challenge
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
          {challenge.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{challenge.description}</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-gray-900 font-semibold">{challenge.participants}</span>
            <span className="text-gray-600">joined</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-600" />
            <span className="text-gray-900 font-semibold">{challenge.rewards.points}</span>
            <span className="text-gray-600">pts</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-gray-900 font-semibold">{completionRate}%</span>
            <span className="text-gray-600">finish</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-600" />
            <span className="text-gray-900 font-semibold text-xs">{challenge.duration}</span>
          </div>
        </div>

        {/* Timeline */}
        {challenge.status !== 'completed' && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Calendar className="h-3 w-3" />
              <span>
                {challenge.status === 'upcoming'
                  ? `Starts ${challenge.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                  : `Ends ${challenge.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
              </span>
            </div>
          </div>
        )}

        {/* Tasks Preview */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
            <Target className="h-4 w-4" />
            <span className="font-medium">{challenge.tasks.length} tasks</span>
          </div>
          <div className="text-xs text-gray-600">
            {challenge.tasks.filter((t) => t.required).length} required
          </div>
        </div>

        {/* Action Button */}
        {showJoinButton && (
          <button
            onClick={(e) => {
              e.preventDefault()
              alert(`Joining challenge: ${challenge.title}`)
            }}
            className={`w-full py-2 rounded-lg font-semibold transition-colors ${
              isUserParticipating
                ? 'bg-gray-100 text-gray-700 cursor-default'
                : challenge.status === 'active'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
            disabled={challenge.status !== 'active' && !isUserParticipating}
          >
            {isUserParticipating
              ? `${userProgress}% Complete`
              : challenge.status === 'upcoming'
                ? 'Coming Soon'
                : challenge.status === 'active'
                  ? 'Join Challenge'
                  : 'Challenge Ended'}
          </button>
        )}
      </div>
    </Link>
  )
}

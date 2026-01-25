'use client'

import { BADGES } from '@/lib/constants'
import { Lock } from 'lucide-react'

interface BadgeShowcaseProps {
  earnedBadges: string[]
}

export function BadgeShowcase({ earnedBadges }: BadgeShowcaseProps) {
  const allBadges = Object.entries(BADGES)

  const earned = allBadges.filter(([key]) => earnedBadges.includes(key))
  const locked = allBadges.filter(([key]) => !earnedBadges.includes(key))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Badges</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {earned.length} of {allBadges.length} earned
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{earned.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Total Badges</div>
        </div>
      </div>

      {/* Earned Badges */}
      {earned.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Earned</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {earned.map(([key, badge]) => (
              <div
                key={key}
                className="group relative bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 border-2 border-yellow-300 dark:border-yellow-700 shadow-sm hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{badge.name}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{badge.description}</p>
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">
                    +{badge.points} pts
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full">
                    {badge.tier}
                  </span>
                </div>

                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 z-10">
                  <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg">
                    <p className="font-semibold mb-1">{badge.name}</p>
                    <p className="text-gray-300">{badge.description}</p>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                      <div className="border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {locked.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Available ({locked.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {locked.slice(0, 8).map(([key, badge]) => (
              <div
                key={key}
                className="group relative bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-2 border-gray-200 dark:border-gray-600 opacity-60 hover:opacity-100 transition-all cursor-pointer"
              >
                <div className="relative">
                  <div className="text-4xl mb-2 grayscale">{badge.icon}</div>
                  <Lock className="absolute top-0 right-0 h-4 w-4 text-gray-400" />
                </div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-1">{badge.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{badge.description}</p>
                <div className="mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">+{badge.points} pts</span>
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 z-10">
                  <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg">
                    <p className="font-semibold mb-1">{badge.name}</p>
                    <p className="text-gray-300 mb-2">{badge.description}</p>
                    <p className="text-yellow-400 font-semibold">Earn {badge.points} points</p>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                      <div className="border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

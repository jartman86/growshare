'use client'

import { UserLevel } from '@/lib/profile-data'
import { TrendingUp, Star } from 'lucide-react'

interface LevelProgressProps {
  currentLevel: UserLevel
  nextLevel: UserLevel | null
  progress: number
  pointsNeeded: number
  totalPoints: number
}

export function LevelProgress({
  currentLevel,
  nextLevel,
  progress,
  pointsNeeded,
  totalPoints,
}: LevelProgressProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{currentLevel.badge}</span>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Level {currentLevel.level}: {currentLevel.name}
            </h3>
            <p className="text-sm text-gray-600">{totalPoints.toLocaleString()} total points</p>
          </div>
        </div>
        {nextLevel && (
          <div className="text-right">
            <p className="text-sm text-gray-600">Next Level</p>
            <p className="font-semibold text-gray-900">{nextLevel.name}</p>
          </div>
        )}
      </div>

      {nextLevel ? (
        <>
          {/* Progress Bar */}
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${progress}%` }}
            >
              {progress > 15 && (
                <span className="text-xs font-bold text-white">{progress}%</span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {pointsNeeded.toLocaleString()} points to next level
            </span>
            <span className="font-medium text-emerald-600 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {progress}% complete
            </span>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
          <Star className="h-5 w-5 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-800">
            <strong>Maximum level reached!</strong> You're a GrowShare legend.
          </p>
        </div>
      )}

      {/* Benefits */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Level Benefits:</h4>
        <ul className="space-y-1">
          {currentLevel.benefits.map((benefit, index) => (
            <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-emerald-600">✓</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

'use client'

import { calculateLevel, pointsForNextLevel } from '@/lib/utils'
import { LEVELS } from '@/lib/constants'
import { TrendingUp } from 'lucide-react'

interface LevelProgressProps {
  totalPoints: number
  level: number
}

export function LevelProgress({ totalPoints, level }: LevelProgressProps) {
  const currentLevel = level
  const nextLevelPoints = pointsForNextLevel(currentLevel)
  const currentLevelPoints = currentLevel > 1 ? (currentLevel - 1) ** 2 * 100 : 0
  const pointsInCurrentLevel = totalPoints - currentLevelPoints
  const pointsNeededForLevel = nextLevelPoints - currentLevelPoints
  const progress = (pointsInCurrentLevel / pointsNeededForLevel) * 100

  const levelInfo = LEVELS[currentLevel as keyof typeof LEVELS]
  const nextLevelInfo = LEVELS[(currentLevel + 1) as keyof typeof LEVELS]

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{levelInfo?.title || 'Grower'}</h3>
          <p className="text-sm text-gray-600">Level {currentLevel}</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <span className="font-bold text-gray-900">{totalPoints.toLocaleString()}</span>
          <span className="text-sm text-gray-600">pts</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progress to {nextLevelInfo?.title || 'Next Level'}</span>
          <span className="font-semibold text-gray-900">
            {pointsInCurrentLevel.toLocaleString()} / {pointsNeededForLevel.toLocaleString()}
          </span>
        </div>
        <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 text-right">
          {(pointsNeededForLevel - pointsInCurrentLevel).toLocaleString()} points to level {currentLevel + 1}
        </p>
      </div>

      {/* Milestones */}
      <div className="mt-4 pt-4 border-t border-green-200 flex gap-3 overflow-x-auto">
        {Object.entries(LEVELS).slice(0, 10).map(([lvl, info]) => {
          const levelNum = parseInt(lvl)
          const isCompleted = currentLevel >= levelNum
          const isCurrent = currentLevel === levelNum

          return (
            <div
              key={lvl}
              className={`flex-shrink-0 flex flex-col items-center gap-1 ${
                isCurrent ? 'scale-110' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCompleted
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {levelNum}
              </div>
              {isCurrent && (
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

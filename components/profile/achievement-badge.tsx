'use client'

import { Achievement } from '@/lib/profile-data'
import { Lock } from 'lucide-react'

interface AchievementBadgeProps {
  achievement: Achievement
  unlocked: boolean
}

export function AchievementBadge({ achievement, unlocked }: AchievementBadgeProps) {
  const getTierColor = () => {
    switch (achievement.tier) {
      case 'Bronze':
        return 'from-orange-400 to-amber-600'
      case 'Silver':
        return 'from-gray-300 to-gray-500'
      case 'Gold':
        return 'from-yellow-400 to-yellow-600'
      case 'Platinum':
        return 'from-cyan-400 to-blue-600'
    }
  }

  const getTierBorder = () => {
    switch (achievement.tier) {
      case 'Bronze':
        return 'border-amber-600'
      case 'Silver':
        return 'border-gray-500'
      case 'Gold':
        return 'border-yellow-600'
      case 'Platinum':
        return 'border-blue-600'
    }
  }

  if (!unlocked) {
    return (
      <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 opacity-60">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-gray-200 rounded-full">
            <Lock className="h-6 w-6 text-gray-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-500 mb-1">Locked</h3>
            <p className="text-xs text-gray-500">{achievement.requirement}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-4 border-2 ${getTierBorder()} rounded-lg bg-gradient-to-br ${getTierColor()} relative overflow-hidden`}>
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" />

      <div className="relative">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-white/90 rounded-full shadow-lg">
            <span className="text-3xl">{achievement.icon}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-white text-shadow">{achievement.name}</h3>
              <span className="text-xs px-2 py-0.5 bg-white/90 text-gray-700 rounded-full font-semibold">
                {achievement.tier}
              </span>
            </div>
            <p className="text-sm text-white/90 text-shadow-sm mb-2">
              {achievement.description}
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/80">{achievement.requirement}</span>
              {achievement.points > 0 && (
                <span className="font-bold text-white">+{achievement.points} pts</span>
              )}
            </div>
          </div>
        </div>

        {achievement.unlockedBy && (
          <div className="mt-3 pt-3 border-t border-white/20">
            <p className="text-xs text-white/70">
              Unlocked by {achievement.unlockedBy}% of users
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .text-shadow {
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        .text-shadow-sm {
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  )
}

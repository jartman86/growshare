'use client'

import { formatRelativeTime } from '@/lib/utils'
import {
  Sprout,
  Award,
  BookOpen,
  ShoppingBag,
  MapPin,
  Star,
  TrendingUp,
} from 'lucide-react'

interface Activity {
  id: string
  type: string
  title: string
  description?: string
  points?: number
  timestamp: Date
}

interface ActivityFeedProps {
  activities: Activity[]
}

const activityIcons: Record<string, any> = {
  PLOT_LISTED: MapPin,
  PLOT_RENTED: Sprout,
  FIRST_HARVEST: Sprout,
  JOURNAL_ENTRY: BookOpen,
  COURSE_COMPLETED: BookOpen,
  BADGE_EARNED: Award,
  REVIEW_RECEIVED: Star,
  PRODUCE_SOLD: ShoppingBag,
  MILESTONE_REACHED: TrendingUp,
}

const activityColors: Record<string, string> = {
  PLOT_LISTED: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  PLOT_RENTED: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  FIRST_HARVEST: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  JOURNAL_ENTRY: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  COURSE_COMPLETED: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  BADGE_EARNED: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  REVIEW_RECEIVED: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
  PRODUCE_SOLD: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
  MILESTONE_REACHED: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h2>

      {activities.length === 0 ? (
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">No activity yet</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Start farming, earn badges, and complete courses to see your activity here!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type] || TrendingUp
            const colorClass = activityColors[activity.type] || 'bg-gray-100 text-gray-600'

            return (
              <div key={activity.id} className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full ${colorClass} flex items-center justify-center`}>
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{activity.title}</h4>
                      {activity.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{activity.description}</p>
                      )}
                    </div>

                    {activity.points && activity.points > 0 && (
                      <span className="flex-shrink-0 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                        +{activity.points} pts
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

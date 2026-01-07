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
  PLOT_LISTED: 'bg-blue-100 text-blue-600',
  PLOT_RENTED: 'bg-green-100 text-green-600',
  FIRST_HARVEST: 'bg-green-100 text-green-600',
  JOURNAL_ENTRY: 'bg-purple-100 text-purple-600',
  COURSE_COMPLETED: 'bg-orange-100 text-orange-600',
  BADGE_EARNED: 'bg-yellow-100 text-yellow-600',
  REVIEW_RECEIVED: 'bg-pink-100 text-pink-600',
  PRODUCE_SOLD: 'bg-teal-100 text-teal-600',
  MILESTONE_REACHED: 'bg-indigo-100 text-indigo-600',
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="bg-white rounded-xl border p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>

      {activities.length === 0 ? (
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">No activity yet</h3>
          <p className="text-sm text-gray-600">
            Start farming, earn badges, and complete courses to see your activity here!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type] || TrendingUp
            const colorClass = activityColors[activity.type] || 'bg-gray-100 text-gray-600'

            return (
              <div key={activity.id} className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full ${colorClass} flex items-center justify-center`}>
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                      {activity.description && (
                        <p className="text-sm text-gray-600 mt-0.5">{activity.description}</p>
                      )}
                    </div>

                    {activity.points && activity.points > 0 && (
                      <span className="flex-shrink-0 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        +{activity.points} pts
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
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

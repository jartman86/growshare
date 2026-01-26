'use client'

import { useState, useEffect } from 'react'
import { Loader2, Bell, Calendar, MessageSquare, Star, ShoppingBag, MessageCircle, BookOpen, Users, Megaphone } from 'lucide-react'

interface NotificationPreferences {
  id: string
  bookingRequests: boolean
  bookingUpdates: boolean
  newMessages: boolean
  newReviews: boolean
  marketplaceActivity: boolean
  forumActivity: boolean
  courseUpdates: boolean
  communityActivity: boolean
  systemAnnouncements: boolean
}

interface PreferenceItem {
  key: keyof Omit<NotificationPreferences, 'id'>
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const PREFERENCE_ITEMS: PreferenceItem[] = [
  {
    key: 'bookingRequests',
    label: 'Booking Requests',
    description: 'When someone requests to rent your plot',
    icon: Calendar,
  },
  {
    key: 'bookingUpdates',
    label: 'Booking Updates',
    description: 'Status changes on your bookings',
    icon: Bell,
  },
  {
    key: 'newMessages',
    label: 'New Messages',
    description: 'When you receive a new message',
    icon: MessageSquare,
  },
  {
    key: 'newReviews',
    label: 'New Reviews',
    description: 'When someone reviews your plot or listing',
    icon: Star,
  },
  {
    key: 'marketplaceActivity',
    label: 'Marketplace Activity',
    description: 'Orders, sales, and tool rentals',
    icon: ShoppingBag,
  },
  {
    key: 'forumActivity',
    label: 'Forum Activity',
    description: 'Replies to your topics and mentions',
    icon: MessageCircle,
  },
  {
    key: 'courseUpdates',
    label: 'Course Updates',
    description: 'New lessons, certificates, and course news',
    icon: BookOpen,
  },
  {
    key: 'communityActivity',
    label: 'Community Activity',
    description: 'Events, groups, and community tips',
    icon: Users,
  },
  {
    key: 'systemAnnouncements',
    label: 'System Announcements',
    description: 'Important updates from GrowShare',
    icon: Megaphone,
  },
]

export function NotificationPreferencesForm() {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/users/me/notification-preferences')
      if (!response.ok) {
        throw new Error('Failed to fetch preferences')
      }
      const data = await response.json()
      setPreferences(data)
    } catch (err) {
      setError('Failed to load notification preferences')
    } finally {
      setIsLoading(false)
    }
  }

  const updatePreference = async (key: keyof Omit<NotificationPreferences, 'id'>, value: boolean) => {
    if (!preferences) return

    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)

    // Optimistic update
    const previousPreferences = { ...preferences }
    setPreferences({ ...preferences, [key]: value })

    try {
      const response = await fetch('/api/users/me/notification-preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value }),
      })

      if (!response.ok) {
        throw new Error('Failed to update preference')
      }

      setSuccessMessage('Preference updated')
      setTimeout(() => setSuccessMessage(null), 2000)
    } catch (err) {
      // Revert optimistic update
      setPreferences(previousPreferences)
      setError('Failed to save preference')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleAll = async (value: boolean) => {
    if (!preferences) return

    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)

    const updates: Record<string, boolean> = {}
    PREFERENCE_ITEMS.forEach((item) => {
      updates[item.key] = value
    })

    // Optimistic update
    const previousPreferences = { ...preferences }
    setPreferences({ ...preferences, ...updates } as NotificationPreferences)

    try {
      const response = await fetch('/api/users/me/notification-preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update preferences')
      }

      setSuccessMessage(value ? 'All notifications enabled' : 'All notifications disabled')
      setTimeout(() => setSuccessMessage(null), 2000)
    } catch (err) {
      setPreferences(previousPreferences)
      setError('Failed to save preferences')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (!preferences) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-sm text-red-800 dark:text-red-300">{error || 'Failed to load preferences'}</p>
      </div>
    )
  }

  const allEnabled = PREFERENCE_ITEMS.every((item) => preferences[item.key])
  const allDisabled = PREFERENCE_ITEMS.every((item) => !preferences[item.key])

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-300">{successMessage}</p>
        </div>
      )}

      <div className="flex items-center justify-between pb-4 border-b dark:border-gray-700">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Quick Actions</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Enable or disable all in-app notifications</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => toggleAll(true)}
            disabled={isSaving || allEnabled}
            className="px-3 py-1.5 text-sm font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enable All
          </button>
          <button
            onClick={() => toggleAll(false)}
            disabled={isSaving || allDisabled}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Disable All
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {PREFERENCE_ITEMS.map((item) => {
          const Icon = item.icon
          const isEnabled = preferences[item.key]

          return (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
                  <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                </div>
              </div>

              <button
                onClick={() => updatePreference(item.key, !isEnabled)}
                disabled={isSaving}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isEnabled ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
                role="switch"
                aria-checked={isEnabled}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )
        })}
      </div>

      <div className="pt-4 border-t dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          In-app notifications appear in the notification bell in the header. Email notifications are managed separately below.
        </p>
      </div>
    </div>
  )
}

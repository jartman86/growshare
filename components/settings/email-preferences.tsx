'use client'

import { useState, useEffect } from 'react'
import { Loader2, Mail, Bell, MessageSquare, Star, ShoppingBag, MessageCircle, Calendar } from 'lucide-react'

interface EmailPreferences {
  id: string
  bookingRequests: boolean
  bookingUpdates: boolean
  newMessages: boolean
  newReviews: boolean
  marketplaceOrders: boolean
  forumReplies: boolean
  weeklyDigest: boolean
}

interface PreferenceItem {
  key: keyof Omit<EmailPreferences, 'id'>
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const PREFERENCE_ITEMS: PreferenceItem[] = [
  {
    key: 'bookingRequests',
    label: 'Booking Requests',
    description: 'Get notified when someone wants to rent your plot',
    icon: Calendar,
  },
  {
    key: 'bookingUpdates',
    label: 'Booking Updates',
    description: 'Updates on your booking status and payments',
    icon: Bell,
  },
  {
    key: 'newMessages',
    label: 'New Messages',
    description: 'Receive an email when you get a new message',
    icon: MessageSquare,
  },
  {
    key: 'newReviews',
    label: 'New Reviews',
    description: 'Get notified when someone reviews your plot',
    icon: Star,
  },
  {
    key: 'marketplaceOrders',
    label: 'Marketplace Orders',
    description: 'Updates on your produce sales and purchases',
    icon: ShoppingBag,
  },
  {
    key: 'forumReplies',
    label: 'Forum Replies',
    description: 'Notifications when someone replies to your topics',
    icon: MessageCircle,
  },
  {
    key: 'weeklyDigest',
    label: 'Weekly Digest',
    description: 'A weekly summary of activity on your plots',
    icon: Mail,
  },
]

export function EmailPreferencesForm() {
  const [preferences, setPreferences] = useState<EmailPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/users/me/email-preferences')
      if (!response.ok) {
        throw new Error('Failed to fetch preferences')
      }
      const data = await response.json()
      setPreferences(data)
    } catch (err) {
      setError('Failed to load email preferences')
      console.error('Error fetching preferences:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const updatePreference = async (key: keyof Omit<EmailPreferences, 'id'>, value: boolean) => {
    if (!preferences) return

    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)

    // Optimistic update
    const previousPreferences = { ...preferences }
    setPreferences({ ...preferences, [key]: value })

    try {
      const response = await fetch('/api/users/me/email-preferences', {
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
      console.error('Error updating preference:', err)
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
    setPreferences({ ...preferences, ...updates } as EmailPreferences)

    try {
      const response = await fetch('/api/users/me/email-preferences', {
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
      console.error('Error updating preferences:', err)
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
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-800">{error || 'Failed to load preferences'}</p>
      </div>
    )
  }

  const allEnabled = PREFERENCE_ITEMS.every((item) => preferences[item.key])
  const allDisabled = PREFERENCE_ITEMS.every((item) => !preferences[item.key])

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Quick Actions</h3>
          <p className="text-sm text-gray-500">Enable or disable all email notifications</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => toggleAll(true)}
            disabled={isSaving || allEnabled}
            className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enable All
          </button>
          <button
            onClick={() => toggleAll(false)}
            disabled={isSaving || allDisabled}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Icon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{item.label}</h4>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>

              <button
                onClick={() => updatePreference(item.key, !isEnabled)}
                disabled={isSaving}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isEnabled ? 'bg-green-600' : 'bg-gray-200'
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

      <div className="pt-4 border-t">
        <p className="text-xs text-gray-500">
          You can also unsubscribe from individual emails by clicking the unsubscribe link at the bottom of any email.
        </p>
      </div>
    </div>
  )
}

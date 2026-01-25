'use client'

import { useState, useEffect } from 'react'
import {
  Shield,
  Eye,
  EyeOff,
  MessageSquare,
  MessageSquareOff,
  UserX,
  User,
  Loader2,
  Trash2,
  AlertCircle
} from 'lucide-react'
import Image from 'next/image'

interface BlockedUser {
  id: string
  blockedId: string
  reason: string | null
  createdAt: string
  blocked: {
    id: string
    firstName: string
    lastName: string
    avatar: string | null
  }
}

interface PrivacySettings {
  profileVisibility: 'PUBLIC' | 'PRIVATE'
  allowMessages: 'EVERYONE' | 'NONE'
}

export function PrivacySettings() {
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: 'PUBLIC',
    allowMessages: 'EVERYONE',
  })
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [settingsRes, blockedRes] = await Promise.all([
        fetch('/api/users/privacy'),
        fetch('/api/users/block'),
      ])

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json()
        setSettings(settingsData)
      }

      if (blockedRes.ok) {
        const blockedData = await blockedRes.json()
        setBlockedUsers(blockedData)
      }
    } catch (err) {
      console.error('Error fetching privacy data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateSetting = async (key: keyof PrivacySettings, value: string) => {
    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch('/api/users/privacy', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update settings')
      }

      const updatedSettings = await response.json()
      setSettings(updatedSettings)
      setSuccessMessage('Settings updated successfully')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUnblock = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/block?userId=${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to unblock user')
      }

      setBlockedUsers(prev => prev.filter(u => u.blockedId !== userId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unblock user')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-green-600" />
        <h2 className="text-xl font-bold text-gray-900">Privacy Settings</h2>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
          {successMessage}
        </div>
      )}

      {/* Profile Visibility */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Visibility</h3>
        <p className="text-sm text-gray-600 mb-4">
          Control who can see your profile information, including your bio, location, and listed plots.
        </p>

        <div className="space-y-3">
          <label
            className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
              settings.profileVisibility === 'PUBLIC'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="profileVisibility"
              value="PUBLIC"
              checked={settings.profileVisibility === 'PUBLIC'}
              onChange={() => handleUpdateSetting('profileVisibility', 'PUBLIC')}
              disabled={isSaving}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                <span className="font-medium text-gray-900">Public</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Anyone can view your profile and listings
              </p>
            </div>
          </label>

          <label
            className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
              settings.profileVisibility === 'PRIVATE'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="profileVisibility"
              value="PRIVATE"
              checked={settings.profileVisibility === 'PRIVATE'}
              onChange={() => handleUpdateSetting('profileVisibility', 'PRIVATE')}
              disabled={isSaving}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <EyeOff className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">Private</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Only users you've interacted with can view your full profile
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Message Settings */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Settings</h3>
        <p className="text-sm text-gray-600 mb-4">
          Control who can send you messages on the platform.
        </p>

        <div className="space-y-3">
          <label
            className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
              settings.allowMessages === 'EVERYONE'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="allowMessages"
              value="EVERYONE"
              checked={settings.allowMessages === 'EVERYONE'}
              onChange={() => handleUpdateSetting('allowMessages', 'EVERYONE')}
              disabled={isSaving}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-600" />
                <span className="font-medium text-gray-900">Everyone</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Any logged-in user can message you
              </p>
            </div>
          </label>

          <label
            className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
              settings.allowMessages === 'NONE'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="allowMessages"
              value="NONE"
              checked={settings.allowMessages === 'NONE'}
              onChange={() => handleUpdateSetting('allowMessages', 'NONE')}
              disabled={isSaving}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <MessageSquareOff className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">No one</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Disable messages from all users (existing conversations still accessible)
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Blocked Users */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Blocked Users</h3>
            <p className="text-sm text-gray-600">
              Blocked users cannot message you or view your profile
            </p>
          </div>
          <UserX className="h-5 w-5 text-gray-400" />
        </div>

        {blockedUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <UserX className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p>You haven't blocked any users</p>
          </div>
        ) : (
          <div className="space-y-3">
            {blockedUsers.map((block) => (
              <div
                key={block.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {block.blocked.avatar ? (
                    <Image
                      src={block.blocked.avatar}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {block.blocked.firstName} {block.blocked.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Blocked {new Date(block.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleUnblock(block.blockedId)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Unblock
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> These settings don't affect your existing bookings or active conversations.
          Landowners and renters with active bookings will still be able to communicate.
        </p>
      </div>
    </div>
  )
}

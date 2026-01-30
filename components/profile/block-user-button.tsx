'use client'

import { useState } from 'react'
import { ShieldOff, Shield, Loader2, X } from 'lucide-react'

interface BlockUserButtonProps {
  userId: string
  username: string
  isBlocked: boolean
  onBlockChange?: () => void
}

export function BlockUserButton({ userId, username, isBlocked, onBlockChange }: BlockUserButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [blocked, setBlocked] = useState(isBlocked)

  const handleBlock = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/users/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error('Failed to block user')
      }

      setBlocked(true)
      setShowConfirm(false)
      onBlockChange?.()
    } catch {
      // Error blocking user
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnblock = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/users/block?userId=${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to unblock user')
      }

      setBlocked(false)
      onBlockChange?.()
    } catch {
      // Error unblocking user
    } finally {
      setIsLoading(false)
    }
  }

  if (blocked) {
    return (
      <button
        onClick={handleUnblock}
        disabled={isLoading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Shield className="h-4 w-4" />
        )}
        Unblock
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <ShieldOff className="h-4 w-4" />
        Block
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Block @{username}?</h3>
              <button
                onClick={() => setShowConfirm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              They won&apos;t be able to message you or see your profile. You can unblock them later from your settings.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBlock}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <ShieldOff className="h-4 w-4" />
                    Block
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

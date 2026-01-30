'use client'

import { useState, useEffect } from 'react'
import { UserPlus, UserMinus, Loader2 } from 'lucide-react'

interface FollowButtonProps {
  userId: string
  initialIsFollowing?: boolean
}

export function FollowButton({ userId, initialIsFollowing = false }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isLoading, setIsLoading] = useState(false)

  // Check follow status on mount
  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/follow`)
        if (response.ok) {
          const data = await response.json()
          setIsFollowing(data.isFollowing)
        }
      } catch {
        // Silently ignore errors checking follow status
      }
    }
    checkFollowStatus()
  }, [userId])

  const handleFollow = async () => {
    setIsLoading(true)
    try {
      if (isFollowing) {
        // Unfollow
        const response = await fetch(`/api/users/${userId}/follow`, {
          method: 'DELETE',
        })
        if (response.ok) {
          setIsFollowing(false)
        }
      } else {
        // Follow
        const response = await fetch(`/api/users/${userId}/follow`, {
          method: 'POST',
        })
        if (response.ok) {
          setIsFollowing(true)
        }
      }
    } catch {
      // Silently ignore errors toggling follow
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleFollow}
      disabled={isLoading}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
        isFollowing
          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          : 'bg-gradient-to-r from-[#6ba03f] to-[#4a7c2c] text-white hover:from-[#4a7c2c] hover:to-[#2d5016]'
      }`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          {isFollowing ? 'Unfollowing...' : 'Following...'}
        </>
      ) : isFollowing ? (
        <>
          <UserMinus className="h-5 w-5" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="h-5 w-5" />
          Follow
        </>
      )}
    </button>
  )
}

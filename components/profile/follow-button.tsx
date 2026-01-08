'use client'

import { useState } from 'react'
import { UserPlus, UserMinus } from 'lucide-react'

interface FollowButtonProps {
  userId: string
}

export function FollowButton({ userId }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleFollow = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsFollowing(!isFollowing)
    setIsLoading(false)
  }

  return (
    <button
      onClick={handleFollow}
      disabled={isLoading}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 ${
        isFollowing
          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          : 'bg-emerald-600 text-white hover:bg-emerald-700'
      }`}
    >
      {isFollowing ? (
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

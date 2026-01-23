'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface VoteButtonsProps {
  topicId?: string
  replyId?: string
  initialScore: number
  initialUserVote: number
  compact?: boolean
}

export function VoteButtons({
  topicId,
  replyId,
  initialScore,
  initialUserVote,
  compact = false,
}: VoteButtonsProps) {
  const [score, setScore] = useState(initialScore)
  const [userVote, setUserVote] = useState(initialUserVote)
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async (value: 1 | -1) => {
    if (isVoting) return

    setIsVoting(true)

    // Optimistic update
    const previousScore = score
    const previousUserVote = userVote

    if (userVote === value) {
      // Removing vote
      setScore(score - value)
      setUserVote(0)
    } else if (userVote === 0) {
      // New vote
      setScore(score + value)
      setUserVote(value)
    } else {
      // Changing vote
      setScore(score + value * 2)
      setUserVote(value)
    }

    try {
      const response = await fetch('/api/forum/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId,
          replyId,
          value,
        }),
      })

      if (!response.ok) {
        // Revert optimistic update
        setScore(previousScore)
        setUserVote(previousUserVote)
        console.error('Vote failed')
      }
    } catch (error) {
      // Revert optimistic update
      setScore(previousScore)
      setUserVote(previousUserVote)
      console.error('Vote error:', error)
    } finally {
      setIsVoting(false)
    }
  }

  if (compact) {
    return (
      <div className="flex flex-col items-center gap-0.5">
        <button
          onClick={() => handleVote(1)}
          disabled={isVoting}
          className={`p-1 rounded transition-colors ${
            userVote === 1
              ? 'text-green-600 bg-green-50'
              : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
          }`}
        >
          <ChevronUp className="h-5 w-5" />
        </button>
        <span
          className={`text-sm font-semibold ${
            score > 0 ? 'text-green-600' : score < 0 ? 'text-red-600' : 'text-gray-500'
          }`}
        >
          {score}
        </span>
        <button
          onClick={() => handleVote(-1)}
          disabled={isVoting}
          className={`p-1 rounded transition-colors ${
            userVote === -1
              ? 'text-red-600 bg-red-50'
              : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
          }`}
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleVote(1)}
        disabled={isVoting}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
          userVote === 1
            ? 'text-green-700 bg-green-100'
            : 'text-gray-600 bg-gray-100 hover:bg-green-100 hover:text-green-700'
        }`}
      >
        <ChevronUp className="h-4 w-4" />
        Upvote
      </button>

      <span
        className={`text-lg font-semibold min-w-[2rem] text-center ${
          score > 0 ? 'text-green-600' : score < 0 ? 'text-red-600' : 'text-gray-500'
        }`}
      >
        {score}
      </span>

      <button
        onClick={() => handleVote(-1)}
        disabled={isVoting}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
          userVote === -1
            ? 'text-red-700 bg-red-100'
            : 'text-gray-600 bg-gray-100 hover:bg-red-100 hover:text-red-700'
        }`}
      >
        <ChevronDown className="h-4 w-4" />
        Downvote
      </button>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { ThumbsUp, ThumbsDown, User, Lightbulb, Loader2, ChevronRight, Calendar, Bug, Leaf } from 'lucide-react'

type TipCategory = 'PLANTING_CALENDAR' | 'PEST_DISEASE' | 'COMPANION_PLANTING'

interface CommunityTip {
  id: string
  category: TipCategory
  title: string
  content: string
  plantName?: string
  usdaZone?: string
  pestName?: string
  treatment?: string
  mainPlant?: string
  companions?: string[]
  avoid?: string[]
  upvotes: number
  downvotes: number
  createdAt: string
  author: {
    id: string
    firstName: string
    lastName: string
    avatar?: string
  }
  userVote?: number
}

interface RecentCommunityTipsProps {
  limit?: number
  title?: string
}

export function RecentCommunityTips({ limit = 6, title = 'Community Tips' }: RecentCommunityTipsProps) {
  const { isSignedIn } = useUser()
  const [tips, setTips] = useState<CommunityTip[]>([])
  const [loading, setLoading] = useState(true)
  const [votingTipId, setVotingTipId] = useState<string | null>(null)

  const fetchTips = async () => {
    try {
      const response = await fetch(`/api/community-tips?limit=${limit}`)
      if (response.ok) {
        const data = await response.json()
        setTips(data)
      }
    } catch {
      // Error fetching tips
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTips()
  }, [limit])

  const handleVote = async (tipId: string, value: number) => {
    if (!isSignedIn) {
      alert('Please sign in to vote')
      return
    }

    setVotingTipId(tipId)

    try {
      const response = await fetch(`/api/community-tips/${tipId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      })

      if (response.ok) {
        const updatedTip = await response.json()
        setTips(tips.map(tip =>
          tip.id === tipId
            ? { ...tip, upvotes: updatedTip.upvotes, downvotes: updatedTip.downvotes, userVote: updatedTip.userVote }
            : tip
        ))
      }
    } catch {
      // Error voting
    } finally {
      setVotingTipId(null)
    }
  }

  const getCategoryIcon = (category: TipCategory) => {
    switch (category) {
      case 'PLANTING_CALENDAR':
        return <Calendar className="h-4 w-4" />
      case 'PEST_DISEASE':
        return <Bug className="h-4 w-4" />
      case 'COMPANION_PLANTING':
        return <Leaf className="h-4 w-4" />
    }
  }

  const getCategoryLabel = (category: TipCategory) => {
    switch (category) {
      case 'PLANTING_CALENDAR':
        return 'Planting'
      case 'PEST_DISEASE':
        return 'Pest & Disease'
      case 'COMPANION_PLANTING':
        return 'Companion'
    }
  }

  const getCategoryColors = (category: TipCategory) => {
    switch (category) {
      case 'PLANTING_CALENDAR':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      case 'PEST_DISEASE':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
      case 'COMPANION_PLANTING':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
    }
  }

  const getCategoryLink = (category: TipCategory) => {
    switch (category) {
      case 'PLANTING_CALENDAR':
        return '/resources/calendar'
      case 'PEST_DISEASE':
        return '/resources/pests'
      case 'COMPANION_PLANTING':
        return '/resources/companion'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 dark:border-gray-700 p-8">
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="h-6 w-6 text-amber-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </div>
    )
  }

  if (tips.length === 0) {
    return null
  }

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 dark:border-gray-700 p-8 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Lightbulb className="h-6 w-6 text-amber-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Tips shared by fellow gardeners. Visit the specialized pages to share your own knowledge!
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tips.map((tip) => (
          <div
            key={tip.id}
            className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start gap-3">
              {/* Vote buttons */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => handleVote(tip.id, tip.userVote === 1 ? 0 : 1)}
                  disabled={votingTipId === tip.id}
                  className={`p-1 rounded transition-colors ${
                    tip.userVote === 1
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400'
                  }`}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                </button>
                <span className="text-xs font-semibold text-gray-900 dark:text-white">
                  {tip.upvotes - tip.downvotes}
                </span>
                <button
                  onClick={() => handleVote(tip.id, tip.userVote === -1 ? 0 : -1)}
                  disabled={votingTipId === tip.id}
                  className={`p-1 rounded transition-colors ${
                    tip.userVote === -1
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400'
                  }`}
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Category badge */}
                <Link
                  href={getCategoryLink(tip.category)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium mb-2 ${getCategoryColors(tip.category)} hover:opacity-80 transition-opacity`}
                >
                  {getCategoryIcon(tip.category)}
                  {getCategoryLabel(tip.category)}
                </Link>

                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-1">
                  {tip.title}
                </h3>

                {/* Context badges */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {tip.plantName && (
                    <span className="px-1.5 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded text-xs">
                      {tip.plantName}
                    </span>
                  )}
                  {tip.pestName && (
                    <span className="px-1.5 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded text-xs">
                      {tip.pestName}
                    </span>
                  )}
                  {tip.mainPlant && (
                    <span className="px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded text-xs">
                      {tip.mainPlant}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                  {tip.content}
                </p>

                {/* Author info */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
                  {tip.author.avatar ? (
                    <img
                      src={tip.author.avatar}
                      alt={`${tip.author.firstName} ${tip.author.lastName}`}
                      className="w-4 h-4 rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4 p-0.5 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  )}
                  <span>{tip.author.firstName}</span>
                  <span className="text-gray-400">·</span>
                  <span>{formatDate(tip.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Links to category pages */}
      <div className="mt-6 pt-6 border-t dark:border-gray-700 flex flex-wrap gap-4">
        <Link
          href="/resources/calendar"
          className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <Calendar className="h-4 w-4" />
          Planting Calendar Tips
          <ChevronRight className="h-4 w-4" />
        </Link>
        <Link
          href="/resources/pests"
          className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <Bug className="h-4 w-4" />
          Pest & Disease Tips
          <ChevronRight className="h-4 w-4" />
        </Link>
        <Link
          href="/resources/companion"
          className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <Leaf className="h-4 w-4" />
          Companion Planting Tips
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

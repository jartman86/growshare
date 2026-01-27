'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { ThumbsUp, ThumbsDown, User, Lightbulb, Loader2, Plus, Calendar, Bug, Leaf } from 'lucide-react'

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

interface PlantCommunityTipsProps {
  plantName: string
  limit?: number
}

export function PlantCommunityTips({ plantName, limit = 10 }: PlantCommunityTipsProps) {
  const { isSignedIn } = useUser()
  const [tips, setTips] = useState<CommunityTip[]>([])
  const [loading, setLoading] = useState(true)
  const [votingTipId, setVotingTipId] = useState<string | null>(null)

  const fetchTips = async () => {
    try {
      // Fetch tips that mention this plant in plantName or mainPlant fields
      const [plantResponse, companionResponse] = await Promise.all([
        fetch(`/api/community-tips?plantName=${encodeURIComponent(plantName)}&limit=${limit}`),
        fetch(`/api/community-tips?category=COMPANION_PLANTING&limit=${limit}`),
      ])

      const plantTips = plantResponse.ok ? await plantResponse.json() : []
      const companionTips = companionResponse.ok ? await companionResponse.json() : []

      // Filter companion tips to those related to this plant
      const normalizedPlantName = plantName.toLowerCase()
      const relevantCompanionTips = companionTips.filter((tip: CommunityTip) => {
        const mainPlantMatch = tip.mainPlant?.toLowerCase().includes(normalizedPlantName)
        const companionMatch = tip.companions?.some(c => c.toLowerCase().includes(normalizedPlantName))
        const avoidMatch = tip.avoid?.some(a => a.toLowerCase().includes(normalizedPlantName))
        return mainPlantMatch || companionMatch || avoidMatch
      })

      // Combine and deduplicate
      const allTips = [...plantTips, ...relevantCompanionTips]
      const uniqueTips = allTips.filter((tip, index, self) =>
        index === self.findIndex(t => t.id === tip.id)
      )

      // Sort by upvotes
      uniqueTips.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))

      setTips(uniqueTips.slice(0, limit))
    } catch (error) {
      console.error('Error fetching plant tips:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (plantName) {
      fetchTips()
    }
  }, [plantName, limit])

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
    } catch (error) {
      console.error('Error voting:', error)
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
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-8">
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="h-6 w-6 text-amber-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Community Tips</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Lightbulb className="h-6 w-6 text-amber-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Community Tips</h2>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Tips from fellow gardeners about growing {plantName}. Share your experience on our resource pages!
      </p>

      {tips.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <Lightbulb className="h-12 w-12 text-amber-400/50 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No tips yet for {plantName}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
            Be the first to share your knowledge!
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/resources/calendar"
              className="inline-flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Planting Tip
            </Link>
            <Link
              href="/resources/pests"
              className="inline-flex items-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Pest Tip
            </Link>
            <Link
              href="/resources/companion"
              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Companion Tip
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex gap-4">
                {/* Vote buttons */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => handleVote(tip.id, tip.userVote === 1 ? 0 : 1)}
                    disabled={votingTipId === tip.id}
                    className={`p-1.5 rounded-lg transition-colors ${
                      tip.userVote === 1
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400'
                    }`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {tip.upvotes - tip.downvotes}
                  </span>
                  <button
                    onClick={() => handleVote(tip.id, tip.userVote === -1 ? 0 : -1)}
                    disabled={votingTipId === tip.id}
                    className={`p-1.5 rounded-lg transition-colors ${
                      tip.userVote === -1
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400'
                    }`}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Link
                      href={getCategoryLink(tip.category)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getCategoryColors(tip.category)} hover:opacity-80 transition-opacity`}
                    >
                      {getCategoryIcon(tip.category)}
                      {getCategoryLabel(tip.category)}
                    </Link>
                    {tip.usdaZone && (
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-medium">
                        Zone {tip.usdaZone}
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {tip.title}
                  </h3>

                  {/* Additional context */}
                  {tip.treatment && (
                    <p className="text-sm text-purple-700 dark:text-purple-400 mb-2">
                      <span className="font-medium">Treatment:</span> {tip.treatment}
                    </p>
                  )}

                  {tip.category === 'COMPANION_PLANTING' && (tip.companions?.length || tip.avoid?.length) && (
                    <div className="flex flex-wrap gap-4 mb-2 text-xs">
                      {tip.companions && tip.companions.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-green-600 dark:text-green-400 font-medium">Good with:</span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {tip.companions.join(', ')}
                          </span>
                        </div>
                      )}
                      {tip.avoid && tip.avoid.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-red-600 dark:text-red-400 font-medium">Avoid:</span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {tip.avoid.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {tip.content}
                  </p>

                  {/* Author info */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    {tip.author.avatar ? (
                      <img
                        src={tip.author.avatar}
                        alt={`${tip.author.firstName} ${tip.author.lastName}`}
                        className="w-5 h-5 rounded-full"
                      />
                    ) : (
                      <User className="w-5 h-5 p-0.5 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    )}
                    <span>
                      {tip.author.firstName} {tip.author.lastName}
                    </span>
                    <span>·</span>
                    <span>{formatDate(tip.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Link to share tips */}
      <div className="mt-6 pt-6 border-t dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Have a tip about {plantName}? Share it with the community!
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/resources/calendar"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
          >
            <Calendar className="h-4 w-4" />
            Planting Tips
          </Link>
          <Link
            href="/resources/pests"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            <Bug className="h-4 w-4" />
            Pest & Disease Tips
          </Link>
          <Link
            href="/resources/companion"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
          >
            <Leaf className="h-4 w-4" />
            Companion Tips
          </Link>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { ThumbsUp, ThumbsDown, User, Lightbulb, Plus, Loader2 } from 'lucide-react'
import { TipSubmissionForm } from './tip-submission-form'

type TipCategory = 'PLANTING_CALENDAR' | 'PEST_DISEASE' | 'COMPANION_PLANTING'

interface CommunityTip {
  id: string
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

interface CommunityTipsSectionProps {
  category: TipCategory
  title?: string
}

export function CommunityTipsSection({ category, title = 'Community Tips' }: CommunityTipsSectionProps) {
  const { isSignedIn, user } = useUser()
  const [tips, setTips] = useState<CommunityTip[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [votingTipId, setVotingTipId] = useState<string | null>(null)

  const fetchTips = async () => {
    try {
      const response = await fetch(`/api/community-tips?category=${category}`)
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
  }, [category])

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

  const getCategoryIcon = () => {
    switch (category) {
      case 'PLANTING_CALENDAR':
        return '🌱'
      case 'PEST_DISEASE':
        return '🐛'
      case 'COMPANION_PLANTING':
        return '🌻'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Lightbulb className="h-6 w-6 text-amber-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Share a Tip
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Tips shared by fellow gardeners. Vote on helpful tips and share your own knowledge!
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : tips.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <span className="text-4xl mb-4 block">{getCategoryIcon()}</span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No tips yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Be the first to share your gardening knowledge!
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Share a Tip
          </button>
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
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {tip.title}
                  </h3>

                  {/* Category-specific badges */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tip.plantName && (
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-medium">
                        {tip.plantName}
                      </span>
                    )}
                    {tip.usdaZone && (
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-medium">
                        Zone {tip.usdaZone}
                      </span>
                    )}
                    {tip.pestName && (
                      <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs font-medium">
                        {tip.pestName}
                      </span>
                    )}
                    {tip.treatment && (
                      <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-xs font-medium">
                        {tip.treatment}
                      </span>
                    )}
                    {tip.mainPlant && (
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded text-xs font-medium">
                        {tip.mainPlant}
                      </span>
                    )}
                  </div>

                  {/* Companion planting specifics */}
                  {category === 'COMPANION_PLANTING' && (tip.companions?.length || tip.avoid?.length) && (
                    <div className="flex flex-wrap gap-4 mb-2 text-xs">
                      {tip.companions && tip.companions.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-green-600 dark:text-green-400 font-medium">Good:</span>
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
                    <span>•</span>
                    <span>{formatDate(tip.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <TipSubmissionForm
          category={category}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false)
            fetchTips()
          }}
        />
      )}
    </div>
  )
}

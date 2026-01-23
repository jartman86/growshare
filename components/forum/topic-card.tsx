'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { MessageSquare, Eye, CheckCircle, Pin } from 'lucide-react'
import { VoteButtons } from './vote-buttons'

interface TopicCardProps {
  topic: {
    id: string
    title: string
    category: string
    tags: string[]
    isPinned: boolean
    isSolved: boolean
    views: number
    score: number
    createdAt: string
    author: {
      id: string
      firstName: string
      lastName: string
      avatar: string | null
      isVerified: boolean
    }
    _count: {
      replies: number
    }
  }
  userVote?: number
}

const CATEGORY_LABELS: Record<string, string> = {
  GENERAL_DISCUSSION: 'General',
  GROWING_TIPS: 'Growing Tips',
  PEST_DISEASE: 'Pest & Disease',
  EQUIPMENT_TOOLS: 'Equipment',
  RECIPES_COOKING: 'Recipes',
  MARKETPLACE_HELP: 'Marketplace',
  INTRODUCTIONS: 'Introductions',
  EVENTS_MEETUPS: 'Events',
}

export function TopicCard({ topic, userVote = 0 }: TopicCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Vote Column */}
        <div className="flex-shrink-0">
          <VoteButtons
            topicId={topic.id}
            initialScore={topic.score}
            initialUserVote={userVote}
            compact
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-2">
            {topic.isPinned && (
              <Pin className="h-4 w-4 text-orange-500 flex-shrink-0 mt-1" />
            )}
            {topic.isSolved && (
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" />
            )}
            <Link
              href={`/community/${topic.id}`}
              className="font-semibold text-gray-900 hover:text-green-600 transition-colors line-clamp-2"
            >
              {topic.title}
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
              {CATEGORY_LABELS[topic.category] || topic.category}
            </span>
            {topic.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Link
              href={`/profile/${topic.author.id}`}
              className="flex items-center gap-2 hover:text-gray-700"
            >
              {topic.author.avatar ? (
                <img
                  src={topic.author.avatar}
                  alt={topic.author.firstName}
                  className="w-5 h-5 rounded-full"
                />
              ) : (
                <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                  {topic.author.firstName[0]}
                </div>
              )}
              <span>
                {topic.author.firstName} {topic.author.lastName}
              </span>
            </Link>

            <span className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              {topic._count.replies}
            </span>

            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {topic.views}
            </span>

            <span>
              {formatDistanceToNow(new Date(topic.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

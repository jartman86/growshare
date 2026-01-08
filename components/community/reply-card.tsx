'use client'

import { useState } from 'react'
import { ForumReply } from '@/lib/community-data'
import { ArrowUp, CheckCircle, Calendar, Star } from 'lucide-react'

interface ReplyCardProps {
  reply: ForumReply
}

export function ReplyCard({ reply }: ReplyCardProps) {
  const [upvoted, setUpvoted] = useState(false)
  const [localUpvotes, setLocalUpvotes] = useState(reply.upvotes)

  const handleUpvote = () => {
    if (upvoted) {
      setLocalUpvotes(localUpvotes - 1)
      setUpvoted(false)
    } else {
      setLocalUpvotes(localUpvotes + 1)
      setUpvoted(true)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <div
      className={`bg-white rounded-xl border p-6 ${
        reply.isAccepted ? 'ring-2 ring-green-500 border-green-500' : ''
      }`}
    >
      {/* Accepted Badge */}
      {reply.isAccepted && (
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-green-200">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="font-semibold text-green-700">Accepted Answer</span>
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Upvote Button */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <button
            onClick={handleUpvote}
            className={`p-2 rounded-lg transition-colors ${
              upvoted
                ? 'bg-purple-100 text-purple-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <ArrowUp className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-gray-900">{localUpvotes}</span>
        </div>

        {/* Author Avatar */}
        {reply.authorAvatar && (
          <img
            src={reply.authorAvatar}
            alt={reply.authorName}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Author Info */}
          <div className="flex items-center gap-2 mb-3">
            <p className="font-semibold text-gray-900">{reply.authorName}</p>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(reply.createdAt)}</span>
            </div>
          </div>

          {/* Reply Content */}
          <div className="prose max-w-none mb-4">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{reply.content}</p>
          </div>

          {/* Images */}
          {reply.images && reply.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {reply.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Reply image ${index + 1}`}
                  className="rounded-lg border"
                />
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 text-sm">
            <button className="text-purple-600 hover:text-purple-700 font-medium">
              Reply
            </button>
            <button className="text-gray-600 hover:text-gray-700">Share</button>
            {reply.createdAt.getTime() !== reply.updatedAt.getTime() && (
              <span className="text-xs text-gray-500">
                (edited {formatDate(reply.updatedAt)})
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

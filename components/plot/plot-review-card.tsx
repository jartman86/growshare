'use client'

import { useState } from 'react'
import { StarRating } from '@/components/reviews/star-rating'
import { MessageSquare, Reply, Loader2 } from 'lucide-react'

interface Review {
  id: string
  rating: number
  content: string
  createdAt: Date
  response?: string | null
  respondedAt?: Date | null
  author: {
    id: string
    firstName: string
    lastName: string
    avatar: string | null
  }
}

interface PlotReviewCardProps {
  review: Review
  isOwner?: boolean
  ownerName?: string
  onResponseSubmitted?: () => void
}

export function PlotReviewCard({
  review,
  isOwner = false,
  ownerName,
  onResponseSubmitted
}: PlotReviewCardProps) {
  const [showResponseForm, setShowResponseForm] = useState(false)
  const [responseText, setResponseText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [responseError, setResponseError] = useState<string | null>(null)
  const [localResponse, setLocalResponse] = useState(review.response)
  const [localRespondedAt, setLocalRespondedAt] = useState(review.respondedAt)

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleSubmitResponse = async () => {
    if (!responseText.trim()) {
      setResponseError('Response cannot be empty')
      return
    }

    setIsSubmitting(true)
    setResponseError(null)

    try {
      const res = await fetch(`/api/reviews/${review.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: responseText.trim() }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to submit response')
      }

      setLocalResponse(responseText.trim())
      setLocalRespondedAt(new Date())
      setShowResponseForm(false)
      setResponseText('')
      onResponseSubmitted?.()
    } catch (error) {
      setResponseError(error instanceof Error ? error.message : 'Failed to submit response')
    } finally {
      setIsSubmitting(false)
    }
  }

  const canRespond = isOwner && !localResponse

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-start gap-4">
        {/* Reviewer Avatar */}
        {review.author.avatar ? (
          <img
            src={review.author.avatar}
            alt={`${review.author.firstName} ${review.author.lastName}`}
            className="w-12 h-12 rounded-full border-2 border-gray-200 flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
            {review.author.firstName.charAt(0)}
          </div>
        )}

        <div className="flex-1">
          {/* Reviewer Name */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">
              {review.author.firstName} {review.author.lastName}
            </h3>
          </div>

          {/* Rating & Date */}
          <div className="flex items-center gap-3 mb-3">
            <StarRating rating={review.rating} size="sm" showNumber />
            <span className="text-sm text-gray-500">
              {formatDate(review.createdAt)}
            </span>
          </div>

          {/* Review Content */}
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {review.content}
          </p>

          {/* Owner Response */}
          {localResponse && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-900 text-sm">
                  Response from Owner
                </span>
                {localRespondedAt && (
                  <span className="text-xs text-blue-700">
                    {formatDate(localRespondedAt)}
                  </span>
                )}
              </div>
              <p className="text-sm text-blue-900">{localResponse}</p>
            </div>
          )}

          {/* Owner Respond Button */}
          {canRespond && !showResponseForm && (
            <div className="mt-4">
              <button
                onClick={() => setShowResponseForm(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
              >
                <Reply className="h-4 w-4" />
                Respond to this review
              </button>
            </div>
          )}

          {/* Owner Response Form */}
          {showResponseForm && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Reply className="h-4 w-4 text-gray-600" />
                <span className="font-semibold text-gray-900 text-sm">
                  Respond as {ownerName || 'Owner'}
                </span>
              </div>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Write your response to this review..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                rows={4}
                maxLength={2000}
                disabled={isSubmitting}
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-500">
                  {responseText.length}/2000 characters
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowResponseForm(false)
                      setResponseText('')
                      setResponseError(null)
                    }}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitResponse}
                    disabled={isSubmitting || !responseText.trim()}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Response'
                    )}
                  </button>
                </div>
              </div>
              {responseError && (
                <p className="mt-2 text-sm text-red-600">{responseError}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

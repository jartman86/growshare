'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Review } from '@/lib/reviews-data'
import { StarRating } from './star-rating'
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  BadgeCheck,
  Edit2,
  MoreVertical,
  Flag,
  Clock,
  Loader2,
  Reply,
} from 'lucide-react'

interface ReviewCardProps {
  review: Review
  onHelpful?: (reviewId: string) => void
  onNotHelpful?: (reviewId: string) => void
  showTarget?: boolean
  isOwner?: boolean
  ownerName?: string
  onResponseSubmitted?: (reviewId: string, response: string) => void
  userVote?: number | null // 1 for helpful, -1 for not helpful, null for no vote
  isOwnReview?: boolean // Whether current user authored this review
}

export function ReviewCard({
  review,
  onHelpful,
  onNotHelpful,
  showTarget = false,
  isOwner = false,
  ownerName,
  onResponseSubmitted,
  userVote: initialUserVote = null,
  isOwnReview = false,
}: ReviewCardProps) {
  const [showFullContent, setShowFullContent] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showResponseForm, setShowResponseForm] = useState(false)
  const [responseText, setResponseText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [responseError, setResponseError] = useState<string | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  const [userVote, setUserVote] = useState<number | null>(initialUserVote)
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount)
  const [notHelpfulCount, setNotHelpfulCount] = useState(review.notHelpfulCount)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const contentPreviewLength = 300
  const shouldTruncate = review.content.length > contentPreviewLength
  const displayContent =
    shouldTruncate && !showFullContent
      ? review.content.slice(0, contentPreviewLength) + '...'
      : review.content

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

      setShowResponseForm(false)
      setResponseText('')
      onResponseSubmitted?.(review.id, responseText.trim())
    } catch (error) {
      setResponseError(error instanceof Error ? error.message : 'Failed to submit response')
    } finally {
      setIsSubmitting(false)
    }
  }

  const canRespond = isOwner && !review.ownerResponse

  const handleVote = async (value: 1 | -1) => {
    if (isVoting || isOwnReview) return

    setIsVoting(true)
    try {
      const res = await fetch(`/api/reviews/${review.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      })

      if (!res.ok) {
        throw new Error('Failed to vote')
      }

      const data = await res.json()
      setHelpfulCount(data.helpfulCount)
      setNotHelpfulCount(data.notHelpfulCount)
      setUserVote(data.userVote)

      // Call legacy handlers if provided
      if (value === 1) {
        onHelpful?.(review.id)
      } else {
        onNotHelpful?.(review.id)
      }
    } catch {
      // Error voting
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          {/* Reviewer Avatar */}
          <Link href={`/profile/${review.reviewerId}`}>
            <img
              src={review.reviewerAvatar}
              alt={review.reviewerName}
              className="w-12 h-12 rounded-full border-2 border-gray-200 hover:border-green-500 transition-colors"
            />
          </Link>

          <div className="flex-1">
            {/* Reviewer Name & Level */}
            <div className="flex items-center gap-2 mb-1">
              <Link
                href={`/profile/${review.reviewerId}`}
                className="font-semibold text-gray-900 hover:text-green-600 transition-colors"
              >
                {review.reviewerName}
              </Link>
              {review.reviewerLevel && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                  Level {review.reviewerLevel}
                </span>
              )}
              {(review.verifiedPurchase || review.verifiedRental) && (
                <div className="flex items-center gap-1 text-blue-600" title="Verified transaction">
                  <BadgeCheck className="h-4 w-4" />
                  <span className="text-xs font-medium">
                    Verified {review.verifiedPurchase ? 'Purchase' : 'Rental'}
                  </span>
                </div>
              )}
            </div>

            {/* Rating & Date */}
            <div className="flex items-center gap-3">
              <StarRating rating={review.rating} size="sm" />
              <span className="text-sm text-gray-500">
                {formatDate(review.createdAt)}
                {review.isEdited && ' (edited)'}
              </span>
              {review.rentalDuration && (
                <span className="text-sm text-gray-500">• Rented for {review.rentalDuration}</span>
              )}
            </div>

            {/* Target (if showing reviews for a user) */}
            {showTarget && (
              <div className="mt-1">
                <Link
                  href={`/tools/${review.targetId}`}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {review.targetName} →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* More Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                <Flag className="h-4 w-4" />
                Report review
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Review Title */}
      {review.title && (
        <h3 className="text-lg font-bold text-gray-900 mb-3">{review.title}</h3>
      )}

      {/* Review Content */}
      <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-wrap">
        {displayContent}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setShowFullContent(!showFullContent)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-4"
        >
          {showFullContent ? 'Show less' : 'Read more'}
        </button>
      )}

      {/* Pros & Cons */}
      {(review.pros && review.pros.length > 0) || (review.cons && review.cons.length > 0) ? (
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {review.pros && review.pros.length > 0 && (
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2 text-sm">Pros</h4>
              <ul className="space-y-1">
                {review.pros.map((pro, index) => (
                  <li key={index} className="text-sm text-green-800 flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">+</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {review.cons && review.cons.length > 0 && (
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-semibold text-red-900 mb-2 text-sm">Cons</h4>
              <ul className="space-y-1">
                {review.cons.map((con, index) => (
                  <li key={index} className="text-sm text-red-800 flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">−</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : null}

      {/* Photos */}
      {review.photos && review.photos.length > 0 && (
        <div className="mb-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {review.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Review photo ${index + 1}`}
                className="h-32 w-32 object-cover rounded-lg border cursor-pointer hover:opacity-75 transition-opacity"
              />
            ))}
          </div>
        </div>
      )}

      {/* Owner Response */}
      {review.ownerResponse && (
        <div className="mt-4 ml-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-blue-900 text-sm">
              Response from {review.ownerResponse.responderName}
            </span>
            <span className="text-xs text-blue-700">
              {formatDate(review.ownerResponse.respondedAt)}
            </span>
          </div>
          <p className="text-sm text-blue-900">{review.ownerResponse.content}</p>
        </div>
      )}

      {/* Owner Respond Button */}
      {canRespond && !showResponseForm && (
        <div className="mt-4 ml-8">
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
        <div className="mt-4 ml-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
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

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t">
        <button
          onClick={() => handleVote(1)}
          disabled={isVoting || isOwnReview}
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors disabled:cursor-not-allowed ${
            userVote === 1
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'text-gray-700 hover:bg-gray-100'
          } ${isOwnReview ? 'opacity-50' : ''}`}
          title={isOwnReview ? "You can't vote on your own review" : 'Mark as helpful'}
        >
          <ThumbsUp className={`h-4 w-4 ${userVote === 1 ? 'fill-current' : ''}`} />
          <span>Helpful ({helpfulCount})</span>
        </button>
        <button
          onClick={() => handleVote(-1)}
          disabled={isVoting || isOwnReview}
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors disabled:cursor-not-allowed ${
            userVote === -1
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'text-gray-700 hover:bg-gray-100'
          } ${isOwnReview ? 'opacity-50' : ''}`}
          title={isOwnReview ? "You can't vote on your own review" : 'Mark as not helpful'}
        >
          <ThumbsDown className={`h-4 w-4 ${userVote === -1 ? 'fill-current' : ''}`} />
          <span>({notHelpfulCount})</span>
        </button>
        {review.replyCount > 0 && (
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ml-auto">
            <MessageSquare className="h-4 w-4" />
            <span>{review.replyCount} {review.replyCount === 1 ? 'Reply' : 'Replies'}</span>
          </button>
        )}
      </div>
    </div>
  )
}

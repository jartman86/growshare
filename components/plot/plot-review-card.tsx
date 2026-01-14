'use client'

import { StarRating } from '@/components/reviews/star-rating'

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: Date
  author: {
    id: string
    firstName: string
    lastName: string
    avatar: string | null
  }
}

interface PlotReviewCardProps {
  review: Review
}

export function PlotReviewCard({ review }: PlotReviewCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

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

          {/* Review Comment */}
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {review.comment}
          </p>
        </div>
      </div>
    </div>
  )
}

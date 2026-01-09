'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

interface StarRatingInputProps {
  value: number
  onChange: (rating: number) => void
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  required?: boolean
  disabled?: boolean
}

export function StarRatingInput({
  value,
  onChange,
  maxRating = 5,
  size = 'lg',
  required = false,
  disabled = false,
}: StarRatingInputProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null)

  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  const ratingLabels = [
    '',
    'Poor',
    'Fair',
    'Good',
    'Very Good',
    'Excellent',
  ]

  const displayRating = hoverRating ?? value
  const currentLabel = ratingLabels[displayRating] || 'Rate this'

  return (
    <div className={disabled ? 'opacity-50 cursor-not-allowed' : ''}>
      <div className="flex items-center gap-2">
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1
          const isFilled = starValue <= displayRating

          return (
            <button
              key={index}
              type="button"
              onClick={() => !disabled && onChange(starValue)}
              onMouseEnter={() => !disabled && setHoverRating(starValue)}
              onMouseLeave={() => !disabled && setHoverRating(null)}
              disabled={disabled}
              className={`transition-all ${
                disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'
              }`}
              aria-label={`Rate ${starValue} stars`}
            >
              <Star
                className={`${sizeClasses[size]} transition-colors ${
                  isFilled
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300 hover:text-yellow-200'
                }`}
              />
            </button>
          )
        })}
        <span className="ml-2 text-sm font-medium text-gray-700">
          {currentLabel}
          {required && value === 0 && <span className="text-red-500 ml-1">*</span>}
        </span>
      </div>
    </div>
  )
}

import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
  className?: string
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showNumber = false,
  className = '',
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1
        const isFilled = starValue <= Math.floor(rating)
        const isPartial = starValue === Math.ceil(rating) && rating % 1 !== 0
        const fillPercentage = isPartial ? (rating % 1) * 100 : 0

        return (
          <div key={index} className="relative">
            {isPartial ? (
              <>
                {/* Background star (empty) */}
                <Star className={`${sizeClasses[size]} text-gray-300`} />
                {/* Foreground star (partial fill) */}
                <div
                  className="absolute top-0 left-0 overflow-hidden"
                  style={{ width: `${fillPercentage}%` }}
                >
                  <Star
                    className={`${sizeClasses[size]} text-yellow-400 fill-yellow-400`}
                  />
                </div>
              </>
            ) : (
              <Star
                className={`${sizeClasses[size]} ${
                  isFilled
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            )}
          </div>
        )
      })}
      {showNumber && (
        <span className={`font-medium text-gray-700 ml-1 ${textSizeClasses[size]}`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

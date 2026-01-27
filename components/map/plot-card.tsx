'use client'

import { PlotMarker } from '@/lib/types'
import { MapPin, Droplet, CheckCircle, Star, Navigation, Sprout } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

interface PlotCardProps {
  plot: PlotMarker
  onClick?: () => void
  isSelected?: boolean
  showLink?: boolean
}

export function PlotCard({ plot, onClick, isSelected, showLink = false }: PlotCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const CardContent = (
    <div
      onClick={onClick}
      className={cn(
        'group cursor-pointer rounded-xl border-2 bg-white dark:bg-gray-800 p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
        isSelected
          ? 'border-green-500 shadow-xl ring-2 ring-green-500/20 dark:border-green-400'
          : 'border-gray-100 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 shadow-md'
      )}
    >
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-3 bg-gray-100 dark:bg-gray-700">
        {!imageError && plot.images[0] ? (
          <>
            {/* Blur placeholder */}
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
            )}
            <Image
              src={plot.images[0]}
              alt={plot.title}
              fill
              className={cn(
                'object-cover transition-all duration-500 group-hover:scale-105',
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <Sprout className="h-12 w-12 text-green-300 dark:text-green-700" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span
            className={cn(
              'px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm backdrop-blur-sm',
              plot.status === 'ACTIVE' && 'bg-green-500/90 text-white',
              plot.status === 'RENTED' && 'bg-blue-500/90 text-white',
              plot.status === 'INACTIVE' && 'bg-gray-500/90 text-white'
            )}
          >
            {plot.status === 'ACTIVE' ? 'Available' : plot.status === 'RENTED' ? 'Rented' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1 line-clamp-1 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
          {plot.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          <span>{plot.city}, {plot.state}</span>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
            <Navigation className="h-3 w-3" />
            {plot.acreage} {plot.acreage === 1 ? 'acre' : 'acres'}
          </div>

          {plot.hasIrrigation && (
            <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md">
              <Droplet className="h-3 w-3" />
              Irrigation
            </div>
          )}

          {plot.hasFencing && (
            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-md">
              <CheckCircle className="h-3 w-3" />
              Fenced
            </div>
          )}

          {plot.hasGreenhouse && (
            <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-md">
              <CheckCircle className="h-3 w-3" />
              Greenhouse
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(plot.pricePerMonth)}
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/month</span>
            </div>
          </div>

          {plot.averageRating && (
            <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 rounded-md">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {plot.averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Owner */}
        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Hosted by <span className="font-medium text-gray-700 dark:text-gray-300">{plot.ownerName}</span>
          </p>
        </div>
      </div>
    </div>
  )

  if (showLink) {
    return (
      <Link href={`/explore/${plot.id}`} className="block">
        {CardContent}
      </Link>
    )
  }

  return CardContent
}

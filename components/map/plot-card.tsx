'use client'

import { PlotMarker } from '@/lib/types'
import { MapPin, Droplet, CheckCircle, Star, Navigation } from 'lucide-react'
import Image from 'next/image'
import { cn, formatCurrency } from '@/lib/utils'

interface PlotCardProps {
  plot: PlotMarker
  onClick?: () => void
  isSelected?: boolean
}

export function PlotCard({ plot, onClick, isSelected }: PlotCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group cursor-pointer rounded-lg border bg-white p-4 transition-all hover:shadow-lg',
        isSelected ? 'border-green-600 shadow-lg ring-2 ring-green-600' : 'border-gray-200 hover:border-green-400'
      )}
    >
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-3">
        <Image
          src={plot.images[0] || '/placeholder-farm.jpg'}
          alt={plot.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span
            className={cn(
              'px-2 py-1 text-xs font-semibold rounded-full',
              plot.status === 'ACTIVE' && 'bg-green-600 text-white',
              plot.status === 'RENTED' && 'bg-blue-600 text-white',
              plot.status === 'INACTIVE' && 'bg-gray-500 text-white'
            )}
          >
            {plot.status === 'ACTIVE' ? 'Available' : plot.status === 'RENTED' ? 'Rented' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div>
        <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
          {plot.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
          <MapPin className="h-4 w-4" />
          <span>{plot.city}, {plot.state}</span>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
            <Navigation className="h-3 w-3" />
            {plot.acreage} {plot.acreage === 1 ? 'acre' : 'acres'}
          </div>

          {plot.hasIrrigation && (
            <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
              <Droplet className="h-3 w-3" />
              Irrigation
            </div>
          )}

          {plot.hasFencing && (
            <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
              <CheckCircle className="h-3 w-3" />
              Fenced
            </div>
          )}

          {plot.hasGreenhouse && (
            <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
              <CheckCircle className="h-3 w-3" />
              Greenhouse
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(plot.pricePerMonth)}
              <span className="text-sm font-normal text-gray-600">/month</span>
            </div>
          </div>

          {plot.averageRating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-900">
                {plot.averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Owner */}
        <div className="mt-2 pt-2 border-t">
          <p className="text-xs text-gray-500">
            Hosted by <span className="font-medium text-gray-700">{plot.ownerName}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

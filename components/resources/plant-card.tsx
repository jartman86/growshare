'use client'

import Link from 'next/link'
import { Sun, Droplet, Leaf, Clock, TrendingUp, Globe } from 'lucide-react'

interface PlantCardProps {
  guide: {
    id: string
    commonName: string
    scientificName: string
    category: string
    difficulty: string
    image: string
    description?: string
    sunlight?: string
    water?: string
    daysToMaturity?: string
    hardinessZones?: string
    popularityScore?: number
    source?: 'local' | 'perenual'
  }
}

export function PlantCard({ guide }: PlantCardProps) {
  const getDifficultyColor = () => {
    switch (guide.difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'Challenging':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const isApiPlant = guide.source === 'perenual'

  return (
    <Link href={`/resources/${guide.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer overflow-hidden h-full flex flex-col group">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={guide.image}
            alt={guide.commonName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            {isApiPlant && (
              <div className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-600 text-white flex items-center gap-1">
                <Globe className="h-3 w-3" />
                API
              </div>
            )}
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor()}`}>
              {guide.difficulty}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Category */}
          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
              {guide.category}
            </span>
            {guide.popularityScore && (
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <TrendingUp className="h-3 w-3" />
                <span>{guide.popularityScore}% popular</span>
              </div>
            )}
          </div>

          {/* Names */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {guide.commonName}
          </h3>
          <p className="text-sm italic text-gray-600 dark:text-gray-400 mb-4">{guide.scientificName}</p>

          {/* Description */}
          {guide.description && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2 flex-1">
              {guide.description}
            </p>
          )}

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t dark:border-gray-700">
            {guide.sunlight && (
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Sun className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <span className="truncate">{guide.sunlight}</span>
              </div>
            )}
            {guide.water && (
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Droplet className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="truncate">{guide.water}</span>
              </div>
            )}
            {guide.daysToMaturity && (
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Clock className="h-4 w-4 text-purple-500 flex-shrink-0" />
                <span className="truncate">{guide.daysToMaturity}</span>
              </div>
            )}
            {guide.hardinessZones && (
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Leaf className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="truncate">Zone {guide.hardinessZones}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

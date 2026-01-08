'use client'

import Link from 'next/link'
import { PlantGuide } from '@/lib/resources-data'
import { Sun, Droplet, Leaf, Clock, TrendingUp } from 'lucide-react'

interface PlantCardProps {
  guide: PlantGuide
}

export function PlantCard({ guide }: PlantCardProps) {
  const getDifficultyColor = () => {
    switch (guide.difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700'
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-700'
      case 'Challenging':
        return 'bg-red-100 text-red-700'
    }
  }

  return (
    <Link href={`/resources/${guide.id}`}>
      <div className="bg-white rounded-xl border hover:shadow-lg transition-all cursor-pointer overflow-hidden h-full flex flex-col group">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={guide.image}
            alt={guide.commonName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor()}`}>
              {guide.difficulty}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Category */}
          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              {guide.category}
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <TrendingUp className="h-3 w-3" />
              <span>{guide.popularityScore}% popular</span>
            </div>
          </div>

          {/* Names */}
          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
            {guide.commonName}
          </h3>
          <p className="text-sm italic text-gray-600 mb-4">{guide.scientificName}</p>

          {/* Description */}
          <p className="text-sm text-gray-700 mb-4 line-clamp-2 flex-1">
            {guide.description}
          </p>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Sun className="h-4 w-4 text-amber-500 flex-shrink-0" />
              <span className="truncate">{guide.sunlight}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Droplet className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <span className="truncate">{guide.water}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Clock className="h-4 w-4 text-purple-500 flex-shrink-0" />
              <span className="truncate">{guide.daysToMaturity}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Leaf className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="truncate">Zone {guide.hardinessZones}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

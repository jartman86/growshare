'use client'

import Link from 'next/link'
import { JournalEntry } from '@/lib/journal-data'
import { Calendar, Sprout, TrendingUp, CheckCircle } from 'lucide-react'

interface EntryCardProps {
  entry: JournalEntry
}

const statusConfig = {
  PLANNING: {
    label: 'Planning',
    color: 'bg-gray-100 text-gray-700',
    icon: Calendar,
  },
  PLANTED: {
    label: 'Planted',
    color: 'bg-blue-100 text-blue-700',
    icon: Sprout,
  },
  GROWING: {
    label: 'Growing',
    color: 'bg-green-100 text-green-700',
    icon: TrendingUp,
  },
  HARVESTED: {
    label: 'Harvested',
    color: 'bg-orange-100 text-orange-700',
    icon: CheckCircle,
  },
  COMPLETED: {
    label: 'Completed',
    color: 'bg-purple-100 text-purple-700',
    icon: CheckCircle,
  },
}

export function EntryCard({ entry }: EntryCardProps) {
  const config = statusConfig[entry.status]
  const StatusIcon = config.icon

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  const daysGrowing = Math.floor(
    (new Date().getTime() - entry.plantingDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <Link href={`/dashboard/journal/${entry.id}`}>
      <div className="bg-white rounded-xl border hover:shadow-lg transition-all cursor-pointer overflow-hidden group">
        {/* Image */}
        {entry.images.length > 0 && (
          <div className="relative aspect-video overflow-hidden">
            <img
              src={entry.images[0]}
              alt={entry.cropName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 right-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
                {config.label}
              </span>
            </div>
          </div>
        )}

        <div className="p-5">
          {/* Crop Name */}
          <h3 className="text-xl font-bold text-gray-900 mb-1">{entry.cropName}</h3>

          {/* Crop Type & Plot */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              {entry.cropType}
            </span>
            <span>•</span>
            <span className="truncate">{entry.plotName}</span>
          </div>

          {/* Growth Stage */}
          <div className="flex items-center gap-2 mb-3">
            <StatusIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700 font-medium">{entry.growthStage}</span>
          </div>

          {/* Notes Preview */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{entry.notes}</p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t">
            <div>
              <p className="text-xs text-gray-500">Planted</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDate(entry.plantingDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Days Growing</p>
              <p className="text-sm font-semibold text-gray-900">{daysGrowing} days</p>
            </div>
          </div>

          {/* Harvest Info */}
          {entry.harvestAmount && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Harvest</span>
                <span className="text-lg font-bold text-green-600">
                  {entry.harvestAmount} {entry.harvestUnit}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

import Link from 'next/link'
import { JournalEntry } from '@/lib/journal-data'
import {
  Calendar,
  MapPin,
  Sprout,
  Droplet,
  Bug,
  Heart,
  Image as ImageIcon,
  TrendingUp,
  CheckCircle,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface JournalEntryCardProps {
  entry: JournalEntry
  showPlotLink?: boolean
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PLANNING: 'bg-gray-100 text-gray-700',
    PLANTED: 'bg-blue-100 text-blue-700',
    GROWING: 'bg-green-100 text-green-700',
    HARVESTED: 'bg-orange-100 text-orange-700',
    COMPLETED: 'bg-purple-100 text-purple-700',
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'PLANNING':
      return <Calendar className="h-4 w-4" />
    case 'PLANTED':
      return <Sprout className="h-4 w-4" />
    case 'GROWING':
      return <TrendingUp className="h-4 w-4" />
    case 'HARVESTED':
      return <CheckCircle className="h-4 w-4" />
    case 'COMPLETED':
      return <Heart className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

export function JournalEntryCard({ entry, showPlotLink = true }: JournalEntryCardProps) {
  return (
    <div className="bg-white rounded-xl border hover:shadow-lg transition-all overflow-hidden">
      {/* Header Image */}
      {entry.images && entry.images.length > 0 && (
        <div className="relative h-48 bg-gray-200 overflow-hidden group">
          <img
            src={entry.images[0]}
            alt={entry.cropName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {entry.images.length > 1 && (
            <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm font-medium flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              {entry.images.length}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Status & Date */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={cn(
              'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium',
              getStatusColor(entry.status)
            )}
          >
            {getStatusIcon(entry.status)}
            {entry.status}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            {entry.plantingDate
              ? new Date(entry.plantingDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'No date set'}
          </div>
        </div>

        {/* Crop Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-1">{entry.cropName}</h3>

        {/* Crop Type */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Sprout className="h-4 w-4" />
          <span>{entry.cropType}</span>
        </div>

        {/* Plot Info */}
        {showPlotLink && (
          <Link
            href={`/plots/${entry.plotId}`}
            className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 mb-3 font-medium"
          >
            <MapPin className="h-4 w-4" />
            {entry.plotName}
          </Link>
        )}

        {/* Growth Stage */}
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs font-semibold text-gray-700 mb-1">Growth Stage</div>
          <div className="text-sm text-gray-900">{entry.growthStage}</div>
        </div>

        {/* Notes */}
        <p className="text-sm text-gray-700 mb-4 line-clamp-3">{entry.notes}</p>

        {/* Conditions Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {entry.weatherConditions && (
            <div className="flex items-start gap-2">
              <div className="mt-0.5">☀️</div>
              <div>
                <div className="text-xs text-gray-600">Weather</div>
                <div className="text-xs font-medium text-gray-900 line-clamp-2">
                  {entry.weatherConditions}
                </div>
              </div>
            </div>
          )}
          {entry.soilCondition && (
            <div className="flex items-start gap-2">
              <div className="mt-0.5">🌱</div>
              <div>
                <div className="text-xs text-gray-600">Soil</div>
                <div className="text-xs font-medium text-gray-900 line-clamp-2">
                  {entry.soilCondition}
                </div>
              </div>
            </div>
          )}
          {entry.wateringSchedule && (
            <div className="flex items-start gap-2">
              <Droplet className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <div className="text-xs text-gray-600">Watering</div>
                <div className="text-xs font-medium text-gray-900 line-clamp-2">
                  {entry.wateringSchedule}
                </div>
              </div>
            </div>
          )}
          {entry.pestIssues && (
            <div className="flex items-start gap-2">
              <Bug className="h-4 w-4 text-red-600 mt-0.5" />
              <div>
                <div className="text-xs text-gray-600">Pests</div>
                <div className="text-xs font-medium text-gray-900 line-clamp-2">
                  {entry.pestIssues}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Harvest Info */}
        {entry.harvestAmount && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-sm font-bold text-gray-900">
                  Harvested: {entry.harvestAmount} {entry.harvestUnit}
                </div>
                {entry.actualHarvestDate && (
                  <div className="text-xs text-gray-600">
                    on{' '}
                    {new Date(entry.actualHarvestDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Timeline Info */}
        {entry.expectedHarvestDate && entry.status !== 'HARVESTED' && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Clock className="h-3 w-3" />
            Expected harvest:{' '}
            {new Date(entry.expectedHarvestDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </div>
        )}

        {/* Updated timestamp */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Updated {new Date(entry.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  )
}

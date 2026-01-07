import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SAMPLE_JOURNAL_ENTRIES } from '@/lib/journal-data'
import { EntryDetailClient } from '@/components/journal/entry-detail-client'
import {
  ArrowLeft,
  Calendar,
  Sprout,
  TrendingUp,
  CheckCircle,
  Cloud,
  Droplets,
  Bug,
  Beaker,
  MapPin,
  Edit,
} from 'lucide-react'

export default async function JournalEntryDetailPage({
  params,
}: {
  params: Promise<{ entryId: string }>
}) {
  const { entryId } = await params
  const entry = SAMPLE_JOURNAL_ENTRIES.find((e) => e.id === entryId)

  if (!entry) {
    notFound()
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  const formatShortDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  const daysGrowing = Math.floor(
    (new Date().getTime() - entry.plantingDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  const statusConfig = {
    PLANNING: {
      label: 'Planning',
      color: 'bg-gray-100 text-gray-700 border-gray-300',
      icon: Calendar,
    },
    PLANTED: {
      label: 'Planted',
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      icon: Sprout,
    },
    GROWING: {
      label: 'Growing',
      color: 'bg-green-100 text-green-700 border-green-300',
      icon: TrendingUp,
    },
    HARVESTED: {
      label: 'Harvested',
      color: 'bg-orange-100 text-orange-700 border-orange-300',
      icon: CheckCircle,
    },
    COMPLETED: {
      label: 'Completed',
      color: 'bg-purple-100 text-purple-700 border-purple-300',
      icon: CheckCircle,
    },
  }

  const config = statusConfig[entry.status]
  const StatusIcon = config.icon

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link
              href="/dashboard/journal"
              className="inline-flex items-center gap-2 text-green-100 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Journal
            </Link>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{entry.cropName}</h1>
                <div className="flex items-center gap-3 text-green-100">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                    {entry.cropType}
                  </span>
                  <span>•</span>
                  <span>{entry.growthStage}</span>
                </div>
              </div>
              <Link
                href={`/dashboard/journal/${entryId}/edit`}
                className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Status Badge */}
          <div className="mb-6">
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-semibold ${config.color}`}
            >
              <StatusIcon className="h-5 w-5" />
              {config.label}
            </span>
          </div>

          {/* Harvest Button (shows only for growing crops) */}
          <EntryDetailClient entry={entry} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Photo Gallery */}
              {entry.images.length > 0 && (
                <div className="bg-white rounded-xl border overflow-hidden">
                  <div className="grid grid-cols-2 gap-2 p-2">
                    {entry.images.map((image, index) => (
                      <div
                        key={index}
                        className={`relative ${entry.images.length === 1 ? 'col-span-2' : ''} ${
                          index === 0 && entry.images.length === 3 ? 'col-span-2' : ''
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${entry.cropName} photo ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg aspect-video"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Notes</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {entry.notes}
                </p>
              </div>

              {/* Growing Conditions */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Growing Conditions
                </h2>
                <div className="space-y-4">
                  {entry.weatherConditions && (
                    <div className="flex items-start gap-3">
                      <Cloud className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">Weather</h3>
                        <p className="text-gray-700">{entry.weatherConditions}</p>
                      </div>
                    </div>
                  )}

                  {entry.soilCondition && (
                    <div className="flex items-start gap-3">
                      <Sprout className="h-5 w-5 text-brown-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          Soil Condition
                        </h3>
                        <p className="text-gray-700">{entry.soilCondition}</p>
                      </div>
                    </div>
                  )}

                  {entry.wateringSchedule && (
                    <div className="flex items-start gap-3">
                      <Droplets className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">Watering</h3>
                        <p className="text-gray-700">{entry.wateringSchedule}</p>
                      </div>
                    </div>
                  )}

                  {entry.fertilizer && (
                    <div className="flex items-start gap-3">
                      <Beaker className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">Fertilizer</h3>
                        <p className="text-gray-700">{entry.fertilizer}</p>
                      </div>
                    </div>
                  )}

                  {entry.pestIssues && (
                    <div className="flex items-start gap-3">
                      <Bug className="h-5 w-5 text-red-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">Pest Issues</h3>
                        <p className="text-gray-700">{entry.pestIssues}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Harvest Information */}
              {entry.harvestAmount && (
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl border-2 border-orange-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    🎉 Harvest Results
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Amount Harvested</p>
                      <p className="text-3xl font-bold text-orange-600">
                        {entry.harvestAmount} {entry.harvestUnit}
                      </p>
                    </div>
                    {entry.actualHarvestDate && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Harvest Date</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatShortDate(entry.actualHarvestDate)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Right Column */}
            <div className="space-y-6">
              {/* Key Dates */}
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-bold text-gray-900 mb-4">Key Dates</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Planted</p>
                    <p className="font-semibold text-gray-900">
                      {formatShortDate(entry.plantingDate)}
                    </p>
                  </div>

                  {entry.expectedHarvestDate && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Expected Harvest</p>
                      <p className="font-semibold text-gray-900">
                        {formatShortDate(entry.expectedHarvestDate)}
                      </p>
                    </div>
                  )}

                  {entry.actualHarvestDate && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Actual Harvest</p>
                      <p className="font-semibold text-green-600">
                        {formatShortDate(entry.actualHarvestDate)}
                      </p>
                    </div>
                  )}

                  <div className="pt-3 border-t">
                    <p className="text-xs text-gray-500 mb-1">Days Growing</p>
                    <p className="text-2xl font-bold text-green-600">{daysGrowing}</p>
                  </div>
                </div>
              </div>

              {/* Plot Information */}
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-bold text-gray-900 mb-4">Plot Location</h3>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">{entry.plotName}</p>
                    <Link
                      href={`/explore/${entry.plotId}`}
                      className="text-sm text-green-600 hover:text-green-700 mt-1 inline-block"
                    >
                      View plot details →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-bold text-gray-900 mb-4">Timeline</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Created</p>
                    <p className="text-gray-900">{formatDate(entry.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Updated</p>
                    <p className="text-gray-900">{formatDate(entry.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

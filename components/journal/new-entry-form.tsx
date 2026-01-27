'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { ImageUpload } from '@/components/ui/image-upload'
import { WeatherWidget } from '@/components/journal/weather-widget'
import type { WeatherData } from '@/lib/weather'

interface JournalEntry {
  id: string
  cropName: string
  variety: string | null
  plantedDate: string | null
  expectedHarvest: string | null
  stage: string
  title: string
  content: string
  plantCount: number | null
  areaUsed: number | null
  images: string[]
  weatherData: WeatherData | null
  weatherLocation: string | null
  createdAt: string
  updatedAt: string
}

interface NewEntryFormProps {
  onClose: () => void
  onSubmit: (entry: JournalEntry) => void
}

export function NewEntryForm({ onClose, onSubmit }: NewEntryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    cropName: '',
    variety: '',
    plantedDate: new Date().toISOString().split('T')[0],
    expectedHarvest: '',
    stage: 'PLANNING' as const,
    title: '',
    content: '',
    plantCount: '',
    areaUsed: '',
    images: [] as string[],
    weatherData: null as WeatherData | null,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const journalData = {
        cropName: formData.cropName,
        variety: formData.variety || null,
        plantedDate: formData.plantedDate || null,
        expectedHarvest: formData.expectedHarvest || null,
        stage: formData.stage,
        title: formData.title,
        content: formData.content,
        plantCount: formData.plantCount ? parseInt(formData.plantCount) : null,
        areaUsed: formData.areaUsed ? parseFloat(formData.areaUsed) : null,
        images: formData.images,
        weatherData: formData.weatherData,
        weatherLocation: formData.weatherData?.location
          ? `${formData.weatherData.location.name}, ${formData.weatherData.location.country}`
          : null,
      }

      const response = await fetch('/api/journals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(journalData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create journal entry')
      }

      const createdJournal = await response.json()

      // Call the onSubmit callback with the created entry
      onSubmit(createdJournal)
      onClose()
    } catch (err) {
      console.error('Error creating journal entry:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      setIsSubmitting(false)
    }
  }

  const availableStages = [
    { value: 'PLANNING', label: 'Planning' },
    { value: 'PLANTED', label: 'Planted' },
    { value: 'GERMINATED', label: 'Germinated' },
    { value: 'GROWING', label: 'Growing' },
    { value: 'FLOWERING', label: 'Flowering' },
    { value: 'FRUITING', label: 'Fruiting' },
    { value: 'HARVESTING', label: 'Harvesting' },
    { value: 'COMPLETED', label: 'Completed' },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">New Journal Entry</h2>
          <button
            onClick={onClose}
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entry Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., First Tomato Planting"
            />
          </div>

          {/* Crop Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Crop Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Crop Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="cropName"
                  value={formData.cropName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Tomatoes"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Variety
                </label>
                <input
                  type="text"
                  name="variety"
                  value={formData.variety}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Cherokee Purple"
                />
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Timeline</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Planted Date
                </label>
                <input
                  type="date"
                  name="plantedDate"
                  value={formData.plantedDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Harvest Date
                </label>
                <input
                  type="date"
                  name="expectedHarvest"
                  value={formData.expectedHarvest}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Growth Stage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Growth Stage <span className="text-red-500">*</span>
            </label>
            <select
              name="stage"
              value={formData.stage}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {availableStages.map((stage) => (
                <option key={stage.value} value={stage.value}>
                  {stage.label}
                </option>
              ))}
            </select>
          </div>

          {/* Plant Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Plant Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plant Count
                </label>
                <input
                  type="number"
                  name="plantCount"
                  value={formData.plantCount}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., 6"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area Used (sq ft)
                </label>
                <input
                  type="number"
                  name="areaUsed"
                  value={formData.areaUsed}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., 48.0"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Describe what's happening with your crop..."
            />
          </div>

          {/* Weather */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Weather Conditions</h3>
            <p className="text-sm text-gray-600">
              Capture current weather conditions to track growing conditions over time.
            </p>
            <WeatherWidget
              weatherData={formData.weatherData}
              onCapture={(data) => setFormData((prev) => ({ ...prev, weatherData: data }))}
              onClear={() => setFormData((prev) => ({ ...prev, weatherData: null }))}
            />
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Images</h3>
            <ImageUpload
              value={formData.images}
              onChange={(images) => setFormData((prev) => ({ ...prev, images }))}
              maxImages={10}
              folder="growshare/journals"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Entry...' : 'Create Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CROP_TYPES, GROWTH_STAGES } from '@/lib/journal-data'
import { SAMPLE_PLOTS } from '@/lib/sample-data'
import { Camera, X, Calendar, Sprout } from 'lucide-react'

interface EntryFormProps {
  mode?: 'create' | 'edit'
  initialData?: any
}

export function EntryForm({ mode = 'create', initialData }: EntryFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    plotId: initialData?.plotId || '',
    cropName: initialData?.cropName || '',
    cropType: initialData?.cropType || '',
    plantingDate: initialData?.plantingDate
      ? new Date(initialData.plantingDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    expectedHarvestDate: initialData?.expectedHarvestDate
      ? new Date(initialData.expectedHarvestDate).toISOString().split('T')[0]
      : '',
    status: initialData?.status || 'PLANNING',
    growthStage: initialData?.growthStage || '',
    notes: initialData?.notes || '',
    weatherConditions: initialData?.weatherConditions || '',
    soilCondition: initialData?.soilCondition || '',
    pestIssues: initialData?.pestIssues || '',
    fertilizer: initialData?.fertilizer || '',
    wateringSchedule: initialData?.wateringSchedule || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.plotId) newErrors.plotId = 'Please select a plot'
    if (!formData.cropName) newErrors.cropName = 'Crop name is required'
    if (!formData.cropType) newErrors.cropType = 'Crop type is required'
    if (!formData.plantingDate) newErrors.plantingDate = 'Planting date is required'
    if (!formData.status) newErrors.status = 'Status is required'
    if (!formData.growthStage) newErrors.growthStage = 'Growth stage is required'
    if (!formData.notes) newErrors.notes = 'Notes are required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In production, this would save to database
    console.log('Saving journal entry:', formData)

    // Redirect to journal list
    router.push('/dashboard/journal')
  }

  const selectedPlot = SAMPLE_PLOTS.find((p) => p.id === formData.plotId)
  const availableGrowthStages = GROWTH_STAGES[formData.status as keyof typeof GROWTH_STAGES] || []

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Plot Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Select Plot <span className="text-red-500">*</span>
        </label>
        <select
          name="plotId"
          value={formData.plotId}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            errors.plotId ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Choose a plot...</option>
          {SAMPLE_PLOTS.map((plot) => (
            <option key={plot.id} value={plot.id}>
              {plot.title} ({plot.acreage} acres)
            </option>
          ))}
        </select>
        {errors.plotId && <p className="mt-1 text-sm text-red-500">{errors.plotId}</p>}
        {selectedPlot && (
          <p className="mt-2 text-sm text-gray-600 flex items-center gap-2">
            <Sprout className="h-4 w-4" />
            {selectedPlot.city}, {selectedPlot.state}
          </p>
        )}
      </div>

      {/* Crop Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Crop Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="cropName"
            value={formData.cropName}
            onChange={handleChange}
            placeholder="e.g., Heritage Tomatoes"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.cropName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.cropName && <p className="mt-1 text-sm text-red-500">{errors.cropName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Crop Type <span className="text-red-500">*</span>
          </label>
          <select
            name="cropType"
            value={formData.cropType}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.cropType ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select type...</option>
            {CROP_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.cropType && <p className="mt-1 text-sm text-red-500">{errors.cropType}</p>}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Planting Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="plantingDate"
            value={formData.plantingDate}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.plantingDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.plantingDate && (
            <p className="mt-1 text-sm text-red-500">{errors.plantingDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Expected Harvest Date
          </label>
          <input
            type="date"
            name="expectedHarvestDate"
            value={formData.expectedHarvestDate}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Status & Growth Stage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.status ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="PLANNING">Planning</option>
            <option value="PLANTED">Planted</option>
            <option value="GROWING">Growing</option>
            <option value="HARVESTED">Harvested</option>
            <option value="COMPLETED">Completed</option>
          </select>
          {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Growth Stage <span className="text-red-500">*</span>
          </label>
          <select
            name="growthStage"
            value={formData.growthStage}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.growthStage ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select stage...</option>
            {availableGrowthStages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
          {errors.growthStage && (
            <p className="mt-1 text-sm text-red-500">{errors.growthStage}</p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Notes <span className="text-red-500">*</span>
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          placeholder="Describe what's happening with your crop, any observations, challenges, or successes..."
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            errors.notes ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.notes && <p className="mt-1 text-sm text-red-500">{errors.notes}</p>}
      </div>

      {/* Additional Details (Collapsible) */}
      <details className="bg-gray-50 rounded-lg border">
        <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900">
          Additional Details (Optional)
        </summary>
        <div className="px-6 pb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Weather Conditions
            </label>
            <input
              type="text"
              name="weatherConditions"
              value={formData.weatherConditions}
              onChange={handleChange}
              placeholder="e.g., Sunny, 75°F, low humidity"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Soil Condition
            </label>
            <input
              type="text"
              name="soilCondition"
              value={formData.soilCondition}
              onChange={handleChange}
              placeholder="e.g., Moist, well-draining, pH 6.5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Pest Issues
            </label>
            <input
              type="text"
              name="pestIssues"
              value={formData.pestIssues}
              onChange={handleChange}
              placeholder="e.g., Minor aphid presence, managed with neem oil"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Fertilizer
            </label>
            <input
              type="text"
              name="fertilizer"
              value={formData.fertilizer}
              onChange={handleChange}
              placeholder="e.g., Organic compost tea, weekly application"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Watering Schedule
            </label>
            <input
              type="text"
              name="wateringSchedule"
              value={formData.wateringSchedule}
              onChange={handleChange}
              placeholder="e.g., Deep watering every 3 days, early morning"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </details>

      {/* Photo Upload Placeholder */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Photos</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-2">
            Photo upload coming soon
          </p>
          <p className="text-xs text-gray-500">
            In the full version, you'll be able to add photos of your crops
          </p>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? 'Saving...'
            : mode === 'edit'
              ? 'Update Entry'
              : 'Create Entry'}
        </button>
      </div>
    </form>
  )
}

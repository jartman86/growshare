'use client'

import { useState } from 'react'
import { CROP_TYPES, GROWTH_STAGES } from '@/lib/journal-data'
import { X, Plus, Image as ImageIcon } from 'lucide-react'

interface NewEntryFormProps {
  onClose: () => void
  onSubmit: (entry: any) => void
}

export function NewEntryForm({ onClose, onSubmit }: NewEntryFormProps) {
  const [formData, setFormData] = useState({
    plotId: '',
    plotName: '',
    cropName: '',
    cropType: '',
    plantingDate: new Date().toISOString().split('T')[0],
    expectedHarvestDate: '',
    status: 'PLANNING' as const,
    growthStage: '',
    notes: '',
    weatherConditions: '',
    soilCondition: '',
    pestIssues: '',
    fertilizer: '',
    wateringSchedule: '',
    images: [] as string[],
  })

  const [newImage, setNewImage] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddImage = () => {
    if (newImage.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImage.trim()],
      }))
      setNewImage('')
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const entry = {
      id: `entry-${Date.now()}`,
      userId: 'user-1', // Current user
      plotId: formData.plotId,
      plotName: formData.plotName,
      cropName: formData.cropName,
      cropType: formData.cropType,
      plantingDate: new Date(formData.plantingDate),
      expectedHarvestDate: formData.expectedHarvestDate
        ? new Date(formData.expectedHarvestDate)
        : undefined,
      status: formData.status,
      growthStage: formData.growthStage,
      notes: formData.notes,
      images: formData.images,
      weatherConditions: formData.weatherConditions || undefined,
      soilCondition: formData.soilCondition || undefined,
      pestIssues: formData.pestIssues || undefined,
      fertilizer: formData.fertilizer || undefined,
      wateringSchedule: formData.wateringSchedule || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    onSubmit(entry)
    onClose()
  }

  const availableGrowthStages = GROWTH_STAGES[formData.status] || []

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">New Journal Entry</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Plot Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Plot Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plot ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="plotId"
                  value={formData.plotId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., 1, bed-a, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plot Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="plotName"
                  value={formData.plotName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Sunny 5-Acre Organic Farm Plot"
                />
              </div>
            </div>
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
                  placeholder="e.g., Heritage Tomatoes"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Crop Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="cropType"
                  value={formData.cropType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select type...</option>
                  {CROP_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Timeline</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Planting Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="plantingDate"
                  value={formData.plantingDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Harvest Date
                </label>
                <input
                  type="date"
                  name="expectedHarvestDate"
                  value={formData.expectedHarvestDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Status & Growth */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Status & Growth</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="PLANNING">Planning</option>
                  <option value="PLANTED">Planted</option>
                  <option value="GROWING">Growing</option>
                  <option value="HARVESTED">Harvested</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Growth Stage <span className="text-red-500">*</span>
                </label>
                <select
                  name="growthStage"
                  value={formData.growthStage}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select stage...</option>
                  {availableGrowthStages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes <span className="text-red-500">*</span>
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Describe what's happening with your crop..."
            />
          </div>

          {/* Growing Conditions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Growing Conditions</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weather Conditions
                </label>
                <input
                  type="text"
                  name="weatherConditions"
                  value={formData.weatherConditions}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Sunny, 75°F"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Soil Condition</label>
                <input
                  type="text"
                  name="soilCondition"
                  value={formData.soilCondition}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Moist, well-draining"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Watering Schedule</label>
                <input
                  type="text"
                  name="wateringSchedule"
                  value={formData.wateringSchedule}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Daily, morning"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fertilizer</label>
                <input
                  type="text"
                  name="fertilizer"
                  value={formData.fertilizer}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Organic compost"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pest Issues</label>
              <input
                type="text"
                name="pestIssues"
                value={formData.pestIssues}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Any pest or disease problems..."
              />
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Images</h3>
            <div className="flex gap-2">
              <input
                type="url"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Image URL (e.g., https://...)"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Create Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

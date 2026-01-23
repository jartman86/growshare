'use client'

import { useState } from 'react'
import { ListingFormData } from '../listing-form'
import { FileText, MapIcon } from 'lucide-react'
import { ImageUpload } from '@/components/ui/image-upload'

interface BasicInfoStepProps {
  formData: ListingFormData
  updateFormData: (data: Partial<ListingFormData>) => void
  onNext: () => void
  onBack?: () => void
  onSubmit?: () => void
}

export function BasicInfoStep({ formData, updateFormData, onNext }: BasicInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters'
    }

    if (!formData.acreage) {
      newErrors.acreage = 'Acreage is required'
    } else if (parseFloat(formData.acreage) <= 0) {
      newErrors.acreage = 'Acreage must be greater than 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validate()) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
        <p className="text-gray-600">
          Let's start with the essentials about your land
        </p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Listing Title <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={formData.title}
            onChange={(e) => {
              updateFormData({ title: e.target.value })
              if (errors.title) setErrors({ ...errors, title: '' })
            }}
            placeholder="e.g., Sunny 5-Acre Organic Farm Plot in Asheville"
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            maxLength={100}
          />
        </div>
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        <p className="mt-1 text-xs text-gray-500">
          {formData.title.length}/100 characters
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => {
            updateFormData({ description: e.target.value })
            if (errors.description) setErrors({ ...errors, description: '' })
          }}
          rows={6}
          placeholder="Describe your land: terrain, current use, surrounding area, unique features, etc. Be detailed to attract the right growers."
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          maxLength={1000}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {formData.description.length}/1000 characters
        </p>
      </div>

      {/* Acreage */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Total Acreage <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MapIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="number"
            value={formData.acreage}
            onChange={(e) => {
              updateFormData({ acreage: e.target.value })
              if (errors.acreage) setErrors({ ...errors, acreage: '' })
            }}
            placeholder="0.0"
            step="0.1"
            min="0"
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.acreage ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>
        {errors.acreage && <p className="mt-1 text-sm text-red-500">{errors.acreage}</p>}
        <p className="mt-1 text-xs text-gray-500">
          Total available acreage for farming (can be a fraction)
        </p>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Plot Photos
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Add photos to showcase your land. The first image will be your primary listing photo.
        </p>
        <ImageUpload
          value={formData.images}
          onChange={(images) => updateFormData({ images })}
          maxImages={10}
          folder="growshare/plots"
        />
      </div>

      {/* Tips */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-900 mb-2">💡 Tips for a Great Listing</h3>
        <ul className="space-y-1 text-sm text-green-800">
          <li>• Be specific in your title (include location, size, and key features)</li>
          <li>• Describe the terrain, drainage, and current condition</li>
          <li>• Mention nearby resources (water sources, roads, neighbors)</li>
          <li>• Share your vision for how the land could be used</li>
        </ul>
      </div>
    </div>
  )
}

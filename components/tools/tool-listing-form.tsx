'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImageUpload } from '@/components/ui/image-upload'
import { Loader2 } from 'lucide-react'

interface ToolListingFormProps {
  initialData?: {
    id?: string
    name?: string
    description?: string
    category?: string
    condition?: string
    listingType?: string
    salePrice?: number
    dailyRate?: number
    weeklyRate?: number
    depositRequired?: number
    location?: string
    images?: string[]
    availableFrom?: string
    availableTo?: string
  }
  mode?: 'create' | 'edit'
}

const CATEGORIES = [
  { value: 'HAND_TOOLS', label: 'Hand Tools' },
  { value: 'POWER_TOOLS', label: 'Power Tools' },
  { value: 'IRRIGATION', label: 'Irrigation' },
  { value: 'SOIL_COMPOST', label: 'Soil & Compost' },
  { value: 'HARVESTING', label: 'Harvesting' },
  { value: 'STORAGE', label: 'Storage' },
  { value: 'OTHER', label: 'Other' },
]

const CONDITIONS = [
  { value: 'EXCELLENT', label: 'Excellent' },
  { value: 'GOOD', label: 'Good' },
  { value: 'FAIR', label: 'Fair' },
  { value: 'NEEDS_REPAIR', label: 'Needs Repair' },
]

const LISTING_TYPES = [
  { value: 'RENT', label: 'Rent Only' },
  { value: 'SALE', label: 'Sale Only' },
  { value: 'BOTH', label: 'Rent or Buy' },
]

export function ToolListingForm({ initialData, mode = 'create' }: ToolListingFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    condition: initialData?.condition || '',
    listingType: initialData?.listingType || 'RENT',
    salePrice: initialData?.salePrice?.toString() || '',
    dailyRate: initialData?.dailyRate?.toString() || '',
    weeklyRate: initialData?.weeklyRate?.toString() || '',
    depositRequired: initialData?.depositRequired?.toString() || '',
    location: initialData?.location || '',
    images: initialData?.images || [],
    availableFrom: initialData?.availableFrom || '',
    availableTo: initialData?.availableTo || '',
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
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        condition: formData.condition,
        listingType: formData.listingType,
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        dailyRate: formData.dailyRate ? parseFloat(formData.dailyRate) : null,
        weeklyRate: formData.weeklyRate ? parseFloat(formData.weeklyRate) : null,
        depositRequired: formData.depositRequired ? parseFloat(formData.depositRequired) : null,
        location: formData.location || null,
        images: formData.images,
        availableFrom: formData.availableFrom || null,
        availableTo: formData.availableTo || null,
      }

      const url = mode === 'edit' && initialData?.id
        ? `/api/tools/${initialData.id}`
        : '/api/tools'

      const response = await fetch(url, {
        method: mode === 'edit' ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save tool listing')
      }

      router.push('/tools')
      router.refresh()
    } catch (err) {
      console.error('Error saving tool:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsSubmitting(false)
    }
  }

  const showRentalFields = formData.listingType === 'RENT' || formData.listingType === 'BOTH'
  const showSaleFields = formData.listingType === 'SALE' || formData.listingType === 'BOTH'

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Tool Information</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tool Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., Honda Rototiller"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condition <span className="text-red-500">*</span>
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select condition</option>
              {CONDITIONS.map((cond) => (
                <option key={cond.value} value={cond.value}>{cond.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Describe the tool, its features, and any usage notes..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., Downtown Asheville"
          />
        </div>
      </div>

      {/* Listing Type & Pricing */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Listing Type & Pricing</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Listing Type <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {LISTING_TYPES.map((type) => (
              <label
                key={type.value}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                  formData.listingType === type.value
                    ? 'bg-green-50 border-green-500 text-green-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="listingType"
                  value={type.value}
                  checked={formData.listingType === type.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                {type.label}
              </label>
            ))}
          </div>
        </div>

        {showRentalFields && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Daily Rate ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="dailyRate"
                value={formData.dailyRate}
                onChange={handleChange}
                required={showRentalFields}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weekly Rate ($)
              </label>
              <input
                type="number"
                name="weeklyRate"
                value={formData.weeklyRate}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deposit Required ($)
              </label>
              <input
                type="number"
                name="depositRequired"
                value={formData.depositRequired}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>
        )}

        {showSaleFields && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sale Price ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="salePrice"
              value={formData.salePrice}
              onChange={handleChange}
              required={showSaleFields}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
        )}
      </div>

      {/* Availability */}
      {showRentalFields && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Availability</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available From
              </label>
              <input
                type="date"
                name="availableFrom"
                value={formData.availableFrom}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Until
              </label>
              <input
                type="date"
                name="availableTo"
                value={formData.availableTo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Photos</h3>
        <ImageUpload
          value={formData.images}
          onChange={(images) => setFormData((prev) => ({ ...prev, images }))}
          maxImages={6}
          folder="growshare/tools"
        />
      </div>

      {/* Submit */}
      <div className="flex gap-4 pt-6 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
          {mode === 'edit' ? 'Update Listing' : 'Create Listing'}
        </button>
      </div>
    </form>
  )
}

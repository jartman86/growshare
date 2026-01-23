'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImageUpload } from '@/components/ui/image-upload'
import { Loader2 } from 'lucide-react'

interface ListingFormProps {
  initialData?: {
    id?: string
    productName?: string
    variety?: string
    description?: string
    category?: string
    quantity?: number
    unit?: string
    pricePerUnit?: number
    availableDate?: string
    expiresDate?: string
    deliveryMethods?: string[]
    pickupLocation?: string
    deliveryRadius?: number
    images?: string[]
    isOrganic?: boolean
    isCertified?: boolean
    certifications?: string[]
  }
  mode?: 'create' | 'edit'
}

const CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Herbs',
  'Eggs',
  'Dairy',
  'Honey',
  'Meat',
  'Grains',
  'Flowers',
  'Plants',
  'Other',
]

const UNITS = ['lb', 'oz', 'bunch', 'dozen', 'each', 'pint', 'quart', 'gallon']

const DELIVERY_METHODS = [
  { value: 'PICKUP', label: 'Pickup' },
  { value: 'DELIVERY', label: 'Delivery' },
  { value: 'CENTRAL_DROP', label: 'Central Drop Point' },
]

export function ListingForm({ initialData, mode = 'create' }: ListingFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    productName: initialData?.productName || '',
    variety: initialData?.variety || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    quantity: initialData?.quantity?.toString() || '',
    unit: initialData?.unit || 'lb',
    pricePerUnit: initialData?.pricePerUnit?.toString() || '',
    availableDate: initialData?.availableDate || new Date().toISOString().split('T')[0],
    expiresDate: initialData?.expiresDate || '',
    deliveryMethods: initialData?.deliveryMethods || ['PICKUP'],
    pickupLocation: initialData?.pickupLocation || '',
    deliveryRadius: initialData?.deliveryRadius?.toString() || '',
    images: initialData?.images || [],
    isOrganic: initialData?.isOrganic || false,
    isCertified: initialData?.isCertified || false,
    certifications: initialData?.certifications || [],
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleDeliveryMethodChange = (method: string) => {
    setFormData((prev) => {
      const methods = prev.deliveryMethods.includes(method)
        ? prev.deliveryMethods.filter((m) => m !== method)
        : [...prev.deliveryMethods, method]
      return { ...prev, deliveryMethods: methods }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const payload = {
        productName: formData.productName,
        variety: formData.variety || null,
        description: formData.description,
        category: formData.category,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        pricePerUnit: parseFloat(formData.pricePerUnit),
        availableDate: formData.availableDate,
        expiresDate: formData.expiresDate || null,
        deliveryMethods: formData.deliveryMethods,
        pickupLocation: formData.pickupLocation || null,
        deliveryRadius: formData.deliveryRadius ? parseInt(formData.deliveryRadius) : null,
        images: formData.images,
        isOrganic: formData.isOrganic,
        isCertified: formData.isCertified,
        certifications: formData.certifications,
      }

      const url = mode === 'edit' && initialData?.id
        ? `/api/marketplace/listings/${initialData.id}`
        : '/api/marketplace/listings'

      const response = await fetch(url, {
        method: mode === 'edit' ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save listing')
      }

      router.push('/dashboard/sell')
      router.refresh()
    } catch (err) {
      console.error('Error saving listing:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Product Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
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
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
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
            placeholder="Describe your produce, growing methods, freshness, etc."
          />
        </div>
      </div>

      {/* Quantity & Pricing */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Quantity & Pricing</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit <span className="text-red-500">*</span>
            </label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {UNITS.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price per Unit ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="pricePerUnit"
              value={formData.pricePerUnit}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Availability</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Available From <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="availableDate"
              value={formData.availableDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expires On
            </label>
            <input
              type="date"
              name="expiresDate"
              value={formData.expiresDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Delivery */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Delivery Options</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Methods <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {DELIVERY_METHODS.map((method) => (
              <label
                key={method.value}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                  formData.deliveryMethods.includes(method.value)
                    ? 'bg-green-50 border-green-500 text-green-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.deliveryMethods.includes(method.value)}
                  onChange={() => handleDeliveryMethodChange(method.value)}
                  className="sr-only"
                />
                {method.label}
              </label>
            ))}
          </div>
        </div>

        {formData.deliveryMethods.includes('PICKUP') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pickup Location
            </label>
            <input
              type="text"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., 123 Farm Road, City"
            />
          </div>
        )}

        {formData.deliveryMethods.includes('DELIVERY') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Radius (miles)
            </label>
            <input
              type="number"
              name="deliveryRadius"
              value={formData.deliveryRadius}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., 25"
            />
          </div>
        )}
      </div>

      {/* Certifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Certifications</h3>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isOrganic"
              checked={formData.isOrganic}
              onChange={handleChange}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-gray-700">Organic</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isCertified"
              checked={formData.isCertified}
              onChange={handleChange}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-gray-700">Certified</span>
          </label>
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Photos</h3>
        <ImageUpload
          value={formData.images}
          onChange={(images) => setFormData((prev) => ({ ...prev, images }))}
          maxImages={6}
          folder="growshare/produce"
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

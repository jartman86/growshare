'use client'

import { useState } from 'react'
import { ListingFormData } from '../listing-form'
import { MapPin, Navigation } from 'lucide-react'

interface LocationStepProps {
  formData: ListingFormData
  updateFormData: (data: Partial<ListingFormData>) => void
  onNext: () => void
}

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

export function LocationStep({ formData, updateFormData, onNext }: LocationStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.address.trim()) newErrors.address = 'Street address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state) newErrors.state = 'State is required'
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required'
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Invalid ZIP code format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validate()) {
      onNext()
    }
  }

  const handleGeocodeAddress = () => {
    // In production, this would call a geocoding API
    // For now, just use demo coordinates (Asheville, NC area)
    const demoLat = (35.5 + Math.random() * 0.2).toFixed(6)
    const demoLng = (-82.6 + Math.random() * 0.2).toFixed(6)

    updateFormData({
      latitude: demoLat,
      longitude: demoLng,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Location</h2>
        <p className="text-gray-600">
          Where is your land located?
        </p>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Street Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => {
            updateFormData({ address: e.target.value })
            if (errors.address) setErrors({ ...errors, address: '' })
          }}
          placeholder="123 Farm Road"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            errors.address ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
      </div>

      {/* City, State, ZIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => {
              updateFormData({ city: e.target.value })
              if (errors.city) setErrors({ ...errors, city: '' })
            }}
            placeholder="Asheville"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            State <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.state}
            onChange={(e) => {
              updateFormData({ state: e.target.value })
              if (errors.state) setErrors({ ...errors, state: '' })
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.state ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select...</option>
            {US_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            ZIP Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.zipCode}
            onChange={(e) => {
              updateFormData({ zipCode: e.target.value })
              if (errors.zipCode) setErrors({ ...errors, zipCode: '' })
            }}
            placeholder="28801"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.zipCode ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.zipCode && <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>}
        </div>
      </div>

      {/* Coordinates (Optional) */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <Navigation className="h-5 w-5 text-gray-600" />
              GPS Coordinates (Optional)
            </h3>
            <p className="text-sm text-gray-600">
              Help growers find your exact location on the map
            </p>
          </div>
          <button
            type="button"
            onClick={handleGeocodeAddress}
            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
          >
            Auto-Fill
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Latitude
            </label>
            <input
              type="text"
              value={formData.latitude}
              onChange={(e) => updateFormData({ latitude: e.target.value })}
              placeholder="35.5951"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitude
            </label>
            <input
              type="text"
              value={formData.longitude}
              onChange={(e) => updateFormData({ longitude: e.target.value })}
              placeholder="-82.5515"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Privacy Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">🔒 Privacy & Safety</h3>
        <p className="text-sm text-blue-800">
          Your exact address won't be shared publicly. Growers will see the general area on
          the map. Your full address is only revealed once you approve a booking request.
        </p>
      </div>
    </div>
  )
}

'use client'

import { ListingFormData } from '../listing-form'
import { MapPin, DollarSign, Droplets, Sprout, CheckCircle } from 'lucide-react'

interface ReviewStepProps {
  formData: ListingFormData
  onSubmit: () => void
}

export function ReviewStep({ formData, onSubmit }: ReviewStepProps) {
  const monthlyPrice = parseFloat(formData.pricePerMonth) || 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Listing</h2>
        <p className="text-gray-600">
          Double-check everything looks good before submitting
        </p>
      </div>

      {/* Preview Card */}
      <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
        {/* Header Image Placeholder */}
        <div className="h-48 bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
          <p className="text-white text-lg font-semibold">
            📸 Photos will be added in the next step
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title & Price */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{formData.title}</h3>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>
                  {formData.city}, {formData.state} {formData.zipCode}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">
                ${monthlyPrice.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">per month</div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-gray-700 whitespace-pre-line">{formData.description}</p>
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{formData.acreage}</div>
              <div className="text-xs text-gray-600">Acres</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{formData.minimumRental}</div>
              <div className="text-xs text-gray-600">Min. Months</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">
                {formData.soilTypes.length || 'N/A'}
              </div>
              <div className="text-xs text-gray-600">Soil Types</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">
                {formData.waterAccess.length || 'N/A'}
              </div>
              <div className="text-xs text-gray-600">Water Sources</div>
            </div>
          </div>

          {/* Soil Types */}
          {formData.soilTypes.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Sprout className="h-4 w-4 text-green-600" />
                Soil Types
              </h4>
              <div className="flex flex-wrap gap-2">
                {formData.soilTypes.map((type) => (
                  <span
                    key={type}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Water Access */}
          {formData.waterAccess.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-600" />
                Water Access
              </h4>
              <div className="flex flex-wrap gap-2">
                {formData.waterAccess.map((access) => (
                  <span
                    key={access}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {access}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Amenities</h4>
            <div className="grid grid-cols-2 gap-2">
              {formData.hasIrrigation && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Irrigation System</span>
                </div>
              )}
              {formData.hasFencing && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Fencing</span>
                </div>
              )}
              {formData.hasGreenhouse && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Greenhouse</span>
                </div>
              )}
              {formData.hasElectricity && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Electricity</span>
                </div>
              )}
            </div>
            {!formData.hasIrrigation &&
              !formData.hasFencing &&
              !formData.hasGreenhouse &&
              !formData.hasElectricity && (
                <p className="text-sm text-gray-500">No amenities specified</p>
              )}
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Pricing Details</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly rent:</span>
              <span className="font-semibold">${monthlyPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Minimum rental:</span>
              <span className="font-semibold">{formData.minimumRental} months</span>
            </div>
            {formData.securityDeposit && (
              <div className="flex justify-between">
                <span className="text-gray-600">Security deposit:</span>
                <span className="font-semibold">
                  ${parseFloat(formData.securityDeposit).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
          <div className="space-y-1 text-sm">
            <p className="text-gray-700">{formData.address}</p>
            <p className="text-gray-700">
              {formData.city}, {formData.state} {formData.zipCode}
            </p>
            {formData.latitude && formData.longitude && (
              <p className="text-gray-500 text-xs">
                GPS: {formData.latitude}, {formData.longitude}
              </p>
            )}
            {formData.usdaZone && (
              <p className="text-gray-500 text-xs">USDA Zone: {formData.usdaZone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">📋 What Happens Next?</h3>
        <ol className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="font-bold">1.</span>
            <span>
              Your listing will be reviewed by our team (usually within 24 hours)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">2.</span>
            <span>Once approved, your plot will appear on the map for growers to find</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">3.</span>
            <span>You'll receive notifications when growers send booking requests</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">4.</span>
            <span>Review their profiles and choose who farms your land</span>
          </li>
        </ol>
      </div>
    </div>
  )
}

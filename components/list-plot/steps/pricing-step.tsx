'use client'

import { useState } from 'react'
import { ListingFormData } from '../listing-form'
import { DollarSign, Calendar, Shield } from 'lucide-react'

interface PricingStepProps {
  formData: ListingFormData
  updateFormData: (data: Partial<ListingFormData>) => void
  onNext: () => void
}

export function PricingStep({ formData, updateFormData, onNext }: PricingStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.pricePerMonth) {
      newErrors.pricePerMonth = 'Monthly price is required'
    } else if (parseFloat(formData.pricePerMonth) <= 0) {
      newErrors.pricePerMonth = 'Price must be greater than $0'
    }

    if (!formData.minimumRental) {
      newErrors.minimumRental = 'Minimum rental period is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validate()) {
      onNext()
    }
  }

  const monthlyPrice = parseFloat(formData.pricePerMonth) || 0
  const estimatedAnnual = monthlyPrice * 12

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pricing & Terms</h2>
        <p className="text-gray-600">
          Set your pricing and rental requirements
        </p>
      </div>

      {/* Monthly Price */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          Monthly Rental Price <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
            $
          </span>
          <input
            type="number"
            value={formData.pricePerMonth}
            onChange={(e) => {
              updateFormData({ pricePerMonth: e.target.value })
              if (errors.pricePerMonth) setErrors({ ...errors, pricePerMonth: '' })
            }}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.pricePerMonth ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>
        {errors.pricePerMonth && (
          <p className="mt-1 text-sm text-red-500">{errors.pricePerMonth}</p>
        )}
        {monthlyPrice > 0 && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Estimated annual income:</strong> ${estimatedAnnual.toLocaleString()}/year
            </p>
            <p className="text-xs text-green-700 mt-1">
              (Based on 12 months at ${monthlyPrice.toLocaleString()}/month)
            </p>
          </div>
        )}
      </div>

      {/* Pricing Guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Pricing Guide</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• <strong>Typical range:</strong> $50-$200 per acre per month</p>
          <p>• <strong>Factors:</strong> Location, soil quality, water access, amenities</p>
          <p>• <strong>Tip:</strong> Research similar plots in your area</p>
        </div>
      </div>

      {/* Minimum Rental Period */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Minimum Rental Period <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.minimumRental}
          onChange={(e) => {
            updateFormData({ minimumRental: e.target.value })
            if (errors.minimumRental) setErrors({ ...errors, minimumRental: '' })
          }}
          className={`w-full md:w-64 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            errors.minimumRental ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select period...</option>
          <option value="1">1 month</option>
          <option value="3">3 months (one season)</option>
          <option value="6">6 months (two seasons)</option>
          <option value="12">12 months (one year)</option>
          <option value="24">24 months (two years)</option>
        </select>
        {errors.minimumRental && (
          <p className="mt-1 text-sm text-red-500">{errors.minimumRental}</p>
        )}
        <p className="mt-2 text-xs text-gray-500">
          Most landowners require 3-12 month commitments to ensure crop success
        </p>
      </div>

      {/* Security Deposit */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
          <Shield className="h-5 w-5 text-purple-600" />
          Security Deposit (Optional)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
            $
          </span>
          <input
            type="number"
            value={formData.securityDeposit}
            onChange={(e) => updateFormData({ securityDeposit: e.target.value })}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Typically equal to one month's rent. Returned at end of rental period.
        </p>
      </div>

      {/* Payment Terms Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">💳 How Payments Work</h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold mt-0.5">1.</span>
            <span>Growers pay through GrowShare's secure payment system</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold mt-0.5">2.</span>
            <span>Funds are held in escrow until the start date</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold mt-0.5">3.</span>
            <span>Monthly payments are automatically deposited to your account</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold mt-0.5">4.</span>
            <span>GrowShare charges a 10% service fee (included in grower's payment)</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

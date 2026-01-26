'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BasicInfoStep } from './steps/basic-info-step'
import { LocationStep } from './steps/location-step'
import { DetailsStep } from './steps/details-step'
import { PricingStep } from './steps/pricing-step'
import { ReviewStep } from './steps/review-step'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface ListingFormData {
  // Basic Info
  title: string
  description: string
  acreage: string
  images: string[]

  // Location
  address: string
  city: string
  state: string
  zipCode: string
  latitude: string
  longitude: string

  // Details
  soilTypes: string[]
  waterAccess: string[]
  hasIrrigation: boolean
  hasFencing: boolean
  hasGreenhouse: boolean
  hasElectricity: boolean
  usdaZone: string

  // Pricing
  pricePerMonth: string
  minimumRental: string
  securityDeposit: string
}

const STEPS = [
  { id: 1, name: 'Basic Info', component: BasicInfoStep },
  { id: 2, name: 'Location', component: LocationStep },
  { id: 3, name: 'Details', component: DetailsStep },
  { id: 4, name: 'Pricing', component: PricingStep },
  { id: 5, name: 'Review', component: ReviewStep },
]

export function ListingForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ListingFormData>({
    title: '',
    description: '',
    acreage: '',
    images: [],
    address: '',
    city: '',
    state: '',
    zipCode: '',
    latitude: '',
    longitude: '',
    soilTypes: [],
    waterAccess: [],
    hasIrrigation: false,
    hasFencing: false,
    hasGreenhouse: false,
    hasElectricity: false,
    usdaZone: '',
    pricePerMonth: '',
    minimumRental: '3',
    securityDeposit: '',
  })

  const updateFormData = (data: Partial<ListingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Transform form data to match API schema
      const plotData = {
        title: formData.title,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        county: '', // Optional field
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        acreage: parseFloat(formData.acreage) || 0,
        soilType: formData.soilTypes,
        waterAccess: formData.waterAccess,
        usdaZone: formData.usdaZone,
        sunExposure: 'full', // Default
        hasIrrigation: formData.hasIrrigation,
        hasFencing: formData.hasFencing,
        hasGreenhouse: formData.hasGreenhouse,
        hasElectricity: formData.hasElectricity,
        hasRoadAccess: true, // Default
        hasToolStorage: false, // Default
        isADAAccessible: false, // Default
        allowsLivestock: false, // Default
        allowsStructures: false, // Default
        pricePerMonth: parseFloat(formData.pricePerMonth) || 0,
        securityDeposit: parseFloat(formData.securityDeposit) || 0,
        minimumLease: parseInt(formData.minimumRental) || 3,
        instantBook: false,
        images: formData.images,
      }

      const response = await fetch('/api/plots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plotData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create plot listing')
      }

      // Redirect to success page
      router.push('/list-plot/success')
    } catch (err) {
      console.error('Error submitting listing:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      setIsSubmitting(false)
    }
  }

  const CurrentStepComponent = STEPS[currentStep - 1].component

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  step.id <= currentStep
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'bg-white border-gray-300 text-gray-500'
                }`}
              >
                <span className="text-sm font-semibold">{step.id}</span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-12 md:w-20 mx-2 transition-colors ${
                    step.id < currentStep ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`text-xs font-medium transition-colors ${
                step.id === currentStep ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              {step.name}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step */}
      <div className="mb-8">
        <CurrentStepComponent
          formData={formData}
          updateFormData={updateFormData}
          onNext={handleNext}
          onBack={handleBack}
          onSubmit={handleSubmit}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5" />
          Back
        </button>

        {currentStep < STEPS.length ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Next
            <ChevronRight className="h-5 w-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating Listing...' : 'Submit Listing'}
          </button>
        )}
      </div>
    </div>
  )
}

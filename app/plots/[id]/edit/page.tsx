'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Upload, X } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const plotSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'Zip code is required'),
  county: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  acreage: z.number().min(0.1, 'Acreage must be at least 0.1'),
  soilType: z.array(z.string()).min(1, 'Select at least one soil type'),
  soilPH: z.number().min(0).max(14).optional(),
  waterAccess: z.array(z.string()).min(1, 'Select at least one water access option'),
  usdaZone: z.string().optional(),
  sunExposure: z.string().optional(),
  hasFencing: z.boolean(),
  hasGreenhouse: z.boolean(),
  hasToolStorage: z.boolean(),
  hasElectricity: z.boolean(),
  hasRoadAccess: z.boolean(),
  hasIrrigation: z.boolean(),
  isADAAccessible: z.boolean(),
  allowsLivestock: z.boolean(),
  allowsStructures: z.boolean(),
  restrictions: z.string().optional(),
  pricePerMonth: z.number().min(1, 'Price is required'),
  pricePerSeason: z.number().optional(),
  pricePerYear: z.number().optional(),
  securityDeposit: z.number().optional(),
  instantBook: z.boolean(),
  minimumLease: z.number().min(1).max(24),
  images: z.array(z.string()).optional(),
  droneFootageUrl: z.string().url().optional().or(z.literal('')),
  virtualTourUrl: z.string().url().optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE', 'RENTED']).optional(),
})

type PlotFormData = z.infer<typeof plotSchema>

export default function EditPlotPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { isSignedIn } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [imageUrls, setImageUrls] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PlotFormData>({
    resolver: zodResolver(plotSchema),
  })

  const soilTypes = watch('soilType') || []
  const waterAccessTypes = watch('waterAccess') || []

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }

    fetchPlot()
  }, [isSignedIn, id])

  const fetchPlot = async () => {
    try {
      const response = await fetch(`/api/plots/${id}`)
      if (!response.ok) {
        alert('Failed to load plot')
        router.push('/my-plots')
        return
      }

      const plot = await response.json()

      // Convert enum values back to display format
      const waterAccessDisplay = (plot.waterAccess || []).map((access: string) => {
        if (access === 'STREAM') return 'Stream/Creek'
        if (access === 'POND') return 'Pond/Lake'
        return access.charAt(0) + access.slice(1).toLowerCase()
      })

      const soilTypeDisplay = (plot.soilType || []).map((type: string) =>
        type.charAt(0) + type.slice(1).toLowerCase()
      )

      reset({
        ...plot,
        soilType: soilTypeDisplay,
        waterAccess: waterAccessDisplay,
        droneFootageUrl: plot.droneFootageUrl || '',
        virtualTourUrl: plot.virtualTourUrl || '',
      })

      setImageUrls(plot.images || [])
    } catch (error) {
      console.error('Error loading plot:', error)
      alert('Failed to load plot')
      router.push('/my-plots')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSignedIn || isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center garden-gradient-light">
          <Loader2 className="h-8 w-8 text-[#4a7c2c] animate-spin" />
        </div>
        <Footer />
      </>
    )
  }

  const handleSoilTypeToggle = (type: string) => {
    const current = soilTypes
    if (current.includes(type)) {
      setValue('soilType', current.filter(t => t !== type))
    } else {
      setValue('soilType', [...current, type])
    }
  }

  const handleWaterAccessToggle = (type: string) => {
    const current = waterAccessTypes
    if (current.includes(type)) {
      setValue('waterAccess', current.filter(t => t !== type))
    } else {
      setValue('waterAccess', [...current, type])
    }
  }

  const handleAddImage = () => {
    const url = prompt('Enter image URL:')
    if (url) {
      const newImages = [...imageUrls, url]
      setImageUrls(newImages)
      setValue('images', newImages)
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = imageUrls.filter((_, i) => i !== index)
    setImageUrls(newImages)
    setValue('images', newImages)
  }

  const onSubmit = async (data: PlotFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/plots/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          images: imageUrls,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || 'Failed to update plot')
        return
      }

      alert('Plot updated successfully!')
      router.push('/my-plots')
    } catch (error) {
      console.error('Error updating plot:', error)
      alert('Failed to update plot')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen garden-gradient-light topo-lines">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2d5016]">Edit Plot</h1>
            <p className="mt-2 text-[#4a3f35]">
              Update your land listing details
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-[#2d5016] mb-4">Basic Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#4a3f35] mb-1">
                    Status
                  </label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="RENTED">Rented</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a3f35] mb-1">
                    Title *
                  </label>
                  <input
                    {...register('title')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent"
                    placeholder="e.g., Sunny 2-Acre Garden Plot with Water Access"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a3f35] mb-1">
                    Description *
                  </label>
                  <textarea
                    {...register('description')}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent"
                    placeholder="Describe your land, its features, ideal uses, and what makes it special..."
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-[#2d5016] mb-4">Location</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#4a3f35] mb-1">
                    Address *
                  </label>
                  <input
                    {...register('address')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent"
                  />
                  {errors.address && (
                    <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a3f35] mb-1">
                    City *
                  </label>
                  <input
                    {...register('city')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent"
                  />
                  {errors.city && (
                    <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a3f35] mb-1">
                    State *
                  </label>
                  <input
                    {...register('state')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent"
                  />
                  {errors.state && (
                    <p className="text-sm text-red-600 mt-1">{errors.state.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a3f35] mb-1">
                    Zip Code *
                  </label>
                  <input
                    {...register('zipCode')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent"
                  />
                  {errors.zipCode && (
                    <p className="text-sm text-red-600 mt-1">{errors.zipCode.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a3f35] mb-1">
                    County
                  </label>
                  <input
                    {...register('county')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a3f35] mb-1">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    {...register('latitude', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent"
                  />
                  {errors.latitude && (
                    <p className="text-sm text-red-600 mt-1">{errors.latitude.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a3f35] mb-1">
                    Longitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    {...register('longitude', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent"
                  />
                  {errors.longitude && (
                    <p className="text-sm text-red-600 mt-1">{errors.longitude.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Land Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-[#2d5016] mb-4">Land Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#4a3f35] mb-1">
                    Acreage *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('acreage', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent"
                  />
                  {errors.acreage && (
                    <p className="text-sm text-red-600 mt-1">{errors.acreage.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a3f35] mb-1">
                    Soil pH (0-14)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('soilPH', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a3f35] mb-1">
                    USDA Zone
                  </label>
                  <input
                    {...register('usdaZone')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent"
                    placeholder="e.g., 7a"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a3f35] mb-1">
                    Sun Exposure
                  </label>
                  <select
                    {...register('sunExposure')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    <option value="Full Sun">Full Sun (6+ hours)</option>
                    <option value="Partial Sun">Partial Sun (4-6 hours)</option>
                    <option value="Partial Shade">Partial Shade (2-4 hours)</option>
                    <option value="Full Shade">Full Shade (&lt;2 hours)</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-[#4a3f35] mb-2">
                  Soil Type * (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['Clay', 'Sand', 'Silt', 'Loam', 'Peat', 'Chalk'].map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={soilTypes.includes(type)}
                        onChange={() => handleSoilTypeToggle(type)}
                        className="rounded text-[#4a7c2c] focus:ring-[#4a7c2c]"
                      />
                      <span className="text-sm text-[#4a3f35]">{type}</span>
                    </label>
                  ))}
                </div>
                {errors.soilType && (
                  <p className="text-sm text-red-600 mt-1">{errors.soilType.message}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-[#4a3f35] mb-2">
                  Water Access * (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['Well', 'Municipal', 'Stream/Creek', 'Pond/Lake', 'Rainwater Collection'].map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={waterAccessTypes.includes(type)}
                        onChange={() => handleWaterAccessToggle(type)}
                        className="rounded text-[#4a7c2c] focus:ring-[#4a7c2c]"
                      />
                      <span className="text-sm text-[#4a3f35]">{type}</span>
                    </label>
                  ))}
                </div>
                {errors.waterAccess && (
                  <p className="text-sm text-red-600 mt-1">{errors.waterAccess.message}</p>
                )}
              </div>
            </div>

            {/* Features & Amenities */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-[#2d5016] mb-4">Features & Amenities</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'hasFencing', label: 'Has Fencing' },
                  { name: 'hasGreenhouse', label: 'Has Greenhouse' },
                  { name: 'hasToolStorage', label: 'Has Tool Storage' },
                  { name: 'hasElectricity', label: 'Has Electricity' },
                  { name: 'hasRoadAccess', label: 'Has Road Access' },
                  { name: 'hasIrrigation', label: 'Has Irrigation System' },
                  { name: 'isADAAccessible', label: 'ADA Accessible' },
                  { name: 'allowsLivestock', label: 'Allows Livestock' },
                  { name: 'allowsStructures', label: 'Allows Structures' },
                ].map((field) => (
                  <label key={field.name} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      {...register(field.name as any)}
                      className="rounded text-[#4a7c2c] focus:ring-[#4a7c2c]"
                    />
                    <span className="text-sm text-[#4a3f35]">{field.label}</span>
                  </label>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-[#4a3f35] mb-1">
                  Restrictions or Rules
                </label>
                <textarea
                  {...register('restrictions')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent"
                  placeholder="List any restrictions, rules, or requirements..."
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-[#2d5016] mb-4">Pricing</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#4a3f35] mb-1">
                    Price Per Month * ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('pricePerMonth', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent"
                  />
                  {errors.pricePerMonth && (
                    <p className="text-sm text-red-600 mt-1">{errors.pricePerMonth.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a3f35] mb-1">
                    Price Per Season ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('pricePerSeason', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a3f35] mb-1">
                    Price Per Year ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('pricePerYear', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a3f35] mb-1">
                    Security Deposit ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('securityDeposit', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a3f35] mb-1">
                    Minimum Lease (months)
                  </label>
                  <input
                    type="number"
                    {...register('minimumLease', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-2 mt-6">
                  <input
                    type="checkbox"
                    {...register('instantBook')}
                    className="rounded text-[#4a7c2c] focus:ring-[#4a7c2c]"
                  />
                  <span className="text-sm text-[#4a3f35]">Allow Instant Booking</span>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-[#2d5016] mb-4">Images & Media</h2>

              <div className="mb-4">
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#aed581] text-[#2d5016] rounded-lg hover:bg-[#9bc76f] transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Add Image URL
                </button>
              </div>

              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Plot image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#4a3f35] mb-1">
                    Drone Footage URL
                  </label>
                  <input
                    {...register('droneFootageUrl')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a3f35] mb-1">
                    Virtual Tour URL
                  </label>
                  <input
                    {...register('virtualTourUrl')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-br from-[#6ba03f] to-[#4a7c2c] text-white rounded-lg hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Plot'
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push('/my-plots')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}

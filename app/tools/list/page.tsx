'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { type ToolCategory, type ToolCondition } from '@/lib/tools-data'
import {
  ArrowLeft,
  DollarSign,
  Shield,
  Clock,
  Info,
  CheckCircle2,
  Wrench,
} from 'lucide-react'
import { ImageUpload } from '@/components/ui/image-upload'

const categories: ToolCategory[] = [
  'Hand Tools',
  'Power Tools',
  'Irrigation',
  'Soil & Compost',
  'Harvesting',
  'Storage',
  'Other',
]

const conditions: ToolCondition[] = ['Excellent', 'Good', 'Fair', 'Needs Repair']

// Map display categories to API enum values
const categoryToEnum: Record<string, string> = {
  'Hand Tools': 'HAND_TOOLS',
  'Power Tools': 'POWER_TOOLS',
  'Irrigation': 'IRRIGATION',
  'Soil & Compost': 'SOIL_COMPOST',
  'Harvesting': 'HARVESTING',
  'Storage': 'STORAGE',
  'Other': 'OTHER',
}

const conditionToEnum: Record<string, string> = {
  'Excellent': 'EXCELLENT',
  'Good': 'GOOD',
  'Fair': 'FAIR',
  'Needs Repair': 'NEEDS_REPAIR',
}

export default function ListToolPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '' as ToolCategory,
    condition: '' as ToolCondition,
    brand: '',
    model: '',
    yearPurchased: '',
    specifications: '',
    instructions: '',
    pickupNotes: '',
    listingType: '',
    salePrice: '',
    priceNegotiable: false,
    dailyRate: '',
    weeklyRate: '',
    depositRequired: '',
    maxRentalDays: '7',
    isFree: false,
    images: [] as string[],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Map listing type to API enum
      const listingTypeMap: Record<string, string> = {
        'rent': 'RENT',
        'sale': 'SALE',
        'both': 'BOTH',
      }

      const response = await fetch('/api/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          category: categoryToEnum[formData.category] || 'OTHER',
          condition: conditionToEnum[formData.condition] || 'GOOD',
          listingType: listingTypeMap[formData.listingType] || 'RENT',
          salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
          dailyRate: formData.isFree ? 0 : (formData.dailyRate ? parseFloat(formData.dailyRate) : null),
          weeklyRate: formData.weeklyRate ? parseFloat(formData.weeklyRate) : null,
          depositRequired: formData.depositRequired ? parseFloat(formData.depositRequired) : null,
          images: formData.images,
          location: formData.pickupNotes,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create tool listing')
      }

      // Navigate to tools page on success
      router.push('/tools')
    } catch (err) {
      console.error('Error creating tool listing:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="text-white relative overflow-hidden h-[300px]">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60 z-10"></div>
          <Image
            src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&q=80"
            alt="Garden tools and equipment"
            fill
            className="object-cover"
          />
          <div className="relative z-20 mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-white hover:text-orange-100 mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tools
            </Link>
            <div className="text-center">
              <Wrench className="mx-auto h-16 w-16 mb-4 drop-shadow-md" />
              <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">List Your Tool</h1>
              <p className="text-xl text-[#f4e4c1] max-w-2xl mx-auto drop-shadow-md font-medium">
                Share your tools with the community and help fellow gardeners while earning points
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Benefits Banner */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl border border-orange-200 dark:border-orange-800 p-6 mb-8">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4 text-center">Why List Your Tools?</h2>
            <div className="grid gap-4 md:grid-cols-3 text-sm">
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl mb-2">💰</div>
                <p className="font-medium text-gray-900 dark:text-white">Earn Extra Income</p>
                <p className="text-gray-600 dark:text-gray-300">Make money from tools sitting in your garage</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl mb-2">🤝</div>
                <p className="font-medium text-gray-900 dark:text-white">Help Community</p>
                <p className="text-gray-600 dark:text-gray-300">Support fellow gardeners in their projects</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl mb-2">⭐</div>
                <p className="font-medium text-gray-900 dark:text-white">Earn Rewards</p>
                <p className="text-gray-600 dark:text-gray-300">Get points and achievements for sharing</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-300">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            )}

            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Basic Information</h2>

              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tool Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Gas-Powered Tiller, Wheelbarrow, etc."
                    className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe your tool, its features, and what makes it useful..."
                    className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Be detailed and honest about the tool's capabilities</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Condition *
                    </label>
                    <select
                      id="condition"
                      name="condition"
                      required
                      value={formData.condition}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select condition</option>
                      {conditions.map((cond) => (
                        <option key={cond} value={cond}>
                          {cond}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Brand
                    </label>
                    <input
                      type="text"
                      id="brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      placeholder="e.g., Troy-Bilt"
                      className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Model
                    </label>
                    <input
                      type="text"
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      placeholder="e.g., Pony ES"
                      className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="yearPurchased" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Year Purchased
                    </label>
                    <input
                      type="number"
                      id="yearPurchased"
                      name="yearPurchased"
                      value={formData.yearPurchased}
                      onChange={handleInputChange}
                      min="1950"
                      max={new Date().getFullYear()}
                      placeholder="2022"
                      className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Photos */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Photos</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Add photos to showcase your tool. The first image will be the main listing photo.</p>

              <ImageUpload
                value={formData.images}
                onChange={(images) => setFormData({ ...formData, images })}
                maxImages={8}
                folder="growshare/tools"
              />
            </div>

            {/* Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Additional Details</h2>

              <div className="space-y-6">
                <div>
                  <label htmlFor="specifications" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Specifications
                  </label>
                  <textarea
                    id="specifications"
                    name="specifications"
                    value={formData.specifications}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="List key specifications (one per line)&#10;e.g., 196cc 4-cycle OHV engine&#10;Tilling width: 21 inches"
                    className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>

                <div>
                  <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Usage Instructions
                  </label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Any special instructions for using this tool?"
                    className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>

                <div>
                  <label htmlFor="pickupNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pickup Notes *
                  </label>
                  <textarea
                    id="pickupNotes"
                    name="pickupNotes"
                    required
                    value={formData.pickupNotes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="How will renters pick up the tool? Any delivery options?"
                    className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Listing Type & Pricing */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Listing Type & Pricing</h2>

              <div className="space-y-6">
                {/* Listing Type Selection */}
                <div>
                  <label htmlFor="listingType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Listing Type *
                  </label>
                  <select
                    id="listingType"
                    name="listingType"
                    required
                    value={formData.listingType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select listing type</option>
                    <option value="rent">For Rent</option>
                    <option value="sale">For Sale</option>
                    <option value="both">Rent or Buy</option>
                  </select>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Choose whether you want to rent, sell, or offer both options for this tool
                  </p>
                </div>

                {/* Sale Price (if for sale or both) */}
                {(formData.listingType === 'sale' || formData.listingType === 'both') && (
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Sale Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          Sale Price *
                        </label>
                        <input
                          type="number"
                          id="salePrice"
                          name="salePrice"
                          required={formData.listingType === 'sale' || formData.listingType === 'both'}
                          value={formData.salePrice}
                          onChange={handleInputChange}
                          min="0"
                          step="0.01"
                          placeholder="150.00"
                          className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        />
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name="priceNegotiable"
                            checked={formData.priceNegotiable}
                            onChange={handleInputChange}
                            className="h-5 w-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Price is negotiable</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rental Options (if for rent or both) */}
                {(formData.listingType === 'rent' || formData.listingType === 'both') && (
                  <>
                    {formData.listingType === 'both' && (
                      <h3 className="font-semibold text-gray-900 dark:text-white mt-6">Rental Information</h3>
                    )}
                    {/* Free Option */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFree"
                      checked={formData.isFree}
                      onChange={handleInputChange}
                      className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">Offer for free (deposit only)</div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Build community goodwill by lending your tool for free. You'll still collect a refundable deposit.
                      </p>
                    </div>
                  </label>
                </div>

                {!formData.isFree && (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="dailyRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        Daily Rate *
                      </label>
                      <input
                        type="number"
                        id="dailyRate"
                        name="dailyRate"
                        required={!formData.isFree}
                        value={formData.dailyRate}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        placeholder="25.00"
                        className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <label htmlFor="weeklyRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Weekly Rate (Optional)
                      </label>
                      <input
                        type="number"
                        id="weeklyRate"
                        name="weeklyRate"
                        value={formData.weeklyRate}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        placeholder="100.00"
                        className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      />
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Offer a discount for weekly rentals</p>
                    </div>
                  </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="depositRequired" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                      Security Deposit *
                    </label>
                    <input
                      type="number"
                      id="depositRequired"
                      name="depositRequired"
                      required
                      value={formData.depositRequired}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      placeholder="50.00"
                      className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Refundable if tool is returned in good condition</p>
                  </div>

                  <div>
                    <label htmlFor="maxRentalDays" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      Max Rental Period *
                    </label>
                    <select
                      id="maxRentalDays"
                      name="maxRentalDays"
                      required
                      value={formData.maxRentalDays}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="1">1 day</option>
                      <option value="3">3 days</option>
                      <option value="5">5 days</option>
                      <option value="7">7 days (1 week)</option>
                      <option value="14">14 days (2 weeks)</option>
                      <option value="30">30 days (1 month)</option>
                    </select>
                  </div>
                </div>

                  </>
                )}

                {/* Pricing Tips */}
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-3">
                  <Info className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">Pricing Tips</p>
                    <ul className="list-disc list-inside space-y-1">
                      {formData.listingType === 'sale' || formData.listingType === 'both' ? (
                        <>
                          <li>Research similar used tools online for fair pricing</li>
                          <li>Consider condition, age, and original purchase price</li>
                          <li>Include all accessories and original packaging if available</li>
                          <li>Be open to negotiation for faster sales</li>
                        </>
                      ) : (
                        <>
                          <li>Research similar tools to set competitive rates</li>
                          <li>Consider the tool's purchase price and wear</li>
                          <li>Factor in cleaning and maintenance time</li>
                          <li>Weekly rates are typically 4-5x daily rate</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-8">
              <div className="flex items-start gap-3 mb-6">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 h-5 w-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
                  I agree to the{' '}
                  <Link href="/terms" className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium">
                    Tool Sharing Terms
                  </Link>{' '}
                  and confirm that this tool is in safe working condition. I understand that I am responsible for any damage or injury caused by defects I fail to disclose.
                </label>
              </div>

              <div className="flex gap-4">
                <Link
                  href="/tools"
                  className="flex-1 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    'Listing Tool...'
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      List My Tool
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  )
}

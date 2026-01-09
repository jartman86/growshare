'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { type ToolCategory, type ToolCondition } from '@/lib/tools-data'
import {
  ArrowLeft,
  Upload,
  DollarSign,
  Shield,
  Clock,
  Info,
  CheckCircle2,
  Wrench,
} from 'lucide-react'

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

export default function ListToolPage() {
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
    dailyRate: '',
    weeklyRate: '',
    depositRequired: '',
    maxRentalDays: '7',
    isFree: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Tool listing submitted:', formData)
    // Would integrate with backend here
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

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-white hover:text-orange-100 mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tools
            </Link>
            <div className="text-center">
              <Wrench className="mx-auto h-16 w-16 mb-4" />
              <h1 className="text-4xl font-bold mb-4">List Your Tool</h1>
              <p className="text-xl text-orange-100 max-w-2xl mx-auto">
                Share your tools with the community and help fellow gardeners while earning points
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Benefits Banner */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 p-6 mb-8">
            <h2 className="font-bold text-gray-900 mb-4 text-center">Why List Your Tools?</h2>
            <div className="grid gap-4 md:grid-cols-3 text-sm">
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl mb-2">💰</div>
                <p className="font-medium text-gray-900">Earn Extra Income</p>
                <p className="text-gray-600">Make money from tools sitting in your garage</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl mb-2">🤝</div>
                <p className="font-medium text-gray-900">Help Community</p>
                <p className="text-gray-600">Support fellow gardeners in their projects</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl mb-2">⭐</div>
                <p className="font-medium text-gray-900">Earn Rewards</p>
                <p className="text-gray-600">Get points and achievements for sharing</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-xl border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>

              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">Be detailed and honest about the tool's capabilities</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                    <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                      Condition *
                    </label>
                    <select
                      id="condition"
                      name="condition"
                      required
                      value={formData.condition}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                      Brand
                    </label>
                    <input
                      type="text"
                      id="brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      placeholder="e.g., Troy-Bilt"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                      Model
                    </label>
                    <input
                      type="text"
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      placeholder="e.g., Pony ES"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="yearPurchased" className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Photos */}
            <div className="bg-white rounded-xl border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Photos</h2>
              <p className="text-gray-600 mb-6">Add photos to showcase your tool (recommended)</p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 transition-colors cursor-pointer">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-700 font-medium mb-1">Click to upload photos</p>
                <p className="text-sm text-gray-500">PNG, JPG up to 5MB each (max 5 photos)</p>
              </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-xl border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Details</h2>

              <div className="space-y-6">
                <div>
                  <label htmlFor="specifications" className="block text-sm font-medium text-gray-700 mb-2">
                    Specifications
                  </label>
                  <textarea
                    id="specifications"
                    name="specifications"
                    value={formData.specifications}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="List key specifications (one per line)&#10;e.g., 196cc 4-cycle OHV engine&#10;Tilling width: 21 inches"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
                    Usage Instructions
                  </label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Any special instructions for using this tool?"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label htmlFor="pickupNotes" className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Rental Terms */}
            <div className="bg-white rounded-xl border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Rental Terms</h2>

              <div className="space-y-6">
                {/* Free Option */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFree"
                      checked={formData.isFree}
                      onChange={handleInputChange}
                      className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Offer for free (deposit only)</div>
                      <p className="text-sm text-gray-600">
                        Build community goodwill by lending your tool for free. You'll still collect a refundable deposit.
                      </p>
                    </div>
                  </label>
                </div>

                {!formData.isFree && (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="dailyRate" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-orange-600" />
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
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="weeklyRate" className="block text-sm font-medium text-gray-700 mb-2">
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
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      <p className="mt-1 text-sm text-gray-500">Offer a discount for weekly rentals</p>
                    </div>
                  </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="depositRequired" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
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
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">Refundable if tool is returned in good condition</p>
                  </div>

                  <div>
                    <label htmlFor="maxRentalDays" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      Max Rental Period *
                    </label>
                    <select
                      id="maxRentalDays"
                      name="maxRentalDays"
                      required
                      value={formData.maxRentalDays}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                  <Info className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold text-gray-900 mb-1">Pricing Tips</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Research similar tools to set competitive rates</li>
                      <li>Consider the tool's purchase price and wear</li>
                      <li>Factor in cleaning and maintenance time</li>
                      <li>Weekly rates are typically 4-5x daily rate</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="bg-white rounded-xl border p-8">
              <div className="flex items-start gap-3 mb-6">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 h-5 w-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the{' '}
                  <Link href="/terms" className="text-orange-600 hover:text-orange-700 font-medium">
                    Tool Sharing Terms
                  </Link>{' '}
                  and confirm that this tool is in safe working condition. I understand that I am responsible for any damage or injury caused by defects I fail to disclose.
                </label>
              </div>

              <div className="flex gap-4">
                <Link
                  href="/tools"
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  List My Tool
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

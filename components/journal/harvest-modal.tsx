'use client'

import { useState } from 'react'
import { X, CheckCircle, Scale } from 'lucide-react'

interface HarvestModalProps {
  isOpen: boolean
  onClose: () => void
  cropName: string
  entryId: string
}

export function HarvestModal({ isOpen, onClose, cropName, entryId }: HarvestModalProps) {
  const [formData, setFormData] = useState({
    harvestDate: new Date().toISOString().split('T')[0],
    amount: '',
    unit: 'lbs',
    quality: 'good',
    notes: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.harvestDate) newErrors.harvestDate = 'Harvest date is required'
    if (!formData.amount) newErrors.amount = 'Amount is required'
    if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // TODO: In production, this would update the database

    // Close modal and reset
    setIsSubmitting(false)
    onClose()
    setFormData({
      harvestDate: new Date().toISOString().split('T')[0],
      amount: '',
      unit: 'lbs',
      quality: 'good',
      notes: '',
    })

    // Show success message (in production, this would be a toast notification)
    alert('🎉 Harvest recorded successfully! You earned 150 points for your first harvest.')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white p-6 rounded-t-xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Scale className="h-8 w-8" />
                <h2 className="text-2xl font-bold">Record Harvest</h2>
              </div>
              <p className="text-orange-100">{cropName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Points Banner */}
        <div className="bg-green-50 border-b-2 border-green-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
              +150
            </div>
            <div>
              <h3 className="font-semibold text-green-900">
                Earn Points for Your Harvest
              </h3>
              <p className="text-sm text-green-700">
                Recording harvests helps track your productivity and unlocks achievement badges
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Harvest Date */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Harvest Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="harvestDate"
              value={formData.harvestDate}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.harvestDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.harvestDate && (
              <p className="mt-1 text-sm text-red-500">{errors.harvestDate}</p>
            )}
          </div>

          {/* Amount & Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0"
                step="0.1"
                min="0"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Unit</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="lbs">Pounds (lbs)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="oz">Ounces (oz)</option>
                <option value="bushels">Bushels</option>
                <option value="items">Items/Count</option>
              </select>
            </div>
          </div>

          {/* Quality */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Quality Assessment
            </label>
            <select
              name="quality"
              value={formData.quality}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="excellent">Excellent - Premium quality</option>
              <option value="good">Good - Standard quality</option>
              <option value="fair">Fair - Some imperfections</option>
              <option value="poor">Poor - Below standard</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Harvest Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Any notes about the harvest - size, flavor, appearance, etc."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Milestone Achievements */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Potential Achievements
            </h4>
            <ul className="space-y-1 text-sm text-yellow-800">
              <li>• First Harvest Badge (150 pts)</li>
              <li>• 100 Pound Club (300 pts when you reach 100 lbs total)</li>
              <li>• Diverse Grower (200 pts for harvesting 5 different crops)</li>
            </ul>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                'Recording...'
              ) : (
                <>
                  <Scale className="h-5 w-5" />
                  Record Harvest
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

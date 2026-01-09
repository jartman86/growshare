'use client'

import { useState } from 'react'
import { StarRatingInput } from './star-rating-input'
import { Camera, X, Plus } from 'lucide-react'

interface ReviewFormData {
  rating: number
  title: string
  content: string
  pros: string[]
  cons: string[]
}

interface ReviewFormProps {
  targetName: string
  targetType: 'tool' | 'resource' | 'user'
  onSubmit: (data: ReviewFormData) => void
  onCancel: () => void
  isVerified?: boolean
  verifiedType?: 'purchase' | 'rental'
}

export function ReviewForm({
  targetName,
  targetType,
  onSubmit,
  onCancel,
  isVerified = false,
  verifiedType,
}: ReviewFormProps) {
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    title: '',
    content: '',
    pros: [''],
    cons: [''],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleAddPro = () => {
    setFormData({ ...formData, pros: [...formData.pros, ''] })
  }

  const handleRemovePro = (index: number) => {
    const newPros = formData.pros.filter((_, i) => i !== index)
    setFormData({ ...formData, pros: newPros.length > 0 ? newPros : [''] })
  }

  const handleProChange = (index: number, value: string) => {
    const newPros = [...formData.pros]
    newPros[index] = value
    setFormData({ ...formData, pros: newPros })
  }

  const handleAddCon = () => {
    setFormData({ ...formData, cons: [...formData.cons, ''] })
  }

  const handleRemoveCon = (index: number) => {
    const newCons = formData.cons.filter((_, i) => i !== index)
    setFormData({ ...formData, cons: newCons.length > 0 ? newCons : [''] })
  }

  const handleConChange = (index: number, value: string) => {
    const newCons = [...formData.cons]
    newCons[index] = value
    setFormData({ ...formData, cons: newCons })
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating'
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Please enter a title'
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Please enter your review'
    }
    if (formData.content.trim().length < 50) {
      newErrors.content = 'Review must be at least 50 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      // Filter out empty pros and cons
      const cleanedData = {
        ...formData,
        pros: formData.pros.filter((pro) => pro.trim() !== ''),
        cons: formData.cons.filter((con) => con.trim() !== ''),
      }
      onSubmit(cleanedData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Write a Review for {targetName}
      </h3>

      {isVerified && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            ✓ You have a verified {verifiedType} of this {targetType}
          </p>
        </div>
      )}

      {/* Rating */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Overall Rating <span className="text-red-500">*</span>
        </label>
        <StarRatingInput
          value={formData.rating}
          onChange={(rating) => setFormData({ ...formData, rating })}
          required
        />
        {errors.rating && <p className="mt-2 text-sm text-red-600">{errors.rating}</p>}
      </div>

      {/* Review Title */}
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
          Review Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Sum up your experience in one line"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          maxLength={100}
        />
        <p className="mt-1 text-xs text-gray-500">{formData.title.length}/100</p>
        {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
      </div>

      {/* Review Content */}
      <div className="mb-6">
        <label htmlFor="content" className="block text-sm font-semibold text-gray-900 mb-2">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Share details about your experience. What did you like? What could be improved?"
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          maxLength={2000}
        />
        <p className="mt-1 text-xs text-gray-500">
          {formData.content.length}/2000 (minimum 50 characters)
        </p>
        {errors.content && <p className="mt-2 text-sm text-red-600">{errors.content}</p>}
      </div>

      {/* Pros & Cons */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Pros */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Pros (Optional)
          </label>
          <div className="space-y-2">
            {formData.pros.map((pro, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={pro}
                  onChange={(e) => handleProChange(index, e.target.value)}
                  placeholder="What did you like?"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {formData.pros.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePro(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddPro}
              className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium"
            >
              <Plus className="h-4 w-4" />
              Add Pro
            </button>
          </div>
        </div>

        {/* Cons */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Cons (Optional)
          </label>
          <div className="space-y-2">
            {formData.cons.map((con, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={con}
                  onChange={(e) => handleConChange(index, e.target.value)}
                  placeholder="What could be improved?"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {formData.cons.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCon(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddCon}
              className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium"
            >
              <Plus className="h-4 w-4" />
              Add Con
            </button>
          </div>
        </div>
      </div>

      {/* Photo Upload Placeholder */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Add Photos (Optional)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors cursor-pointer">
          <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Click to upload photos</p>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB each</p>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
        >
          Submit Review
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Guidelines */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 mb-2 font-semibold">Review Guidelines:</p>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Be honest and constructive</li>
          <li>• Focus on your personal experience</li>
          <li>• Avoid profanity or offensive language</li>
          <li>• Don't include personal contact information</li>
        </ul>
      </div>
    </form>
  )
}

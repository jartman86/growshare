'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUpload } from '@/components/ui/image-upload'
import {
  BookOpen,
  Loader2,
  Save,
  ArrowLeft,
  DollarSign,
  Award,
  Info
} from 'lucide-react'

const CATEGORIES = [
  { value: 'SOIL_SCIENCE', label: 'Soil Science' },
  { value: 'CROP_GUIDES', label: 'Crop Guides' },
  { value: 'PEST_MANAGEMENT', label: 'Pest Management' },
  { value: 'FARMING_METHODS', label: 'Farming Methods' },
  { value: 'ANIMAL_HUSBANDRY', label: 'Animal Husbandry' },
  { value: 'BUSINESS_LEGAL', label: 'Business & Legal' },
  { value: 'CLIMATE_ADAPTATION', label: 'Climate Adaptation' },
]

const LEVELS = [
  { value: 'BEGINNER', label: 'Beginner', description: 'No prior knowledge required' },
  { value: 'INTERMEDIATE', label: 'Intermediate', description: 'Some experience helpful' },
  { value: 'ADVANCED', label: 'Advanced', description: 'Requires solid foundation' },
  { value: 'EXPERT', label: 'Expert', description: 'For professionals' },
]

const ACCESS_TYPES = [
  { value: 'FREE', label: 'Free', description: 'Anyone can enroll for free' },
  { value: 'ONE_TIME', label: 'One-Time Purchase', description: 'Students pay once for lifetime access' },
  { value: 'SUBSCRIPTION', label: 'Subscription Only', description: 'Only available to subscribers' },
  { value: 'BOTH', label: 'Both', description: 'Available for purchase or via subscription' },
]

export default function NewCoursePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [isInstructor, setIsInstructor] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'BEGINNER',
    thumbnailUrl: '',
    accessType: 'FREE',
    price: '',
    includeInSubscription: false,
    isCertification: false,
    certificateName: '',
  })

  useEffect(() => {
    checkInstructorStatus()
  }, [])

  const checkInstructorStatus = async () => {
    try {
      const response = await fetch('/api/instructors/application')
      if (response.ok) {
        const data = await response.json()
        if (!data.isInstructor) {
          router.push('/instructor/apply')
          return
        }
        setIsInstructor(true)
      }
    } catch (error) {
      console.error('Error checking instructor status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/instructor/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? parseFloat(formData.price) : null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/instructor/courses/${data.course.id}/edit`)
      } else {
        setMessage(data.error || 'Failed to create course')
      }
    } catch (error) {
      setMessage('An error occurred while creating the course')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </main>
        <Footer />
      </>
    )
  }

  if (!isInstructor) {
    return null
  }

  const showPriceField = formData.accessType === 'ONE_TIME' || formData.accessType === 'BOTH'

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Create New Course
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="e.g., Complete Guide to Organic Soil Management"
                    required
                    minLength={5}
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Course Description *
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Describe what students will learn, prerequisites, and who this course is for..."
                    required
                    minLength={50}
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {formData.description.length}/50 minimum characters
                  </p>
                </div>

                {/* Category & Level */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category *
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Difficulty Level
                    </label>
                    <select
                      id="level"
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      {LEVELS.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Thumbnail */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Thumbnail
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Recommended: 1280x720px (16:9 aspect ratio)
                  </p>
                  <ImageUpload
                    value={formData.thumbnailUrl ? [formData.thumbnailUrl] : []}
                    onChange={(urls) => setFormData({ ...formData, thumbnailUrl: urls[0] || '' })}
                    maxImages={1}
                    folder="growshare/courses"
                  />
                </div>

                {/* Pricing */}
                <div className="border-t dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Pricing
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Access Type *
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {ACCESS_TYPES.map((type) => (
                          <label
                            key={type.value}
                            className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              formData.accessType === type.value
                                ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                          >
                            <input
                              type="radio"
                              name="accessType"
                              value={type.value}
                              checked={formData.accessType === type.value}
                              onChange={(e) => setFormData({ ...formData, accessType: e.target.value })}
                              className="sr-only"
                            />
                            <span className="font-medium text-gray-900 dark:text-white">{type.label}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {type.description}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {showPriceField && (
                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Price (USD) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            id="price"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="49.99"
                            min="0"
                            step="0.01"
                            required={showPriceField}
                          />
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          You&apos;ll receive 90% of each sale
                        </p>
                      </div>
                    )}

                    {(formData.accessType === 'SUBSCRIPTION' || formData.accessType === 'BOTH') && (
                      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-blue-800 dark:text-blue-300">
                            This course will be available to all GrowShare subscribers. You&apos;ll earn a share of subscription revenue based on student engagement with your content.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Certification */}
                <div className="border-t dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Certification
                  </h3>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isCertification}
                      onChange={(e) => setFormData({ ...formData, isCertification: e.target.checked })}
                      className="mt-1 rounded text-green-600 focus:ring-green-500"
                    />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        Issue Certificate on Completion
                      </span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Students will receive a downloadable certificate when they complete this course
                      </p>
                    </div>
                  </label>

                  {formData.isCertification && (
                    <div className="mt-4">
                      <label htmlFor="certificateName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Certificate Name
                      </label>
                      <input
                        type="text"
                        id="certificateName"
                        value={formData.certificateName}
                        onChange={(e) => setFormData({ ...formData, certificateName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="e.g., Certified Organic Soil Specialist"
                      />
                    </div>
                  )}
                </div>

                {/* Message */}
                {message && (
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-400">
                    {message}
                  </div>
                )}

                {/* Submit */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Create Course
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  )
}

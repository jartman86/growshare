'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ArrowLeft, Calendar, AlertCircle, Loader2 } from 'lucide-react'

// Map display names to database enum values
const categoryMap: Record<string, string> = {
  'Workshop': 'WORKSHOP',
  'Seed Swap': 'SEED_SWAP',
  'Farmers Market': 'FARMERS_MARKET',
  'Volunteer Day': 'VOLUNTEER_DAY',
  'Meetup': 'MEETUP',
  'Tour': 'TOUR',
  'Class': 'CLASS',
  'Harvest Festival': 'HARVEST_FESTIVAL',
  'Other': 'OTHER',
}

type CategoryDisplay = keyof typeof categoryMap

export default function NewEventPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Meetup' as CategoryDisplay,
    date: '',
    time: '',
    endTime: '',
    location: '',
    address: '',
    city: '',
    state: 'OR',
    capacity: '',
    price: '0',
    isVirtual: false,
    virtualLink: '',
    tags: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const categories: CategoryDisplay[] = [
    'Workshop',
    'Seed Swap',
    'Farmers Market',
    'Volunteer Day',
    'Meetup',
    'Tour',
    'Class',
    'Harvest Festival',
    'Other',
  ]

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = 'Event title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.date) newErrors.date = 'Event date is required'
    if (!formData.time) newErrors.time = 'Start time is required'
    if (!formData.location.trim()) newErrors.location = 'Location name is required'

    if (!formData.isVirtual) {
      if (!formData.address.trim()) newErrors.address = 'Address is required for in-person events'
      if (!formData.city.trim()) newErrors.city = 'City is required'
    }

    if (formData.isVirtual && !formData.virtualLink.trim()) {
      newErrors.virtualLink = 'Virtual meeting link is required'
    }

    if (formData.price && parseFloat(formData.price) < 0) {
      newErrors.price = 'Price must be 0 or greater'
    }

    if (formData.capacity && parseInt(formData.capacity) <= 0) {
      newErrors.capacity = 'Capacity must be greater than 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Combine date and time into ISO string
      const startDate = new Date(`${formData.date}T${formData.time}:00`)
      const endDate = formData.endTime
        ? new Date(`${formData.date}T${formData.endTime}:00`)
        : null

      // Parse tags
      const tags = formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : []

      const response = await fetch('/api/community-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: categoryMap[formData.category],
          startDate: startDate.toISOString(),
          endDate: endDate?.toISOString() || null,
          location: formData.location,
          address: formData.isVirtual ? 'Online' : formData.address,
          city: formData.isVirtual ? 'Virtual' : formData.city,
          state: formData.isVirtual ? 'Online' : formData.state.toUpperCase(),
          isVirtual: formData.isVirtual,
          virtualLink: formData.isVirtual ? formData.virtualLink : null,
          capacity: formData.capacity ? parseInt(formData.capacity) : null,
          price: parseFloat(formData.price) || 0,
          tags,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setSubmitError(data.error || 'Failed to create event')
        return
      }

      // Navigate to the new event
      router.push(`/events/${data.id}`)
    } catch {
      setSubmitError('Failed to create event. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create New Event</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Organize a workshop, meetup, or community gathering for local growers
            </p>
          </div>

          {/* Error Alert */}
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-red-800 dark:text-red-300">{submitError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Basic Information</h2>

              <div className="space-y-4">
                {/* Event Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value })
                      if (errors.title) setErrors({ ...errors, title: '' })
                    }}
                    placeholder="e.g., Community Seed Swap & Garden Social"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as CategoryDisplay })
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value })
                      if (errors.description) setErrors({ ...errors, description: '' })
                    }}
                    placeholder="Describe your event, what attendees will learn or do, and any special highlights..."
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none dark:bg-gray-700 dark:text-white ${
                      errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Date & Time</h2>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => {
                      setFormData({ ...formData, date: e.target.value })
                      if (errors.date) setErrors({ ...errors, date: '' })
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.date && (
                    <p className="mt-2 text-sm text-red-500">{errors.date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => {
                      setFormData({ ...formData, time: e.target.value })
                      if (errors.time) setErrors({ ...errors, time: '' })
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.time ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.time && (
                    <p className="mt-2 text-sm text-red-500">{errors.time}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    End Time (Optional)
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Location</h2>

              <div className="space-y-4">
                {/* Virtual Event Toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isVirtual}
                    onChange={(e) => setFormData({ ...formData, isVirtual: e.target.checked })}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">This is a virtual event</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Event will be held online</p>
                  </div>
                </label>

                {/* Location Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Location Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => {
                      setFormData({ ...formData, location: e.target.value })
                      if (errors.location) setErrors({ ...errors, location: '' })
                    }}
                    placeholder={
                      formData.isVirtual
                        ? "e.g., Virtual Event via Zoom"
                        : "e.g., Laurelhurst Park Pavilion"
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.location ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.location && (
                    <p className="mt-2 text-sm text-red-500">{errors.location}</p>
                  )}
                </div>

                {/* Virtual Link */}
                {formData.isVirtual && (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Virtual Meeting Link <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={formData.virtualLink}
                      onChange={(e) => {
                        setFormData({ ...formData, virtualLink: e.target.value })
                        if (errors.virtualLink) setErrors({ ...errors, virtualLink: '' })
                      }}
                      placeholder="https://zoom.us/j/..."
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                        errors.virtualLink ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.virtualLink && (
                      <p className="mt-2 text-sm text-red-500">{errors.virtualLink}</p>
                    )}
                  </div>
                )}

                {/* Physical Address */}
                {!formData.isVirtual && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => {
                          setFormData({ ...formData, address: e.target.value })
                          if (errors.address) setErrors({ ...errors, address: '' })
                        }}
                        placeholder="123 Main Street"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                          errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {errors.address && (
                        <p className="mt-2 text-sm text-red-500">{errors.address}</p>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => {
                            setFormData({ ...formData, city: e.target.value })
                            if (errors.city) setErrors({ ...errors, city: '' })
                          }}
                          placeholder="Portland"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                            errors.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          }`}
                        />
                        {errors.city && (
                          <p className="mt-2 text-sm text-red-500">{errors.city}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                          State <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          placeholder="OR"
                          maxLength={2}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent uppercase dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Additional Details</h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Capacity (Optional)
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => {
                      setFormData({ ...formData, capacity: e.target.value })
                      if (errors.capacity) setErrors({ ...errors, capacity: '' })
                    }}
                    placeholder="Leave blank for unlimited"
                    min="1"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.capacity ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.capacity && (
                    <p className="mt-2 text-sm text-red-500">{errors.capacity}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Price (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-semibold">
                      $
                    </span>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => {
                        setFormData({ ...formData, price: e.target.value })
                        if (errors.price) setErrors({ ...errors, price: '' })
                      }}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                        errors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Enter 0 for free events</p>
                  {errors.price && (
                    <p className="mt-2 text-sm text-red-500">{errors.price}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g., seed-swap, community, beginner-friendly"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-green-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating Event...
                  </>
                ) : (
                  <>
                    <Calendar className="h-5 w-5" />
                    Create Event
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  )
}

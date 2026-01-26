'use client'

import { useState } from 'react'
import { Calendar, Users, X, CheckCircle, AlertCircle, Mail } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { AvailabilityCalendar } from './availability-calendar'

interface BookingCardProps {
  plotId: string
  pricePerMonth: number
  pricePerSeason?: number
  pricePerYear?: number
  averageRating?: number
  reviewCount?: number
  plotTitle: string
  instantBook?: boolean
  minimumLease?: number
}

export function BookingCard({
  plotId,
  pricePerMonth,
  pricePerSeason,
  pricePerYear,
  averageRating,
  reviewCount = 0,
  plotTitle,
  instantBook = false,
  minimumLease = 3,
}: BookingCardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedStart, setSelectedStart] = useState<Date | null>(null)
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null)
  const [calculatedMonths, setCalculatedMonths] = useState(0)
  const [calculatedTotal, setCalculatedTotal] = useState(0)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [requiresVerification, setRequiresVerification] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleDateSelect = (start: Date | null, end: Date | null) => {
    setSelectedStart(start)
    setSelectedEnd(end)
    if (start) {
      setStartDate(start.toISOString().split('T')[0])
    }
    if (end) {
      setEndDate(end.toISOString().split('T')[0])
    }
  }

  const handlePriceCalculated = (months: number, total: number) => {
    setCalculatedMonths(months)
    setCalculatedTotal(total)
  }

  const handleRequestBooking = () => {
    setIsModalOpen(true)
    setError(null)
    setRequiresVerification(false)
    setSuccess(false)
    setSelectedStart(null)
    setSelectedEnd(null)
    setStartDate('')
    setEndDate('')
    setCalculatedMonths(0)
    setCalculatedTotal(0)
    setMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plotId,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          message: message || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.requiresVerification) {
          setRequiresVerification(true)
          setError(data.error || 'Please verify your email address')
          return
        }
        throw new Error(data.error || 'Failed to create booking')
      }

      setSuccess(true)

      // Close modal and redirect after a short delay
      setTimeout(() => {
        setIsModalOpen(false)
        router.push('/my-bookings')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Sticky Booking Card */}
      <div className="sticky top-24 border rounded-xl shadow-lg p-6 bg-white">
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {formatCurrency(pricePerMonth)}
            </span>
            <span className="text-gray-600">/ month</span>
          </div>

          {averageRating && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm">⭐ {averageRating.toFixed(1)}</span>
              <span className="text-sm text-gray-600">
                · {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          )}
        </div>

        {/* Pricing Options */}
        {(pricePerSeason || pricePerYear) && (
          <div className="mb-4 pb-4 border-b">
            <p className="text-sm font-semibold text-gray-900 mb-2">Other pricing options:</p>
            {pricePerSeason && (
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Per season (3 months):</span>
                <span className="font-medium">{formatCurrency(pricePerSeason)}</span>
              </div>
            )}
            {pricePerYear && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Per year:</span>
                <span className="font-medium">{formatCurrency(pricePerYear)}</span>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleRequestBooking}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          {instantBook ? 'Book Instantly' : 'Request to Book'}
        </button>

        {instantBook && (
          <p className="text-center text-xs text-green-600 font-medium mt-3">
            ⚡ Instant booking - No approval needed
          </p>
        )}

        <p className="text-center text-xs text-gray-500 mt-2">
          You won't be charged yet
        </p>

        <div className="mt-6 pt-6 border-t space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Service fee</span>
            <span className="font-medium">Calculated at checkout</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Security deposit</span>
            <span className="font-medium">Refundable</span>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {instantBook ? 'Book Instantly' : 'Request to Book'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isLoading}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {success ? (
              <div className="py-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {instantBook ? 'Booking Confirmed!' : 'Request Sent!'}
                </h3>
                <p className="text-gray-600">
                  {instantBook
                    ? 'Your booking has been confirmed. Redirecting...'
                    : 'Your booking request has been sent to the owner. Redirecting...'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Plot Title */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Plot</p>
                  <p className="font-semibold text-gray-900">{plotTitle}</p>
                  {instantBook && (
                    <p className="text-xs text-green-600 font-medium mt-1">
                      ⚡ Instant booking - No approval needed
                    </p>
                  )}
                </div>

                {/* Availability Calendar */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Dates
                  </label>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <AvailabilityCalendar
                      plotId={plotId}
                      selectedStart={selectedStart}
                      selectedEnd={selectedEnd}
                      onDateSelect={handleDateSelect}
                      onPriceCalculated={handlePriceCalculated}
                      pricePerMonth={pricePerMonth}
                      minimumLease={minimumLease}
                    />
                  </div>
                  {selectedStart && selectedEnd && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Selected dates:</span>
                        <span className="font-medium text-gray-900">
                          {selectedStart.toLocaleDateString()} - {selectedEnd.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium text-gray-900">
                          {calculatedMonths} {calculatedMonths === 1 ? 'month' : 'months'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-1 pt-2 border-t border-green-200">
                        <span className="font-medium text-gray-900">Estimated total:</span>
                        <span className="font-bold text-green-700">
                          {formatCurrency(calculatedTotal)}
                        </span>
                      </div>
                    </div>
                  )}
                  {!selectedStart && (
                    <p className="mt-2 text-xs text-gray-500">
                      Click on a date to select your start date, then click another date for your end date.
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message to Owner (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell the owner about yourself and your farming plans..."
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none disabled:bg-gray-100"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className={`flex items-start gap-2 p-3 border rounded-lg ${
                    requiresVerification
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-red-50 border-red-200'
                  }`}>
                    {requiresVerification ? (
                      <Mail className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm ${requiresVerification ? 'text-amber-800' : 'text-red-800'}`}>
                        {error}
                      </p>
                      {requiresVerification && (
                        <Link
                          href={`/verify-email?redirect=${encodeURIComponent(pathname)}`}
                          className="inline-flex items-center gap-1.5 mt-2 text-sm font-medium text-amber-700 hover:text-amber-900 underline"
                        >
                          <Mail className="h-4 w-4" />
                          Verify your email address
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !selectedStart || !selectedEnd}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : (instantBook ? 'Confirm Booking' : 'Send Request')}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}

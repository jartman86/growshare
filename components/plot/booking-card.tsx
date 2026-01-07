'use client'

import { useState } from 'react'
import { Calendar, Users, X } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface BookingCardProps {
  pricePerMonth: number
  pricePerSeason?: number
  pricePerYear?: number
  averageRating?: number
  reviewCount?: number
  plotTitle: string
}

export function BookingCard({
  pricePerMonth,
  pricePerSeason,
  pricePerYear,
  averageRating,
  reviewCount = 0,
  plotTitle,
}: BookingCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [renters, setRenters] = useState(1)

  const handleRequestBooking = () => {
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement booking request logic
    console.log('Booking request:', { startDate, endDate, renters })
    setIsModalOpen(false)
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
          Request to Book
        </button>

        <p className="text-center text-xs text-gray-500 mt-3">
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Request to Book</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Plot Title */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Plot</p>
                <p className="font-semibold text-gray-900">{plotTitle}</p>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Number of Renters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Renters
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    value={renters}
                    onChange={(e) => setRenters(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message to Owner (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell the owner about yourself and your farming plans..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Send Request
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

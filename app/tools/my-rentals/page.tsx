'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Package,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Loader2,
  Star,
  X,
} from 'lucide-react'

interface Rental {
  id: string
  toolId: string
  toolName: string
  toolImage: string
  ownerId: string
  ownerName: string
  ownerAvatar: string | null
  startDate: string
  endDate: string
  dailyRate: number
  totalCost: number
  depositAmount: number | null
  status: string
  pickedUpAt: string | null
  returnedAt: string | null
  hasReview: boolean
  reviewId: string | null
  daysRemaining: number
}

export default function MyRentalsPage() {
  const [activeRentals, setActiveRentals] = useState<Rental[]>([])
  const [pastRentals, setPastRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reviewModal, setReviewModal] = useState<{ open: boolean; rental: Rental | null }>({
    open: false,
    rental: null,
  })
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    content: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState<string | null>(null)

  useEffect(() => {
    fetchRentals()
  }, [])

  const fetchRentals = async () => {
    setLoading(true)
    setError(null)
    try {
      const [activeRes, completedRes] = await Promise.all([
        fetch('/api/my-rentals?status=active'),
        fetch('/api/my-rentals?status=completed'),
      ])

      if (!activeRes.ok || !completedRes.ok) {
        throw new Error('Failed to fetch rentals')
      }

      const [active, completed] = await Promise.all([
        activeRes.json(),
        completedRes.json(),
      ])

      setActiveRentals(active)
      setPastRentals(completed)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rentals')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!reviewModal.rental) return

    setSubmitting(true)
    setReviewError(null)

    try {
      const response = await fetch(`/api/tool-rentals/${reviewModal.rental.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit review')
      }

      // Update the rental in the list to show it's been reviewed
      setPastRentals(prev =>
        prev.map(r =>
          r.id === reviewModal.rental?.id ? { ...r, hasReview: true } : r
        )
      )

      // Close modal and reset form
      setReviewModal({ open: false, rental: null })
      setReviewForm({ rating: 5, title: '', content: '' })
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateStr))
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-white hover:text-orange-100 mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tools
            </Link>
            <h1 className="text-4xl font-bold mb-2">My Tool Rentals</h1>
            <p className="text-xl text-orange-100">
              Track your current and past tool rentals
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
              <button
                onClick={fetchRentals}
                className="mt-2 text-red-600 hover:underline text-sm"
              >
                Try again
              </button>
            </div>
          )}

          {/* Active Rentals */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Rentals</h2>
            {activeRentals.length > 0 ? (
              <div className="space-y-4">
                {activeRentals.map((rental) => (
                  <div key={rental.id} className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Tool Image */}
                      <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={rental.toolImage}
                          alt={rental.toolName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Rental Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{rental.toolName}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              {rental.ownerAvatar ? (
                                <img
                                  src={rental.ownerAvatar}
                                  alt={rental.ownerName}
                                  className="w-6 h-6 rounded-full"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-gray-200" />
                              )}
                              <span className="text-sm text-gray-600">Borrowed from {rental.ownerName}</span>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                            Active
                          </span>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 mb-4">
                          <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600">Rental Period</p>
                              <p className="font-semibold text-gray-900">
                                {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600">Due In</p>
                              <p className="font-semibold text-gray-900">{rental.daysRemaining} days</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600">Total Cost</p>
                              <p className="font-semibold text-gray-900">${rental.totalCost}</p>
                            </div>
                          </div>

                          {rental.depositAmount && (
                            <div className="flex items-start gap-3">
                              <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-sm text-gray-600">Deposit Held</p>
                                <p className="font-semibold text-gray-900">${rental.depositAmount}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors">
                            Arrange Return
                          </button>
                          <Link
                            href={`/messages?userId=${rental.ownerId}`}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                          >
                            <MessageSquare className="h-4 w-4" />
                            Message Owner
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border p-12 text-center">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Rentals</h3>
                <p className="text-gray-600 mb-6">You don't have any tools currently rented</p>
                <Link
                  href="/tools"
                  className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                  Browse Tools
                </Link>
              </div>
            )}
          </div>

          {/* Past Rentals */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Rental History</h2>
            {pastRentals.length > 0 ? (
              <div className="space-y-4">
                {pastRentals.map((rental) => (
                  <div key={rental.id} className="bg-white rounded-xl border p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Tool Image */}
                      <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={rental.toolImage}
                          alt={rental.toolName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Rental Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{rental.toolName}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              {rental.ownerAvatar ? (
                                <img
                                  src={rental.ownerAvatar}
                                  alt={rental.ownerName}
                                  className="w-5 h-5 rounded-full"
                                />
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-gray-200" />
                              )}
                              <span className="text-sm text-gray-600">Borrowed from {rental.ownerName}</span>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full">
                            Completed
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(rental.startDate)} - {formatDate(rental.endDate)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span>${rental.totalCost} total</span>
                          </div>
                          {rental.returnedAt && (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Returned {formatDate(rental.returnedAt)}</span>
                            </div>
                          )}
                        </div>

                        {!rental.hasReview && (
                          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700 flex-1">How was your experience with this tool?</span>
                            <button
                              onClick={() => setReviewModal({ open: true, rental })}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                              Leave Review
                            </button>
                          </div>
                        )}

                        {rental.hasReview && (
                          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <span className="text-sm text-green-700">You reviewed this rental</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border p-12 text-center">
                <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No rental history yet</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Review Modal */}
      {reviewModal.open && reviewModal.rental && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Review Your Rental</h2>
                <button
                  onClick={() => setReviewModal({ open: false, rental: null })}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600">
                  How was your experience with <strong>{reviewModal.rental.toolName}</strong>?
                </p>
              </div>

              {reviewError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{reviewError}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm(f => ({ ...f, rating: star }))}
                        className="p-1"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= reviewForm.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Title (optional)
                  </label>
                  <input
                    type="text"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Summarize your experience"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    maxLength={100}
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={reviewForm.content}
                    onChange={(e) => setReviewForm(f => ({ ...f, content: e.target.value }))}
                    placeholder="Share your experience with this tool..."
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 resize-none"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {reviewForm.content.length}/500 characters (minimum 10)
                  </p>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setReviewModal({ open: false, rental: null })}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    disabled={submitting || reviewForm.content.length < 10}
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    Submit Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}

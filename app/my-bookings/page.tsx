'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  MessageSquare,
  CreditCard,
  RefreshCw,
  RotateCcw,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { ReviewModal } from '@/components/plot/review-modal'
import { BookingPaymentModal } from '@/components/payments/booking-payment-modal'

interface PaymentIntent {
  status: string
  failureMessage?: string
  metadata?: {
    refundAmount?: number
    refundPercentage?: number
    refundedAt?: string
  }
}

interface Booking {
  id: string
  startDate: string
  endDate: string
  status: string
  totalAmount: number
  createdAt: string
  paidAt?: string
  hasReviewed?: boolean
  paymentIntent?: PaymentIntent
  plot: {
    id: string
    title: string
    city: string
    state: string
    images: string[]
    owner: {
      id: string
      firstName: string
      lastName: string
      email: string
      avatar: string | null
    }
  }
}

export default function MyBookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null)
  const [payingBooking, setPayingBooking] = useState<Booking | null>(null)
  const [cancelConfirmBooking, setCancelConfirmBooking] = useState<Booking | null>(null)
  const [refundInfo, setRefundInfo] = useState<{
    eligible: boolean
    refundPercentage: number
    refundAmount: number
  } | null>(null)
  const [loadingRefundInfo, setLoadingRefundInfo] = useState(false)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings?type=renter')
      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }
      const data = await response.json()
      setBookings(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRefundInfo = async (bookingId: string) => {
    setLoadingRefundInfo(true)
    try {
      const response = await fetch(`/api/payments/refund?bookingId=${bookingId}`)
      if (response.ok) {
        const data = await response.json()
        setRefundInfo(data)
      }
    } catch (err) {
      console.error('Error fetching refund info:', err)
    } finally {
      setLoadingRefundInfo(false)
    }
  }

  const handleCancelClick = async (booking: Booking) => {
    setCancelConfirmBooking(booking)
    // If booking was paid, fetch refund info
    if (booking.paidAt || booking.paymentIntent?.status === 'SUCCEEDED') {
      await fetchRefundInfo(booking.id)
    } else {
      setRefundInfo(null)
    }
  }

  const handleConfirmCancel = async () => {
    if (!cancelConfirmBooking) return

    setCancellingId(cancelConfirmBooking.id)
    setCancelConfirmBooking(null)

    try {
      const response = await fetch(`/api/bookings/${cancelConfirmBooking.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'CANCELLED' }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to cancel booking')
      }

      // Refresh bookings list
      await fetchBookings()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to cancel booking')
    } finally {
      setCancellingId(null)
      setRefundInfo(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: {
        icon: Clock,
        text: 'Pending',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      },
      APPROVED: {
        icon: CreditCard,
        text: 'Awaiting Payment',
        className: 'bg-amber-100 text-amber-800 border-amber-200',
      },
      REJECTED: {
        icon: XCircle,
        text: 'Rejected',
        className: 'bg-red-100 text-red-800 border-red-200',
      },
      CANCELLED: {
        icon: XCircle,
        text: 'Cancelled',
        className: 'bg-gray-100 text-gray-800 border-gray-200',
      },
      ACTIVE: {
        icon: CheckCircle,
        text: 'Active',
        className: 'bg-blue-100 text-blue-800 border-blue-200',
      },
      COMPLETED: {
        icon: CheckCircle,
        text: 'Completed',
        className: 'bg-purple-100 text-purple-800 border-purple-200',
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || {
      icon: AlertCircle,
      text: status,
      className: 'bg-gray-100 text-gray-800 border-gray-200',
    }

    const Icon = config.icon

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${config.className}`}
      >
        <Icon className="h-4 w-4" />
        {config.text}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getPaymentStatusBadge = (booking: Booking) => {
    const paymentIntent = booking.paymentIntent

    if (!paymentIntent) {
      if (booking.status === 'APPROVED') {
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
            <CreditCard className="h-3 w-3" />
            Payment Pending
          </span>
        )
      }
      return null
    }

    switch (paymentIntent.status) {
      case 'SUCCEEDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <CheckCircle className="h-3 w-3" />
            Paid
          </span>
        )
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            <XCircle className="h-3 w-3" />
            Payment Failed
          </span>
        )
      case 'REFUNDED':
        const refundAmount = paymentIntent.metadata?.refundAmount
        const refundPercentage = paymentIntent.metadata?.refundPercentage
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
            <RotateCcw className="h-3 w-3" />
            Refunded {refundPercentage}%
            {refundAmount && ` ($${refundAmount.toFixed(2)})`}
          </span>
        )
      case 'PENDING':
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
            <Loader2 className="h-3 w-3 animate-spin" />
            Processing
          </span>
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-2">
              View and manage your plot booking requests
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Bookings List */}
          {bookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No bookings yet
              </h2>
              <p className="text-gray-600 mb-6">
                Start exploring plots and make your first booking!
              </p>
              <button
                onClick={() => router.push('/explore')}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Explore Plots
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h2 className="text-xl font-semibold text-gray-900">
                            {booking.plot.title}
                          </h2>
                          {getStatusBadge(booking.status)}
                          {getPaymentStatusBadge(booking)}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {booking.plot.city}, {booking.plot.state}
                          </span>
                        </div>
                      </div>

                      {booking.plot.images && booking.plot.images.length > 0 && (
                        <img
                          src={booking.plot.images[0]}
                          alt={booking.plot.title}
                          className="w-32 h-24 object-cover rounded-lg ml-4"
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-t border-b">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Dates</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {formatDate(booking.startDate)} -{' '}
                            {formatDate(booking.endDate)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Price</p>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(booking.totalAmount)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-1">Landowner</p>
                        <div className="flex items-center gap-2">
                          {booking.plot.owner.avatar ? (
                            <img
                              src={booking.plot.owner.avatar}
                              alt={`${booking.plot.owner.firstName} ${booking.plot.owner.lastName}`}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                              {booking.plot.owner.firstName.charAt(0)}
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {booking.plot.owner.firstName}{' '}
                            {booking.plot.owner.lastName}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-3 flex-wrap">
                      <button
                        onClick={() => router.push(`/explore/${booking.plot.id}`)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                      >
                        View Plot
                      </button>

                      <button
                        onClick={() => router.push(`/messages?userId=${booking.plot.owner.id}`)}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center gap-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Contact Owner
                      </button>

                      {/* Pay Now button for approved bookings without payment or with pending payment */}
                      {booking.status === 'APPROVED' &&
                        (!booking.paymentIntent || booking.paymentIntent.status === 'PENDING') && (
                        <button
                          onClick={() => setPayingBooking(booking)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                          <CreditCard className="h-4 w-4" />
                          Pay Now
                        </button>
                      )}

                      {/* Retry Payment button for failed payments */}
                      {booking.status === 'APPROVED' &&
                        booking.paymentIntent?.status === 'FAILED' && (
                        <button
                          onClick={() => setPayingBooking(booking)}
                          className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center gap-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Retry Payment
                        </button>
                      )}

                      {booking.status === 'COMPLETED' && !booking.hasReviewed && (
                        <button
                          onClick={() => setReviewingBooking(booking)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                        >
                          Leave a Review
                        </button>
                      )}

                      {(booking.status === 'PENDING' ||
                        booking.status === 'APPROVED') && (
                        <button
                          onClick={() => handleCancelClick(booking)}
                          disabled={cancellingId === booking.id}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          {cancellingId === booking.id
                            ? 'Cancelling...'
                            : 'Cancel Booking'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Review Modal */}
      {reviewingBooking && (
        <ReviewModal
          plotId={reviewingBooking.plot.id}
          plotTitle={reviewingBooking.plot.title}
          onClose={() => setReviewingBooking(null)}
          onSuccess={() => {
            fetchBookings()
          }}
        />
      )}

      {/* Payment Modal */}
      {payingBooking && (
        <BookingPaymentModal
          booking={payingBooking}
          onClose={() => setPayingBooking(null)}
          onSuccess={() => {
            fetchBookings()
            setPayingBooking(null)
          }}
        />
      )}

      {/* Cancel Confirmation Modal */}
      {cancelConfirmBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Cancel Booking
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel your booking for{' '}
              <span className="font-medium">{cancelConfirmBooking.plot.title}</span>?
            </p>

            {loadingRefundInfo && (
              <div className="flex items-center gap-2 text-gray-500 mb-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Calculating refund...</span>
              </div>
            )}

            {refundInfo && !loadingRefundInfo && (
              <div className={`p-4 rounded-lg mb-4 ${
                refundInfo.eligible
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                {refundInfo.eligible ? (
                  <>
                    <p className="font-medium text-green-800">
                      Refund: {refundInfo.refundPercentage}% (${refundInfo.refundAmount.toFixed(2)})
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Your refund will be processed automatically.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-red-800">No refund available</p>
                    <p className="text-sm text-red-600 mt-1">
                      Cancellations less than 3 days before the start date are not eligible for a refund.
                    </p>
                  </>
                )}
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Refund Policy:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>7+ days before start: 100% refund</li>
                <li>3-6 days before start: 50% refund</li>
                <li>Less than 3 days: No refund</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCancelConfirmBooking(null)
                  setRefundInfo(null)
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

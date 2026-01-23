'use client'

import { useState } from 'react'
import { X, Calendar, MapPin, DollarSign } from 'lucide-react'
import { CheckoutForm } from './checkout-form'
import { formatCurrency } from '@/lib/utils'

interface BookingPaymentModalProps {
  booking: {
    id: string
    totalAmount: number
    startDate: string
    endDate: string
    plot: {
      id: string
      title: string
      city: string
      state: string
      images: string[]
      owner: {
        firstName: string
        lastName: string
      }
    }
  }
  onClose: () => void
  onSuccess: () => void
}

export function BookingPaymentModal({
  booking,
  onClose,
  onSuccess,
}: BookingPaymentModalProps) {
  const [paymentComplete, setPaymentComplete] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handlePaymentSuccess = () => {
    setPaymentComplete(true)
    // Wait a moment to show success state, then close and refresh
    setTimeout(() => {
      onSuccess()
      onClose()
    }, 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {paymentComplete ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-600">
                Your booking is now active. You'll receive a confirmation email shortly.
              </p>
            </div>
          ) : (
            <>
              {/* Booking Summary */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex gap-4">
                  {booking.plot.images && booking.plot.images.length > 0 && (
                    <img
                      src={booking.plot.images[0]}
                      alt={booking.plot.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {booking.plot.title}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>
                        {booking.plot.city}, {booking.plot.state}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Hosted by {booking.plot.owner.firstName} {booking.plot.owner.lastName}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Rental Period</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <DollarSign className="h-3.5 w-3.5" />
                      <span>Total Amount</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {formatCurrency(booking.totalAmount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <CheckoutForm
                type="booking"
                entityId={booking.id}
                amount={booking.totalAmount}
                onSuccess={handlePaymentSuccess}
                onError={(error) => console.error('Payment error:', error)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

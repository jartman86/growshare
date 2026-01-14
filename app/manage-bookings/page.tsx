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
  User,
  MessageSquare,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Booking {
  id: string
  startDate: string
  endDate: string
  status: string
  totalAmount: number
  createdAt: string
  plot: {
    id: string
    title: string
    city: string
    state: string
    images: string[]
  }
  renter: {
    id: string
    firstName: string
    lastName: string
    email: string
    avatar: string | null
  }
}

export default function ManageBookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings?type=owner')
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

  const handleUpdateStatus = async (
    bookingId: string,
    newStatus: 'APPROVED' | 'REJECTED' | 'CANCELLED'
  ) => {
    const confirmMessages = {
      APPROVED: 'Are you sure you want to approve this booking?',
      REJECTED: 'Are you sure you want to reject this booking?',
      CANCELLED: 'Are you sure you want to cancel this booking?',
    }

    if (!confirm(confirmMessages[newStatus])) {
      return
    }

    setProcessingId(bookingId)
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update booking')
      }

      // Refresh bookings list
      await fetchBookings()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update booking')
    } finally {
      setProcessingId(null)
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
        icon: CheckCircle,
        text: 'Approved',
        className: 'bg-green-100 text-green-800 border-green-200',
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

  const filteredBookings =
    filterStatus === 'all'
      ? bookings
      : bookings.filter((b) => b.status === filterStatus)

  const pendingCount = bookings.filter((b) => b.status === 'PENDING').length

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
            <h1 className="text-3xl font-bold text-gray-900">Manage Bookings</h1>
            <p className="text-gray-600 mt-2">
              Review and manage booking requests for your plots
            </p>
            {pendingCount > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-900">
                  You have {pendingCount} pending{' '}
                  {pendingCount === 1 ? 'request' : 'requests'} to review
                </span>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="mb-6 flex gap-2 overflow-x-auto">
            {[
              { value: 'all', label: 'All' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'APPROVED', label: 'Approved' },
              { value: 'ACTIVE', label: 'Active' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'REJECTED', label: 'Rejected' },
              { value: 'CANCELLED', label: 'Cancelled' },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  filterStatus === filter.value
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border hover:bg-gray-50'
                }`}
              >
                {filter.label}
                {filter.value !== 'all' && (
                  <span className="ml-2 text-xs">
                    ({bookings.filter((b) => b.status === filter.value).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {filterStatus === 'all'
                  ? 'No bookings yet'
                  : `No ${filterStatus.toLowerCase()} bookings`}
              </h2>
              <p className="text-gray-600 mb-6">
                {filterStatus === 'all'
                  ? 'Your plots will appear here once someone makes a booking request'
                  : `You don't have any ${filterStatus.toLowerCase()} bookings`}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-xl font-semibold text-gray-900">
                            {booking.plot.title}
                          </h2>
                          {getStatusBadge(booking.status)}
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
                        <p className="text-sm text-gray-600 mb-1">Renter</p>
                        <div className="flex items-center gap-2">
                          {booking.renter.avatar ? (
                            <img
                              src={booking.renter.avatar}
                              alt={`${booking.renter.firstName} ${booking.renter.lastName}`}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                              {booking.renter.firstName.charAt(0)}
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {booking.renter.firstName} {booking.renter.lastName}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-3 flex-wrap">
                      {booking.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() =>
                              handleUpdateStatus(booking.id, 'APPROVED')
                            }
                            disabled={processingId === booking.id}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            {processingId === booking.id
                              ? 'Processing...'
                              : 'Approve'}
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(booking.id, 'REJECTED')
                            }
                            disabled={processingId === booking.id}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {(booking.status === 'APPROVED' ||
                        booking.status === 'ACTIVE') && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(booking.id, 'CANCELLED')
                          }
                          disabled={processingId === booking.id}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          {processingId === booking.id
                            ? 'Processing...'
                            : 'Cancel Booking'}
                        </button>
                      )}

                      <button
                        onClick={() => router.push(`/explore/${booking.plot.id}`)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                      >
                        View Plot
                      </button>

                      <button
                        onClick={() => router.push(`/messages?userId=${booking.renter.id}`)}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center gap-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Contact Renter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

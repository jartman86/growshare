'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  ArrowLeft,
  Package,
  MapPin,
  Truck,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  MessageSquare,
  AlertCircle,
} from 'lucide-react'

interface Order {
  id: string
  quantity: number
  totalPrice: number
  status: string
  deliveryMethod: string
  deliveryAddress: string | null
  notes: string | null
  createdAt: string
  readyAt: string | null
  completedAt: string | null
  cancelledAt: string | null
  listing: {
    id: string
    productName: string
    variety: string | null
    unit: string
    pricePerUnit: number
    images: string[]
    pickupLocation: string | null
    user: {
      id: string
      firstName: string
      lastName: string
      avatar: string | null
    }
  }
  buyer: {
    id: string
    firstName: string
    lastName: string
    avatar: string | null
  }
  paymentIntent: {
    id: string
    status: string
    amount: number
  } | null
}

const statusConfig: Record<string, { label: string; bgClass: string; textClass: string; icon: typeof CheckCircle }> = {
  PENDING: { label: 'Pending', bgClass: 'bg-yellow-100', textClass: 'text-yellow-800', icon: Clock },
  CONFIRMED: { label: 'Confirmed', bgClass: 'bg-blue-100', textClass: 'text-blue-800', icon: CheckCircle },
  READY: { label: 'Ready for Pickup/Delivery', bgClass: 'bg-green-100', textClass: 'text-green-800', icon: Package },
  COMPLETED: { label: 'Completed', bgClass: 'bg-green-100', textClass: 'text-green-800', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', bgClass: 'bg-red-100', textClass: 'text-red-800', icon: XCircle },
}

export default function OrderDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const orderId = params.orderId as string
  const isSuccess = searchParams.get('success') === 'true'

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/marketplace/orders/${orderId}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Order not found')
        }
        throw new Error('Failed to fetch order')
      }
      const data = await response.json()
      setOrder(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(dateString))
  }

  const deliveryMethodLabels: Record<string, string> = {
    PICKUP: 'Farm Pickup',
    DELIVERY: 'Local Delivery',
    SHIPPING: 'Shipping',
    CENTRAL_DROP: 'CSA Box / Central Drop',
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </main>
        <Footer />
      </>
    )
  }

  if (error || !order) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'We couldn\'t find this order.'}</p>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Marketplace
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const status = statusConfig[order.status] || statusConfig.PENDING
  const StatusIcon = status.icon

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Back Link */}
        <div className="bg-white border-b">
          <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
            <Link
              href="/dashboard/orders"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Success Message */}
          {isSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-green-900">Order Placed Successfully!</h2>
                <p className="text-sm text-green-700 mt-1">
                  Your payment has been processed and the seller has been notified.
                  They will confirm your order soon.
                </p>
              </div>
            </div>
          )}

          {/* Order Header */}
          <div className="bg-white rounded-xl border p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Order #{order.id.slice(-8).toUpperCase()}</p>
                <h1 className="text-2xl font-bold text-gray-900 mt-1">
                  {order.listing.productName}
                  {order.listing.variety && (
                    <span className="text-gray-600"> - {order.listing.variety}</span>
                  )}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${status.bgClass} ${status.textClass}`}>
                <StatusIcon className="h-5 w-5" />
                <span className="font-semibold">{status.label}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Order Details */}
            <div className="space-y-6">
              {/* Product */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {order.listing.images[0] ? (
                      <img
                        src={order.listing.images[0]}
                        alt={order.listing.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`/marketplace/${order.listing.id}`}
                      className="font-medium text-gray-900 hover:text-green-600"
                    >
                      {order.listing.productName}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.quantity} {order.listing.unit} @ ${order.listing.pricePerUnit.toFixed(2)}/{order.listing.unit}
                    </p>
                    <p className="text-lg font-bold text-green-600 mt-2">
                      ${order.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                {order.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium text-gray-700">Notes:</p>
                    <p className="text-sm text-gray-600 mt-1">{order.notes}</p>
                  </div>
                )}
              </div>

              {/* Delivery */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery</h2>
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {deliveryMethodLabels[order.deliveryMethod] || order.deliveryMethod}
                    </p>
                    {order.deliveryAddress && (
                      <p className="text-sm text-gray-600 mt-1">{order.deliveryAddress}</p>
                    )}
                    {order.deliveryMethod === 'PICKUP' && order.listing.pickupLocation && (
                      <div className="flex items-start gap-2 mt-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span>{order.listing.pickupLocation}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment */}
              {order.paymentIntent && (
                <div className="bg-white rounded-xl border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment</h2>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`font-medium ${
                      order.paymentIntent.status === 'SUCCEEDED' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {order.paymentIntent.status === 'SUCCEEDED' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-bold text-gray-900">
                      ${(order.paymentIntent.amount / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Seller Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Seller</h2>
                <div className="flex items-center gap-4">
                  {order.listing.user.avatar ? (
                    <img
                      src={order.listing.user.avatar}
                      alt={order.listing.user.firstName || 'Seller'}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-xl font-bold text-green-600">
                        {order.listing.user.firstName?.charAt(0) || 'S'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {order.listing.user.firstName} {order.listing.user.lastName}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/messages?to=${order.listing.user.id}`}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <MessageSquare className="h-4 w-4" />
                  Message Seller
                </Link>
              </div>

              {/* Order Timeline */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                    <div>
                      <p className="font-medium text-gray-900">Order Placed</p>
                      <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  {order.status !== 'PENDING' && order.status !== 'CANCELLED' && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                      <div>
                        <p className="font-medium text-gray-900">Confirmed by Seller</p>
                      </div>
                    </div>
                  )}
                  {order.readyAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                      <div>
                        <p className="font-medium text-gray-900">Ready</p>
                        <p className="text-sm text-gray-600">{formatDate(order.readyAt)}</p>
                      </div>
                    </div>
                  )}
                  {order.completedAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                      <div>
                        <p className="font-medium text-gray-900">Completed</p>
                        <p className="text-sm text-gray-600">{formatDate(order.completedAt)}</p>
                      </div>
                    </div>
                  )}
                  {order.cancelledAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-red-500" />
                      <div>
                        <p className="font-medium text-red-600">Cancelled</p>
                        <p className="text-sm text-gray-600">{formatDate(order.cancelledAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

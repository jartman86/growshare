'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CheckoutForm } from '@/components/payments/checkout-form'
import {
  ArrowLeft,
  Package,
  MapPin,
  Truck,
  Loader2,
  CheckCircle,
  ShoppingBag,
} from 'lucide-react'

interface Order {
  id: string
  quantity: number
  totalPrice: number
  status: string
  deliveryMethod: string
  deliveryAddress: string | null
  listing: {
    id: string
    productName: string
    variety: string | null
    unit: string
    pricePerUnit: number
    images: string[]
    user: {
      id: string
      firstName: string
      lastName: string
      avatar: string | null
    }
  }
}

export default function MarketplaceCheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentComplete, setPaymentComplete] = useState(false)

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    } else {
      setError('No order specified')
      setLoading(false)
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

      if (data.status !== 'PENDING') {
        setError('This order has already been processed')
        setLoading(false)
        return
      }

      setOrder(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    setPaymentComplete(true)
    // Redirect to order confirmation after a brief delay
    setTimeout(() => {
      router.push(`/marketplace/orders/${orderId}?success=true`)
    }, 2000)
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error)
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
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto" />
            <p className="mt-4 text-gray-600">Loading order...</p>
          </div>
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
            <div className="bg-white rounded-xl border p-8">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {error || 'Order Not Found'}
              </h1>
              <p className="text-gray-600 mb-6">
                We couldn't load your order. Please try again or browse the marketplace.
              </p>
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Marketplace
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (paymentComplete) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center bg-white rounded-xl border p-8 max-w-md mx-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-4">
              Your order has been placed. The seller will be notified.
            </p>
            <p className="text-sm text-gray-500">Redirecting to your order...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Back Link */}
        <div className="bg-white border-b">
          <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
            <Link
              href={`/marketplace/${order.listing.id}`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Product
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Complete Your Purchase</h1>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                {/* Product Info */}
                <div className="flex gap-4 pb-4 border-b">
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
                    <h3 className="font-medium text-gray-900">
                      {order.listing.productName}
                      {order.listing.variety && (
                        <span className="text-gray-600"> - {order.listing.variety}</span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Sold by {order.listing.user.firstName} {order.listing.user.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      ${order.listing.pricePerUnit.toFixed(2)} / {order.listing.unit}
                    </p>
                  </div>
                </div>

                {/* Order Details */}
                <div className="pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Quantity</span>
                    <span className="font-medium">
                      {order.quantity} {order.listing.unit}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${order.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm pt-2 border-t">
                    <Truck className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">
                      {deliveryMethodLabels[order.deliveryMethod] || order.deliveryMethod}
                    </span>
                  </div>
                  {order.deliveryAddress && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <span className="text-gray-600">{order.deliveryAddress}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Seller Info */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Seller</h2>
                <div className="flex items-center gap-3">
                  {order.listing.user.avatar ? (
                    <img
                      src={order.listing.user.avatar}
                      alt={order.listing.user.firstName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-lg font-bold text-green-600">
                        {order.listing.user.firstName[0]}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.listing.user.firstName} {order.listing.user.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Will be notified once payment is complete
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div>
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment</h2>
                <CheckoutForm
                  type="order"
                  entityId={order.id}
                  amount={order.totalPrice}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

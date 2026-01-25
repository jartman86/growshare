'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  Package,
  Loader2,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Truck,
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
  listing: {
    id: string
    productName: string
    variety: string | null
    unit: string
    images: string[]
  }
  buyer: {
    id: string
    firstName: string
    lastName: string
    avatar: string | null
  }
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  PENDING: { label: 'Pending', color: 'yellow', icon: Clock },
  CONFIRMED: { label: 'Confirmed', color: 'blue', icon: CheckCircle },
  READY: { label: 'Ready', color: 'green', icon: Package },
  COMPLETED: { label: 'Completed', color: 'green', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', color: 'red', icon: XCircle },
}

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/marketplace/orders?role=seller')
      if (!response.ok) throw new Error('Failed to fetch orders')
      const data = await response.json()
      setOrders(data)
    } catch (err) {
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrder(orderId)
    try {
      const response = await fetch(`/api/marketplace/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update order')
      }
      await fetchOrders()
    } catch (err) {
      console.error('Error updating order:', err)
      alert(err instanceof Error ? err.message : 'Failed to update order')
    } finally {
      setUpdatingOrder(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateString))
  }

  const deliveryMethodLabels: Record<string, string> = {
    PICKUP: 'Pickup',
    DELIVERY: 'Delivery',
    SHIPPING: 'Shipping',
    CENTRAL_DROP: 'CSA Box',
  }

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true
    if (filter === 'pending') return order.status === 'PENDING'
    if (filter === 'active') return ['CONFIRMED', 'READY'].includes(order.status)
    if (filter === 'completed') return order.status === 'COMPLETED'
    return true
  })

  const getNextActions = (status: string): { label: string; status: string; variant: string }[] => {
    switch (status) {
      case 'PENDING':
        return [
          { label: 'Confirm Order', status: 'CONFIRMED', variant: 'primary' },
          { label: 'Cancel', status: 'CANCELLED', variant: 'danger' },
        ]
      case 'CONFIRMED':
        return [
          { label: 'Mark Ready', status: 'READY', variant: 'primary' },
          { label: 'Cancel', status: 'CANCELLED', variant: 'danger' },
        ]
      case 'READY':
        return [{ label: 'Complete Order', status: 'COMPLETED', variant: 'primary' }]
      default:
        return []
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/dashboard/sell"
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Incoming Orders</h1>
              <p className="text-gray-600 mt-1">Manage orders from buyers</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6">
            {['all', 'pending', 'active', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-green-600 text-white'
                    : 'bg-white border text-gray-700 hover:bg-gray-50'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f === 'pending' && orders.filter((o) => o.status === 'PENDING').length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 bg-yellow-500 text-white text-xs rounded-full">
                    {orders.filter((o) => o.status === 'PENDING').length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl border p-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders</h2>
              <p className="text-gray-600">
                {filter === 'all'
                  ? "When buyers purchase your products, orders will appear here."
                  : `No ${filter} orders found.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.PENDING
                const StatusIcon = status.icon
                const actions = getNextActions(order.status)

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl border p-5"
                  >
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
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {order.listing.productName}
                              {order.listing.variety && (
                                <span className="text-gray-600 font-normal"> - {order.listing.variety}</span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {order.quantity} {order.listing.unit} &middot; ${order.totalPrice.toFixed(2)}
                            </p>
                          </div>
                          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-${status.color}-100 text-${status.color}-800`}>
                            <StatusIcon className="h-4 w-4" />
                            {status.label}
                          </div>
                        </div>

                        {/* Buyer Info */}
                        <div className="flex items-center gap-3 mt-3 pt-3 border-t">
                          {order.buyer.avatar ? (
                            <img
                              src={order.buyer.avatar}
                              alt={order.buyer.firstName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="text-sm font-bold text-green-600">
                                {order.buyer.firstName[0]}
                              </span>
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {order.buyer.firstName} {order.buyer.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              Ordered {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Truck className="h-4 w-4" />
                            {deliveryMethodLabels[order.deliveryMethod] || order.deliveryMethod}
                          </div>
                        </div>

                        {/* Delivery Address */}
                        {order.deliveryAddress && (
                          <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                            <strong>Delivery to:</strong> {order.deliveryAddress}
                          </p>
                        )}

                        {/* Notes */}
                        {order.notes && (
                          <p className="text-sm text-gray-600 mt-2 bg-blue-50 p-2 rounded">
                            <strong>Notes:</strong> {order.notes}
                          </p>
                        )}

                        {/* Actions */}
                        {actions.length > 0 && (
                          <div className="flex gap-2 mt-4">
                            {actions.map((action) => (
                              <button
                                key={action.status}
                                onClick={() => updateOrderStatus(order.id, action.status)}
                                disabled={updatingOrder === order.id}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                                  action.variant === 'primary'
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : action.variant === 'danger'
                                    ? 'border border-red-300 text-red-700 hover:bg-red-50'
                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {updatingOrder === order.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  action.label
                                )}
                              </button>
                            ))}
                            <Link
                              href={`/messages?to=${order.buyer.id}`}
                              className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                              Message Buyer
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

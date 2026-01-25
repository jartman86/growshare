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
  ShoppingBag,
} from 'lucide-react'

interface Order {
  id: string
  quantity: number
  totalPrice: number
  status: string
  deliveryMethod: string
  createdAt: string
  listing: {
    id: string
    productName: string
    variety: string | null
    unit: string
    images: string[]
    user: {
      firstName: string
      lastName: string
    }
  }
}

const statusConfig: Record<string, { label: string; bgClass: string; textClass: string; icon: typeof CheckCircle }> = {
  PENDING: { label: 'Pending', bgClass: 'bg-yellow-100 dark:bg-yellow-900/30', textClass: 'text-yellow-800 dark:text-yellow-400', icon: Clock },
  CONFIRMED: { label: 'Confirmed', bgClass: 'bg-blue-100 dark:bg-blue-900/30', textClass: 'text-blue-800 dark:text-blue-400', icon: CheckCircle },
  READY: { label: 'Ready', bgClass: 'bg-green-100 dark:bg-green-900/30', textClass: 'text-green-800 dark:text-green-400', icon: Package },
  COMPLETED: { label: 'Completed', bgClass: 'bg-green-100 dark:bg-green-900/30', textClass: 'text-green-800 dark:text-green-400', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', bgClass: 'bg-red-100 dark:bg-red-900/30', textClass: 'text-red-800 dark:text-red-400', icon: XCircle },
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/marketplace/orders?role=buyer')
      if (!response.ok) throw new Error('Failed to fetch orders')
      const data = await response.json()
      setOrders(data)
    } catch (err) {
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateString))
  }

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true
    if (filter === 'active') return ['PENDING', 'CONFIRMED', 'READY'].includes(order.status)
    if (filter === 'completed') return order.status === 'COMPLETED'
    if (filter === 'cancelled') return order.status === 'CANCELLED'
    return true
  })

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Orders</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Track your marketplace purchases</p>
            </div>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <ShoppingBag className="h-4 w-4" />
              Browse Marketplace
            </Link>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6">
            {['all', 'active', 'completed', 'cancelled'].map((f) => (
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
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
              <p className="text-gray-600 mb-6">
                When you purchase from the marketplace, your orders will appear here.
              </p>
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Browse Marketplace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.PENDING
                const StatusIcon = status.icon

                return (
                  <Link
                    key={order.id}
                    href={`/marketplace/orders/${order.id}`}
                    className="block bg-white rounded-xl border p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {order.listing.images[0] ? (
                          <img
                            src={order.listing.images[0]}
                            alt={order.listing.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-medium text-gray-900 truncate">
                              {order.listing.productName}
                              {order.listing.variety && (
                                <span className="text-gray-600"> - {order.listing.variety}</span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600 mt-0.5">
                              {order.quantity} {order.listing.unit} from{' '}
                              {order.listing.user.firstName} {order.listing.user.lastName}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Ordered {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-gray-900">
                              ${order.totalPrice.toFixed(2)}
                            </p>
                            <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.bgClass} ${status.textClass}`}>
                              <StatusIcon className="h-3 w-3" />
                              {status.label}
                            </div>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0 self-center" />
                    </div>
                  </Link>
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

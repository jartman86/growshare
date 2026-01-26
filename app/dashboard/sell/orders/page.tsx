'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  Package,
  Loader2,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Truck,
  Search,
  DollarSign,
  ShoppingBag,
  AlertCircle,
  X,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  MapPin,
  Calendar,
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
  listing: {
    id: string
    productName: string
    variety: string | null
    unit: string
    pricePerUnit: number
    images: string[]
    pickupLocation: string | null
  }
  buyer: {
    id: string
    firstName: string
    lastName: string
    avatar: string | null
  }
}

interface StatusConfig {
  label: string
  bgClass: string
  textClass: string
  icon: typeof CheckCircle
}

const statusConfig: Record<string, StatusConfig> = {
  PENDING: {
    label: 'Pending',
    bgClass: 'bg-yellow-100 dark:bg-yellow-900/30',
    textClass: 'text-yellow-800 dark:text-yellow-400',
    icon: Clock,
  },
  CONFIRMED: {
    label: 'Confirmed',
    bgClass: 'bg-blue-100 dark:bg-blue-900/30',
    textClass: 'text-blue-800 dark:text-blue-400',
    icon: CheckCircle,
  },
  READY: {
    label: 'Ready',
    bgClass: 'bg-emerald-100 dark:bg-emerald-900/30',
    textClass: 'text-emerald-800 dark:text-emerald-400',
    icon: Package,
  },
  COMPLETED: {
    label: 'Completed',
    bgClass: 'bg-green-100 dark:bg-green-900/30',
    textClass: 'text-green-800 dark:text-green-400',
    icon: CheckCircle,
  },
  CANCELLED: {
    label: 'Cancelled',
    bgClass: 'bg-red-100 dark:bg-red-900/30',
    textClass: 'text-red-800 dark:text-red-400',
    icon: XCircle,
  },
}

const deliveryMethodLabels: Record<string, string> = {
  PICKUP: 'Farm Pickup',
  DELIVERY: 'Local Delivery',
  SHIPPING: 'Shipping',
  CENTRAL_DROP: 'CSA Box',
}

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  // Auto-dismiss messages
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/marketplace/orders?role=seller')
      if (!response.ok) throw new Error('Failed to fetch orders')
      const data = await response.json()
      setOrders(data)
    } catch (err) {
      setError('Failed to load orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string, statusLabel: string) => {
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
      setSuccessMessage(`Order marked as ${statusLabel.toLowerCase()}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order')
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

  const formatDateTime = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(dateString))
  }

  // Filter and search
  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (filter === 'pending' && order.status !== 'PENDING') return false
    if (filter === 'active' && !['CONFIRMED', 'READY'].includes(order.status)) return false
    if (filter === 'completed' && order.status !== 'COMPLETED') return false
    if (filter === 'cancelled' && order.status !== 'CANCELLED') return false

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const buyerName = `${order.buyer.firstName} ${order.buyer.lastName}`.toLowerCase()
      const productName = order.listing.productName.toLowerCase()
      return buyerName.includes(query) || productName.includes(query)
    }

    return true
  })

  // Calculate stats
  const pendingCount = orders.filter((o) => o.status === 'PENDING').length
  const activeCount = orders.filter((o) => ['CONFIRMED', 'READY'].includes(o.status)).length
  const totalRevenue = orders
    .filter((o) => o.status === 'COMPLETED')
    .reduce((sum, o) => sum + o.totalPrice, 0)
  const todayOrders = orders.filter((o) => {
    const orderDate = new Date(o.createdAt).toDateString()
    return orderDate === new Date().toDateString()
  }).length

  const getNextActions = (status: string): { label: string; status: string; variant: 'primary' | 'danger' | 'secondary' }[] => {
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

  const getActionButtonClass = (variant: 'primary' | 'danger' | 'secondary') => {
    switch (variant) {
      case 'primary':
        return 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700'
      case 'danger':
        return 'border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
      default:
        return 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Toast Messages */}
        {error && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg shadow-lg">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-2 hover:text-red-900 dark:hover:text-red-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 bg-green-100 dark:bg-green-900/50 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 rounded-lg shadow-lg">
            <CheckCircle className="h-5 w-5" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/dashboard/sell"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order Fulfillment</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and fulfill customer orders</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeCount}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalRevenue.toFixed(0)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Revenue</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayOrders}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Today</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {[
                { key: 'all', label: 'All' },
                { key: 'pending', label: 'Pending', count: pendingCount },
                { key: 'active', label: 'In Progress', count: activeCount },
                { key: 'completed', label: 'Completed' },
                { key: 'cancelled', label: 'Cancelled' },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    filter === f.key
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {f.label}
                  {f.count && f.count > 0 && (
                    <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                      filter === f.key
                        ? 'bg-white/20 text-white'
                        : 'bg-yellow-500 text-white'
                    }`}>
                      {f.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex-1 sm:max-w-xs">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No orders found</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery
                  ? 'Try a different search term'
                  : filter === 'all'
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
                const isExpanded = expandedOrder === order.id

                return (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="p-4 sm:p-5">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                          {order.listing.images[0] ? (
                            <Image
                              src={order.listing.images[0]}
                              alt={order.listing.productName}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Order Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {order.listing.productName}
                                {order.listing.variety && (
                                  <span className="text-gray-600 dark:text-gray-400 font-normal"> - {order.listing.variety}</span>
                                )}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {order.quantity} {order.listing.unit} &middot; <span className="font-semibold">${order.totalPrice.toFixed(2)}</span>
                              </p>
                            </div>
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.bgClass} ${status.textClass}`}>
                              <StatusIcon className="h-4 w-4" />
                              <span className="hidden sm:inline">{status.label}</span>
                            </div>
                          </div>

                          {/* Buyer Info */}
                          <div className="flex items-center gap-3 mt-3 pt-3 border-t dark:border-gray-700">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 overflow-hidden flex-shrink-0">
                              {order.buyer.avatar ? (
                                <Image
                                  src={order.buyer.avatar}
                                  alt={order.buyer.firstName}
                                  width={32}
                                  height={32}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                    {order.buyer.firstName[0]}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {order.buyer.firstName} {order.buyer.lastName}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDateTime(order.createdAt)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <Truck className="h-4 w-4" />
                              <span className="hidden sm:inline">{deliveryMethodLabels[order.deliveryMethod] || order.deliveryMethod}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center gap-2 mt-4 flex-wrap">
                        {actions.map((action) => (
                          <button
                            key={action.status}
                            onClick={() => updateOrderStatus(order.id, action.status, action.label)}
                            disabled={updatingOrder === order.id}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${getActionButtonClass(action.variant)}`}
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
                          className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span className="hidden sm:inline">Message</span>
                        </Link>
                        <button
                          onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                          className="ml-auto px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors inline-flex items-center gap-1"
                        >
                          {isExpanded ? (
                            <>
                              Less <ChevronUp className="h-4 w-4" />
                            </>
                          ) : (
                            <>
                              Details <ChevronDown className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-4 sm:px-5 pb-5 pt-0 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <div className="grid gap-4 sm:grid-cols-2 pt-4">
                          {/* Delivery Info */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Delivery Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Truck className="h-4 w-4 text-gray-500 mt-0.5" />
                                <span className="text-gray-700 dark:text-gray-300">
                                  {deliveryMethodLabels[order.deliveryMethod] || order.deliveryMethod}
                                </span>
                              </div>
                              {order.deliveryAddress && (
                                <div className="flex items-start gap-2">
                                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                                  <span className="text-gray-700 dark:text-gray-300">{order.deliveryAddress}</span>
                                </div>
                              )}
                              {order.deliveryMethod === 'PICKUP' && order.listing.pickupLocation && (
                                <div className="flex items-start gap-2">
                                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                                  <span className="text-gray-700 dark:text-gray-300">
                                    Pickup: {order.listing.pickupLocation}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Order Timeline */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Timeline</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="text-gray-700 dark:text-gray-300">
                                  Ordered: {formatDateTime(order.createdAt)}
                                </span>
                              </div>
                              {order.readyAt && (
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-green-500" />
                                  <span className="text-gray-700 dark:text-gray-300">
                                    Ready: {formatDateTime(order.readyAt)}
                                  </span>
                                </div>
                              )}
                              {order.completedAt && (
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-green-500" />
                                  <span className="text-gray-700 dark:text-gray-300">
                                    Completed: {formatDateTime(order.completedAt)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Notes */}
                        {order.notes && (
                          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Customer Notes:</p>
                            <p className="text-sm text-blue-800 dark:text-blue-400 mt-1">{order.notes}</p>
                          </div>
                        )}

                        {/* Order ID */}
                        <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                          Order ID: {order.id}
                        </p>
                      </div>
                    )}
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

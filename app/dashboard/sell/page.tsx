'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Plus, Package, DollarSign, Eye, Edit, Trash2, TrendingUp, Loader2, AlertCircle } from 'lucide-react'

interface MarketplaceListing {
  id: string
  productName: string
  variety: string | null
  category: string
  price: number
  unit: string
  quantity: number
  images: string[]
  status: string
  createdAt: string
  _count?: {
    orders: number
  }
}

interface SellerStats {
  totalListings: number
  activeListings: number
  totalRevenue: number
  totalOrders: number
  averageRating: number
  totalReviews: number
}

export default function SellDashboardPage() {
  const [listings, setListings] = useState<MarketplaceListing[]>([])
  const [stats, setStats] = useState<SellerStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<'overview' | 'products'>('overview')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch user's listings
      const listingsRes = await fetch('/api/marketplace/listings?mine=true')
      if (!listingsRes.ok) throw new Error('Failed to fetch listings')
      const listingsData = await listingsRes.json()
      setListings(listingsData)

      // Fetch seller stats
      const statsRes = await fetch('/api/marketplace/seller-stats')
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      } else {
        // Calculate basic stats from listings if endpoint doesn't exist
        const activeListings = listingsData.filter((l: MarketplaceListing) => l.status === 'ACTIVE')
        setStats({
          totalListings: listingsData.length,
          activeListings: activeListings.length,
          totalRevenue: 0,
          totalOrders: listingsData.reduce((sum: number, l: MarketplaceListing) => sum + (l._count?.orders || 0), 0),
          averageRating: 0,
          totalReviews: 0,
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return

    try {
      setDeleteLoading(listingId)
      const res = await fetch(`/api/marketplace/listings/${listingId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete listing')
      }

      // Remove from local state
      setListings(prev => prev.filter(l => l.id !== listingId))
      if (stats) {
        setStats({
          ...stats,
          totalListings: stats.totalListings - 1,
          activeListings: stats.activeListings - (listings.find(l => l.id === listingId)?.status === 'ACTIVE' ? 1 : 0),
        })
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete listing')
    } finally {
      setDeleteLoading(null)
    }
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return { label: 'Available', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' }
      case 'SOLD_OUT':
        return { label: 'Sold Out', className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' }
      case 'PAUSED':
        return { label: 'Paused', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' }
      default:
        return { label: status, className: 'bg-gray-100 text-gray-700' }
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading your listings...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error loading data</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Seller Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your marketplace listings and track sales</p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Listings</h3>
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.totalListings || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{stats?.activeListings || 0} active</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</h3>
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">${(stats?.totalRevenue || 0).toFixed(0)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">All time</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</h3>
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.totalOrders || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">All time</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Rating</h3>
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.averageRating ? stats.averageRating.toFixed(1) : '-'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {stats?.totalReviews || 0} reviews
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setView('overview')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  view === 'overview'
                    ? 'bg-green-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setView('products')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  view === 'products'
                    ? 'bg-green-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                My Products
              </button>
            </div>

            <div className="flex gap-3">
              <Link
                href="/dashboard/sell/orders"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Package className="h-4 w-4" />
                Manage Orders
              </Link>
              <Link
                href="/dashboard/sell/new"
                className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                List New Product
              </Link>
            </div>
          </div>

          {/* Overview View */}
          {view === 'overview' && (
            <div className="space-y-6">
              {/* Quick Links */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                  href="/dashboard/sell/orders"
                  className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                >
                  <Package className="h-8 w-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Order Fulfillment</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage and fulfill customer orders</p>
                </Link>

                <Link
                  href="/dashboard/disputes"
                  className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                >
                  <AlertCircle className="h-8 w-8 text-orange-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Disputes</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Handle customer disputes and issues</p>
                </Link>

                <Link
                  href="/dashboard/sell/new"
                  className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                >
                  <Plus className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">New Listing</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Create a new product listing</p>
                </Link>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-3">Seller Tips</h3>
                <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <li>• Add high-quality photos to increase sales by 40%</li>
                  <li>• Products with detailed descriptions get 3x more views</li>
                  <li>• Respond to inquiries within 24 hours for better ratings</li>
                  <li>• Offer multiple delivery methods to reach more buyers</li>
                </ul>
              </div>
            </div>
          )}

          {/* Products View */}
          {view === 'products' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700">
              {listings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {listings.map((listing) => {
                        const status = getStatusDisplay(listing.status)
                        return (
                          <tr key={listing.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                                  {listing.images[0] ? (
                                    <Image
                                      src={listing.images[0]}
                                      alt={listing.productName}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Package className="h-6 w-6 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">{listing.productName}</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {listing.variety && `${listing.variety} • `}{listing.category}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-semibold text-gray-900 dark:text-white">
                                ${listing.price.toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">per {listing.unit}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-gray-900 dark:text-white">
                                {listing.quantity} {listing.unit}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                                {status.label}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/marketplace/${listing.id}`}
                                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                  title="View"
                                >
                                  <Eye className="h-4 w-4" />
                                </Link>
                                <Link
                                  href={`/dashboard/sell/${listing.id}/edit`}
                                  className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="h-4 w-4" />
                                </Link>
                                <button
                                  onClick={() => handleDelete(listing.id)}
                                  disabled={deleteLoading === listing.id}
                                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                                  title="Delete"
                                >
                                  {deleteLoading === listing.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No products yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Start selling by creating your first product listing
                  </p>
                  <Link
                    href="/dashboard/sell/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    List New Product
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

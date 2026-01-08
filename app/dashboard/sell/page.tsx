'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SAMPLE_PRODUCTS } from '@/lib/marketplace-data'
import { Plus, Package, DollarSign, Eye, Edit, Trash2, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function SellDashboardPage() {
  // Filter products for current user (in this demo, show Sarah Chen's products)
  const myProducts = SAMPLE_PRODUCTS.filter((p) => p.sellerId === 'grower-1')

  const [view, setView] = useState<'overview' | 'products'>('overview')

  // Calculate stats
  const stats = {
    totalListings: myProducts.length,
    activeListings: myProducts.filter((p) => p.status === 'available').length,
    totalRevenue: myProducts.reduce((sum, p) => sum + p.price * (100 - p.quantity), 0), // Mock calculation
    totalViews: 1247, // Mock data
  }

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      alert(`Product ${productId} deleted (demo only)`)
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
            <p className="text-gray-600">Manage your marketplace listings and track sales</p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Listings</h3>
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalListings}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.activeListings} active</p>
            </div>

            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toFixed(0)}</p>
              <p className="text-xs text-green-600 mt-1">+12% this month</p>
            </div>

            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Views</h3>
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalViews}</p>
              <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
            </div>

            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Avg. Rating</h3>
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">4.9</p>
              <p className="text-xs text-gray-500 mt-1">From 47 reviews</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setView('overview')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  view === 'overview'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border hover:bg-gray-50'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setView('products')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  view === 'products'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border hover:bg-gray-50'
                }`}
              >
                My Products
              </button>
            </div>

            <Link
              href="/dashboard/sell/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              List New Product
            </Link>
          </div>

          {/* Overview View */}
          {view === 'overview' && (
            <div className="space-y-6">
              {/* Recent Activity */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        New order for Heritage Tomatoes
                      </p>
                      <p className="text-xs text-gray-600">2 hours ago</p>
                    </div>
                    <span className="text-sm font-semibold text-green-600">+$26.00</span>
                  </div>
                  <div className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Your listing "Tomato Seedlings" got 15 new views
                      </p>
                      <p className="text-xs text-gray-600">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        New 5-star review on Heritage Tomatoes
                      </p>
                      <p className="text-xs text-gray-600">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-3">💡 Seller Tips</h3>
                <ul className="space-y-2 text-sm text-blue-800">
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
            <div className="bg-white rounded-xl border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {myProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{product.title}</p>
                              <p className="text-sm text-gray-600">{product.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">
                            ${product.price.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-600">per {product.unit}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900">
                            {product.quantity} {product.unit}
                            {product.quantity > 1 ? 's' : ''}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                              product.status === 'available'
                                ? 'bg-green-100 text-green-700'
                                : product.status === 'low-stock'
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {product.status === 'available'
                              ? 'Available'
                              : product.status === 'low-stock'
                                ? 'Low Stock'
                                : 'Sold Out'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/marketplace/${product.id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <button
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {myProducts.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
                  <p className="text-gray-600 mb-6">
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

'use client'

import { useState, useEffect } from 'react'
import {
  Lightbulb,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  User,
  Calendar,
  Bug,
  Leaf,
  Clock,
} from 'lucide-react'

interface CommunityTip {
  id: string
  title: string
  content: string
  category: 'PLANTING_CALENDAR' | 'PEST_DISEASE' | 'COMPANION_PLANTING'
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  plantName: string | null
  usdaZone: string | null
  pestName: string | null
  treatment: string | null
  mainPlant: string | null
  companions: string[]
  avoid: string[]
  createdAt: string
  author: {
    id: string
    firstName: string
    lastName: string
    avatar: string | null
  }
}

export default function AdminCommunityTipsPage() {
  const [tips, setTips] = useState<CommunityTip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [selectedTip, setSelectedTip] = useState<CommunityTip | null>(null)
  const [processing, setProcessing] = useState(false)
  const [reviewNotes, setReviewNotes] = useState('')

  useEffect(() => {
    fetchTips()
  }, [statusFilter, categoryFilter])

  const fetchTips = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.set('status', statusFilter)
      if (categoryFilter) params.set('category', categoryFilter)
      params.set('limit', '100')

      const response = await fetch(`/api/community-tips?${params}`)

      if (!response.ok) {
        throw new Error('Failed to fetch tips')
      }

      const data = await response.json()
      setTips(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tips')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setProcessing(true)
    try {
      const response = await fetch(`/api/community-tips/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reviewNotes }),
      })

      if (!response.ok) {
        throw new Error('Failed to update tip')
      }

      // Refresh the list
      fetchTips()
      setSelectedTip(null)
      setReviewNotes('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update tip')
    } finally {
      setProcessing(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PLANTING_CALENDAR':
        return <Calendar className="h-5 w-5 text-emerald-600" />
      case 'PEST_DISEASE':
        return <Bug className="h-5 w-5 text-orange-600" />
      case 'COMPANION_PLANTING':
        return <Leaf className="h-5 w-5 text-green-600" />
      default:
        return <Lightbulb className="h-5 w-5 text-amber-600" />
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'PLANTING_CALENDAR':
        return 'Planting Calendar'
      case 'PEST_DISEASE':
        return 'Pest & Disease'
      case 'COMPANION_PLANTING':
        return 'Companion Planting'
      default:
        return category
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        )
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3" />
            Approved
          </span>
        )
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3" />
            Rejected
          </span>
        )
      default:
        return null
    }
  }

  const pendingCount = tips.filter(t => t.status === 'PENDING').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Community Tips</h1>
          <p className="text-gray-600 mt-1">Review and approve user-submitted gardening tips</p>
        </div>
        {statusFilter === 'PENDING' && pendingCount > 0 && (
          <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
            {pendingCount} pending review
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-gray-400" />

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-green-500"
            >
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Categories</option>
              <option value="PLANTING_CALENDAR">Planting Calendar</option>
              <option value="PEST_DISEASE">Pest & Disease</option>
              <option value="COMPANION_PLANTING">Companion Planting</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchTips}
            className="mt-2 text-red-600 hover:underline text-sm"
          >
            Try again
          </button>
        </div>
      )}

      {/* Tips List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : tips.length === 0 ? (
          <div className="text-center py-12">
            <Lightbulb className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Tips Found</h3>
            <p className="text-gray-500">
              {statusFilter === 'PENDING'
                ? 'No tips waiting for review'
                : `No ${statusFilter.toLowerCase()} tips`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tip
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tips.map((tip) => (
                  <tr key={tip.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="font-medium text-gray-900 truncate">{tip.title}</p>
                        <p className="text-sm text-gray-500 truncate">{tip.content}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(tip.category)}
                        <span className="text-sm text-gray-600">{getCategoryLabel(tip.category)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {tip.author.avatar ? (
                          <img
                            src={tip.author.avatar}
                            alt=""
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <User className="w-6 h-6 p-1 bg-gray-200 rounded-full text-gray-500" />
                        )}
                        <span className="text-sm text-gray-600">
                          {tip.author.firstName} {tip.author.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(tip.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(tip.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedTip(tip)}
                        className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedTip && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Review Tip</h2>
                <button
                  onClick={() => {
                    setSelectedTip(null)
                    setReviewNotes('')
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Category & Status */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                    {getCategoryIcon(selectedTip.category)}
                    <span className="text-sm font-medium">{getCategoryLabel(selectedTip.category)}</span>
                  </div>
                  {getStatusBadge(selectedTip.status)}
                </div>

                {/* Title & Content */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{selectedTip.title}</h3>
                  <p className="text-gray-700">{selectedTip.content}</p>
                </div>

                {/* Category-specific details */}
                {selectedTip.category === 'PLANTING_CALENDAR' && (selectedTip.plantName || selectedTip.usdaZone) && (
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-emerald-800 mb-2">Planting Details</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTip.plantName && (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-sm">
                          Plant: {selectedTip.plantName}
                        </span>
                      )}
                      {selectedTip.usdaZone && (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-sm">
                          Zone: {selectedTip.usdaZone}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {selectedTip.category === 'PEST_DISEASE' && (selectedTip.pestName || selectedTip.treatment) && (
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-orange-800 mb-2">Pest/Disease Details</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTip.pestName && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-sm">
                          Issue: {selectedTip.pestName}
                        </span>
                      )}
                      {selectedTip.treatment && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-sm">
                          Treatment: {selectedTip.treatment}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {selectedTip.category === 'COMPANION_PLANTING' && (selectedTip.mainPlant || selectedTip.companions?.length > 0 || selectedTip.avoid?.length > 0) && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-green-800 mb-2">Companion Details</h4>
                    {selectedTip.mainPlant && (
                      <p className="text-sm text-green-700 mb-2">
                        <strong>Main Plant:</strong> {selectedTip.mainPlant}
                      </p>
                    )}
                    {selectedTip.companions && selectedTip.companions.length > 0 && (
                      <p className="text-sm text-green-700 mb-1">
                        <strong>Good Companions:</strong> {selectedTip.companions.join(', ')}
                      </p>
                    )}
                    {selectedTip.avoid && selectedTip.avoid.length > 0 && (
                      <p className="text-sm text-red-700">
                        <strong>Avoid:</strong> {selectedTip.avoid.join(', ')}
                      </p>
                    )}
                  </div>
                )}

                {/* Author */}
                <div className="flex items-center gap-3 pt-2">
                  {selectedTip.author.avatar ? (
                    <img
                      src={selectedTip.author.avatar}
                      alt=""
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <User className="w-10 h-10 p-2 bg-gray-200 rounded-full text-gray-500" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {selectedTip.author.firstName} {selectedTip.author.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Submitted {new Date(selectedTip.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Review Notes */}
                {selectedTip.status === 'PENDING' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Review Notes (optional)
                    </label>
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Add notes about your decision..."
                      rows={2}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                {selectedTip.status === 'PENDING' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => handleAction(selectedTip.id, 'APPROVED')}
                      disabled={processing}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {processing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      Approve (+15 pts to user)
                    </button>
                    <button
                      onClick={() => handleAction(selectedTip.id, 'REJECTED')}
                      disabled={processing}
                      className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {processing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">How Community Tips Work</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>Users submit tips from the Planting Calendar, Pest & Disease, and Companion Planting pages</li>
          <li>Users earn 5 points when they submit a tip</li>
          <li>When you approve a tip, the user earns an additional 15 points</li>
          <li>Approved tips appear on the respective resource pages for all users to see</li>
          <li>Users can upvote helpful tips to surface the best content</li>
        </ul>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import {
  Flag,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  FileText,
  ShoppingBag,
  Wrench,
  Map,
  User,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  X
} from 'lucide-react'

interface FlaggedItem {
  id: string
  type: 'PLOT' | 'REVIEW' | 'MESSAGE' | 'LISTING' | 'TOOL' | 'FORUM_POST' | 'USER'
  reason: string
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED'
  details: string | null
  createdAt: string
  reportedBy: {
    id: string
    firstName: string
    lastName: string
    avatar: string | null
  }
  content: {
    id: string
    title?: string
    content?: string
    preview?: string
  }
  resolution: string | null
  actionTaken: string | null
}

export default function AdminModerationPage() {
  const [items, setItems] = useState<FlaggedItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [typeFilter, setTypeFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [selectedItem, setSelectedItem] = useState<FlaggedItem | null>(null)
  const [resolving, setResolving] = useState(false)

  useEffect(() => {
    fetchReports()
  }, [statusFilter, typeFilter, page])

  const fetchReports = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.set('status', statusFilter)
      if (typeFilter) params.set('type', typeFilter)
      params.set('page', page.toString())

      const response = await fetch(`/api/admin/reports?${params}`)

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('You do not have permission to view reports')
        }
        throw new Error('Failed to fetch reports')
      }

      const data = await response.json()
      setItems(data.reports)
      setTotalPages(data.totalPages)
      setTotal(data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reports')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResolve = async (id: string, status: 'RESOLVED' | 'DISMISSED', resolution?: string, actionTaken?: string) => {
    setResolving(true)
    try {
      const response = await fetch(`/api/admin/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, resolution, actionTaken }),
      })

      if (!response.ok) {
        throw new Error('Failed to update report')
      }

      // Refresh the list
      fetchReports()
      setSelectedItem(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update report')
    } finally {
      setResolving(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PLOT':
        return <Map className="h-5 w-5" />
      case 'REVIEW':
        return <FileText className="h-5 w-5" />
      case 'MESSAGE':
        return <MessageSquare className="h-5 w-5" />
      case 'LISTING':
        return <ShoppingBag className="h-5 w-5" />
      case 'TOOL':
        return <Wrench className="h-5 w-5" />
      case 'FORUM_POST':
        return <MessageSquare className="h-5 w-5" />
      case 'USER':
        return <User className="h-5 w-5" />
      default:
        return <Flag className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertTriangle className="h-3 w-3" />
            Pending
          </span>
        )
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3" />
            Resolved
          </span>
        )
      case 'DISMISSED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <XCircle className="h-3 w-3" />
            Dismissed
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Moderation</h1>
          <p className="text-gray-600 mt-1">Review and manage flagged content</p>
        </div>
        {total > 0 && (
          <div className="text-sm text-gray-500">
            {total} report{total !== 1 ? 's' : ''} total
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
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className="px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-green-500"
            >
              <option value="PENDING">Pending</option>
              <option value="RESOLVED">Resolved</option>
              <option value="DISMISSED">Dismissed</option>
              <option value="ALL">All</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value)
                setPage(1)
              }}
              className="px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Types</option>
              <option value="PLOT">Plots</option>
              <option value="REVIEW">Reviews</option>
              <option value="MESSAGE">Messages</option>
              <option value="LISTING">Marketplace Listings</option>
              <option value="TOOL">Tool Rentals</option>
              <option value="FORUM_POST">Forum Posts</option>
              <option value="USER">Users</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchReports}
            className="mt-2 text-red-600 hover:underline text-sm"
          >
            Try again
          </button>
        </div>
      )}

      {/* Content List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">All Clear!</h3>
            <p className="text-gray-500">No flagged content to review</p>
            <p className="text-sm text-gray-400 mt-4">
              When users report content, it will appear here for review.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Reported
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="max-w-xs truncate">
                          <p className="font-medium text-gray-900">
                            {item.content.title || 'Untitled'}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {item.content.preview || item.content.content}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-gray-600">
                          {getTypeIcon(item.type)}
                          <span className="capitalize">{item.type.toLowerCase().replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                        {item.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{new Date(item.createdAt).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-400">
                          by {item.reportedBy.firstName} {item.reportedBy.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedItem(item)}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Review Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Review Report</h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Report Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <span className="ml-2 font-medium capitalize">
                        {selectedItem.type.toLowerCase().replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Reason:</span>
                      <span className="ml-2 font-medium capitalize">{selectedItem.reason}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className="ml-2">{getStatusBadge(selectedItem.status)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Reported:</span>
                      <span className="ml-2">
                        {new Date(selectedItem.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Preview */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Reported Content</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium">{selectedItem.content.title || 'Untitled'}</p>
                    {selectedItem.content.content && (
                      <p className="mt-2 text-sm text-gray-600">{selectedItem.content.content}</p>
                    )}
                  </div>
                </div>

                {/* Reporter Details */}
                {selectedItem.details && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Details</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">{selectedItem.details}</p>
                    </div>
                  </div>
                )}

                {/* Reporter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Reported By</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {selectedItem.reportedBy.avatar ? (
                        <img
                          src={selectedItem.reportedBy.avatar}
                          alt=""
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {selectedItem.reportedBy.firstName} {selectedItem.reportedBy.lastName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedItem.status === 'PENDING' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => handleResolve(selectedItem.id, 'RESOLVED', 'Action taken by admin')}
                      disabled={resolving}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {resolving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      Resolve
                    </button>
                    <button
                      onClick={() => handleResolve(selectedItem.id, 'DISMISSED', 'No action needed')}
                      disabled={resolving}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {resolving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Resolution Info */}
                {selectedItem.status !== 'PENDING' && (
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Resolution</h3>
                    <div className="bg-gray-50 rounded-lg p-4 text-sm">
                      <p><span className="text-gray-500">Status:</span> {selectedItem.status}</p>
                      {selectedItem.resolution && (
                        <p><span className="text-gray-500">Notes:</span> {selectedItem.resolution}</p>
                      )}
                      {selectedItem.actionTaken && (
                        <p><span className="text-gray-500">Action:</span> {selectedItem.actionTaken}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">How Moderation Works</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>Users can report content using the flag button on plots, reviews, messages, etc.</li>
          <li>Reported content appears here for admin review</li>
          <li>You can resolve (take action) or dismiss (no action needed) reports</li>
          <li>Resolved items may result in content removal or user warnings</li>
        </ul>
      </div>
    </div>
  )
}

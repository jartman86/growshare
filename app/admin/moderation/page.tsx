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
  Filter
} from 'lucide-react'
import Image from 'next/image'

interface FlaggedItem {
  id: string
  type: 'PLOT' | 'REVIEW' | 'MESSAGE' | 'LISTING' | 'TOOL' | 'FORUM_POST'
  reason: string
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED'
  createdAt: string
  reportedBy: {
    id: string
    firstName: string
    lastName: string
  }
  content: {
    id: string
    title?: string
    content?: string
    preview?: string
  }
}

export default function AdminModerationPage() {
  const [items, setItems] = useState<FlaggedItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [typeFilter, setTypeFilter] = useState('')

  useEffect(() => {
    // In a real implementation, this would fetch from an API
    // For now, show a placeholder state
    setIsLoading(false)
  }, [statusFilter, typeFilter])

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
              <option value="RESOLVED">Resolved</option>
              <option value="DISMISSED">Dismissed</option>
              <option value="ALL">All</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Types</option>
              <option value="PLOT">Plots</option>
              <option value="REVIEW">Reviews</option>
              <option value="MESSAGE">Messages</option>
              <option value="LISTING">Marketplace Listings</option>
              <option value="TOOL">Tool Rentals</option>
              <option value="FORUM_POST">Forum Posts</option>
            </select>
          </div>
        </div>
      </div>

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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1">
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

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">How Moderation Works</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Users can report content using the flag button on plots, reviews, messages, etc.</li>
          <li>• Reported content appears here for admin review</li>
          <li>• You can resolve (take action) or dismiss (no action needed) reports</li>
          <li>• Resolved items may result in content removal or user warnings</li>
        </ul>
      </div>
    </div>
  )
}

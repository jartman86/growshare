'use client'

import { useState, useEffect } from 'react'
import {
  Shield,
  Phone,
  IdCard,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  User,
  Calendar,
  FileText,
  Loader2
} from 'lucide-react'
import Image from 'next/image'

interface VerificationUser {
  id: string
  firstName: string
  lastName: string
  email: string
  avatar: string | null
  createdAt: string
  isPhoneVerified: boolean
  isIdVerified: boolean
}

interface VerificationRequest {
  id: string
  userId: string
  type: 'PHONE' | 'ID' | 'ADDRESS'
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  documentUrl: string | null
  notes: string | null
  createdAt: string
  reviewedAt: string | null
  reviewedBy: string | null
  user: VerificationUser
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function AdminVerificationsPage() {
  const [requests, setRequests] = useState<VerificationRequest[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [typeFilter, setTypeFilter] = useState('')
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null)
  const [actionNotes, setActionNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [statusFilter, typeFilter])

  const fetchRequests = async (page = 1) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        status: statusFilter,
      })
      if (typeFilter) {
        params.set('type', typeFilter)
      }

      const response = await fetch(`/api/admin/verifications?${params}`)
      if (!response.ok) throw new Error('Failed to fetch')

      const data = await response.json()
      setRequests(data.requests)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching verification requests:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAction = async (requestId: string, action: 'APPROVE' | 'REJECT') => {
    setIsProcessing(true)
    try {
      const response = await fetch('/api/admin/verifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          action,
          notes: actionNotes || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to process')
      }

      // Refresh the list
      await fetchRequests(pagination?.page || 1)
      setSelectedRequest(null)
      setActionNotes('')
    } catch (error) {
      console.error('Error processing verification:', error)
      alert(error instanceof Error ? error.message : 'Failed to process verification')
    } finally {
      setIsProcessing(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PHONE':
        return <Phone className="h-5 w-5" />
      case 'ID':
        return <IdCard className="h-5 w-5" />
      default:
        return <Shield className="h-5 w-5" />
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verification Requests</h1>
          <p className="text-gray-600 mt-1">Review and process user verification requests</p>
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
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
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
              <option value="PHONE">Phone</option>
              <option value="ID">ID</option>
              <option value="ADDRESS">Address</option>
            </select>
          </div>

          {pagination && (
            <div className="ml-auto text-sm text-gray-600">
              {pagination.total} total requests
            </div>
          )}
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No verification requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Type
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
                {requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {request.user.avatar ? (
                          <Image
                            src={request.user.avatar}
                            alt=""
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {request.user.firstName} {request.user.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{request.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-600">
                        {getTypeIcon(request.type)}
                        <span className="capitalize">{request.type.toLowerCase()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
            <button
              onClick={() => fetchRequests(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchRequests(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Verification Request</h2>
                <button
                  onClick={() => {
                    setSelectedRequest(null)
                    setActionNotes('')
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="flex items-start gap-4">
                {selectedRequest.user.avatar ? (
                  <Image
                    src={selectedRequest.user.avatar}
                    alt=""
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-500" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedRequest.user.firstName} {selectedRequest.user.lastName}
                  </h3>
                  <p className="text-gray-600">{selectedRequest.user.email}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {new Date(selectedRequest.user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {selectedRequest.user.isPhoneVerified && (
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                        Phone Verified
                      </span>
                    )}
                    {selectedRequest.user.isIdVerified && (
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                        ID Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Request Type</span>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(selectedRequest.type)}
                    <span className="capitalize font-medium">{selectedRequest.type.toLowerCase()} Verification</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                  {getStatusBadge(selectedRequest.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Submitted</span>
                  <span>{new Date(selectedRequest.createdAt).toLocaleString()}</span>
                </div>
                {selectedRequest.reviewedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Reviewed</span>
                    <span>{new Date(selectedRequest.reviewedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Document Preview (for ID verification) */}
              {selectedRequest.type === 'ID' && selectedRequest.documentUrl && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Submitted Document
                  </h4>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <a
                      href={selectedRequest.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 underline text-sm"
                    >
                      View Document
                    </a>
                    <div className="mt-2">
                      <Image
                        src={selectedRequest.documentUrl}
                        alt="Verification document"
                        width={400}
                        height={300}
                        className="rounded-lg max-w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Previous Notes */}
              {selectedRequest.notes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedRequest.notes}</p>
                </div>
              )}

              {/* Action Section */}
              {selectedRequest.status === 'PENDING' && (
                <div className="border-t pt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Add Notes (Optional)</h4>
                  <textarea
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    placeholder="Add any notes about this decision..."
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleAction(selectedRequest.id, 'APPROVE')}
                      disabled={isProcessing}
                      className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          Approve
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleAction(selectedRequest.id, 'REJECT')}
                      disabled={isProcessing}
                      className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <XCircle className="h-5 w-5" />
                          Reject
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

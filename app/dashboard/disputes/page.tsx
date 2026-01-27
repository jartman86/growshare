'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Loader2,
  MessageSquare,
  Calendar,
  DollarSign,
  User,
  Filter,
  ArrowRight,
} from 'lucide-react'

interface Dispute {
  id: string
  reason: string
  description: string
  status: string
  resolution: string | null
  requestedAmount: number | null
  resolvedAmount: number | null
  createdAt: string
  resolvedAt: string | null
  userRole: 'filer' | 'owner' | 'renter'
  filedBy: {
    id: string
    firstName: string | null
    lastName: string | null
    avatar: string | null
  }
  otherParty: {
    id: string
    firstName: string | null
    lastName: string | null
    avatar: string | null
  }
  booking: {
    id: string
    startDate: string
    endDate: string
    totalAmount: number
    status: string
    plot: {
      id: string
      title: string
      images: string[]
    }
  }
  _count: {
    messages: number
  }
}

const REASON_LABELS: Record<string, string> = {
  PROPERTY_NOT_AS_DESCRIBED: 'Property not as described',
  ACCESS_ISSUES: 'Access issues',
  PAYMENT_DISPUTE: 'Payment dispute',
  EARLY_TERMINATION: 'Early termination',
  DAMAGE_CLAIM: 'Damage claim',
  SAFETY_CONCERN: 'Safety concern',
  COMMUNICATION_ISSUES: 'Communication issues',
  OTHER: 'Other',
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: typeof Clock }> = {
  OPEN: {
    label: 'Open',
    color: 'text-yellow-800 dark:text-yellow-300',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800',
    icon: Clock,
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    color: 'text-blue-800 dark:text-blue-300',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
    icon: FileText,
  },
  RESOLVED: {
    label: 'Resolved',
    color: 'text-green-800 dark:text-green-300',
    bgColor: 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800',
    icon: CheckCircle,
  },
  CLOSED: {
    label: 'Closed',
    color: 'text-gray-800 dark:text-gray-300',
    bgColor: 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600',
    icon: XCircle,
  },
}

const RESOLUTION_LABELS: Record<string, string> = {
  FULL_REFUND: 'Full Refund',
  PARTIAL_REFUND: 'Partial Refund',
  NO_REFUND: 'No Refund',
  DEPOSIT_RETURNED: 'Deposit Returned',
  DEPOSIT_FORFEITED: 'Deposit Forfeited',
  MUTUAL_AGREEMENT: 'Mutual Agreement',
  DISMISSED: 'Dismissed',
}

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  const fetchDisputes = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (roleFilter !== 'all') params.set('role', roleFilter)

      const response = await fetch(`/api/disputes?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch disputes')
      }
      const data = await response.json()
      setDisputes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [statusFilter, roleFilter])

  useEffect(() => {
    fetchDisputes()
  }, [fetchDisputes])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.OPEN
    const Icon = config.icon

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${config.bgColor} ${config.color}`}
      >
        <Icon className="h-4 w-4" />
        {config.label}
      </span>
    )
  }

  // Count disputes by status
  const statusCounts = disputes.reduce(
    (acc, d) => {
      acc[d.status] = (acc[d.status] || 0) + 1
      acc.total = (acc.total || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Disputes
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              View and manage disputes related to your bookings
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Disputes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {statusCounts.total || 0}
              </p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 p-4">
              <p className="text-sm text-yellow-600 dark:text-yellow-400">Open</p>
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                {statusCounts.OPEN || 0}
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-4">
              <p className="text-sm text-blue-600 dark:text-blue-400">Under Review</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {statusCounts.UNDER_REVIEW || 0}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 p-4">
              <p className="text-sm text-green-600 dark:text-green-400">Resolved</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {statusCounts.RESOLVED || 0}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Filters:
                </span>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="status-filter" className="text-sm text-gray-600 dark:text-gray-400">
                  Status:
                </label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="OPEN">Open</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="role-filter" className="text-sm text-gray-600 dark:text-gray-400">
                  Role:
                </label>
                <select
                  id="role-filter"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All</option>
                  <option value="filed">Filed by me</option>
                  <option value="received">Filed against me</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : disputes.length === 0 ? (
            /* Empty State */
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-12 text-center">
              <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No disputes found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {statusFilter !== 'all' || roleFilter !== 'all'
                  ? 'Try adjusting your filters to see more results.'
                  : "You don't have any disputes. Disputes can be filed from active or completed bookings."}
              </p>
              <Link
                href="/my-bookings"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                View My Bookings
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            /* Disputes List */
            <div className="space-y-4">
              {disputes.map((dispute) => (
                <div
                  key={dispute.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Plot Image */}
                      <div className="flex-shrink-0 hidden sm:block">
                        {dispute.booking.plot.images?.[0] ? (
                          <Image
                            src={dispute.booking.plot.images[0]}
                            alt={dispute.booking.plot.title}
                            width={80}
                            height={80}
                            className="rounded-lg object-cover w-20 h-20"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <FileText className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Main Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {dispute.booking.plot.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Dispute #{dispute.id.slice(-6).toUpperCase()}
                            </p>
                          </div>
                          {getStatusBadge(dispute.status)}
                        </div>

                        {/* Reason */}
                        <div className="mb-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md text-sm font-medium">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            {REASON_LABELS[dispute.reason] || dispute.reason}
                          </span>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 mb-1">Filed by</p>
                            <div className="flex items-center gap-2">
                              {dispute.filedBy.avatar ? (
                                <Image
                                  src={dispute.filedBy.avatar}
                                  alt=""
                                  width={20}
                                  height={20}
                                  className="rounded-full"
                                />
                              ) : (
                                <div className="w-5 h-5 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                  <User className="h-3 w-3 text-gray-500" />
                                </div>
                              )}
                              <span className="font-medium text-gray-900 dark:text-white">
                                {dispute.userRole === 'filer' ? 'You' : `${dispute.filedBy.firstName} ${dispute.filedBy.lastName}`}
                              </span>
                            </div>
                          </div>

                          <div>
                            <p className="text-gray-500 dark:text-gray-400 mb-1">
                              <Calendar className="h-3.5 w-3.5 inline mr-1" />
                              Filed on
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {formatDate(dispute.createdAt)}
                            </p>
                          </div>

                          {dispute.requestedAmount && (
                            <div>
                              <p className="text-gray-500 dark:text-gray-400 mb-1">
                                <DollarSign className="h-3.5 w-3.5 inline mr-1" />
                                Requested
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                ${dispute.requestedAmount.toFixed(2)}
                              </p>
                            </div>
                          )}

                          <div>
                            <p className="text-gray-500 dark:text-gray-400 mb-1">
                              <MessageSquare className="h-3.5 w-3.5 inline mr-1" />
                              Messages
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {dispute._count.messages}
                            </p>
                          </div>
                        </div>

                        {/* Resolution Info */}
                        {dispute.status === 'RESOLVED' && dispute.resolution && (
                          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <p className="text-sm font-medium text-green-800 dark:text-green-300">
                              Resolution: {RESOLUTION_LABELS[dispute.resolution] || dispute.resolution}
                              {dispute.resolvedAmount && (
                                <span className="ml-2">(${dispute.resolvedAmount.toFixed(2)})</span>
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-4 border-t dark:border-gray-700 flex justify-end gap-3">
                      <Link
                        href={`/bookings/${dispute.booking.id}/dispute`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        View Details
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

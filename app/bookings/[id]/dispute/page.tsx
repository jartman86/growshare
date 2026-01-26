'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  ArrowLeft,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Send,
  User,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
} from 'lucide-react'

interface DisputeMessage {
  id: string
  content: string
  attachments: string[]
  isInternal: boolean
  createdAt: string
  sender: {
    id: string
    firstName: string | null
    lastName: string | null
    avatar: string | null
  }
}

interface Dispute {
  id: string
  reason: string
  description: string
  evidence: string[]
  requestedAmount: number | null
  status: string
  resolution: string | null
  resolutionNotes: string | null
  resolvedAmount: number | null
  resolvedAt: string | null
  createdAt: string
  filedBy: {
    id: string
    firstName: string | null
    lastName: string | null
    avatar: string | null
  }
  resolvedBy: {
    id: string
    firstName: string | null
    lastName: string | null
  } | null
  messages: DisputeMessage[]
}

interface BookingInfo {
  id: string
  plotTitle: string
  startDate: string
  endDate: string
  totalAmount: number
  status: string
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

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  OPEN: {
    label: 'Open',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: FileText,
  },
  RESOLVED: {
    label: 'Resolved',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
  },
  CLOSED: {
    label: 'Closed',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: XCircle,
  },
}

const RESOLUTION_LABELS: Record<string, string> = {
  FULL_REFUND: 'Full Refund',
  PARTIAL_REFUND: 'Partial Refund',
  NO_REFUND: 'No Refund',
  DEPOSIT_RETURNED: 'Deposit Returned',
}

export default function DisputeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: bookingId } = use(params)
  const router = useRouter()
  const [dispute, setDispute] = useState<Dispute | null>(null)
  const [booking, setBooking] = useState<BookingInfo | null>(null)
  const [userRole, setUserRole] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchDispute()
  }, [bookingId])

  const fetchDispute = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/dispute`)
      if (response.ok) {
        const data = await response.json()
        setDispute(data.dispute)
        setBooking(data.booking)
        setUserRole(data.userRole)
      } else if (response.status === 404) {
        setError('No dispute found for this booking')
      } else {
        setError('Failed to load dispute')
      }
    } catch {
      setError('Failed to load dispute')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setSending(true)
    try {
      const response = await fetch(`/api/bookings/${bookingId}/dispute`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            content: message,
            attachments: [],
            isInternal: false,
          },
        }),
      })

      if (response.ok) {
        setMessage('')
        await fetchDispute()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to send message')
      }
    } catch {
      alert('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </main>
        <Footer />
      </>
    )
  }

  if (error || !dispute || !booking) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {error || 'Dispute not found'}
              </h1>
              <Link
                href="/my-bookings"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Back to My Bookings
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const statusConfig = STATUS_CONFIG[dispute.status] || STATUS_CONFIG.OPEN
  const StatusIcon = statusConfig.icon

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href="/my-bookings"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Bookings
          </Link>

          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 mb-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Dispute #{dispute.id.slice(-6).toUpperCase()}
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {booking.plotTitle}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${statusConfig.color}`}
              >
                <StatusIcon className="h-4 w-4" />
                {statusConfig.label}
              </span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Dispute Details */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Dispute Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Reason
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {REASON_LABELS[dispute.reason] || dispute.reason}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Description
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {dispute.description}
                    </p>
                  </div>

                  {dispute.requestedAmount && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Requested Amount
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        ${dispute.requestedAmount.toFixed(2)}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Filed by
                    </p>
                    <div className="flex items-center gap-2">
                      {dispute.filedBy.avatar ? (
                        <Image
                          src={dispute.filedBy.avatar}
                          alt=""
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 text-gray-500" />
                        </div>
                      )}
                      <span className="text-gray-900 dark:text-white">
                        {dispute.filedBy.firstName} {dispute.filedBy.lastName}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Filed on
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {formatDateTime(dispute.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Resolution (if resolved) */}
              {dispute.status === 'RESOLVED' && dispute.resolution && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 p-6">
                  <h2 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4">
                    Resolution
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-green-600 dark:text-green-400 mb-1">
                        Outcome
                      </p>
                      <p className="font-medium text-green-800 dark:text-green-300">
                        {RESOLUTION_LABELS[dispute.resolution] || dispute.resolution}
                      </p>
                    </div>
                    {dispute.resolvedAmount && (
                      <div>
                        <p className="text-sm text-green-600 dark:text-green-400 mb-1">
                          Amount
                        </p>
                        <p className="font-medium text-green-800 dark:text-green-300">
                          ${dispute.resolvedAmount.toFixed(2)}
                        </p>
                      </div>
                    )}
                    {dispute.resolutionNotes && (
                      <div>
                        <p className="text-sm text-green-600 dark:text-green-400 mb-1">
                          Notes
                        </p>
                        <p className="text-green-700 dark:text-green-300">
                          {dispute.resolutionNotes}
                        </p>
                      </div>
                    )}
                    {dispute.resolvedAt && (
                      <div>
                        <p className="text-sm text-green-600 dark:text-green-400 mb-1">
                          Resolved on
                        </p>
                        <p className="text-green-700 dark:text-green-300">
                          {formatDateTime(dispute.resolvedAt)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Messages ({dispute.messages.length})
                  </h2>
                </div>

                {/* Message List */}
                <div className="max-h-96 overflow-y-auto p-6 space-y-4">
                  {dispute.messages.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      No messages yet. Start the conversation below.
                    </p>
                  ) : (
                    dispute.messages.map((msg) => (
                      <div key={msg.id} className="flex gap-3">
                        {msg.sender.avatar ? (
                          <Image
                            src={msg.sender.avatar}
                            alt=""
                            width={36}
                            height={36}
                            className="rounded-full flex-shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-gray-500" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {msg.sender.firstName} {msg.sender.lastName}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDateTime(msg.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                {dispute.status !== 'RESOLVED' && dispute.status !== 'CLOSED' && (
                  <form
                    onSubmit={handleSendMessage}
                    className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                  >
                    <div className="flex gap-3">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        rows={2}
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      />
                      <button
                        type="submit"
                        disabled={sending || !message.trim()}
                        className="px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {sending ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Send className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Booking Info */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Booking Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Dates
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Total Amount
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          ${booking.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Booking Status
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {booking.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Help Box */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    Need Help?
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mb-4">
                    Our support team typically responds within 24-48 hours.
                  </p>
                  <Link
                    href="/help"
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Visit Help Center
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

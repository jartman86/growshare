'use client'

import { useState } from 'react'
import {
  X,
  AlertTriangle,
  Loader2,
  Upload,
  DollarSign,
} from 'lucide-react'

interface DisputeModalProps {
  bookingId: string
  plotTitle: string
  totalAmount: number
  onClose: () => void
  onSuccess: () => void
}

const DISPUTE_REASONS = [
  { value: 'PROPERTY_NOT_AS_DESCRIBED', label: 'Property not as described' },
  { value: 'ACCESS_ISSUES', label: 'Access issues' },
  { value: 'PAYMENT_DISPUTE', label: 'Payment dispute' },
  { value: 'EARLY_TERMINATION', label: 'Early termination' },
  { value: 'DAMAGE_CLAIM', label: 'Damage claim' },
  { value: 'SAFETY_CONCERN', label: 'Safety concern' },
  { value: 'COMMUNICATION_ISSUES', label: 'Communication issues' },
  { value: 'OTHER', label: 'Other' },
]

export function DisputeModal({
  bookingId,
  plotTitle,
  totalAmount,
  onClose,
  onSuccess,
}: DisputeModalProps) {
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [requestedAmount, setRequestedAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!reason) {
      setError('Please select a reason for the dispute')
      return
    }

    if (!description || description.length < 50) {
      setError('Please provide a detailed description (at least 50 characters)')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/bookings/${bookingId}/dispute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason,
          description,
          requestedAmount: requestedAmount ? parseFloat(requestedAmount) : null,
          evidence: [],
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to file dispute')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to file dispute')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                File a Dispute
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {plotTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reason for Dispute *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="">Select a reason...</option>
              {DISPUTE_REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Detailed Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Please describe the issue in detail. Include dates, what happened, and any attempts to resolve the issue directly..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              required
              minLength={50}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {description.length}/50 characters minimum
            </p>
          </div>

          {/* Requested Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Requested Refund Amount (Optional)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                max={totalAmount}
                step="0.01"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Booking total: ${totalAmount.toFixed(2)}
            </p>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-2">
              What happens next?
            </h4>
            <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
              <li>1. The other party will be notified of your dispute</li>
              <li>2. Both parties can add messages and evidence</li>
              <li>3. Our team will review and mediate if needed</li>
              <li>4. A resolution will be issued within 7 business days</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'File Dispute'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

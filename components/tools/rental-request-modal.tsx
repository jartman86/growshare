'use client'

import { useState } from 'react'
import { X, Calendar, DollarSign, Loader2 } from 'lucide-react'

interface RentalRequestModalProps {
  tool: {
    id: string
    name: string
    dailyRate: number | null
    weeklyRate: number | null
    depositRequired: number | null
  }
  onClose: () => void
  onSuccess: () => void
}

export function RentalRequestModal({ tool, onClose, onSuccess }: RentalRequestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState('')
  const [notes, setNotes] = useState('')

  // Calculate rental cost
  const calculateCost = () => {
    if (!startDate || !endDate || !tool.dailyRate) return { days: 0, cost: 0 }

    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    if (days <= 0) return { days: 0, cost: 0 }

    let cost: number
    if (days >= 7 && tool.weeklyRate) {
      const weeks = Math.floor(days / 7)
      const remainingDays = days % 7
      cost = (weeks * tool.weeklyRate) + (remainingDays * tool.dailyRate)
    } else {
      cost = days * tool.dailyRate
    }

    return { days, cost }
  }

  const { days, cost } = calculateCost()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/tool-rentals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: tool.id,
          startDate,
          endDate,
          notes: notes || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit rental request')
      }

      onSuccess()
      onClose()
    } catch {
      setError('An error occurred')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Request Rental</h2>
          <button
            onClick={onClose}
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Tool Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900">{tool.name}</h3>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
              <span>${tool.dailyRate?.toFixed(2)}/day</span>
              {tool.weeklyRate && (
                <span>${tool.weeklyRate.toFixed(2)}/week</span>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={today}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || today}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes for Owner
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Any special requests or questions..."
            />
          </div>

          {/* Cost Summary */}
          {days > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Rental Summary
              </h4>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Duration:</span>
                  <span>{days} day{days !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Rental Cost:</span>
                  <span>${cost.toFixed(2)}</span>
                </div>
                {tool.depositRequired && tool.depositRequired > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Refundable Deposit:</span>
                    <span>${tool.depositRequired.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-green-900 pt-2 border-t border-green-200">
                  <span>Total Due:</span>
                  <span>${(cost + (tool.depositRequired || 0)).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || days <= 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

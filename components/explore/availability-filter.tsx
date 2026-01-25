'use client'

import { useState } from 'react'
import { Calendar, X } from 'lucide-react'

interface AvailabilityFilterProps {
  availableFrom: string
  availableTo: string
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
}

export function AvailabilityFilter({
  availableFrom,
  availableTo,
  onFromChange,
  onToChange,
}: AvailabilityFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const hasSelection = availableFrom || availableTo

  const clearSelection = () => {
    onFromChange('')
    onToChange('')
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors border ${
          hasSelection
            ? 'border-green-500 bg-green-50 text-green-700'
            : 'border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        <Calendar className="h-4 w-4" />
        {hasSelection ? (
          <span>
            {availableFrom && availableTo
              ? `${new Date(availableFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(availableTo).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
              : availableFrom
                ? `From ${new Date(availableFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                : `Until ${new Date(availableTo).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
            }
          </span>
        ) : (
          <span>Availability</span>
        )}
        {hasSelection && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              clearSelection()
            }}
            className="ml-1 p-0.5 hover:bg-green-200 rounded"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-xl border z-50 p-4 w-72">
            <h4 className="font-medium text-gray-900 mb-3">
              Filter by availability
            </h4>
            <p className="text-sm text-gray-500 mb-4">
              Find plots available during your desired dates
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From
                </label>
                <input
                  type="date"
                  value={availableFrom}
                  onChange={(e) => onFromChange(e.target.value)}
                  min={today}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To
                </label>
                <input
                  type="date"
                  value={availableTo}
                  onChange={(e) => onToChange(e.target.value)}
                  min={availableFrom || today}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={clearSelection}
                className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-3 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

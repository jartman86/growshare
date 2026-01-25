'use client'

import { useState, useEffect } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Calendar,
  X,
  Plus,
} from 'lucide-react'

interface BookedDate {
  id: string
  startDate: string
  endDate: string
  status: string
}

interface BlockedDate {
  id: string
  startDate: string
  endDate: string
  reason: string | null
}

interface AvailabilityCalendarProps {
  plotId: string
  isOwner?: boolean
  selectedStart?: Date | null
  selectedEnd?: Date | null
  onDateSelect?: (start: Date | null, end: Date | null) => void
  onPriceCalculated?: (months: number, total: number) => void
  pricePerMonth?: number
  minimumLease?: number
}

export function AvailabilityCalendar({
  plotId,
  isOwner = false,
  selectedStart,
  selectedEnd,
  onDateSelect,
  onPriceCalculated,
  pricePerMonth = 0,
  minimumLease = 1,
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [bookedDates, setBookedDates] = useState<BookedDate[]>([])
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectingStart, setSelectingStart] = useState(true)
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [blockStart, setBlockStart] = useState('')
  const [blockEnd, setBlockEnd] = useState('')
  const [blockReason, setBlockReason] = useState('')
  const [blockLoading, setBlockLoading] = useState(false)

  useEffect(() => {
    fetchAvailability()
  }, [plotId, currentMonth])

  const fetchAvailability = async () => {
    try {
      const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
      const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 2, 0)

      const res = await fetch(
        `/api/plots/${plotId}/availability?start=${start.toISOString()}&end=${end.toISOString()}`
      )

      if (!res.ok) throw new Error('Failed to fetch')

      const data = await res.json()
      setBookedDates(data.bookings || [])
      setBlockedDates(data.blockedDates || [])
    } catch (error) {
      console.error('Error fetching availability:', error)
    } finally {
      setLoading(false)
    }
  }

  const isDateBooked = (date: Date) => {
    return bookedDates.some((booking) => {
      const start = new Date(booking.startDate)
      const end = new Date(booking.endDate)
      return date >= start && date <= end
    })
  }

  const isDateBlocked = (date: Date) => {
    return blockedDates.some((blocked) => {
      const start = new Date(blocked.startDate)
      const end = new Date(blocked.endDate)
      return date >= start && date <= end
    })
  }

  const isDateSelected = (date: Date) => {
    if (!selectedStart) return false
    if (!selectedEnd) return date.toDateString() === selectedStart.toDateString()
    return date >= selectedStart && date <= selectedEnd
  }

  const isDateInPast = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const handleDateClick = (date: Date) => {
    if (isDateBooked(date) || isDateBlocked(date) || isDateInPast(date)) {
      return
    }

    if (!onDateSelect) return

    if (selectingStart || !selectedStart) {
      onDateSelect(date, null)
      setSelectingStart(false)
    } else {
      if (date < selectedStart) {
        onDateSelect(date, null)
        setSelectingStart(false)
      } else {
        // Check if any dates in range are booked or blocked
        let current = new Date(selectedStart)
        while (current <= date) {
          if (isDateBooked(current) || isDateBlocked(current)) {
            // Can't select range with unavailable dates
            onDateSelect(date, null)
            setSelectingStart(false)
            return
          }
          current.setDate(current.getDate() + 1)
        }
        onDateSelect(selectedStart, date)
        setSelectingStart(true)

        // Calculate price
        if (onPriceCalculated && pricePerMonth > 0) {
          const diffTime = date.getTime() - selectedStart.getTime()
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
          const months = Math.ceil(diffDays / 30)
          onPriceCalculated(months, months * pricePerMonth)
        }
      }
    }
  }

  const handleBlockDates = async () => {
    if (!blockStart || !blockEnd) return

    setBlockLoading(true)
    try {
      const res = await fetch(`/api/plots/${plotId}/blocked-dates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: blockStart,
          endDate: blockEnd,
          reason: blockReason || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to block dates')
      }

      setShowBlockModal(false)
      setBlockStart('')
      setBlockEnd('')
      setBlockReason('')
      fetchAvailability()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to block dates')
    } finally {
      setBlockLoading(false)
    }
  }

  const handleUnblockDate = async (blockedDateId: string) => {
    try {
      const res = await fetch(
        `/api/plots/${plotId}/blocked-dates?id=${blockedDateId}`,
        { method: 'DELETE' }
      )

      if (!res.ok) throw new Error('Failed to unblock')
      fetchAvailability()
    } catch (error) {
      console.error('Error unblocking dates:', error)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    return { daysInMonth, startingDay }
  }

  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth)
    const days = []

    // Empty cells for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      )
      const booked = isDateBooked(date)
      const blocked = isDateBlocked(date)
      const selected = isDateSelected(date)
      const past = isDateInPast(date)
      const unavailable = booked || blocked || past

      let bgColor = 'bg-green-50 hover:bg-green-100 cursor-pointer'
      let textColor = 'text-gray-900'

      if (past) {
        bgColor = 'bg-gray-100'
        textColor = 'text-gray-400'
      } else if (booked) {
        bgColor = 'bg-red-100'
        textColor = 'text-red-800'
      } else if (blocked) {
        bgColor = 'bg-gray-200'
        textColor = 'text-gray-600'
      } else if (selected) {
        bgColor = 'bg-green-500'
        textColor = 'text-white'
      }

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          disabled={unavailable && !isOwner}
          className={`h-10 rounded-lg text-sm font-medium transition-colors ${bgColor} ${textColor} ${
            unavailable ? 'cursor-not-allowed' : ''
          }`}
          title={
            booked
              ? 'Booked'
              : blocked
              ? 'Blocked by owner'
              : past
              ? 'Past date'
              : 'Available'
          }
        >
          {day}
        </button>
      )
    }

    return days
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
            )
          }
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-semibold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
            )
          }
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 pt-4 border-t text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-50 border border-green-200 rounded" />
          <span className="text-gray-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border border-red-200 rounded" />
          <span className="text-gray-600">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded" />
          <span className="text-gray-600">Blocked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded" />
          <span className="text-gray-600">Selected</span>
        </div>
      </div>

      {/* Owner controls */}
      {isOwner && (
        <div className="pt-4 border-t space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Manage Blocked Dates</h4>
            <button
              onClick={() => setShowBlockModal(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              Block Dates
            </button>
          </div>

          {blockedDates.length > 0 && (
            <div className="space-y-2">
              {blockedDates.map((blocked) => (
                <div
                  key={blocked.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(blocked.startDate).toLocaleDateString()} -{' '}
                      {new Date(blocked.endDate).toLocaleDateString()}
                    </p>
                    {blocked.reason && (
                      <p className="text-xs text-gray-500">{blocked.reason}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleUnblockDate(blocked.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Remove block"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Block dates modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Block Date Range
              </h3>
              <button
                onClick={() => setShowBlockModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={blockStart}
                  onChange={(e) => setBlockStart(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={blockEnd}
                  onChange={(e) => setBlockEnd(e.target.value)}
                  min={blockStart || new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason (optional)
                </label>
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="e.g., Maintenance, Personal use"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowBlockModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBlockDates}
                  disabled={!blockStart || !blockEnd || blockLoading}
                  className="flex-1 px-4 py-2 text-white bg-gray-800 hover:bg-gray-900 rounded-lg transition-colors disabled:opacity-50"
                >
                  {blockLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                  ) : (
                    'Block Dates'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

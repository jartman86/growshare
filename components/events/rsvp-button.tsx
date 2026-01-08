'use client'

import { useState } from 'react'
import { Event } from '@/lib/events-data'
import { CheckCircle, Calendar } from 'lucide-react'

interface RSVPButtonProps {
  event: Event
  isPast: boolean
}

export function RSVPButton({ event, isPast }: RSVPButtonProps) {
  const [isRSVPed, setIsRSVPed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const spotsLeft = event.capacity ? event.capacity - event.attendees : null
  const isFull = spotsLeft !== null && spotsLeft <= 0

  const handleRSVP = async () => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsRSVPed(true)
    setIsSubmitting(false)

    // Show success message
    setTimeout(() => {
      const message = event.price === 0
        ? `✅ You're registered for "${event.title}"!\n\nCheck your email for event details and calendar invite.\n\nYou've earned 25 points!`
        : `✅ Registration confirmed!\n\n"${event.title}"\nTotal: $${event.price}\n\nCheck your email for payment details and event information.\n\nYou've earned 25 points!`
      alert(message)
    }, 100)
  }

  if (isPast) {
    return (
      <button
        disabled
        className="w-full px-6 py-4 bg-gray-100 text-gray-500 rounded-lg font-semibold cursor-not-allowed"
      >
        Event Has Ended
      </button>
    )
  }

  if (isFull) {
    return (
      <button
        disabled
        className="w-full px-6 py-4 bg-gray-100 text-gray-500 rounded-lg font-semibold cursor-not-allowed"
      >
        Event Full - Waitlist Available
      </button>
    )
  }

  if (isRSVPed) {
    return (
      <div className="space-y-3">
        <button
          disabled
          className="w-full px-6 py-4 bg-green-100 text-green-700 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-default"
        >
          <CheckCircle className="h-5 w-5" />
          You're Registered!
        </button>
        <button
          onClick={() => setIsRSVPed(false)}
          className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
        >
          Cancel Registration
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleRSVP}
      disabled={isSubmitting}
      className="w-full px-6 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {isSubmitting ? (
        <>Processing...</>
      ) : (
        <>
          <Calendar className="h-5 w-5" />
          {event.price === 0 ? 'RSVP for Free' : `Register - $${event.price}`}
        </>
      )}
    </button>
  )
}

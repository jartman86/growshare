'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Video,
  Users,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  ExternalLink,
  Download,
} from 'lucide-react'

interface Event {
  id: string
  title: string
  description: string | null
  type: string
  startTime: string
  endTime: string
  timezone: string
  meetingUrl: string | null
  maxAttendees: number | null
  isRegistered: boolean
  spotsLeft: number | null
  instructor: {
    id: string
    firstName: string | null
    lastName: string | null
    avatar: string | null
  }
  course: {
    id: string
    title: string
    slug: string | null
  } | null
  _count: {
    attendees: number
  }
}

const EVENT_TYPE_COLORS: Record<string, string> = {
  LIVE_SESSION: 'bg-blue-500',
  WEBINAR: 'bg-purple-500',
  QA_SESSION: 'bg-green-500',
  OFFICE_HOURS: 'bg-orange-500',
  COURSE_RELEASE: 'bg-pink-500',
  DEADLINE: 'bg-red-500',
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  LIVE_SESSION: 'Live Session',
  WEBINAR: 'Webinar',
  QA_SESSION: 'Q&A Session',
  OFFICE_HOURS: 'Office Hours',
  COURSE_RELEASE: 'Course Release',
  DEADLINE: 'Deadline',
}

export function CalendarView() {
  const router = useRouter()
  const { isSignedIn } = useUser()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [registering, setRegistering] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [currentDate])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const year = currentDate.getFullYear()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      const response = await fetch(`/api/events?month=${year}-${month}`)
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (eventId: string) => {
    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }

    setRegistering(true)
    try {
      const event = events.find(e => e.id === eventId)
      const isRegistered = event?.isRegistered

      const response = await fetch(`/api/events/${eventId}/register`, {
        method: isRegistered ? 'DELETE' : 'POST',
      })

      if (response.ok) {
        // Update local state
        setEvents(prev =>
          prev.map(e =>
            e.id === eventId
              ? {
                  ...e,
                  isRegistered: !isRegistered,
                  _count: {
                    ...e._count,
                    attendees: isRegistered
                      ? e._count.attendees - 1
                      : e._count.attendees + 1,
                  },
                  spotsLeft: e.spotsLeft !== null
                    ? isRegistered
                      ? e.spotsLeft + 1
                      : e.spotsLeft - 1
                    : null,
                }
              : e
          )
        )
        if (selectedEvent?.id === eventId) {
          setSelectedEvent(prev =>
            prev
              ? {
                  ...prev,
                  isRegistered: !isRegistered,
                  _count: {
                    ...prev._count,
                    attendees: isRegistered
                      ? prev._count.attendees - 1
                      : prev._count.attendees + 1,
                  },
                  spotsLeft: prev.spotsLeft !== null
                    ? isRegistered
                      ? prev.spotsLeft + 1
                      : prev.spotsLeft - 1
                    : null,
                }
              : null
          )
        }
      }
    } catch (error) {
      console.error('Error registering:', error)
    } finally {
      setRegistering(false)
    }
  }

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const today = new Date()
  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const blanks = Array.from({ length: firstDay }, (_, i) => i)

  // Group events by day
  const eventsByDay: Record<number, Event[]> = {}
  events.forEach(event => {
    const eventDate = new Date(event.startTime)
    if (
      eventDate.getMonth() === currentDate.getMonth() &&
      eventDate.getFullYear() === currentDate.getFullYear()
    ) {
      const day = eventDate.getDate()
      if (!eventsByDay[day]) eventsByDay[day] = []
      eventsByDay[day].push(event)
    }
  })

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  const getGoogleCalendarUrl = (event: Event) => {
    const startDate = new Date(event.startTime)
    const endDate = new Date(event.endTime)

    // Format: YYYYMMDDTHHMMSSZ
    const formatForGoogle = (d: Date) =>
      d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${formatForGoogle(startDate)}/${formatForGoogle(endDate)}`,
      details: event.description || '',
    })

    if (event.meetingUrl) {
      params.set('location', event.meetingUrl)
    }

    return `https://www.google.com/calendar/render?${params.toString()}`
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b dark:border-gray-700">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      ) : (
        <div className="grid grid-cols-7">
          {/* Blank days */}
          {blanks.map(i => (
            <div key={`blank-${i}`} className="min-h-24 border-r border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900" />
          ))}

          {/* Days with events */}
          {days.map(day => {
            const isToday =
              day === today.getDate() &&
              currentDate.getMonth() === today.getMonth() &&
              currentDate.getFullYear() === today.getFullYear()

            const dayEvents = eventsByDay[day] || []

            return (
              <div
                key={day}
                className={`min-h-24 border-r border-b dark:border-gray-700 p-1 ${
                  isToday ? 'bg-green-50 dark:bg-green-900/20' : ''
                }`}
              >
                <div
                  className={`text-sm font-medium mb-1 ${
                    isToday
                      ? 'text-green-700 dark:text-green-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {day}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className={`w-full text-left text-xs p-1 rounded truncate text-white ${
                        EVENT_TYPE_COLORS[event.type] || 'bg-gray-500'
                      } hover:opacity-80 transition-opacity`}
                    >
                      {formatTime(event.startTime)} {event.title}
                    </button>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 pl-1">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Legend */}
      <div className="p-4 border-t dark:border-gray-700 flex flex-wrap gap-3">
        {Object.entries(EVENT_TYPE_LABELS).map(([type, label]) => (
          <div key={type} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded ${EVENT_TYPE_COLORS[type]}`} />
            <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
          </div>
        ))}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Event type badge */}
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                    EVENT_TYPE_COLORS[selectedEvent.type] || 'bg-gray-500'
                  }`}
                >
                  {EVENT_TYPE_LABELS[selectedEvent.type] || selectedEvent.type}
                </span>
                {selectedEvent.isRegistered && (
                  <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
                    Registered
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedEvent.title}
              </h3>

              {/* Course link */}
              {selectedEvent.course && (
                <button
                  onClick={() => router.push(`/knowledge/${selectedEvent.course?.slug || selectedEvent.course?.id}`)}
                  className="text-sm text-green-600 dark:text-green-400 hover:underline mb-4 flex items-center gap-1"
                >
                  Part of: {selectedEvent.course.title}
                  <ExternalLink className="h-3 w-3" />
                </button>
              )}

              {/* Description */}
              {selectedEvent.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {selectedEvent.description}
                </p>
              )}

              {/* Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <CalendarIcon className="h-5 w-5" />
                  <span>{formatDate(selectedEvent.startTime)}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Clock className="h-5 w-5" />
                  <span>
                    {formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Users className="h-5 w-5" />
                  <span>
                    {selectedEvent._count.attendees} registered
                    {selectedEvent.maxAttendees && (
                      <> ({selectedEvent.spotsLeft} spots left)</>
                    )}
                  </span>
                </div>
                {selectedEvent.meetingUrl && selectedEvent.isRegistered && (
                  <a
                    href={selectedEvent.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Video className="h-5 w-5" />
                    <span>Join Meeting</span>
                  </a>
                )}
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                {selectedEvent.instructor.avatar ? (
                  <img
                    src={selectedEvent.instructor.avatar}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedEvent.instructor.firstName} {selectedEvent.instructor.lastName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Host</p>
                </div>
              </div>

              {/* Calendar Export */}
              <div className="flex gap-2 mb-6">
                <a
                  href={`/api/events/${selectedEvent.id}/ical`}
                  download
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download .ics
                </a>
                <a
                  href={getGoogleCalendarUrl(selectedEvent)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  <CalendarIcon className="h-4 w-4" />
                  Google Calendar
                </a>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {new Date(selectedEvent.startTime) > new Date() && (
                  <button
                    onClick={() => handleRegister(selectedEvent.id)}
                    disabled={registering || (selectedEvent.spotsLeft === 0 && !selectedEvent.isRegistered)}
                    className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
                      selectedEvent.isRegistered
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                        : selectedEvent.spotsLeft === 0
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {registering ? (
                      <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                    ) : selectedEvent.isRegistered ? (
                      'Cancel Registration'
                    ) : selectedEvent.spotsLeft === 0 ? (
                      'Event Full'
                    ) : (
                      'Register'
                    )}
                  </button>
                )}
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

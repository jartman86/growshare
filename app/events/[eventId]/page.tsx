'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { use } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  Loader2,
  CheckCircle,
  ExternalLink,
} from 'lucide-react'

interface CourseEvent {
  id: string
  title: string
  description: string | null
  type: string
  startTime: string
  endTime: string
  timezone: string
  meetingUrl: string | null
  maxAttendees: number | null
  instructor: {
    id: string
    firstName: string | null
    lastName: string | null
    avatar: string | null
  }
  course: {
    id: string
    title: string
  } | null
  _count: {
    attendees: number
  }
  isRegistered: boolean
  spotsLeft: number | null
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  LIVE_SESSION: 'Live Session',
  WEBINAR: 'Webinar',
  QA_SESSION: 'Q&A Session',
  OFFICE_HOURS: 'Office Hours',
  COURSE_RELEASE: 'Course Release',
  DEADLINE: 'Deadline',
}

const EVENT_TYPE_COLORS: Record<string, string> = {
  LIVE_SESSION: 'bg-blue-100 text-blue-700',
  WEBINAR: 'bg-purple-100 text-purple-700',
  QA_SESSION: 'bg-green-100 text-green-700',
  OFFICE_HOURS: 'bg-amber-100 text-amber-700',
  COURSE_RELEASE: 'bg-pink-100 text-pink-700',
  DEADLINE: 'bg-red-100 text-red-700',
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const { eventId } = use(params)
  const router = useRouter()
  const [event, setEvent] = useState<CourseEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvent()
  }, [eventId])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`)
      if (response.ok) {
        const data = await response.json()
        setEvent(data.event)
      } else if (response.status === 404) {
        setError('Event not found')
      } else {
        setError('Failed to load event')
      }
    } catch (err) {
      setError('Failed to load event')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    setRegistering(true)
    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
      })
      if (response.ok) {
        await fetchEvent()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to register')
      }
    } catch (err) {
      alert('Failed to register')
    } finally {
      setRegistering(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  const formatTime = (startStr: string, endStr: string) => {
    const start = new Date(startStr)
    const end = new Date(endStr)
    return `${start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </main>
        <Footer />
      </>
    )
  }

  if (error || !event) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Event not found'}
            </h1>
            <Link
              href="/events"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Back to Events
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const isPast = new Date(event.endTime) < new Date()

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-8">
                {/* Type Badge */}
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      EVENT_TYPE_COLORS[event.type] || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {EVENT_TYPE_LABELS[event.type] || event.type}
                  </span>
                  {event.meetingUrl && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      <Video className="h-4 w-4" />
                      Virtual
                    </div>
                  )}
                  {isPast && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                      Past Event
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  {event.title}
                </h1>

                {/* Instructor */}
                {event.instructor && (
                  <div className="flex items-center gap-3 pb-6 border-b dark:border-gray-700">
                    {event.instructor.avatar ? (
                      <Image
                        src={event.instructor.avatar}
                        alt=""
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Hosted by</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {event.instructor.firstName} {event.instructor.lastName}
                      </p>
                    </div>
                  </div>
                )}

                {/* Description */}
                {event.description && (
                  <div className="pt-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      About This Event
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {event.description}
                    </p>
                  </div>
                )}

                {/* Course Link */}
                {event.course && (
                  <div className="mt-6 pt-6 border-t dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Related Course
                    </p>
                    <Link
                      href={`/knowledge/${event.course.id}`}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      {event.course.title}
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Registration Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
                  <div className="text-center mb-6">
                    <p className="text-3xl font-bold text-green-600">FREE</p>
                  </div>

                  {event.isRegistered ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-2 px-4 py-3 bg-green-100 text-green-700 rounded-lg font-medium">
                        <CheckCircle className="h-5 w-5" />
                        You're Registered!
                      </div>
                      {event.meetingUrl && !isPast && (
                        <a
                          href={event.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Join Meeting
                        </a>
                      )}
                    </div>
                  ) : isPast ? (
                    <button
                      disabled
                      className="w-full px-4 py-3 bg-gray-100 text-gray-500 rounded-lg font-medium cursor-not-allowed"
                    >
                      Event Has Ended
                    </button>
                  ) : (
                    <button
                      onClick={handleRegister}
                      disabled={registering || (event.spotsLeft !== null && event.spotsLeft <= 0)}
                      className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {registering ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Registering...
                        </>
                      ) : event.spotsLeft !== null && event.spotsLeft <= 0 ? (
                        'Event Full'
                      ) : (
                        'Register for Free'
                      )}
                    </button>
                  )}

                  {/* Capacity Info */}
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Registered:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {event._count.attendees}
                        {event.maxAttendees && ` / ${event.maxAttendees}`}
                      </span>
                    </div>
                    {event.spotsLeft !== null && event.spotsLeft > 0 && event.spotsLeft <= 5 && (
                      <p className="mt-2 text-xs text-orange-600 font-medium">
                        Only {event.spotsLeft} {event.spotsLeft === 1 ? 'spot' : 'spots'} left!
                      </p>
                    )}
                  </div>
                </div>

                {/* Event Details */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Event Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatDate(event.startTime)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatTime(event.startTime, event.endTime)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {event.timezone}
                        </p>
                      </div>
                    </div>

                    {event.meetingUrl && (
                      <div className="flex items-start gap-3">
                        <Video className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Virtual Event
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Link available after registration
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {event._count.attendees} registered
                        </p>
                        {event.maxAttendees && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Capacity: {event.maxAttendees}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
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

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  DollarSign,
  Tag,
  ClipboardList,
  ShoppingBag,
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

interface CommunityEvent {
  id: string
  title: string
  description: string
  category: string
  image: string | null
  startDate: string
  endDate: string | null
  timezone: string
  location: string
  address: string
  city: string
  state: string
  latitude: number | null
  longitude: number | null
  isVirtual: boolean
  virtualLink: string | null
  capacity: number | null
  price: number
  tags: string[]
  requirements: string[]
  whatToBring: string[]
  organizer: {
    id: string
    firstName: string | null
    lastName: string | null
    avatar: string | null
    username: string | null
    bio: string | null
  }
  attendeeCount: number
  spotsLeft: number | null
  userRSVP: string | null
  recentAttendees: {
    id: string
    firstName: string | null
    lastName: string | null
    avatar: string | null
    username: string | null
  }[]
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

const COMMUNITY_CATEGORY_LABELS: Record<string, string> = {
  WORKSHOP: 'Workshop',
  SEED_SWAP: 'Seed Swap',
  FARMERS_MARKET: 'Farmers Market',
  VOLUNTEER_DAY: 'Volunteer Day',
  MEETUP: 'Meetup',
  TOUR: 'Tour',
  CLASS: 'Class',
  HARVEST_FESTIVAL: 'Harvest Festival',
  OTHER: 'Other',
}

const COMMUNITY_CATEGORY_COLORS: Record<string, string> = {
  WORKSHOP: 'bg-emerald-100 text-emerald-700',
  SEED_SWAP: 'bg-lime-100 text-lime-700',
  FARMERS_MARKET: 'bg-orange-100 text-orange-700',
  VOLUNTEER_DAY: 'bg-cyan-100 text-cyan-700',
  MEETUP: 'bg-indigo-100 text-indigo-700',
  TOUR: 'bg-violet-100 text-violet-700',
  CLASS: 'bg-blue-100 text-blue-700',
  HARVEST_FESTIVAL: 'bg-amber-100 text-amber-700',
  OTHER: 'bg-gray-100 text-gray-700',
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const { eventId } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const eventType = searchParams.get('type') || 'community'

  const [courseEvent, setCourseEvent] = useState<CourseEvent | null>(null)
  const [communityEvent, setCommunityEvent] = useState<CommunityEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvent()
  }, [eventId, eventType])

  const fetchEvent = async () => {
    setLoading(true)
    setError(null)

    try {
      if (eventType === 'course') {
        const response = await fetch(`/api/events/${eventId}`)
        if (response.ok) {
          const data = await response.json()
          setCourseEvent(data.event)
        } else if (response.status === 404) {
          setError('Event not found')
        } else {
          setError('Failed to load event')
        }
      } else {
        const response = await fetch(`/api/community-events/${eventId}`)
        if (response.ok) {
          const data = await response.json()
          setCommunityEvent(data)
        } else if (response.status === 404) {
          setError('Event not found')
        } else {
          setError('Failed to load event')
        }
      }
    } catch {
      setError('Failed to load event')
    } finally {
      setLoading(false)
    }
  }

  const handleCourseRegister = async () => {
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
    } catch {
      alert('Failed to register')
    } finally {
      setRegistering(false)
    }
  }

  const handleCommunityRSVP = async (status: 'GOING' | 'INTERESTED') => {
    setRegistering(true)
    try {
      const response = await fetch(`/api/community-events/${eventId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (response.ok) {
        await fetchEvent()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to RSVP')
      }
    } catch {
      alert('Failed to RSVP')
    } finally {
      setRegistering(false)
    }
  }

  const handleCancelRSVP = async () => {
    setRegistering(true)
    try {
      const response = await fetch(`/api/community-events/${eventId}/rsvp`, {
        method: 'DELETE',
      })
      if (response.ok) {
        await fetchEvent()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to cancel RSVP')
      }
    } catch {
      alert('Failed to cancel RSVP')
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

  const formatTime = (startStr: string, endStr?: string | null) => {
    const start = new Date(startStr)
    const startFormatted = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

    if (endStr) {
      const end = new Date(endStr)
      const endFormatted = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      return `${startFormatted} - ${endFormatted}`
    }

    return startFormatted
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

  if (error || (!courseEvent && !communityEvent)) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
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

  // Render Course Event
  if (eventType === 'course' && courseEvent) {
    const isPast = new Date(courseEvent.endTime) < new Date()

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
                        EVENT_TYPE_COLORS[courseEvent.type] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {EVENT_TYPE_LABELS[courseEvent.type] || courseEvent.type}
                    </span>
                    {courseEvent.meetingUrl && (
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
                    {courseEvent.title}
                  </h1>

                  {/* Instructor */}
                  {courseEvent.instructor && (
                    <div className="flex items-center gap-3 pb-6 border-b dark:border-gray-700">
                      {courseEvent.instructor.avatar ? (
                        <Image
                          src={courseEvent.instructor.avatar}
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
                          {courseEvent.instructor.firstName} {courseEvent.instructor.lastName}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {courseEvent.description && (
                    <div className="pt-6">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        About This Event
                      </h2>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {courseEvent.description}
                      </p>
                    </div>
                  )}

                  {/* Course Link */}
                  {courseEvent.course && (
                    <div className="mt-6 pt-6 border-t dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Related Course
                      </p>
                      <Link
                        href={`/knowledge/${courseEvent.course.id}`}
                        className="text-green-600 hover:text-green-700 font-medium"
                      >
                        {courseEvent.course.title}
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

                    {courseEvent.isRegistered ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2 px-4 py-3 bg-green-100 text-green-700 rounded-lg font-medium">
                          <CheckCircle className="h-5 w-5" />
                          You&apos;re Registered!
                        </div>
                        {courseEvent.meetingUrl && !isPast && (
                          <a
                            href={courseEvent.meetingUrl}
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
                        onClick={handleCourseRegister}
                        disabled={registering || (courseEvent.spotsLeft !== null && courseEvent.spotsLeft <= 0)}
                        className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {registering ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Registering...
                          </>
                        ) : courseEvent.spotsLeft !== null && courseEvent.spotsLeft <= 0 ? (
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
                          {courseEvent._count.attendees}
                          {courseEvent.maxAttendees && ` / ${courseEvent.maxAttendees}`}
                        </span>
                      </div>
                      {courseEvent.spotsLeft !== null && courseEvent.spotsLeft > 0 && courseEvent.spotsLeft <= 5 && (
                        <p className="mt-2 text-xs text-orange-600 font-medium">
                          Only {courseEvent.spotsLeft} {courseEvent.spotsLeft === 1 ? 'spot' : 'spots'} left!
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
                            {formatDate(courseEvent.startTime)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formatTime(courseEvent.startTime, courseEvent.endTime)}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {courseEvent.timezone}
                          </p>
                        </div>
                      </div>

                      {courseEvent.meetingUrl && (
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
                            {courseEvent._count.attendees} registered
                          </p>
                          {courseEvent.maxAttendees && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Capacity: {courseEvent.maxAttendees}
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

  // Render Community Event
  if (communityEvent) {
    const isPast = new Date(communityEvent.startDate) < new Date()

    return (
      <>
        <Header />

        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Hero Image */}
          {communityEvent.image && (
            <div className="relative h-64 md:h-80 w-full">
              <Image
                src={communityEvent.image}
                alt={communityEvent.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}

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
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-8">
                  {/* Category Badge */}
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        COMMUNITY_CATEGORY_COLORS[communityEvent.category] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {COMMUNITY_CATEGORY_LABELS[communityEvent.category] || communityEvent.category}
                    </span>
                    {communityEvent.isVirtual && (
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
                    {communityEvent.title}
                  </h1>

                  {/* Organizer */}
                  <div className="flex items-center gap-3 pb-6 border-b dark:border-gray-700">
                    {communityEvent.organizer.avatar ? (
                      <Image
                        src={communityEvent.organizer.avatar}
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
                        {communityEvent.organizer.firstName} {communityEvent.organizer.lastName}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="pt-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      About This Event
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {communityEvent.description}
                    </p>
                  </div>

                  {/* Tags */}
                  {communityEvent.tags.length > 0 && (
                    <div className="mt-6 pt-6 border-t dark:border-gray-700">
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="h-5 w-5 text-gray-400" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Tags</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {communityEvent.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Requirements */}
                {communityEvent.requirements.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <ClipboardList className="h-5 w-5 text-gray-400" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">Requirements</h3>
                    </div>
                    <ul className="space-y-2">
                      {communityEvent.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                          <span className="text-green-600 mt-1">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* What to Bring */}
                {communityEvent.whatToBring.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <ShoppingBag className="h-5 w-5 text-gray-400" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">What to Bring</h3>
                    </div>
                    <ul className="space-y-2">
                      {communityEvent.whatToBring.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                          <span className="text-green-600 mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recent Attendees */}
                {communityEvent.recentAttendees && communityEvent.recentAttendees.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Who&apos;s Going ({communityEvent.attendeeCount})
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {communityEvent.recentAttendees.map((attendee) => (
                        <div key={attendee.id} className="flex items-center gap-2">
                          {attendee.avatar ? (
                            <Image
                              src={attendee.avatar}
                              alt=""
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-green-600">
                                {attendee.firstName?.[0] || '?'}
                              </span>
                            </div>
                          )}
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {attendee.firstName}
                          </span>
                        </div>
                      ))}
                      {communityEvent.attendeeCount > communityEvent.recentAttendees.length && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 self-center">
                          +{communityEvent.attendeeCount - communityEvent.recentAttendees.length} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* RSVP Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
                    <div className="text-center mb-6">
                      <p className="text-3xl font-bold text-green-600">
                        {communityEvent.price > 0 ? `$${communityEvent.price}` : 'FREE'}
                      </p>
                    </div>

                    {communityEvent.userRSVP === 'GOING' ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2 px-4 py-3 bg-green-100 text-green-700 rounded-lg font-medium">
                          <CheckCircle className="h-5 w-5" />
                          You&apos;re Going!
                        </div>
                        {communityEvent.isVirtual && communityEvent.virtualLink && !isPast && (
                          <a
                            href={communityEvent.virtualLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Join Virtual Event
                          </a>
                        )}
                        <button
                          onClick={handleCancelRSVP}
                          disabled={registering}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                          {registering ? 'Cancelling...' : 'Cancel RSVP'}
                        </button>
                      </div>
                    ) : communityEvent.userRSVP === 'INTERESTED' ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-100 text-blue-700 rounded-lg font-medium">
                          <CheckCircle className="h-5 w-5" />
                          You&apos;re Interested
                        </div>
                        <button
                          onClick={() => handleCommunityRSVP('GOING')}
                          disabled={registering || (communityEvent.spotsLeft !== null && communityEvent.spotsLeft <= 0)}
                          className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                          {registering ? 'Updating...' : 'Change to Going'}
                        </button>
                        <button
                          onClick={handleCancelRSVP}
                          disabled={registering}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                          {registering ? 'Cancelling...' : 'Remove Interest'}
                        </button>
                      </div>
                    ) : isPast ? (
                      <button
                        disabled
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg font-medium cursor-not-allowed"
                      >
                        Event Has Ended
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <button
                          onClick={() => handleCommunityRSVP('GOING')}
                          disabled={registering || (communityEvent.spotsLeft !== null && communityEvent.spotsLeft <= 0)}
                          className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {registering ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : communityEvent.spotsLeft !== null && communityEvent.spotsLeft <= 0 ? (
                            'Event Full'
                          ) : (
                            "I'm Going"
                          )}
                        </button>
                        <button
                          onClick={() => handleCommunityRSVP('INTERESTED')}
                          disabled={registering}
                          className="w-full px-4 py-3 border border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                          Interested
                        </button>
                      </div>
                    )}

                    {/* Capacity Info */}
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Going:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {communityEvent.attendeeCount}
                          {communityEvent.capacity && ` / ${communityEvent.capacity}`}
                        </span>
                      </div>
                      {communityEvent.spotsLeft !== null && communityEvent.spotsLeft > 0 && communityEvent.spotsLeft <= 5 && (
                        <p className="mt-2 text-xs text-orange-600 font-medium">
                          Only {communityEvent.spotsLeft} {communityEvent.spotsLeft === 1 ? 'spot' : 'spots'} left!
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
                            {formatDate(communityEvent.startDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formatTime(communityEvent.startDate, communityEvent.endDate)}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {communityEvent.timezone}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {communityEvent.location}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {communityEvent.address}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {communityEvent.city}, {communityEvent.state}
                          </p>
                        </div>
                      </div>

                      {communityEvent.isVirtual && (
                        <div className="flex items-start gap-3">
                          <Video className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Virtual Event
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {communityEvent.userRSVP ? 'Link available above' : 'Link available after RSVP'}
                            </p>
                          </div>
                        </div>
                      )}

                      {communityEvent.price > 0 && (
                        <div className="flex items-start gap-3">
                          <DollarSign className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              ${communityEvent.price}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Entry fee
                            </p>
                          </div>
                        </div>
                      )}
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

  return null
}

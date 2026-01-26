'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CommunitySidebar } from '@/components/community/community-sidebar'
import {
  Calendar,
  Search,
  Plus,
  DollarSign,
  Users,
  Star,
  X,
  Loader2,
  LayoutGrid,
  CalendarDays,
  Video,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Sprout,
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
  isVirtual: boolean
  virtualLink: string | null
  capacity: number | null
  price: number
  tags: string[]
  organizer: {
    id: string
    firstName: string | null
    lastName: string | null
    avatar: string | null
    username: string | null
  }
  attendeeCount: number
  spotsLeft: number | null
  userRSVP: string | null
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
  LIVE_SESSION: 'bg-blue-100 text-blue-700 border-blue-200',
  WEBINAR: 'bg-purple-100 text-purple-700 border-purple-200',
  QA_SESSION: 'bg-green-100 text-green-700 border-green-200',
  OFFICE_HOURS: 'bg-amber-100 text-amber-700 border-amber-200',
  COURSE_RELEASE: 'bg-pink-100 text-pink-700 border-pink-200',
  DEADLINE: 'bg-red-100 text-red-700 border-red-200',
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
  WORKSHOP: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  SEED_SWAP: 'bg-lime-100 text-lime-700 border-lime-200',
  FARMERS_MARKET: 'bg-orange-100 text-orange-700 border-orange-200',
  VOLUNTEER_DAY: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  MEETUP: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  TOUR: 'bg-violet-100 text-violet-700 border-violet-200',
  CLASS: 'bg-blue-100 text-blue-700 border-blue-200',
  HARVEST_FESTIVAL: 'bg-amber-100 text-amber-700 border-amber-200',
  OTHER: 'bg-gray-100 text-gray-700 border-gray-200',
}

export default function EventsPage() {
  const [eventTab, setEventTab] = useState<'community' | 'course'>('community')
  const [courseEvents, setCourseEvents] = useState<CourseEvent[]>([])
  const [communityEvents, setCommunityEvents] = useState<CommunityEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('All')
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid')
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const [courseRes, communityRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/community-events?upcoming=true'),
      ])

      if (courseRes.ok) {
        const data = await courseRes.json()
        setCourseEvents(data.events || [])
      }

      if (communityRes.ok) {
        const data = await communityRes.json()
        setCommunityEvents(data || [])
      }
    } catch {
      // Error silently handled
    } finally {
      setLoading(false)
    }
  }

  const courseEventTypes = ['All', 'LIVE_SESSION', 'WEBINAR', 'QA_SESSION', 'OFFICE_HOURS']
  const communityCategories = ['All', 'WORKSHOP', 'SEED_SWAP', 'FARMERS_MARKET', 'VOLUNTEER_DAY', 'MEETUP', 'TOUR']

  const filteredCourseEvents = courseEvents.filter((event) => {
    const matchesSearch =
      searchQuery === '' ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)

    const matchesType = selectedType === 'All' || event.type === selectedType

    return matchesSearch && matchesType
  })

  const filteredCommunityEvents = communityEvents.filter((event) => {
    const matchesSearch =
      searchQuery === '' ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = selectedType === 'All' || event.category === selectedType

    return matchesSearch && matchesType
  })

  const hasActiveFilters = selectedType !== 'All' || searchQuery !== ''

  const clearFilters = () => {
    setSelectedType('All')
    setSearchQuery('')
  }

  const handleTabChange = (tab: 'community' | 'course') => {
    setEventTab(tab)
    setSelectedType('All')
    setSearchQuery('')
  }

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days: (number | null)[] = []
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }

  const getEventsForDay = (day: number) => {
    if (eventTab === 'course') {
      return filteredCourseEvents.filter((event) => {
        const eventDate = new Date(event.startTime)
        return (
          eventDate.getDate() === day &&
          eventDate.getMonth() === currentMonth.getMonth() &&
          eventDate.getFullYear() === currentMonth.getFullYear()
        )
      })
    } else {
      return filteredCommunityEvents.filter((event) => {
        const eventDate = new Date(event.startDate)
        return (
          eventDate.getDate() === day &&
          eventDate.getMonth() === currentMonth.getMonth() &&
          eventDate.getFullYear() === currentMonth.getFullYear()
        )
      })
    }
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const formatEventTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    return `${start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
  }

  const formatEventDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <>
      <Header />

      <main className="min-h-screen topo-lines">
        {/* Hero Section */}
        <div className="text-white relative overflow-hidden h-[300px]">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60 z-10"></div>
          <Image
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&q=80"
            alt="Community gathering"
            fill
            className="object-cover"
          />
          <div className="relative z-20 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="text-center w-full">
              <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
                <Calendar className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">Events & Live Sessions</h1>
              <p className="text-xl text-[#f4e4c1] max-w-2xl mx-auto drop-shadow-md font-medium">
                Join live workshops, Q&A sessions, and webinars from our instructors
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <CommunitySidebar />

              {/* Create Event Button */}
              <Link
                href={eventTab === 'community' ? '/events/new' : '/instructor/events'}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6ba03f] to-[#4a7c2c] text-white rounded-lg font-semibold hover:from-[#4a7c2c] hover:to-[#2d5016] transition-all shadow-lg hover:shadow-xl"
              >
                <Plus className="h-5 w-5" />
                {eventTab === 'community' ? 'Create Community Event' : 'Create Course Event'}
              </Link>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Event Type Tabs */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 dark:border-gray-700 p-2 mb-6 shadow-md">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleTabChange('community')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                      eventTab === 'community'
                        ? 'bg-gradient-to-r from-[#6ba03f] to-[#4a7c2c] text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Sprout className="h-5 w-5" />
                    Community Events
                    {communityEvents.length > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        eventTab === 'community' ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'
                      }`}>
                        {communityEvents.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => handleTabChange('course')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                      eventTab === 'course'
                        ? 'bg-gradient-to-r from-[#6ba03f] to-[#4a7c2c] text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <GraduationCap className="h-5 w-5" />
                    Course Events
                    {courseEvents.length > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        eventTab === 'course' ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'
                      }`}>
                        {courseEvents.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Search & Filters */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 dark:border-gray-700 p-6 mb-6 shadow-md">
                {/* Search Bar & View Toggle */}
                <div className="flex gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-[#8bc34a]/30 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  {/* View Toggle */}
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-white dark:bg-gray-600 text-green-700 dark:text-green-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <LayoutGrid className="h-4 w-4" />
                      <span className="hidden sm:inline">Grid</span>
                    </button>
                    <button
                      onClick={() => setViewMode('calendar')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                        viewMode === 'calendar'
                          ? 'bg-white dark:bg-gray-600 text-green-700 dark:text-green-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <CalendarDays className="h-4 w-4" />
                      <span className="hidden sm:inline">Calendar</span>
                    </button>
                  </div>
                </div>

                {/* Type Filters */}
                <div className="flex flex-wrap gap-2">
                  {(eventTab === 'course' ? courseEventTypes : communityCategories).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${
                        selectedType === type
                          ? 'bg-gradient-to-r from-[#6ba03f] to-[#4a7c2c] text-white shadow-md'
                          : 'bg-[#aed581]/20 dark:bg-gray-700 text-[#4a3f35] dark:text-gray-300 hover:bg-[#aed581]/40 dark:hover:bg-gray-600 border border-[#8bc34a]/30 dark:border-gray-600'
                      }`}
                    >
                      {type === 'All'
                        ? 'All Events'
                        : eventTab === 'course'
                          ? (EVENT_TYPE_LABELS[type] || type)
                          : (COMMUNITY_CATEGORY_LABELS[type] || type)}
                    </button>
                  ))}

                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="ml-auto flex items-center gap-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      <X className="h-4 w-4" />
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                </div>
              )}

              {/* Grid View */}
              {!loading && viewMode === 'grid' && eventTab === 'course' && (
                <>
                  {filteredCourseEvents.length > 0 ? (
                    <>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {filteredCourseEvents.length} event{filteredCourseEvents.length !== 1 ? 's' : ''} found
                      </p>
                      <div className="grid gap-6 md:grid-cols-2">
                        {filteredCourseEvents.map((event) => (
                          <div
                            key={event.id}
                            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                          >
                            <div className="p-6">
                              <div className="flex items-start justify-between mb-3">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                    EVENT_TYPE_COLORS[event.type] || 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {EVENT_TYPE_LABELS[event.type] || event.type}
                                </span>
                                {event.meetingUrl && (
                                  <Video className="h-5 w-5 text-blue-600" />
                                )}
                              </div>

                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {event.title}
                              </h3>

                              {event.description && (
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                  {event.description}
                                </p>
                              )}

                              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                <div className="flex items-center gap-2">
                                  <CalendarDays className="h-4 w-4" />
                                  {formatEventDate(event.startTime)}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  {formatEventTime(event.startTime, event.endTime)}
                                </div>
                                {event.instructor && (
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    {event.instructor.firstName} {event.instructor.lastName}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {event._count.attendees} registered
                                  {event.spotsLeft !== null && (
                                    <span className="ml-1">
                                      ({event.spotsLeft} spots left)
                                    </span>
                                  )}
                                </div>
                                <Link
                                  href={`/events/${event.id}?type=course`}
                                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                  {event.isRegistered ? 'View Details' : 'Register'}
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 dark:border-gray-700 p-12 text-center shadow-md">
                      <GraduationCap className="h-12 w-12 text-[#4a7c2c] dark:text-green-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-[#2d5016] dark:text-white mb-2">No course events found</h3>
                      <p className="text-[#4a3f35] dark:text-gray-400 mb-6">
                        {hasActiveFilters
                          ? 'Try adjusting your filters'
                          : 'No upcoming course events scheduled yet'}
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6ba03f] to-[#4a7c2c] text-white rounded-lg font-semibold hover:from-[#4a7c2c] hover:to-[#2d5016] transition-all shadow-lg hover:shadow-xl"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Community Events Grid View */}
              {!loading && viewMode === 'grid' && eventTab === 'community' && (
                <>
                  {filteredCommunityEvents.length > 0 ? (
                    <>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {filteredCommunityEvents.length} event{filteredCommunityEvents.length !== 1 ? 's' : ''} found
                      </p>
                      <div className="grid gap-6 md:grid-cols-2">
                        {filteredCommunityEvents.map((event) => (
                          <div
                            key={event.id}
                            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                          >
                            {event.image && (
                              <div className="relative h-40 w-full">
                                <Image
                                  src={event.image}
                                  alt={event.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="p-6">
                              <div className="flex items-start justify-between mb-3">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                    COMMUNITY_CATEGORY_COLORS[event.category] || 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {COMMUNITY_CATEGORY_LABELS[event.category] || event.category}
                                </span>
                                <div className="flex items-center gap-2">
                                  {event.isVirtual && (
                                    <Video className="h-5 w-5 text-blue-600" />
                                  )}
                                  {event.price > 0 && (
                                    <span className="text-sm font-semibold text-green-600">
                                      ${event.price}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {event.title}
                              </h3>

                              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                {event.description}
                              </p>

                              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                <div className="flex items-center gap-2">
                                  <CalendarDays className="h-4 w-4" />
                                  {formatEventDate(event.startDate)}
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  {event.city}, {event.state}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  {event.organizer.firstName} {event.organizer.lastName}
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {event.attendeeCount} going
                                  {event.spotsLeft !== null && (
                                    <span className="ml-1">
                                      ({event.spotsLeft} spots left)
                                    </span>
                                  )}
                                </div>
                                <Link
                                  href={`/events/${event.id}?type=community`}
                                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                  {event.userRSVP === 'GOING' ? 'View Details' : 'RSVP'}
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 dark:border-gray-700 p-12 text-center shadow-md">
                      <Sprout className="h-12 w-12 text-[#4a7c2c] dark:text-green-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-[#2d5016] dark:text-white mb-2">No community events found</h3>
                      <p className="text-[#4a3f35] dark:text-gray-400 mb-6">
                        {hasActiveFilters
                          ? 'Try adjusting your filters'
                          : 'No upcoming community events scheduled yet'}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        {hasActiveFilters && (
                          <button
                            onClick={clearFilters}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                          >
                            Clear Filters
                          </button>
                        )}
                        <Link
                          href="/events/new"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6ba03f] to-[#4a7c2c] text-white rounded-lg font-semibold hover:from-[#4a7c2c] hover:to-[#2d5016] transition-all shadow-lg hover:shadow-xl"
                        >
                          <Plus className="h-5 w-5" />
                          Create Event
                        </Link>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Calendar View */}
              {!loading && viewMode === 'calendar' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                    <button
                      onClick={prevMonth}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {currentMonth.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </h2>
                    <button
                      onClick={nextMonth}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="p-4">
                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div
                          key={day}
                          className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {getDaysInMonth(currentMonth).map((day, index) => {
                        const dayEvents = day ? getEventsForDay(day) : []
                        const isToday =
                          day &&
                          new Date().getDate() === day &&
                          new Date().getMonth() === currentMonth.getMonth() &&
                          new Date().getFullYear() === currentMonth.getFullYear()

                        return (
                          <div
                            key={index}
                            className={`min-h-[100px] border rounded-lg p-2 ${
                              day
                                ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                                : 'bg-gray-50 dark:bg-gray-900'
                            } ${isToday ? 'border-green-500 border-2' : 'border-gray-200 dark:border-gray-700'}`}
                          >
                            {day && (
                              <>
                                <span
                                  className={`text-sm font-medium ${
                                    isToday
                                      ? 'text-green-600 dark:text-green-400'
                                      : 'text-gray-700 dark:text-gray-300'
                                  }`}
                                >
                                  {day}
                                </span>
                                <div className="mt-1 space-y-1">
                                  {dayEvents.slice(0, 2).map((event: CourseEvent | CommunityEvent) => {
                                    const isCourseEvent = 'type' in event
                                    const colorClasses = isCourseEvent
                                      ? (EVENT_TYPE_COLORS[(event as CourseEvent).type] || 'bg-gray-100 text-gray-700')
                                      : (COMMUNITY_CATEGORY_COLORS[(event as CommunityEvent).category] || 'bg-gray-100 text-gray-700')

                                    return (
                                      <Link
                                        key={event.id}
                                        href={`/events/${event.id}?type=${isCourseEvent ? 'course' : 'community'}`}
                                        className={`block text-xs p-1 rounded truncate ${colorClasses}`}
                                      >
                                        {event.title}
                                      </Link>
                                    )
                                  })}
                                  {dayEvents.length > 2 && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      +{dayEvents.length - 2} more
                                    </span>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

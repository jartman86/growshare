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
  LIVE_SESSION: 'bg-blue-100 text-blue-700 border-blue-200',
  WEBINAR: 'bg-purple-100 text-purple-700 border-purple-200',
  QA_SESSION: 'bg-green-100 text-green-700 border-green-200',
  OFFICE_HOURS: 'bg-amber-100 text-amber-700 border-amber-200',
  COURSE_RELEASE: 'bg-pink-100 text-pink-700 border-pink-200',
  DEADLINE: 'bg-red-100 text-red-700 border-red-200',
}

export default function EventsPage() {
  const [events, setEvents] = useState<CourseEvent[]>([])
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
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const eventTypes = ['All', 'LIVE_SESSION', 'WEBINAR', 'QA_SESSION', 'OFFICE_HOURS']

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchQuery === '' ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)

    const matchesType = selectedType === 'All' || event.type === selectedType

    return matchesSearch && matchesType
  })

  const hasActiveFilters = selectedType !== 'All' || searchQuery !== ''

  const clearFilters = () => {
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
    return filteredEvents.filter((event) => {
      const eventDate = new Date(event.startTime)
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentMonth.getMonth() &&
        eventDate.getFullYear() === currentMonth.getFullYear()
      )
    })
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
                href="/instructor/events"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6ba03f] to-[#4a7c2c] text-white rounded-lg font-semibold hover:from-[#4a7c2c] hover:to-[#2d5016] transition-all shadow-lg hover:shadow-xl"
              >
                <Plus className="h-5 w-5" />
                Create Event
              </Link>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Search & Filters */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 p-6 mb-6 shadow-md">
                {/* Search Bar & View Toggle */}
                <div className="flex gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-[#8bc34a]/30 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent"
                    />
                  </div>

                  {/* View Toggle */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-white text-green-700 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <LayoutGrid className="h-4 w-4" />
                      <span className="hidden sm:inline">Grid</span>
                    </button>
                    <button
                      onClick={() => setViewMode('calendar')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                        viewMode === 'calendar'
                          ? 'bg-white text-green-700 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <CalendarDays className="h-4 w-4" />
                      <span className="hidden sm:inline">Calendar</span>
                    </button>
                  </div>
                </div>

                {/* Type Filters */}
                <div className="flex flex-wrap gap-2">
                  {eventTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${
                        selectedType === type
                          ? 'bg-gradient-to-r from-[#6ba03f] to-[#4a7c2c] text-white shadow-md'
                          : 'bg-[#aed581]/20 text-[#4a3f35] hover:bg-[#aed581]/40 border border-[#8bc34a]/30'
                      }`}
                    >
                      {type === 'All' ? 'All Events' : EVENT_TYPE_LABELS[type] || type}
                    </button>
                  ))}

                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="ml-auto flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
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
              {!loading && viewMode === 'grid' && (
                <>
                  {filteredEvents.length > 0 ? (
                    <>
                      <p className="text-gray-600 mb-4">
                        {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
                      </p>
                      <div className="grid gap-6 md:grid-cols-2">
                        {filteredEvents.map((event) => (
                          <div
                            key={event.id}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
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

                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {event.title}
                              </h3>

                              {event.description && (
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                  {event.description}
                                </p>
                              )}

                              <div className="space-y-2 text-sm text-gray-500 mb-4">
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

                              <div className="flex items-center justify-between pt-4 border-t">
                                <div className="text-sm text-gray-500">
                                  {event._count.attendees} registered
                                  {event.spotsLeft !== null && (
                                    <span className="ml-1">
                                      ({event.spotsLeft} spots left)
                                    </span>
                                  )}
                                </div>
                                <Link
                                  href={`/events/${event.id}`}
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
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 p-12 text-center shadow-md">
                      <Calendar className="h-12 w-12 text-[#4a7c2c] mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-[#2d5016] mb-2">No events found</h3>
                      <p className="text-[#4a3f35] mb-6">
                        {hasActiveFilters
                          ? 'Try adjusting your filters'
                          : 'No upcoming events scheduled yet'}
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

              {/* Calendar View */}
              {!loading && viewMode === 'calendar' && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <button
                      onClick={prevMonth}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {currentMonth.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </h2>
                    <button
                      onClick={nextMonth}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="p-4">
                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div
                          key={day}
                          className="text-center text-sm font-medium text-gray-500 py-2"
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
                                ? 'bg-white hover:bg-gray-50'
                                : 'bg-gray-50'
                            } ${isToday ? 'border-green-500 border-2' : 'border-gray-200'}`}
                          >
                            {day && (
                              <>
                                <span
                                  className={`text-sm font-medium ${
                                    isToday
                                      ? 'text-green-600'
                                      : 'text-gray-700'
                                  }`}
                                >
                                  {day}
                                </span>
                                <div className="mt-1 space-y-1">
                                  {dayEvents.slice(0, 2).map((event) => (
                                    <Link
                                      key={event.id}
                                      href={`/events/${event.id}`}
                                      className={`block text-xs p-1 rounded truncate ${
                                        EVENT_TYPE_COLORS[event.type] ||
                                        'bg-gray-100 text-gray-700'
                                      }`}
                                    >
                                      {event.title}
                                    </Link>
                                  ))}
                                  {dayEvents.length > 2 && (
                                    <span className="text-xs text-gray-500">
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

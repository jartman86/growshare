'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CommunitySidebar } from '@/components/community/community-sidebar'
import { SAMPLE_EVENTS, EventCategory } from '@/lib/events-data'
import { EventCard } from '@/components/events/event-card'
import {
  Calendar,
  Search,
  Plus,
  MapPin,
  DollarSign,
  Users,
  Star,
  X,
} from 'lucide-react'

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'All'>('All')
  const [showOnlyFree, setShowOnlyFree] = useState(false)
  const [showUpcoming, setShowUpcoming] = useState(true)
  const [sortBy, setSortBy] = useState<'date' | 'popular'>('date')

  const categories: Array<EventCategory | 'All'> = [
    'All',
    'Workshop',
    'Seed Swap',
    'Farmers Market',
    'Volunteer Day',
    'Meetup',
    'Tour',
    'Class',
    'Harvest Festival',
    'Other',
  ]

  const now = new Date()

  const filteredEvents = SAMPLE_EVENTS.filter((event) => {
    const matchesSearch =
      searchQuery === '' ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory

    const matchesFree = !showOnlyFree || event.price === 0

    const matchesUpcoming = !showUpcoming || event.date >= now

    return matchesSearch && matchesCategory && matchesFree && matchesUpcoming
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return a.date.getTime() - b.date.getTime()
    } else {
      return b.attendees - a.attendees
    }
  })

  // Featured events
  const featuredEvents = SAMPLE_EVENTS.filter((e) => e.isFeatured && e.date >= now)

  const hasActiveFilters =
    selectedCategory !== 'All' || showOnlyFree || searchQuery !== '' || !showUpcoming

  const clearFilters = () => {
    setSelectedCategory('All')
    setShowOnlyFree(false)
    setShowUpcoming(true)
    setSearchQuery('')
  }

  const stats = {
    totalEvents: SAMPLE_EVENTS.length,
    upcomingEvents: SAMPLE_EVENTS.filter((e) => e.date >= now).length,
    freeEvents: SAMPLE_EVENTS.filter((e) => e.price === 0).length,
    totalAttendees: SAMPLE_EVENTS.reduce((sum, e) => sum + e.attendees, 0),
  }

  return (
    <>
      <Header />

      <main className="min-h-screen topo-lines">
        {/* Hero Section */}
        <div className="text-white relative overflow-hidden h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60 z-10"></div>
          <Image
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&q=80"
            alt="Community farmers market gathering"
            fill
            className="object-cover"
          />
          <div className="relative z-20 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
                <Calendar className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">Events & Meetups</h1>
              <p className="text-xl text-[#f4e4c1] max-w-2xl mx-auto drop-shadow-md font-medium">
                Workshops, seed swaps, farmers markets, and community gatherings for growers
              </p>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <p className="text-2xl font-bold drop-shadow-md">{stats.upcomingEvents}</p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Upcoming</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <p className="text-2xl font-bold drop-shadow-md">{stats.freeEvents}</p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Free Events</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <p className="text-2xl font-bold drop-shadow-md">{featuredEvents.length}</p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Featured</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <p className="text-2xl font-bold drop-shadow-md">{stats.totalAttendees}+</p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Attendees</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Community Navigation */}
              <CommunitySidebar />

              {/* Create Event Button */}
              <Link
                href="/events/new"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6ba03f] to-[#4a7c2c] text-white rounded-lg font-semibold hover:from-[#4a7c2c] hover:to-[#2d5016] transition-all shadow-lg hover:shadow-xl"
              >
                <Plus className="h-5 w-5" />
                Create Event
              </Link>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Featured Events */}
              {featuredEvents.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                    <h2 className="text-2xl font-bold text-gray-900">Featured Events</h2>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    {featuredEvents.slice(0, 2).map((event) => (
                      <EventCard key={event.id} event={event} featured />
                    ))}
                  </div>
                </div>
              )}

              {/* Search & Filters */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 p-6 mb-6 shadow-md">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events by title, location, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-[#8bc34a]/30 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-[#6ba03f] to-[#4a7c2c] text-white shadow-md'
                      : 'bg-[#aed581]/20 text-[#4a3f35] hover:bg-[#aed581]/40 border border-[#8bc34a]/30'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Additional Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowOnlyFree(!showOnlyFree)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showOnlyFree
                    ? 'bg-green-100 text-green-700 border-2 border-green-600'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <DollarSign className="h-4 w-4" />
                Free Only
              </button>

              <button
                onClick={() => setShowUpcoming(!showUpcoming)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showUpcoming
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-600'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Calendar className="h-4 w-4" />
                Upcoming Only
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'popular')}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="date">Date</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="ml-auto flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <X className="h-4 w-4" />
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <>
              <div className="mb-4">
                <p className="text-gray-600">
                  {filteredEvents.length === SAMPLE_EVENTS.length ? (
                    <>Showing all {filteredEvents.length} events</>
                  ) : (
                    <>
                      Found {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
                    </>
                  )}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 p-12 text-center shadow-md">
              <Calendar className="h-12 w-12 text-[#4a7c2c] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#2d5016] mb-2">No events found</h3>
              <p className="text-[#4a3f35] mb-6">
                Try adjusting your filters or check back later for new events!
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
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

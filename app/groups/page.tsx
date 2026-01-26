'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  Users,
  Search,
  MapPin,
  TrendingUp,
  Calendar,
  Plus,
  Filter,
  X,
  Loader2,
  MessageSquare,
} from 'lucide-react'
import { useUser } from '@clerk/nextjs'

interface Group {
  id: string
  name: string
  slug: string
  description: string
  coverImage: string
  icon: string | null
  location: {
    city: string | null
    state: string | null
    country: string
  }
  isPublic: boolean
  requiresApproval: boolean
  tags: string[]
  memberCount: number
  eventCount: number
  postCount: number
  creator: {
    id: string
    firstName: string
    lastName: string
    avatar: string | null
  }
  createdAt: string
  updatedAt: string
}

export default function GroupsPage() {
  const { isSignedIn } = useUser()
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [sortBy, setSortBy] = useState<'members' | 'activity' | 'name'>('members')
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchGroups()
  }, [sortBy])

  const fetchGroups = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('sortBy', sortBy)
      if (searchQuery) params.set('search', searchQuery)
      if (locationFilter) params.set('location', locationFilter)

      const response = await fetch(`/api/groups?${params}`)
      if (response.ok) {
        const data = await response.json()
        setGroups(data)
      } else {
        setError('Failed to load groups')
      }
    } catch (err) {
      setError('Failed to load groups')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchGroups()
  }

  // Filter groups client-side for immediate feedback
  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      searchQuery === '' ||
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesLocation =
      locationFilter === '' ||
      group.location.city?.toLowerCase() === locationFilter.toLowerCase() ||
      group.location.state?.toLowerCase() === locationFilter.toLowerCase()

    return matchesSearch && matchesLocation
  })

  const hasActiveFilters = searchQuery !== '' || locationFilter !== ''

  const clearFilters = () => {
    setSearchQuery('')
    setLocationFilter('')
  }

  // Get unique locations for filter
  const locations = Array.from(
    new Set(
      groups
        .filter((g) => g.location.city && g.location.state)
        .map((g) => `${g.location.city}, ${g.location.state}`)
    )
  ).sort()

  const totalMembers = groups.reduce((sum, g) => sum + g.memberCount, 0)
  const totalEvents = groups.reduce((sum, g) => sum + g.eventCount, 0)

  return (
    <>
      <Header />

      <main className="min-h-screen topo-lines">
        {/* Hero Section */}
        <div className="text-white relative overflow-hidden h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60 z-10"></div>
          <Image
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80"
            alt="Community members working together in a garden"
            fill
            className="object-cover"
          />
          <div className="relative z-20 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="text-center w-full">
              <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
                <Users className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">Local Groups & Chapters</h1>
              <p className="text-xl text-[#f4e4c1] max-w-2xl mx-auto mb-8 drop-shadow-md font-medium">
                Connect with growers in your area. Share tools, knowledge, and build community.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <p className="text-2xl font-bold drop-shadow-md">{groups.length}</p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Groups</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <p className="text-2xl font-bold drop-shadow-md">{totalMembers}</p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Members</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <p className="text-2xl font-bold drop-shadow-md">{totalEvents}</p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Events</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <p className="text-2xl font-bold drop-shadow-md">{locations.length}</p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Locations</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 p-6 mb-8 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-[#4a7c2c]" />
                <h2 className="text-lg font-bold text-[#2d5016]">Find Your Community</h2>
              </div>
              <Link
                href={isSignedIn ? '/groups/new' : '/sign-in?redirect_url=/groups/new'}
                className="flex items-center gap-2 px-4 py-2 bg-[#5a7f3a] hover:bg-[#4a6b2e] text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                <Plus className="h-4 w-4" />
                Create Group
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search groups by name, tags..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    placeholder="City or state"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="members">Most Members</option>
                  <option value="activity">Recent Activity</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="mt-4 flex items-center gap-2 pt-4 border-t">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchQuery && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery('')}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {locationFilter && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                    {locationFilter}
                    <button onClick={() => setLocationFilter('')}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="ml-2 text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="mb-4">
            <p className="text-gray-600">
              Showing {filteredGroups.length} of {groups.length} groups
            </p>
          </div>

          {/* Groups Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl border p-12 text-center">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{error}</h3>
              <button
                onClick={fetchGroups}
                className="text-green-600 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="bg-white rounded-xl border p-12 text-center">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No groups found</h3>
              <p className="text-gray-600 mb-6">
                {hasActiveFilters
                  ? 'Try adjusting your filters'
                  : 'Be the first to create a group in your area!'}
              </p>
              <Link
                href={isSignedIn ? '/groups/new' : '/sign-in?redirect_url=/groups/new'}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Create a Group
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <Link
                  key={group.id}
                  href={`/groups/${group.slug}`}
                  className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all group"
                >
                  <div className="relative h-40">
                    <Image
                      src={group.coverImage}
                      alt={group.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-white text-xl font-bold drop-shadow-md">
                        {group.name}
                      </h3>
                      {group.location.city && (
                        <div className="flex items-center gap-1 text-white/90 text-sm">
                          <MapPin className="h-3 w-3" />
                          <span>
                            {group.location.city}, {group.location.state}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {group.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {group.memberCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {group.eventCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {group.postCount}
                        </span>
                      </div>
                    </div>
                    {group.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {group.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Info Box */}
          <div className="mt-12 bg-gradient-to-br from-[#f4e4c1]/50 to-[#aed581]/30 rounded-xl border-2 border-[#8bc34a]/30 p-8 shadow-md">
            <h3 className="text-xl font-bold text-[#2d5016] mb-4">Why Join a Local Group?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Users className="h-6 w-6 text-[#4a7c2c]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#2d5016] mb-1">Build Community</h4>
                  <p className="text-sm text-[#4a3f35]">
                    Connect with like-minded growers in your neighborhood
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <TrendingUp className="h-6 w-6 text-[#4a7c2c]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#2d5016] mb-1">Share Resources</h4>
                  <p className="text-sm text-[#4a3f35]">
                    Borrow tools, exchange seeds, and share harvests
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Calendar className="h-6 w-6 text-[#4a7c2c]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#2d5016] mb-1">Attend Events</h4>
                  <p className="text-sm text-[#4a3f35]">
                    Join workshops, plant swaps, and community workdays
                  </p>
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

'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { GroupCard } from '@/components/groups/group-card'
import { SAMPLE_LOCAL_GROUPS } from '@/lib/groups-data'
import {
  Users,
  Search,
  MapPin,
  TrendingUp,
  Calendar,
  Plus,
  Filter,
  X,
} from 'lucide-react'

export default function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [sortBy, setSortBy] = useState<'members' | 'activity' | 'name'>('members')

  // Filter and sort groups
  const filteredGroups = SAMPLE_LOCAL_GROUPS.filter((group) => {
    const matchesSearch =
      searchQuery === '' ||
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesLocation =
      locationFilter === '' ||
      group.location.city.toLowerCase() === locationFilter.toLowerCase() ||
      group.location.state.toLowerCase() === locationFilter.toLowerCase()

    return matchesSearch && matchesLocation
  })

  const sortedGroups = [...filteredGroups].sort((a, b) => {
    switch (sortBy) {
      case 'members':
        return b.memberCount - a.memberCount
      case 'activity':
        return b.lastActivity.getTime() - a.lastActivity.getTime()
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const hasActiveFilters = searchQuery !== '' || locationFilter !== ''

  const clearFilters = () => {
    setSearchQuery('')
    setLocationFilter('')
  }

  // Get unique locations for filter
  const locations = Array.from(
    new Set(
      SAMPLE_LOCAL_GROUPS.map((g) => `${g.location.city}, ${g.location.state}`)
    )
  ).sort()

  return (
    <>
      <Header />

      <main className="min-h-screen topo-lines">
        {/* Hero Section */}
        <div className="garden-gradient-sunrise topo-dense text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2d5016]/20 to-transparent"></div>
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
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
                  <p className="text-2xl font-bold drop-shadow-md">{SAMPLE_LOCAL_GROUPS.length}</p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Groups</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <p className="text-2xl font-bold drop-shadow-md">
                    {SAMPLE_LOCAL_GROUPS.reduce((sum, g) => sum + g.memberCount, 0)}
                  </p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Members</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <p className="text-2xl font-bold drop-shadow-md">
                    {SAMPLE_LOCAL_GROUPS.reduce((sum, g) => sum + g.stats.events, 0)}
                  </p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Events</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <p className="text-2xl font-bold drop-shadow-md">
                    {new Set(SAMPLE_LOCAL_GROUPS.map((g) => g.location.city)).size}
                  </p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Cities</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Search & Filters */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 p-6 mb-8 shadow-md">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search groups by name, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-[#8bc34a]/30 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters & Sort */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Location Filter */}
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-600" />
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location.split(',')[0]}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="members">Most Members</option>
                  <option value="activity">Most Active</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="ml-auto flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </button>
              )}

              {/* Create Group Button */}
              <button className="ml-auto flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#6ba03f] to-[#4a7c2c] text-white rounded-lg font-semibold hover:from-[#4a7c2c] hover:to-[#2d5016] transition-all shadow-lg hover:shadow-xl">
                <Plus className="h-5 w-5" />
                Create Group
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              {sortedGroups.length === SAMPLE_LOCAL_GROUPS.length ? (
                <>Showing all {sortedGroups.length} groups</>
              ) : (
                <>
                  Found {sortedGroups.length} group{sortedGroups.length !== 1 ? 's' : ''}
                </>
              )}
            </p>
          </div>

          {/* Groups Grid */}
          {sortedGroups.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 p-12 text-center shadow-md">
              <Users className="h-16 w-16 text-[#4a7c2c] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#2d5016] mb-2">No groups found</h3>
              <p className="text-[#4a3f35] mb-6">
                Try adjusting your search or filters, or create a new group!
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

          {/* Create Your Own CTA */}
          <div className="mt-12 bg-gradient-to-br from-[#f4e4c1]/50 to-[#aed581]/30 rounded-xl border-2 border-[#8bc34a]/30 p-8 text-center shadow-md">
            <h2 className="text-2xl font-bold text-[#2d5016] mb-2">
              Don't see a group in your area?
            </h2>
            <p className="text-[#4a3f35] mb-6 max-w-2xl mx-auto">
              Start your own local chapter and connect with growers nearby. Build a community of
              knowledge sharing and tool lending.
            </p>
            <button className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#6ba03f] to-[#4a7c2c] text-white rounded-lg font-semibold hover:from-[#4a7c2c] hover:to-[#2d5016] transition-all shadow-lg hover:shadow-xl">
              <Plus className="h-5 w-5" />
              Create a New Group
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

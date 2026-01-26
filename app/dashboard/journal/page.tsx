'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { EntryCard } from '@/components/journal/entry-card'
import { Plus, Filter, Search, BookOpen, Loader2 } from 'lucide-react'

interface JournalEntry {
  id: string
  cropName: string
  cropType: string
  variety: string | null
  status: string
  plantedDate: string | null
  expectedHarvestDate: string | null
  plantCount: number | null
  areaUsed: number | null
  notes: string
  images: string[]
  harvestAmount: number
  harvestCount: number
  createdAt: string
  updatedAt: string
}

interface Stats {
  total: number
  growing: number
  harvested: number
  totalHarvest: number
}

export default function JournalPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, growing: 0, harvested: 0, totalHarvest: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEntries()
  }, [statusFilter, searchQuery])

  const fetchEntries = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'ALL') params.set('status', statusFilter)
      if (searchQuery) params.set('search', searchQuery)

      const response = await fetch(`/api/journal?${params}`)
      if (response.ok) {
        const data = await response.json()
        setEntries(data.entries)
        setStats(data.stats)
      } else if (response.status === 401) {
        setError('Please sign in to view your journal')
      } else {
        setError('Failed to load journal entries')
      }
    } catch (err) {
      setError('Failed to load journal entries')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="h-10 w-10" />
                  <h1 className="text-4xl font-bold">Crop Journal</h1>
                </div>
                <p className="text-green-100 text-lg">
                  Document your growing journey and track your harvests
                </p>
              </div>
              <Link
                href="/dashboard/journal/new"
                className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center gap-2 shadow-lg"
              >
                <Plus className="h-5 w-5" />
                New Entry
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl border p-6">
              <p className="text-sm text-gray-600 mb-1">Total Entries</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl border p-6">
              <p className="text-sm text-gray-600 mb-1">Currently Growing</p>
              <p className="text-3xl font-bold text-green-600">{stats.growing}</p>
            </div>
            <div className="bg-white rounded-xl border p-6">
              <p className="text-sm text-gray-600 mb-1">Harvested Crops</p>
              <p className="text-3xl font-bold text-orange-600">{stats.harvested}</p>
            </div>
            <div className="bg-white rounded-xl border p-6">
              <p className="text-sm text-gray-600 mb-1">Total Harvest</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalHarvest.toFixed(1)} lbs</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-bold text-gray-900">Filter Entries</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by crop name, type, or notes..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PLANNING">Planning</option>
                  <option value="PLANTED">Planted</option>
                  <option value="GERMINATED">Germinated</option>
                  <option value="GROWING">Growing</option>
                  <option value="FLOWERING">Flowering</option>
                  <option value="FRUITING">Fruiting</option>
                  <option value="HARVESTING">Harvesting</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>

            {/* Active Filters Summary */}
            {(statusFilter !== 'ALL' || searchQuery) && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {statusFilter !== 'ALL' && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Status: {statusFilter}
                  </span>
                )}
                {searchQuery && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    Search: "{searchQuery}"
                  </span>
                )}
                <button
                  onClick={() => {
                    setStatusFilter('ALL')
                    setSearchQuery('')
                  }}
                  className="ml-2 text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {entries.length} entries
            </p>
          </div>

          {/* Journal Entries Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl border p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{error}</h3>
              {error.includes('sign in') && (
                <Link
                  href="/sign-in"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors mt-4"
                >
                  Sign In
                </Link>
              )}
            </div>
          ) : entries.length === 0 ? (
            <div className="bg-white rounded-xl border p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No entries found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || statusFilter !== 'ALL'
                  ? 'Try adjusting your filters or search query'
                  : 'Start documenting your growing journey!'}
              </p>
              <Link
                href="/dashboard/journal/new"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Create Your First Entry
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {entries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

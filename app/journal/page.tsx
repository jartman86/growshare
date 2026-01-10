'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { JournalEntryCard } from '@/components/journal/journal-entry-card'
import { NewEntryForm } from '@/components/journal/new-entry-form'
import { SAMPLE_JOURNAL_ENTRIES, CROP_TYPES } from '@/lib/journal-data'
import { Plus, Search, Filter, BookOpen, TrendingUp, Sprout } from 'lucide-react'

export default function JournalPage() {
  const [entries, setEntries] = useState(SAMPLE_JOURNAL_ENTRIES)
  const [showNewEntryForm, setShowNewEntryForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterCropType, setFilterCropType] = useState<string>('all')

  // Filter entries based on search and filters
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      searchQuery === '' ||
      entry.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.plotName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === 'all' || entry.status === filterStatus

    const matchesCropType = filterCropType === 'all' || entry.cropType === filterCropType

    return matchesSearch && matchesStatus && matchesCropType
  })

  // Sort by date (most recent first)
  const sortedEntries = [...filteredEntries].sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  )

  const handleNewEntry = (entry: any) => {
    setEntries([entry, ...entries])
  }

  // Stats
  const totalEntries = entries.length
  const activeEntries = entries.filter((e) => e.status === 'GROWING').length
  const harvestedEntries = entries.filter((e) => e.status === 'HARVESTED').length
  const totalHarvest = entries
    .filter((e) => e.harvestAmount)
    .reduce((sum, e) => sum + (e.harvestAmount || 0), 0)

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Garden Journal</h1>
                <p className="text-lg text-gray-600">
                  Track your crops from seed to harvest
                </p>
              </div>
              <button
                onClick={() => setShowNewEntryForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
              >
                <Plus className="h-5 w-5" />
                New Entry
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl border p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{totalEntries}</div>
                    <div className="text-sm text-gray-600">Total Entries</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Sprout className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{activeEntries}</div>
                    <div className="text-sm text-gray-600">Currently Growing</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{harvestedEntries}</div>
                    <div className="text-sm text-gray-600">Harvested</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🌾</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{totalHarvest.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Total lbs</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl border p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search crops, notes, plots..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="PLANNING">Planning</option>
                    <option value="PLANTED">Planted</option>
                    <option value="GROWING">Growing</option>
                    <option value="HARVESTED">Harvested</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                {/* Crop Type Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={filterCropType}
                    onChange={(e) => setFilterCropType(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">All Crop Types</option>
                    {CROP_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Filters Summary */}
              {(searchQuery || filterStatus !== 'all' || filterCropType !== 'all') && (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                  <span>
                    Showing {sortedEntries.length} of {totalEntries} entries
                  </span>
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setFilterStatus('all')
                      setFilterCropType('all')
                    }}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Journal Entries Timeline */}
          {sortedEntries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedEntries.map((entry) => (
                <JournalEntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No entries found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || filterStatus !== 'all' || filterCropType !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : 'Start documenting your garden journey by creating your first entry'}
              </p>
              {!searchQuery && filterStatus === 'all' && filterCropType === 'all' && (
                <button
                  onClick={() => setShowNewEntryForm(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Create First Entry
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* New Entry Form Modal */}
      {showNewEntryForm && (
        <NewEntryForm onClose={() => setShowNewEntryForm(false)} onSubmit={handleNewEntry} />
      )}
    </>
  )
}

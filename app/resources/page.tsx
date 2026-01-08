'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SAMPLE_PLANT_GUIDES, PlantCategory, GrowingDifficulty } from '@/lib/resources-data'
import { PlantCard } from '@/components/resources/plant-card'
import {
  BookOpen,
  Search,
  Leaf,
  Database,
  X,
  Calendar,
  Bug,
} from 'lucide-react'

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<PlantCategory | 'All'>('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState<GrowingDifficulty | 'All'>('All')
  const [selectedSeason, setSelectedSeason] = useState<string>('All')

  const categories: Array<PlantCategory | 'All'> = [
    'All',
    'Vegetables',
    'Fruits',
    'Herbs',
    'Flowers',
    'Leafy Greens',
    'Root Vegetables',
    'Legumes',
  ]

  const difficulties: Array<GrowingDifficulty | 'All'> = ['All', 'Easy', 'Moderate', 'Challenging']

  const seasons = ['All', 'Spring', 'Summer', 'Fall', 'Winter']

  const filteredGuides = SAMPLE_PLANT_GUIDES.filter((guide) => {
    const matchesSearch =
      searchQuery === '' ||
      guide.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === 'All' || guide.category === selectedCategory

    const matchesDifficulty =
      selectedDifficulty === 'All' || guide.difficulty === selectedDifficulty

    const matchesSeason =
      selectedSeason === 'All' || guide.plantingSeasons.includes(selectedSeason as any)

    return matchesSearch && matchesCategory && matchesDifficulty && matchesSeason
  }).sort((a, b) => b.popularityScore - a.popularityScore)

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedDifficulty !== 'All' ||
    selectedSeason !== 'All' ||
    searchQuery !== ''

  const clearFilters = () => {
    setSelectedCategory('All')
    setSelectedDifficulty('All')
    setSelectedSeason('All')
    setSearchQuery('')
  }

  const stats = {
    totalGuides: SAMPLE_PLANT_GUIDES.length,
    categories: new Set(SAMPLE_PLANT_GUIDES.map((g) => g.category)).size,
    easyPlants: SAMPLE_PLANT_GUIDES.filter((g) => g.difficulty === 'Easy').length,
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4">
                <BookOpen className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Growing Resources Library</h1>
              <p className="text-xl text-emerald-100 max-w-2xl mx-auto mb-6">
                Comprehensive growing guides powered by USDA Plants Database and OpenFarm
              </p>

              {/* Data Sources Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm">
                <Database className="h-4 w-4" />
                <span>Data from USDA • OpenFarm • Hardiness Zones</span>
              </div>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-2xl font-bold">{stats.totalGuides}+</p>
                  <p className="text-sm text-emerald-100">Plant Guides</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-2xl font-bold">{stats.categories}</p>
                  <p className="text-sm text-emerald-100">Categories</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 col-span-2 md:col-span-1">
                  <p className="text-2xl font-bold">{stats.easyPlants}</p>
                  <p className="text-sm text-emerald-100">Beginner-Friendly</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Quick Links */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Link
              href="/resources/calendar"
              className="bg-white rounded-xl border p-6 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Planting Calendar</h3>
                  <p className="text-sm text-gray-600">When to plant by zone</p>
                </div>
              </div>
            </Link>

            <Link
              href="/resources/pests"
              className="bg-white rounded-xl border p-6 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <Bug className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Pest & Disease Guide</h3>
                  <p className="text-sm text-gray-600">Identify and treat issues</p>
                </div>
              </div>
            </Link>

            <Link
              href="/resources/companion"
              className="bg-white rounded-xl border p-6 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Companion Planting</h3>
                  <p className="text-sm text-gray-600">What grows well together</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Search & Filters */}
          <div className="bg-white rounded-xl border p-6 mb-6">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search plants by name, scientific name, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mr-2">Difficulty:</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {difficulties.map((diff) => (
                    <option key={diff} value={diff}>
                      {diff}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mr-2">Season:</label>
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {seasons.map((season) => (
                    <option key={season} value={season}>
                      {season}
                    </option>
                  ))}
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

          {/* Plant Guides Grid */}
          {filteredGuides.length > 0 ? (
            <>
              <div className="mb-4">
                <p className="text-gray-600">
                  {filteredGuides.length === SAMPLE_PLANT_GUIDES.length ? (
                    <>Showing all {filteredGuides.length} plant guides</>
                  ) : (
                    <>
                      Found {filteredGuides.length} plant guide
                      {filteredGuides.length !== 1 ? 's' : ''}
                    </>
                  )}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredGuides.map((guide) => (
                  <PlantCard key={guide.id} guide={guide} />
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl border p-12 text-center">
              <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No plants found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or search query to find what you're looking for.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Info Banner */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-2">📊 Data Sources</h3>
            <p className="text-sm text-blue-800 mb-3">
              Our growing guides are compiled from authoritative sources including:
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>USDA Plants Database</strong> - Official plant hardiness and native range data</li>
              <li>• <strong>OpenFarm</strong> - Community-contributed growing guides and tips</li>
              <li>• <strong>USDA Hardiness Zones</strong> - Climate-specific planting recommendations</li>
              <li>• <strong>Extension Services</strong> - University research and best practices</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

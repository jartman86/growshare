'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PlantCategory, GrowingDifficulty } from '@/lib/resources-data'
import { PlantCard } from '@/components/resources/plant-card'
import {
  BookOpen,
  Search,
  Leaf,
  Database,
  X,
  Calendar,
  Bug,
  Loader2,
  Globe,
} from 'lucide-react'

interface PlantResult {
  id: string
  commonName: string
  scientificName: string
  category: string
  difficulty: string
  image: string
  description?: string
  sunlight?: string
  water?: string
  tags?: string[]
  plantingSeasons?: string[]
  source: 'local' | 'perenual'
  perenualId?: number
}

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<PlantCategory | 'All'>('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState<GrowingDifficulty | 'All'>('All')
  const [selectedSeason, setSelectedSeason] = useState<string>('All')
  const [plants, setPlants] = useState<PlantResult[]>([])
  const [loading, setLoading] = useState(true)
  const [hasApiAccess, setHasApiAccess] = useState(false)

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

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch plants from API
  const fetchPlants = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (debouncedQuery) {
        params.set('q', debouncedQuery)
      }

      const response = await fetch(`/api/plants?${params}`)
      const data = await response.json()

      setPlants(data.plants || [])
      setHasApiAccess(data.hasApiAccess || false)
    } catch (error) {
      console.error('Error fetching plants:', error)
      setPlants([])
    } finally {
      setLoading(false)
    }
  }, [debouncedQuery])

  useEffect(() => {
    fetchPlants()
  }, [fetchPlants])

  // Client-side filtering for category, difficulty, and season
  const filteredPlants = plants.filter((plant) => {
    const matchesCategory = selectedCategory === 'All' || plant.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'All' || plant.difficulty === selectedDifficulty
    const matchesSeason = selectedSeason === 'All' ||
      (plant.plantingSeasons && plant.plantingSeasons.includes(selectedSeason))

    return matchesCategory && matchesDifficulty && matchesSeason
  })

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

  const localPlants = plants.filter(p => p.source === 'local')
  const apiPlants = plants.filter(p => p.source === 'perenual')

  return (
    <>
      <Header />

      <main className="min-h-screen topo-lines">
        {/* Hero Section */}
        <div className="text-white relative overflow-hidden h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60 z-10"></div>
          <Image
            src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1920&q=80"
            alt="Seedling trays and growing plants"
            fill
            className="object-cover"
          />
          <div className="relative z-20 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
                <BookOpen className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">Growing Resources Library</h1>
              <p className="text-xl text-[#f4e4c1] max-w-2xl mx-auto mb-6 drop-shadow-md font-medium">
                Comprehensive growing guides powered by Perenual Plant Database
              </p>

              {/* Data Sources Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm shadow-md">
                <Database className="h-4 w-4" />
                <span>Search 10,000+ plants from Perenual API</span>
                {hasApiAccess && (
                  <span className="ml-2 px-2 py-0.5 bg-green-500/30 rounded-full text-xs">
                    API Connected
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <p className="text-2xl font-bold drop-shadow-md">{localPlants.length}</p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Local Guides</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <p className="text-2xl font-bold drop-shadow-md">10K+</p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Plants in Database</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 col-span-2 md:col-span-1 shadow-md">
                  <p className="text-2xl font-bold drop-shadow-md">{localPlants.filter((p: any) => p.difficulty === 'Easy').length}</p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Beginner-Friendly</p>
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
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 dark:border-gray-700 p-6 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Planting Calendar</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">When to plant by zone</p>
                </div>
              </div>
            </Link>

            <Link
              href="/resources/pests"
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 dark:border-gray-700 p-6 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
                  <Bug className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Pest & Disease Guide</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Identify and treat issues</p>
                </div>
              </div>
            </Link>

            <Link
              href="/resources/companion"
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 dark:border-gray-700 p-6 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                  <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Companion Planting</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">What grows well together</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Search & Filters */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 dark:border-gray-700 p-6 mb-6 shadow-md">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search plants by name (e.g., tomato, rose, basil)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                />
                {loading && (
                  <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 animate-spin" />
                )}
              </div>
              {hasApiAccess && searchQuery && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  Searching Perenual database for "{searchQuery}"...
                </p>
              )}
            </div>

            {/* Category Filters */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-[#6ba03f] to-[#4a7c2c] text-white shadow-md'
                        : 'bg-[#aed581]/20 dark:bg-gray-700 text-[#4a3f35] dark:text-gray-300 hover:bg-[#aed581]/40 dark:hover:bg-gray-600 border border-[#8bc34a]/30 dark:border-gray-600'
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
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Difficulty:</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {difficulties.map((diff) => (
                    <option key={diff} value={diff}>
                      {diff}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Season:</label>
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  className="ml-auto flex items-center gap-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Plant Guides Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-[#4a7c2c] animate-spin" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading plants...</span>
            </div>
          ) : filteredPlants.length > 0 ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-600 dark:text-gray-400">
                  Found {filteredPlants.length} plant{filteredPlants.length !== 1 ? 's' : ''}
                  {apiPlants.length > 0 && (
                    <span className="ml-2 text-sm">
                      ({localPlants.filter(p => filteredPlants.includes(p)).length} local, {apiPlants.filter(p => filteredPlants.includes(p)).length} from API)
                    </span>
                  )}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPlants.map((plant) => (
                  <PlantCard key={plant.id} guide={plant as any} />
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 dark:border-gray-700 p-12 text-center shadow-md">
              <Leaf className="h-12 w-12 text-[#4a7c2c] dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#2d5016] dark:text-white mb-2">No plants found</h3>
              <p className="text-[#4a3f35] dark:text-gray-400 mb-6">
                {searchQuery
                  ? `No results for "${searchQuery}". Try a different search term.`
                  : 'Try adjusting your filters or search query to find what you\'re looking for.'}
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

          {/* Info Banner */}
          <div className="mt-12 bg-gradient-to-br from-[#a8dadc]/30 to-[#87ceeb]/20 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-[#87ceeb]/30 dark:border-blue-800/30 rounded-xl p-6 shadow-md">
            <h3 className="font-semibold text-[#2d5016] dark:text-white mb-2">📊 Data Sources</h3>
            <p className="text-sm text-[#4a3f35] dark:text-gray-300 mb-3">
              Our growing guides are compiled from authoritative sources including:
            </p>
            <ul className="text-sm text-[#4a3f35] dark:text-gray-300 space-y-1">
              <li>• <strong>Perenual Plant API</strong> - Access to 10,000+ plant species with detailed care info</li>
              <li>• <strong>Local Growing Guides</strong> - Curated guides with comprehensive planting tips</li>
              <li>• <strong>USDA Hardiness Zones</strong> - Climate-specific planting recommendations</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

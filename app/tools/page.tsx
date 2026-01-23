'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { useAuth } from '@clerk/nextjs'
import {
  Wrench,
  Search,
  Filter,
  MapPin,
  Star,
  DollarSign,
  Calendar,
  Plus,
  TrendingUp,
  Users,
  CheckCircle2,
  Loader2,
} from 'lucide-react'

interface Tool {
  id: string
  ownerId: string
  name: string
  description: string
  category: string
  condition: string
  images: string[]
  listingType: string
  salePrice: number | null
  dailyRate: number | null
  weeklyRate: number | null
  depositRequired: number | null
  status: string
  location: string | null
  availableFrom: string | null
  availableTo: string | null
  createdAt: string
  owner: {
    id: string
    firstName: string
    lastName: string
    avatar: string | null
    location: string | null
  }
  _count?: {
    rentals: number
  }
}

type ToolCategory = 'Hand Tools' | 'Power Tools' | 'Irrigation' | 'Soil & Compost' | 'Harvesting' | 'Storage' | 'Other'

const categories: ToolCategory[] = [
  'Hand Tools',
  'Power Tools',
  'Irrigation',
  'Soil & Compost',
  'Harvesting',
  'Storage',
  'Other',
]

// Map database enum to display category
const categoryMap: Record<string, string> = {
  HAND_TOOLS: 'Hand Tools',
  POWER_TOOLS: 'Power Tools',
  IRRIGATION: 'Irrigation',
  SOIL_COMPOST: 'Soil & Compost',
  HARVESTING: 'Harvesting',
  STORAGE: 'Storage',
  OTHER: 'Other',
}

export default function ToolsPage() {
  const { isSignedIn } = useAuth()
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'All'>('All')

  useEffect(() => {
    fetchTools()
  }, [])

  const fetchTools = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tools')
      if (!response.ok) {
        throw new Error('Failed to fetch tools')
      }
      const data = await response.json()
      setTools(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tools')
    } finally {
      setLoading(false)
    }
  }

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        searchQuery === '' ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())

      const displayCategory = categoryMap[tool.category] || tool.category
      const matchesCategory = selectedCategory === 'All' || displayCategory === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [tools, searchQuery, selectedCategory])

  const stats = useMemo(() => ({
    totalTools: tools.length,
    forRent: tools.filter((tool) => tool.listingType === 'RENT' || tool.listingType === 'BOTH').length,
    forSale: tools.filter((tool) => tool.listingType === 'SALE' || tool.listingType === 'BOTH').length,
  }), [tools])

  return (
    <>
      <Header />

      <main className="min-h-screen topo-lines">
        {/* Hero Section */}
        <div className="text-white relative overflow-hidden h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60 z-10"></div>
          <Image
            src="https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=1920&q=80"
            alt="Gardening tools and equipment in use"
            fill
            className="object-cover"
          />
          <div className="relative z-20 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="text-center">
              <Wrench className="mx-auto h-16 w-16 mb-4 drop-shadow-md" />
              <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">Tool & Equipment Marketplace</h1>
              <p className="text-xl text-[#f4e4c1] mb-8 max-w-3xl mx-auto drop-shadow-md font-medium">
                Rent, buy, and sell quality gardening tools with your community. Save money, reduce waste, and build connections.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/tools/list"
                  className="inline-flex items-center gap-2 bg-white text-[#4a7c2c] px-6 py-3 rounded-lg font-semibold hover:bg-[#f4e4c1] transition-all shadow-lg hover:shadow-xl"
                >
                  <Plus className="h-5 w-5" />
                  List Your Tools
                </Link>
                <Link
                  href="/tools/my-rentals"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ffb703] to-[#fb8500] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#fb8500] hover:to-[#fb8500] transition-all border-2 border-white/20 shadow-lg hover:shadow-xl"
                >
                  <Calendar className="h-5 w-5" />
                  My Rentals
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1 drop-shadow-md">{stats.totalTools}</div>
                <div className="text-[#f4e4c1] text-sm drop-shadow-sm">Total Listings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1 drop-shadow-md">{stats.forRent}</div>
                <div className="text-[#f4e4c1] text-sm drop-shadow-sm">Available to Rent</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1 drop-shadow-md">{stats.forSale}</div>
                <div className="text-[#f4e4c1] text-sm drop-shadow-sm">For Sale</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* How It Works */}
          <div className="bg-gradient-to-br from-[#ffb703]/20 to-[#fb8500]/10 rounded-xl p-8 mb-8 border-2 border-[#ffb703]/30 shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How Tool Sharing Works</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-orange-100 rounded-full mb-4">
                  <Search className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">1. Browse & Request</h3>
                <p className="text-sm text-gray-600">
                  Find the tool you need and send a rental request to the owner
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-orange-100 rounded-full mb-4">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">2. Coordinate Pickup</h3>
                <p className="text-sm text-gray-600">
                  Arrange pickup time and location directly with the owner
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-orange-100 rounded-full mb-4">
                  <CheckCircle2 className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">3. Use & Return</h3>
                <p className="text-sm text-gray-600">
                  Use the tool and return it on time in good condition
                </p>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 p-6 mb-8 shadow-md">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tools by name or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === 'All'
                    ? 'bg-gradient-to-r from-[#ffb703] to-[#fb8500] text-white shadow-md'
                    : 'bg-[#aed581]/20 text-[#4a3f35] hover:bg-[#aed581]/40 border border-[#8bc34a]/30'
                }`}
              >
                All Tools
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-[#ffb703] to-[#fb8500] text-white shadow-md'
                      : 'bg-[#aed581]/20 text-[#4a3f35] hover:bg-[#aed581]/40 border border-[#8bc34a]/30'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-[#4a7c2c]" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16 bg-red-50 rounded-2xl border-2 border-red-200">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchTools}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Tools Grid */}
          {!loading && !error && filteredTools.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool) => {
                const displayCategory = categoryMap[tool.category] || tool.category
                return (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.id}`}
                    className="bg-white/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 hover:shadow-lg transition-all overflow-hidden group hover:border-[#4a7c2c]/50"
                  >
                    {/* Tool Image */}
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      {tool.images.length > 0 ? (
                        <Image
                          src={tool.images[0]}
                          alt={tool.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#aed581]/20">
                          <Wrench className="h-12 w-12 text-[#4a7c2c]" />
                        </div>
                      )}
                      {/* Status Badge */}
                      {tool.status === 'AVAILABLE' ? (
                        <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                          Available
                        </div>
                      ) : tool.status === 'RENTED' ? (
                        <div className="absolute top-3 right-3 px-3 py-1 bg-gray-500 text-white text-xs font-semibold rounded-full">
                          Rented
                        </div>
                      ) : (
                        <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
                          {tool.status}
                        </div>
                      )}
                      {/* Sale/Rent Badges */}
                      {tool.listingType === 'SALE' && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">
                          FOR SALE
                        </div>
                      )}
                      {tool.listingType === 'BOTH' && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-indigo-500 text-white text-xs font-semibold rounded-full">
                          RENT OR BUY
                        </div>
                      )}
                      {tool.listingType === 'RENT' && tool.dailyRate === 0 && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                          FREE
                        </div>
                      )}
                    </div>

                    {/* Tool Info */}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                            {tool.name}
                          </h3>
                          <p className="text-sm text-gray-600">{displayCategory}</p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mb-4 line-clamp-2">{tool.description}</p>

                      {/* Condition Badge */}
                      <div className="mb-4">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                          tool.condition === 'EXCELLENT' ? 'bg-green-100 text-green-800' :
                          tool.condition === 'GOOD' ? 'bg-blue-100 text-blue-800' :
                          tool.condition === 'FAIR' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {tool.condition.charAt(0) + tool.condition.slice(1).toLowerCase()} Condition
                        </span>
                      </div>

                      {/* Owner Info */}
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                        {tool.owner.avatar ? (
                          <Image
                            src={tool.owner.avatar}
                            alt={tool.owner.firstName}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#aed581]" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {tool.owner.firstName} {tool.owner.lastName}
                          </p>
                          {(tool.location || tool.owner.location) && (
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{tool.location || tool.owner.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          {tool.listingType === 'SALE' ? (
                            <div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-5 w-5 text-purple-600" />
                                <span className="text-2xl font-bold text-gray-900">{tool.salePrice}</span>
                              </div>
                            </div>
                          ) : tool.listingType === 'BOTH' ? (
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <DollarSign className="h-5 w-5 text-orange-600" />
                                <span className="text-xl font-bold text-gray-900">{tool.dailyRate}</span>
                                <span className="text-sm text-gray-600">/day</span>
                              </div>
                              <div className="text-xs text-gray-600">
                                or buy for ${tool.salePrice}
                              </div>
                            </div>
                          ) : tool.dailyRate === 0 || tool.dailyRate === null ? (
                            <div className="text-lg font-bold text-blue-600">Free to Borrow</div>
                          ) : (
                            <div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-5 w-5 text-orange-600" />
                                <span className="text-2xl font-bold text-gray-900">{tool.dailyRate}</span>
                                <span className="text-sm text-gray-600">/day</span>
                              </div>
                              {tool.weeklyRate && (
                                <div className="text-xs text-gray-600">
                                  ${tool.weeklyRate}/week
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {tool.depositRequired && (
                          <div className="text-xs text-gray-600">
                            ${tool.depositRequired} deposit
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredTools.length === 0 && (
            <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-[#aed581]/30 shadow-md">
              <div className="inline-flex items-center justify-center p-4 bg-[#aed581]/20 rounded-full mb-4">
                <Wrench className="h-8 w-8 text-[#4a7c2c]" />
              </div>
              <h3 className="text-lg font-semibold text-[#2d5016] mb-2">
                {tools.length === 0 ? 'No tools listed yet' : 'No tools found'}
              </h3>
              <p className="text-[#4a3f35] mb-6">
                {tools.length === 0
                  ? 'Be the first to list your tools for rent or sale!'
                  : 'Try adjusting your search or category filter.'}
              </p>
              {isSignedIn && tools.length === 0 && (
                <Link
                  href="/tools/list"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6ba03f] to-[#4a7c2c] text-white rounded-lg hover:from-[#4a7c2c] hover:to-[#2d5016] transition-all shadow-lg hover:shadow-xl"
                >
                  <Plus className="h-5 w-5" />
                  List Your Tools
                </Link>
              )}
            </div>
          )}

          {/* Benefits Section */}
          <div className="mt-12 bg-white/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 p-8 shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Share Tools?</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="text-4xl mb-3">💰</div>
                <h3 className="font-semibold text-gray-900 mb-2">Save Money</h3>
                <p className="text-sm text-gray-600">
                  Rent tools for a fraction of the purchase price
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🌱</div>
                <h3 className="font-semibold text-gray-900 mb-2">Reduce Waste</h3>
                <p className="text-sm text-gray-600">
                  Share resources instead of everyone buying their own
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🤝</div>
                <h3 className="font-semibold text-gray-900 mb-2">Build Community</h3>
                <p className="text-sm text-gray-600">
                  Connect with neighbors and fellow gardeners
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">⭐</div>
                <h3 className="font-semibold text-gray-900 mb-2">Earn Points</h3>
                <p className="text-sm text-gray-600">
                  Get rewards for sharing your tools with others
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

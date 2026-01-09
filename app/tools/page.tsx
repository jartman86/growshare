import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SAMPLE_TOOLS, type ToolCategory } from '@/lib/tools-data'
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
} from 'lucide-react'

const categories: ToolCategory[] = [
  'Hand Tools',
  'Power Tools',
  'Irrigation',
  'Soil & Compost',
  'Harvesting',
  'Storage',
  'Other',
]

export default function ToolsPage() {
  const availableTools = SAMPLE_TOOLS.filter((tool) => tool.status === 'available')
  const totalTools = SAMPLE_TOOLS.length
  const forRent = SAMPLE_TOOLS.filter((tool) => tool.listingType === 'rent' || tool.listingType === 'both').length
  const forSale = SAMPLE_TOOLS.filter((tool) => tool.listingType === 'sale' || tool.listingType === 'both').length

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <Wrench className="mx-auto h-16 w-16 mb-4" />
              <h1 className="text-4xl font-bold mb-4">Tool & Equipment Marketplace</h1>
              <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
                Rent, buy, and sell quality gardening tools with your community. Save money, reduce waste, and build connections.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/tools/list"
                  className="inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  List Your Tools
                </Link>
                <Link
                  href="/tools/my-rentals"
                  className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-400 transition-colors border-2 border-white/20"
                >
                  <Calendar className="h-5 w-5" />
                  My Rentals
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{totalTools}</div>
                <div className="text-orange-100 text-sm">Total Listings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{forRent}</div>
                <div className="text-orange-100 text-sm">Available to Rent</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{forSale}</div>
                <div className="text-orange-100 text-sm">For Sale</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* How It Works */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-8 mb-8 border border-orange-200">
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
          <div className="bg-white rounded-xl border p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tools by name, brand, or description..."
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
              <button className="inline-flex items-center gap-2 px-6 py-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="h-5 w-5" />
                <span className="font-medium">Filters</span>
              </button>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors">
                All Tools
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SAMPLE_TOOLS.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.id}`}
                className="bg-white rounded-xl border hover:shadow-lg transition-shadow overflow-hidden group"
              >
                {/* Tool Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={tool.images[0]}
                    alt={tool.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Status Badge */}
                  {tool.status === 'available' ? (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                      Available
                    </div>
                  ) : tool.status === 'rented' ? (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-gray-500 text-white text-xs font-semibold rounded-full">
                      Rented
                    </div>
                  ) : (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
                      {tool.status}
                    </div>
                  )}
                  {/* Free/Sale/Rent Badges */}
                  {tool.listingType === 'sale' && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">
                      FOR SALE
                    </div>
                  )}
                  {tool.listingType === 'both' && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-indigo-500 text-white text-xs font-semibold rounded-full">
                      RENT OR BUY
                    </div>
                  )}
                  {tool.listingType === 'rent' && tool.dailyRate === 0 && (
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
                      <p className="text-sm text-gray-600">{tool.category}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">{tool.description}</p>

                  {/* Stats Row */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{tool.rating.toFixed(1)}</span>
                      <span className="text-gray-400">({tool.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                      <span>{tool.timesRented} rentals</span>
                    </div>
                  </div>

                  {/* Owner Info */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                    <img
                      src={tool.ownerAvatar}
                      alt={tool.ownerName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{tool.ownerName}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{tool.ownerLocation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {tool.listingType === 'sale' ? (
                        <div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-5 w-5 text-purple-600" />
                            <span className="text-2xl font-bold text-gray-900">{tool.salePrice}</span>
                          </div>
                          {tool.priceNegotiable && (
                            <div className="text-xs text-gray-600">Price negotiable</div>
                          )}
                        </div>
                      ) : tool.listingType === 'both' ? (
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <DollarSign className="h-5 w-5 text-orange-600" />
                            <span className="text-xl font-bold text-gray-900">{tool.dailyRate}</span>
                            <span className="text-sm text-gray-600">/day</span>
                          </div>
                          <div className="text-xs text-gray-600">
                            or buy for ${tool.salePrice}
                            {tool.priceNegotiable && ' (OBO)'}
                          </div>
                        </div>
                      ) : tool.dailyRate === 0 ? (
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
            ))}
          </div>

          {/* Benefits Section */}
          <div className="mt-12 bg-white rounded-xl border p-8">
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

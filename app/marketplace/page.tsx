'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ProductCard } from '@/components/marketplace/product-card'
import { SAMPLE_PRODUCTS, ProductCategory } from '@/lib/marketplace-data'
import { Search, ShoppingBag, Sprout, Award, Package, X } from 'lucide-react'

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All')
  const [showOnlyOrganic, setShowOnlyOrganic] = useState(false)
  const [showOnlyCertified, setShowOnlyCertified] = useState(false)
  const [deliveryFilter, setDeliveryFilter] = useState<string>('all')

  const categories: Array<ProductCategory | 'All'> = [
    'All',
    'Vegetables',
    'Fruits',
    'Herbs',
    'Flowers',
    'Seeds',
    'Seedlings',
    'Value-Added',
    'Other',
  ]

  const filteredProducts = SAMPLE_PRODUCTS.filter((product) => {
    const matchesSearch =
      searchQuery === '' ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory

    const matchesOrganic = !showOnlyOrganic || product.organic

    const matchesCertified = !showOnlyCertified || product.certifiedOrganic

    const matchesDelivery =
      deliveryFilter === 'all' || product.deliveryMethods.includes(deliveryFilter as any)

    return matchesSearch && matchesCategory && matchesOrganic && matchesCertified && matchesDelivery
  })

  const hasActiveFilters =
    selectedCategory !== 'All' || showOnlyOrganic || showOnlyCertified || deliveryFilter !== 'all'

  const clearFilters = () => {
    setSelectedCategory('All')
    setShowOnlyOrganic(false)
    setShowOnlyCertified(false)
    setDeliveryFilter('all')
    setSearchQuery('')
  }

  const stats = {
    totalProducts: SAMPLE_PRODUCTS.length,
    organicProducts: SAMPLE_PRODUCTS.filter((p) => p.organic).length,
    certifiedProducts: SAMPLE_PRODUCTS.filter((p) => p.certifiedOrganic).length,
    sellers: new Set(SAMPLE_PRODUCTS.map((p) => p.sellerId)).size,
  }

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
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">Co-op Trading Post</h1>
              <p className="text-xl text-[#f4e4c1] max-w-2xl mx-auto drop-shadow-md font-medium">
                Fresh, local produce directly from growers in your community. Support sustainable
                agriculture and enjoy the highest quality food.
              </p>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <p className="text-2xl font-bold drop-shadow-md">{stats.totalProducts}</p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Products</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <p className="text-2xl font-bold drop-shadow-md">{stats.sellers}</p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Local Growers</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <p className="text-2xl font-bold drop-shadow-md">{stats.organicProducts}</p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Organic</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <p className="text-2xl font-bold drop-shadow-md">{stats.certifiedProducts}</p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Certified</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-gradient-to-r from-[#f4e4c1]/95 via-white/95 to-[#aed581]/95 backdrop-blur border-b-2 border-[#8bc34a]/30 sticky top-0 z-10 shadow-md">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#4a7c2c]" />
                <input
                  type="text"
                  placeholder="Search products, tags, or descriptions..."
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
            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={() => setShowOnlyOrganic(!showOnlyOrganic)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  showOnlyOrganic
                    ? 'bg-[#aed581]/30 text-[#2d5016] border-2 border-[#4a7c2c] shadow-md'
                    : 'bg-white text-[#4a3f35] border-2 border-[#8bc34a]/30 hover:bg-[#aed581]/10'
                }`}
              >
                <Sprout className="h-4 w-4" />
                Organic Only
              </button>

              <button
                onClick={() => setShowOnlyCertified(!showOnlyCertified)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  showOnlyCertified
                    ? 'bg-[#ffb703]/30 text-[#2d5016] border-2 border-[#fb8500] shadow-md'
                    : 'bg-white text-[#4a3f35] border-2 border-[#8bc34a]/30 hover:bg-[#aed581]/10'
                }`}
              >
                <Award className="h-4 w-4" />
                Certified Organic
              </button>

              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-[#4a7c2c]" />
                <select
                  value={deliveryFilter}
                  onChange={(e) => setDeliveryFilter(e.target.value)}
                  className="px-3 py-2 border-2 border-[#8bc34a]/30 rounded-lg text-sm focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent"
                >
                  <option value="all">All Delivery Methods</option>
                  <option value="pickup">Pickup</option>
                  <option value="delivery">Local Delivery</option>
                  <option value="shipping">Shipping</option>
                  <option value="csa-box">CSA Box</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-[#4a3f35] hover:text-[#2d5016] font-medium"
                >
                  <X className="h-4 w-4" />
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-[#4a3f35] font-medium">
              {filteredProducts.length === SAMPLE_PRODUCTS.length ? (
                <>Showing all {filteredProducts.length} products</>
              ) : (
                <>
                  Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                </>
              )}
            </p>
          </div>

          {/* Products */}
          {filteredProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-[#aed581]/30 shadow-md">
              <div className="inline-flex items-center justify-center p-4 bg-[#aed581]/20 rounded-full mb-4">
                <ShoppingBag className="h-8 w-8 text-[#4a7c2c]" />
              </div>
              <h3 className="text-lg font-semibold text-[#2d5016] mb-2">No products found</h3>
              <p className="text-[#4a3f35] mb-6">
                Try adjusting your filters or search query to find what you're looking for.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6ba03f] to-[#4a7c2c] text-white rounded-lg hover:from-[#4a7c2c] hover:to-[#2d5016] transition-all shadow-lg hover:shadow-xl"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-white border-t py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
                  <Sprout className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Fresh & Local</h3>
                <p className="text-sm text-gray-600">
                  All products are grown locally and harvested fresh, ensuring peak flavor and
                  nutrition.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Verified Growers</h3>
                <p className="text-sm text-gray-600">
                  All sellers are verified GrowShare growers with ratings and reviews from the
                  community.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-full mb-4">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Flexible Delivery</h3>
                <p className="text-sm text-gray-600">
                  Choose from pickup, local delivery, shipping, or CSA box options for your
                  convenience.
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

'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  Search,
  Map,
  User,
  ShoppingBag,
  Wrench,
  MessageSquare,
  Loader2,
  X,
  UserCheck,
} from 'lucide-react'

interface SearchResult {
  id: string
  type: string
  title: string
  url: string
  image?: string | null
  subtitle?: string
  isVerified?: boolean
}

interface SearchResults {
  plots: SearchResult[]
  users: SearchResult[]
  marketplace: SearchResult[]
  tools: SearchResult[]
  forums: SearchResult[]
}

const typeConfig = {
  plots: { icon: Map, label: 'Plots', color: 'green' },
  users: { icon: User, label: 'Users', color: 'blue' },
  marketplace: { icon: ShoppingBag, label: 'Marketplace', color: 'purple' },
  tools: { icon: Wrench, label: 'Tools', color: 'orange' },
  forums: { icon: MessageSquare, label: 'Forums', color: 'teal' },
}

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''
  const typeFilter = searchParams.get('type') || ''

  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchInput, setSearchInput] = useState(query)

  useEffect(() => {
    if (!query) {
      setResults(null)
      return
    }

    async function search() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.set('q', query)
        params.set('limit', '20')
        if (typeFilter) params.set('type', typeFilter)

        const res = await fetch(`/api/search?${params}`)
        if (!res.ok) throw new Error('Search failed')

        const data = await res.json()
        setResults(data)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }

    search()
  }, [query, typeFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      const params = new URLSearchParams()
      params.set('q', searchInput.trim())
      if (typeFilter) params.set('type', typeFilter)
      router.push(`/search?${params}`)
    }
  }

  const setType = (type: string) => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (type) params.set('type', type)
    router.push(`/search?${params}`)
  }

  const totalResults = results
    ? Object.values(results).reduce((sum, arr) => sum + arr.length, 0)
    : 0

  const colorClasses: Record<string, string> = {
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700',
    teal: 'bg-teal-100 text-teal-700',
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search plots, users, marketplace, tools, forums..."
                className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-colors"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('')
                    router.push('/search')
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              )}
            </div>
          </form>

          {/* Type Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setType('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !typeFilter
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border text-gray-700 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            {Object.entries(typeConfig).map(([key, { icon: Icon, label }]) => (
              <button
                key={key}
                onClick={() => setType(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  typeFilter === key
                    ? 'bg-gray-900 text-white'
                    : 'bg-white border text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : !query ? (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Search GrowShare
              </h2>
              <p className="text-gray-600">
                Find plots, users, produce, tools, and forum discussions
              </p>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No results found
              </h2>
              <p className="text-gray-600">
                Try different keywords or remove filters
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <p className="text-sm text-gray-600">
                Found {totalResults} results for "{query}"
              </p>

              {Object.entries(results || {}).map(([type, items]) => {
                const typedItems = items as SearchResult[]
                if (typedItems.length === 0) return null
                const config = typeConfig[type as keyof typeof typeConfig]
                const Icon = config.icon

                return (
                  <div key={type}>
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className={`p-2 rounded-lg ${
                          colorClasses[config.color]
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {config.label}
                      </h2>
                      <span className="text-sm text-gray-500">
                        ({typedItems.length})
                      </span>
                    </div>

                    <div className="space-y-3">
                      {typedItems.map((item) => (
                        <Link
                          key={item.id}
                          href={item.url}
                          className="flex items-center gap-4 p-4 bg-white rounded-xl border hover:border-green-300 hover:shadow-sm transition-all"
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt=""
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div
                              className={`h-16 w-16 rounded-lg flex items-center justify-center ${
                                colorClasses[config.color]
                              }`}
                            >
                              <Icon className="h-8 w-8" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-900 truncate">
                                {item.title}
                              </h3>
                              {item.isVerified && (
                                <UserCheck className="h-4 w-4 text-blue-600 flex-shrink-0" />
                              )}
                            </div>
                            {item.subtitle && (
                              <p className="text-sm text-gray-500 truncate">
                                {item.subtitle}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, X, Loader2, Map, User, ShoppingBag, Wrench, MessageSquare } from 'lucide-react'

interface SearchResult {
  id: string
  type: string
  title: string
  url: string
  subtitle?: string
}

const typeIcons: Record<string, React.ElementType> = {
  plot: Map,
  user: User,
  marketplace: ShoppingBag,
  tool: Wrench,
  forum: MessageSquare,
}

export function SearchBar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Search as user types (debounced)
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`)
        if (!res.ok) throw new Error('Search failed')

        const data = await res.json()

        // Flatten results and take top 8
        const flattened: SearchResult[] = []
        Object.entries(data).forEach(([, items]) => {
          (items as SearchResult[]).forEach((item) => {
            if (flattened.length < 8) {
              flattened.push(item)
            }
          })
        })
        setResults(flattened)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
      setQuery('')
    }
  }

  const handleResultClick = () => {
    setIsOpen(false)
    setQuery('')
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Search Toggle Button (collapsed state) */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true)
            setTimeout(() => inputRef.current?.focus(), 100)
          }}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          title="Search"
        >
          <Search className="h-5 w-5 text-gray-700 dark:text-white" />
        </button>
      )}

      {/* Search Input (expanded state) */}
      {isOpen && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-72 sm:w-80">
          <form onSubmit={handleSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-10 py-2 text-sm border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-green-500 focus:ring-0 bg-white dark:bg-gray-800 dark:text-white shadow-lg"
            />
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                setQuery('')
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </form>

          {/* Dropdown Results */}
          {(results.length > 0 || loading) && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 max-h-80 overflow-y-auto z-50">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                </div>
              ) : (
                <>
                  {results.map((result) => {
                    const Icon = typeIcons[result.type] || Search
                    return (
                      <Link
                        key={`${result.type}-${result.id}`}
                        href={result.url}
                        onClick={handleResultClick}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b dark:border-gray-700 last:border-b-0"
                      >
                        <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded">
                          <Icon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {result.title}
                          </p>
                          {result.subtitle && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {result.subtitle}
                            </p>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    onClick={handleResultClick}
                    className="block px-4 py-3 text-sm text-center text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-gray-700 font-medium"
                  >
                    View all results for "{query}"
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

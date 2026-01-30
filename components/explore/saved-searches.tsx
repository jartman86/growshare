'use client'

import { useState, useEffect } from 'react'
import {
  Bookmark,
  BookmarkPlus,
  Trash2,
  Bell,
  BellOff,
  Search,
  Loader2,
  X
} from 'lucide-react'

interface SavedSearch {
  id: string
  name: string
  filters: Record<string, string | string[] | boolean>
  notifyOnNew: boolean
  createdAt: string
}

interface SavedSearchesProps {
  currentFilters: Record<string, string | string[] | boolean>
  onLoadSearch: (filters: Record<string, string | string[] | boolean>) => void
}

export function SavedSearches({ currentFilters, onLoadSearch }: SavedSearchesProps) {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [searchName, setSearchName] = useState('')
  const [notifyOnNew, setNotifyOnNew] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchSavedSearches()
    }
  }, [isOpen])

  const fetchSavedSearches = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/saved-searches')
      if (response.ok) {
        const data = await response.json()
        setSavedSearches(data)
      }
    } catch {
      // Error fetching saved searches
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSearch = async () => {
    if (!searchName.trim()) {
      setError('Please enter a name for this search')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch('/api/saved-searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: searchName.trim(),
          filters: currentFilters,
          notifyOnNew,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save search')
      }

      const newSearch = await response.json()
      setSavedSearches(prev => [newSearch, ...prev])
      setShowSaveModal(false)
      setSearchName('')
      setNotifyOnNew(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteSearch = async (searchId: string) => {
    try {
      const response = await fetch(`/api/saved-searches?id=${searchId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSavedSearches(prev => prev.filter(s => s.id !== searchId))
      }
    } catch {
      // Error deleting saved search
    }
  }

  const handleLoadSearch = (search: SavedSearch) => {
    onLoadSearch(search.filters)
    setIsOpen(false)
  }

  const hasActiveFilters = Object.keys(currentFilters).some(key => {
    const value = currentFilters[key]
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'boolean') return value
    return value !== undefined && value !== null && value !== ''
  })

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bookmark className="h-4 w-4" />
        Saved Searches
        {savedSearches.length > 0 && (
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
            {savedSearches.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border z-50">
          <div className="p-3 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Saved Searches</h3>
              {hasActiveFilters && (
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  <BookmarkPlus className="h-4 w-4" />
                  Save Current
                </button>
              )}
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-green-600" />
              </div>
            ) : savedSearches.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm">No saved searches yet</p>
                {hasActiveFilters && (
                  <button
                    onClick={() => setShowSaveModal(true)}
                    className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Save current search
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y">
                {savedSearches.map((search) => (
                  <div
                    key={search.id}
                    className="p-3 hover:bg-gray-50 group"
                  >
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleLoadSearch(search)}
                        className="flex-1 text-left"
                      >
                        <p className="font-medium text-gray-900 text-sm">
                          {search.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {Object.keys(search.filters).length} filters
                        </p>
                      </button>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {search.notifyOnNew && (
                          <span title="Notifications enabled">
                            <Bell className="h-4 w-4 text-green-600" />
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteSearch(search.id)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Save Search</h3>
              <button
                onClick={() => {
                  setShowSaveModal(false)
                  setSearchName('')
                  setError(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Name
                </label>
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="e.g., Large plots in California"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyOnNew}
                  onChange={(e) => setNotifyOnNew(e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <div className="flex items-center gap-2">
                  {notifyOnNew ? (
                    <Bell className="h-4 w-4 text-green-600" />
                  ) : (
                    <BellOff className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-700">
                    Notify me when new plots match
                  </span>
                </div>
              </label>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSaveModal(false)
                    setSearchName('')
                    setError(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSearch}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <BookmarkPlus className="h-5 w-5" />
                      Save
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

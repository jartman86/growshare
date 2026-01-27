'use client'

import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { Header } from '@/components/layout/header'
import { Map } from '@/components/map/map'
import { PlotCard } from '@/components/map/plot-card'
import { FilterSidebar } from '@/components/map/filter-sidebar'
import { CardSkeleton, CardGridSkeleton } from '@/components/ui/skeleton'
import { StaggeredGrid } from '@/components/ui/animated'
import { MapFilters, PlotMarker } from '@/lib/types'
import { Search, LayoutGrid, Map as MapIcon, Loader2, AlertCircle, RefreshCw, Sprout } from 'lucide-react'
import { cn } from '@/lib/utils'

type ViewMode = 'map' | 'grid'

// Debounce hook for filter changes
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export default function ExplorePage() {
  const [filters, setFilters] = useState<MapFilters>({})
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('map')
  const [searchQuery, setSearchQuery] = useState('')
  const [plots, setPlots] = useState<PlotMarker[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Debounce filters to prevent rapid API calls
  const debouncedFilters = useDebounce(filters, 300)

  // Track if this is the initial load
  const isInitialLoad = useRef(true)

  // Fetch plots from API with debounced filters
  const fetchPlots = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()

      if (debouncedFilters.minPrice) params.append('minPrice', debouncedFilters.minPrice.toString())
      if (debouncedFilters.maxPrice) params.append('maxPrice', debouncedFilters.maxPrice.toString())
      if (debouncedFilters.minAcreage) params.append('minAcreage', debouncedFilters.minAcreage.toString())
      if (debouncedFilters.maxAcreage) params.append('maxAcreage', debouncedFilters.maxAcreage.toString())
      if (debouncedFilters.soilTypes?.length) params.append('soilTypes', debouncedFilters.soilTypes.join(','))
      if (debouncedFilters.waterAccess?.length) params.append('waterAccess', debouncedFilters.waterAccess.join(','))
      if (debouncedFilters.hasIrrigation) params.append('hasIrrigation', 'true')
      if (debouncedFilters.hasFencing) params.append('hasFencing', 'true')
      if (debouncedFilters.hasGreenhouse) params.append('hasGreenhouse', 'true')
      if (debouncedFilters.hasElectricity) params.append('hasElectricity', 'true')
      if (debouncedFilters.status?.length) params.append('status', debouncedFilters.status.join(','))
      if (debouncedFilters.availableFrom) params.append('availableFrom', debouncedFilters.availableFrom)
      if (debouncedFilters.availableTo) params.append('availableTo', debouncedFilters.availableTo)

      const response = await fetch(`/api/plots?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch plots')

      const data = await response.json()
      setPlots(data)
      isInitialLoad.current = false
    } catch (err) {
      console.error('Error fetching plots:', err)
      setError('Unable to load plots. Please try again.')
      // Keep existing plots on error (don't clear them)
      if (isInitialLoad.current) {
        setPlots([])
      }
    } finally {
      setIsLoading(false)
    }
  }, [debouncedFilters])

  useEffect(() => {
    fetchPlots()
  }, [fetchPlots])

  // Filter plots based on search query (client-side)
  const filteredPlots = useMemo(() => {
    if (!searchQuery) return plots

    const query = searchQuery.toLowerCase()
    return plots.filter(plot =>
      plot.title.toLowerCase().includes(query) ||
      plot.city.toLowerCase().includes(query) ||
      plot.state.toLowerCase().includes(query)
    )
  }, [plots, searchQuery])

  const handlePlotClick = (plot: PlotMarker) => {
    setSelectedPlotId(plot.id)
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />

      {/* Search Bar */}
      <div className="border-b-2 border-[#8bc34a]/30 dark:border-gray-700 bg-gradient-to-r from-[#f4e4c1]/95 via-white/95 to-[#aed581]/95 dark:from-gray-900/95 dark:via-gray-900/95 dark:to-gray-800/95 backdrop-blur p-4 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#4a7c2c] dark:text-green-400" />
            <input
              type="text"
              placeholder="Search by location, city, or plot name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-[#8bc34a]/30 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent bg-white dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-[#aed581]/20 dark:bg-gray-700 rounded-lg p-1 border border-[#8bc34a]/30 dark:border-gray-600">
            <button
              onClick={() => setViewMode('map')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-all',
                viewMode === 'map'
                  ? 'bg-gradient-to-r from-[#8bc34a] to-[#6ba03f] text-white shadow-md'
                  : 'text-[#4a3f35] dark:text-gray-300 hover:text-[#2d5016] dark:hover:text-white'
              )}
            >
              <MapIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-all',
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-[#8bc34a] to-[#6ba03f] text-white shadow-md'
                  : 'text-[#4a3f35] dark:text-gray-300 hover:text-[#2d5016] dark:hover:text-white'
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchPlots}
              className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Filters Sidebar */}
        <FilterSidebar
          filters={filters}
          onFiltersChange={setFilters}
          plotCount={filteredPlots.length}
        />

        {/* Map or Grid View */}
        {viewMode === 'map' ? (
          <div className="flex-1 flex overflow-hidden">
            {/* Map */}
            <div className="flex-1 relative">
              <Map
                plots={filteredPlots}
                onPlotClick={handlePlotClick}
                selectedPlotId={selectedPlotId}
              />
            </div>

            {/* Plot List Panel */}
            <div className="w-96 border-l-2 border-[#8bc34a]/30 bg-gradient-to-b from-white to-[#aed581]/10 overflow-y-auto">
              <div className="p-4">
                <h2 className="text-lg font-bold text-[#2d5016] mb-4">
                  {filteredPlots.length} {filteredPlots.length === 1 ? 'Plot' : 'Plots'} Available
                </h2>

                <div className="space-y-4">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <CardSkeleton key={i} />
                      ))}
                    </div>
                  ) : (
                    <>
                      {filteredPlots.map((plot, index) => (
                        <div
                          key={plot.id}
                          className="animate-in fade-in slide-in-from-bottom-2"
                          style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                        >
                          <PlotCard
                            plot={plot}
                            showLink={true}
                            onClick={() => handlePlotClick(plot)}
                            isSelected={selectedPlotId === plot.id}
                          />
                        </div>
                      ))}

                      {filteredPlots.length === 0 && (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700">
                          <Sprout className="h-12 w-12 text-green-300 dark:text-green-700 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No plots found
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            Try adjusting your filters or search query
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Grid View
          <div className="flex-1 overflow-y-auto topo-lines p-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold text-[#2d5016] mb-6">
                {filteredPlots.length} {filteredPlots.length === 1 ? 'Plot' : 'Plots'} Available
              </h2>

              {isLoading ? (
                <CardGridSkeleton count={6} />
              ) : (
                <>
                  <StaggeredGrid className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" staggerDelay={75}>
                    {filteredPlots.map(plot => (
                      <PlotCard
                        key={plot.id}
                        plot={plot}
                        showLink={true}
                        isSelected={selectedPlotId === plot.id}
                      />
                    ))}
                  </StaggeredGrid>

                  {filteredPlots.length === 0 && (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-md">
                      <Sprout className="h-16 w-16 text-green-200 dark:text-green-800 mx-auto mb-4" />
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                        No plots found
                      </h3>
                      <p className="text-lg text-gray-600 dark:text-gray-400">
                        Try adjusting your filters or search query
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

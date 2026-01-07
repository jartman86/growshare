'use client'

import { useState, useMemo } from 'react'
import { Header } from '@/components/layout/header'
import { Map } from '@/components/map/map'
import { PlotCard } from '@/components/map/plot-card'
import { FilterSidebar } from '@/components/map/filter-sidebar'
import { SAMPLE_PLOTS } from '@/lib/sample-data'
import { MapFilters, PlotMarker } from '@/lib/types'
import { Search, LayoutGrid, Map as MapIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type ViewMode = 'map' | 'grid'

export default function ExplorePage() {
  const [filters, setFilters] = useState<MapFilters>({})
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('map')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter plots based on criteria
  const filteredPlots = useMemo(() => {
    return SAMPLE_PLOTS.filter(plot => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          plot.title.toLowerCase().includes(query) ||
          plot.city.toLowerCase().includes(query) ||
          plot.state.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Price range
      if (filters.minPrice && plot.pricePerMonth < filters.minPrice) return false
      if (filters.maxPrice && plot.pricePerMonth > filters.maxPrice) return false

      // Acreage range
      if (filters.minAcreage && plot.acreage < filters.minAcreage) return false
      if (filters.maxAcreage && plot.acreage > filters.maxAcreage) return false

      // Features
      if (filters.hasIrrigation && !plot.hasIrrigation) return false
      if (filters.hasFencing && !plot.hasFencing) return false
      if (filters.hasGreenhouse && !plot.hasGreenhouse) return false

      // Soil types
      if (filters.soilTypes && filters.soilTypes.length > 0) {
        const hasMatchingSoil = plot.soilType.some(soil =>
          filters.soilTypes?.includes(soil)
        )
        if (!hasMatchingSoil) return false
      }

      // Water access
      if (filters.waterAccess && filters.waterAccess.length > 0) {
        const hasMatchingWater = plot.waterAccess.some(water =>
          filters.waterAccess?.includes(water)
        )
        if (!hasMatchingWater) return false
      }

      // Status
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(plot.status)) return false
      }

      return true
    })
  }, [filters, searchQuery])

  const handlePlotClick = (plot: PlotMarker) => {
    setSelectedPlotId(plot.id)
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />

      {/* Search Bar */}
      <div className="border-b bg-white p-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by location, city, or plot name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('map')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                viewMode === 'map'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <MapIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                viewMode === 'grid'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

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
            <div className="w-96 border-l bg-white overflow-y-auto">
              <div className="p-4">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  {filteredPlots.length} {filteredPlots.length === 1 ? 'Plot' : 'Plots'} Available
                </h2>

                <div className="space-y-4">
                  {filteredPlots.map(plot => (
                    <PlotCard
                      key={plot.id}
                      plot={plot}
                      onClick={() => handlePlotClick(plot)}
                      isSelected={selectedPlotId === plot.id}
                    />
                  ))}

                  {filteredPlots.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-4">🔍</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No plots found
                      </h3>
                      <p className="text-gray-600">
                        Try adjusting your filters or search query
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Grid View
          <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {filteredPlots.length} {filteredPlots.length === 1 ? 'Plot' : 'Plots'} Available
              </h2>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPlots.map(plot => (
                  <PlotCard
                    key={plot.id}
                    plot={plot}
                    showLink={true}
                    isSelected={selectedPlotId === plot.id}
                  />
                ))}
              </div>

              {filteredPlots.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    No plots found
                  </h3>
                  <p className="text-lg text-gray-600">
                    Try adjusting your filters or search query
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

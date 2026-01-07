'use client'

import { useState } from 'react'
import { MapFilters } from '@/lib/types'
import { SOIL_TYPES, WATER_ACCESS_TYPES } from '@/lib/constants'
import { X, ChevronDown, ChevronUp, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterSidebarProps {
  filters: MapFilters
  onFiltersChange: (filters: MapFilters) => void
  plotCount: number
}

export function FilterSidebar({ filters, onFiltersChange, plotCount }: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    price: true,
    acreage: true,
    features: true,
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const updateFilter = (key: keyof MapFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  const activeFilterCount = Object.values(filters).filter(v =>
    v !== undefined && v !== null && (Array.isArray(v) ? v.length > 0 : true)
  ).length

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-20 left-4 z-10 bg-white rounded-lg shadow-lg p-3 flex items-center gap-2"
      >
        <Filter className="h-5 w-5" />
        <span className="font-medium">Filters</span>
        {activeFilterCount > 0 && (
          <span className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          'bg-white border-r overflow-y-auto transition-all duration-300',
          isOpen ? 'w-80' : 'w-0 lg:w-0',
          'lg:relative fixed inset-y-0 left-0 z-20 lg:z-0'
        )}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-700" />
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              {activeFilterCount > 0 && (
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 hover:bg-gray-100 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Results Count */}
          <div className="mb-6 p-3 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-900">
              {plotCount} {plotCount === 1 ? 'plot' : 'plots'} found
            </p>
          </div>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="w-full mb-4 text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Clear all filters
            </button>
          )}

          {/* Price Range */}
          <div className="mb-6 pb-6 border-b">
            <button
              onClick={() => toggleSection('price')}
              className="w-full flex items-center justify-between mb-3"
            >
              <h3 className="text-sm font-semibold text-gray-900">Price Range</h3>
              {expandedSections.price ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>

            {expandedSections.price && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Min Price/Month</label>
                  <input
                    type="number"
                    placeholder="$0"
                    value={filters.minPrice || ''}
                    onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Max Price/Month</label>
                  <input
                    type="number"
                    placeholder="Any"
                    value={filters.maxPrice || ''}
                    onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Acreage */}
          <div className="mb-6 pb-6 border-b">
            <button
              onClick={() => toggleSection('acreage')}
              className="w-full flex items-center justify-between mb-3"
            >
              <h3 className="text-sm font-semibold text-gray-900">Acreage</h3>
              {expandedSections.acreage ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>

            {expandedSections.acreage && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Min Acres</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="0"
                    value={filters.minAcreage || ''}
                    onChange={(e) => updateFilter('minAcreage', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Max Acres</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Any"
                    value={filters.maxAcreage || ''}
                    onChange={(e) => updateFilter('maxAcreage', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="mb-6 pb-6 border-b">
            <button
              onClick={() => toggleSection('features')}
              className="w-full flex items-center justify-between mb-3"
            >
              <h3 className="text-sm font-semibold text-gray-900">Features</h3>
              {expandedSections.features ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>

            {expandedSections.features && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasIrrigation || false}
                    onChange={(e) => updateFilter('hasIrrigation', e.target.checked || undefined)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Irrigation System</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasFencing || false}
                    onChange={(e) => updateFilter('hasFencing', e.target.checked || undefined)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Fencing</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasGreenhouse || false}
                    onChange={(e) => updateFilter('hasGreenhouse', e.target.checked || undefined)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Greenhouse</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasElectricity || false}
                    onChange={(e) => updateFilter('hasElectricity', e.target.checked || undefined)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Electricity</span>
                </label>
              </div>
            )}
          </div>

          {/* Soil Type */}
          <div className="mb-6 pb-6 border-b">
            <button
              onClick={() => toggleSection('soil')}
              className="w-full flex items-center justify-between mb-3"
            >
              <h3 className="text-sm font-semibold text-gray-900">Soil Type</h3>
              {expandedSections.soil ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>

            {expandedSections.soil && (
              <div className="space-y-2">
                {SOIL_TYPES.map(soil => (
                  <label key={soil.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.soilTypes?.includes(soil.value) || false}
                      onChange={(e) => {
                        const current = filters.soilTypes || []
                        const updated = e.target.checked
                          ? [...current, soil.value]
                          : current.filter(s => s !== soil.value)
                        updateFilter('soilTypes', updated.length > 0 ? updated : undefined)
                      }}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{soil.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Water Access */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('water')}
              className="w-full flex items-center justify-between mb-3"
            >
              <h3 className="text-sm font-semibold text-gray-900">Water Access</h3>
              {expandedSections.water ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>

            {expandedSections.water && (
              <div className="space-y-2">
                {WATER_ACCESS_TYPES.filter(w => w.value !== 'NONE').map(water => (
                  <label key={water.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.waterAccess?.includes(water.value) || false}
                      onChange={(e) => {
                        const current = filters.waterAccess || []
                        const updated = e.target.checked
                          ? [...current, water.value]
                          : current.filter(w => w !== water.value)
                        updateFilter('waterAccess', updated.length > 0 ? updated : undefined)
                      }}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{water.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
        />
      )}
    </>
  )
}

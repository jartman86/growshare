'use client'

import { ListingFormData } from '../listing-form'
import { Droplets, Sprout, Zap, Home } from 'lucide-react'

interface DetailsStepProps {
  formData: ListingFormData
  updateFormData: (data: Partial<ListingFormData>) => void
  onNext: () => void
  onBack?: () => void
  onSubmit?: () => void
}

const SOIL_TYPES = [
  'Clay',
  'Sandy',
  'Loam',
  'Silt',
  'Peaty',
  'Chalky',
  'Rocky',
]

const WATER_ACCESS_OPTIONS = [
  'Well',
  'Municipal',
  'Stream/Creek',
  'Pond/Lake',
  'Rainwater Collection',
  'None',
]

const USDA_ZONES = [
  '3a', '3b', '4a', '4b', '5a', '5b', '6a', '6b',
  '7a', '7b', '8a', '8b', '9a', '9b', '10a', '10b',
]

export function DetailsStep({ formData, updateFormData, onNext }: DetailsStepProps) {
  const toggleSoilType = (type: string) => {
    const current = formData.soilTypes
    if (current.includes(type)) {
      updateFormData({ soilTypes: current.filter((t) => t !== type) })
    } else {
      updateFormData({ soilTypes: [...current, type] })
    }
  }

  const toggleWaterAccess = (option: string) => {
    const current = formData.waterAccess
    if (current.includes(option)) {
      updateFormData({ waterAccess: current.filter((o) => o !== option) })
    } else {
      updateFormData({ waterAccess: [...current, option] })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Plot Details</h2>
        <p className="text-gray-600">
          Tell growers about the specific features and resources available
        </p>
      </div>

      {/* Soil Types */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Sprout className="h-5 w-5 text-green-600" />
          Soil Type(s)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SOIL_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => toggleSoilType(type)}
              className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                formData.soilTypes.includes(type)
                  ? 'bg-green-50 border-green-600 text-green-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Select all that apply (if you're not sure, that's okay!)
        </p>
      </div>

      {/* Water Access */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Droplets className="h-5 w-5 text-blue-600" />
          Water Access
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {WATER_ACCESS_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggleWaterAccess(option)}
              className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                formData.waterAccess.includes(option)
                  ? 'bg-blue-50 border-blue-600 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Home className="h-5 w-5 text-purple-600" />
          Amenities & Infrastructure
        </label>
        <div className="space-y-3">
          <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={formData.hasIrrigation}
              onChange={(e) => updateFormData({ hasIrrigation: e.target.checked })}
              className="mt-1 h-5 w-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
            />
            <div>
              <span className="font-medium text-gray-900">Irrigation System</span>
              <p className="text-sm text-gray-600">
                Drip lines, sprinklers, or other installed irrigation
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={formData.hasFencing}
              onChange={(e) => updateFormData({ hasFencing: e.target.checked })}
              className="mt-1 h-5 w-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
            />
            <div>
              <span className="font-medium text-gray-900">Fencing</span>
              <p className="text-sm text-gray-600">
                Perimeter fencing for security and/or livestock control
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={formData.hasGreenhouse}
              onChange={(e) => updateFormData({ hasGreenhouse: e.target.checked })}
              className="mt-1 h-5 w-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
            />
            <div>
              <span className="font-medium text-gray-900">Greenhouse/Hoop House</span>
              <p className="text-sm text-gray-600">
                Season extension structures available for use
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={formData.hasElectricity}
              onChange={(e) => updateFormData({ hasElectricity: e.target.checked })}
              className="mt-1 h-5 w-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
            />
            <div>
              <span className="font-medium text-gray-900 flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-600" />
                Electricity Access
              </span>
              <p className="text-sm text-gray-600">
                Power available for tools, pumps, or other equipment
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* USDA Zone */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          USDA Hardiness Zone (Optional)
        </label>
        <select
          value={formData.usdaZone}
          onChange={(e) => updateFormData({ usdaZone: e.target.value })}
          className="w-full md:w-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">Select zone...</option>
          {USDA_ZONES.map((zone) => (
            <option key={zone} value={zone}>
              Zone {zone}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-gray-500">
          Not sure?{' '}
          <a
            href="https://planthardiness.ars.usda.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 underline"
          >
            Find your zone here
          </a>
        </p>
      </div>
    </div>
  )
}

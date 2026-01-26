'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SAMPLE_PLANT_GUIDES } from '@/lib/resources-data'
import { Calendar, ArrowLeft, Leaf, Thermometer, Info, MapPin, Snowflake, Sun, Loader2, AlertCircle, Sprout, Clock } from 'lucide-react'

interface FrostData {
  zipCode: string
  location: {
    city: string
    state: string
  }
  weatherStation: {
    name: string
    distanceKm: number
  }
  hardinessZone: {
    zone: string
    zoneNumber: number
    temperatureRange: string
  } | null
  frostDates: {
    lastSpringFrost: string | null
    firstFallFrost: string | null
    frostFreeWindow: number | null
    springFrostRange: {
      early: string | null
      typical: string | null
      late: string | null
    }
    fallFrostRange: {
      early: string | null
      typical: string | null
      late: string | null
    }
    lastSpringFrostRaw: string | null
    firstFallFrostRaw: string | null
  }
  dataSource: string
  noFrostZone: boolean
}

// Calculate a planting date based on frost date and offset
function calculatePlantingDate(frostDateRaw: string | null, weeksOffset: number, isAfterFrost: boolean): string | null {
  if (!frostDateRaw) return null

  const [month, day] = frostDateRaw.split('/').map(Number)
  const currentYear = new Date().getFullYear()
  const frostDate = new Date(currentYear, month - 1, day)

  const offsetDays = weeksOffset * 7
  const plantingDate = new Date(frostDate)

  if (isAfterFrost) {
    plantingDate.setDate(plantingDate.getDate() + offsetDays)
  } else {
    plantingDate.setDate(plantingDate.getDate() - offsetDays)
  }

  return plantingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function PlantingCalendarPage() {
  const [selectedZone, setSelectedZone] = useState('7')
  const [selectedMonth, setSelectedMonth] = useState('All')
  const [zipCode, setZipCode] = useState('')
  const [frostData, setFrostData] = useState<FrostData | null>(null)
  const [frostLoading, setFrostLoading] = useState(false)
  const [frostError, setFrostError] = useState<string | null>(null)

  // Load saved zip code from localStorage on mount
  useEffect(() => {
    const savedZip = localStorage.getItem('growshare_zipCode')
    if (savedZip) {
      setZipCode(savedZip)
    }
  }, [])

  // Auto-fetch frost data when zip code is loaded from storage
  useEffect(() => {
    const savedZip = localStorage.getItem('growshare_zipCode')
    if (savedZip && savedZip.length === 5 && !frostData && !frostLoading) {
      fetchFrostDatesForZip(savedZip)
    }
  }, [])

  const fetchFrostDatesForZip = async (zip: string) => {
    setFrostLoading(true)
    setFrostError(null)

    try {
      const response = await fetch(`/api/frost-dates/${zip}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch frost dates')
      }

      setFrostData(data)

      // Auto-set zone if available
      if (data.hardinessZone?.zoneNumber) {
        const zoneNum = data.hardinessZone.zoneNumber
        // Clamp to available zones (3-10)
        const clampedZone = Math.max(3, Math.min(10, zoneNum)).toString()
        setSelectedZone(clampedZone)
      }

      // Save zip code to localStorage
      localStorage.setItem('growshare_zipCode', zip)
    } catch (error) {
      setFrostError(error instanceof Error ? error.message : 'Failed to fetch frost dates')
      setFrostData(null)
    } finally {
      setFrostLoading(false)
    }
  }

  const fetchFrostDates = async () => {
    if (!zipCode || zipCode.length !== 5) {
      setFrostError('Please enter a valid 5-digit zip code')
      return
    }
    await fetchFrostDatesForZip(zipCode)
  }

  const zones = ['3', '4', '5', '6', '7', '8', '9', '10']
  const months = ['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const seasonMap: Record<string, string[]> = {
    'Spring': ['March', 'April', 'May'],
    'Summer': ['June', 'July', 'August'],
    'Fall': ['September', 'October', 'November'],
    'Winter': ['December', 'January', 'February']
  }

  // Get plants appropriate for selected zone
  const plantsForZone = SAMPLE_PLANT_GUIDES.filter(plant => {
    const zones = plant.hardinessZones.split('-')
    const minZone = parseInt(zones[0])
    const maxZone = parseInt(zones[1])
    const zone = parseInt(selectedZone)
    return zone >= minZone && zone <= maxZone
  })

  // Organize by season and month
  const calendarData: Record<string, any[]> = {
    'Spring': [],
    'Summer': [],
    'Fall': [],
    'Winter': []
  }

  plantsForZone.forEach(plant => {
    plant.plantingSeasons.forEach(season => {
      const monthsInSeason = seasonMap[season]
      if (selectedMonth === 'All' || monthsInSeason.includes(selectedMonth)) {
        if (!calendarData[season].find(p => p.id === plant.id)) {
          calendarData[season].push(plant)
        }
      }
    })
  })

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <div className="text-white relative overflow-hidden h-[350px]">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70 z-10"></div>
          <Image
            src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&q=80"
            alt="Garden planting calendar concept"
            fill
            className="object-cover"
          />
          <div className="relative z-20 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-white/90 hover:text-emerald-300 mb-6 w-fit transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Resources
            </Link>
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
                <Calendar className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">Planting Calendar</h1>
              <p className="text-xl text-emerald-100 max-w-2xl mx-auto drop-shadow-md">
                Find the best planting times for your USDA hardiness zone
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Zone & Month Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 mb-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-emerald-600" />
                  Select Your USDA Hardiness Zone
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {zones.map((zone) => (
                    <button
                      key={zone}
                      onClick={() => setSelectedZone(zone)}
                      className={`px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                        selectedZone === zone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Zone {zone}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  <a href="https://planthardiness.ars.usda.gov/" target="_blank" rel="noopener" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                    Find your zone →
                  </a>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  Filter by Month (Optional)
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-emerald-800 dark:text-emerald-300">
                  <p className="font-semibold mb-1">Zone {selectedZone} Information</p>
                  <p>Showing plants suitable for USDA Hardiness Zone {selectedZone}. Planting times may vary based on local microclimates and last frost dates.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Frost Date Lookup */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Snowflake className="h-5 w-5 text-blue-500" />
              Frost Date Lookup
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Enter your zip code to get personalized frost dates based on NOAA climate data.
            </p>

            <div className="flex gap-3">
              <div className="relative flex-1 max-w-xs">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  onKeyDown={(e) => e.key === 'Enter' && fetchFrostDates()}
                  placeholder="Enter zip code"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={fetchFrostDates}
                disabled={frostLoading || zipCode.length !== 5}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {frostLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Get Frost Dates'
                )}
              </button>
            </div>

            {frostError && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-800 dark:text-red-300">{frostError}</p>
              </div>
            )}

            {frostData && (
              <div className="mt-6 space-y-4">
                {/* Location Header */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      {frostData.location.city}, {frostData.location.state}
                      {frostData.hardinessZone && (
                        <span className="text-sm font-medium px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded">
                          Zone {frostData.hardinessZone.zone}
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Data from {frostData.weatherStation.name} ({frostData.weatherStation.distanceKm.toFixed(1)} km away)
                      {frostData.hardinessZone && ` • Avg min temp: ${frostData.hardinessZone.temperatureRange}°F`}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {frostData.dataSource}
                  </span>
                </div>

                {frostData.noFrostZone ? (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Sun className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-yellow-800 dark:text-yellow-300">
                        <p className="font-semibold mb-1">Year-Round Growing Zone!</p>
                        <p>Your area rarely experiences frost. You can plant warm-season crops year-round, though some cool-season crops may struggle in summer heat.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Last Spring Frost */}
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                          <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-sm font-medium text-green-800 dark:text-green-300">Last Spring Frost</span>
                      </div>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                        {frostData.frostDates.lastSpringFrost || 'N/A'}
                      </p>
                      {frostData.frostDates.springFrostRange.early && (
                        <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                          Range: {frostData.frostDates.springFrostRange.early} – {frostData.frostDates.springFrostRange.late}
                        </p>
                      )}
                      <p className="text-xs text-green-600 dark:text-green-500 mt-2">
                        Plant warm-season crops after this date
                      </p>
                    </div>

                    {/* First Fall Frost */}
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-lg">
                          <Snowflake className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <span className="text-sm font-medium text-orange-800 dark:text-orange-300">First Fall Frost</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                        {frostData.frostDates.firstFallFrost || 'N/A'}
                      </p>
                      {frostData.frostDates.fallFrostRange.early && (
                        <p className="text-xs text-orange-700 dark:text-orange-400 mt-1">
                          Range: {frostData.frostDates.fallFrostRange.early} – {frostData.frostDates.fallFrostRange.late}
                        </p>
                      )}
                      <p className="text-xs text-orange-600 dark:text-orange-500 mt-2">
                        Harvest tender crops before this date
                      </p>
                    </div>

                    {/* Growing Season */}
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                          <Sun className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-sm font-medium text-purple-800 dark:text-purple-300">Growing Season</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        {frostData.frostDates.frostFreeWindow ? `${frostData.frostDates.frostFreeWindow} days` : 'N/A'}
                      </p>
                      <p className="text-xs text-purple-600 dark:text-purple-500 mt-2">
                        Frost-free window for outdoor growing
                      </p>
                    </div>
                  </div>
                )}

                {/* Planting Date Calculator */}
                {!frostData.noFrostZone && frostData.frostDates.lastSpringFrostRaw && (
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Sprout className="h-5 w-5 text-emerald-600" />
                      Recommended Planting Dates for {frostData.location.city}
                    </h4>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {/* Warm-season crops */}
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tomatoes, Peppers, Squash</p>
                        <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                          <Clock className="h-4 w-4 text-emerald-600" />
                          {calculatePlantingDate(frostData.frostDates.lastSpringFrostRaw, 2, true)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">2 weeks after last frost</p>
                      </div>
                      {/* Cool-season spring */}
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Lettuce, Peas, Spinach</p>
                        <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                          <Clock className="h-4 w-4 text-emerald-600" />
                          {calculatePlantingDate(frostData.frostDates.lastSpringFrostRaw, 4, false)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">4 weeks before last frost</p>
                      </div>
                      {/* Seeds indoors */}
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Start Seeds Indoors</p>
                        <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                          <Clock className="h-4 w-4 text-emerald-600" />
                          {calculatePlantingDate(frostData.frostDates.lastSpringFrostRaw, 8, false)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">8 weeks before last frost</p>
                      </div>
                      {/* Fall planting */}
                      {frostData.frostDates.firstFallFrostRaw && (
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Fall Crops (Broccoli, Kale)</p>
                          <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                            <Clock className="h-4 w-4 text-orange-600" />
                            {calculatePlantingDate(frostData.frostDates.firstFallFrostRaw, 10, false)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">10 weeks before first frost</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Seasonal Calendar */}
          <div className="space-y-6">
            {Object.entries(calendarData).map(([season, plants]) => (
              <div key={season} className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
                <div className={`p-6 ${
                  season === 'Spring' ? 'bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800' :
                  season === 'Summer' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800' :
                  season === 'Fall' ? 'bg-orange-50 dark:bg-orange-900/20 border-b border-orange-200 dark:border-orange-800' :
                  'bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      {season === 'Spring' && '🌱'}
                      {season === 'Summer' && '☀️'}
                      {season === 'Fall' && '🍂'}
                      {season === 'Winter' && '❄️'}
                      {season}
                    </h2>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {seasonMap[season].join(', ')}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {plants.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {plants.map((plant) => (
                        <Link
                          key={plant.id}
                          href={`/resources/${plant.id}`}
                          className="flex items-start gap-3 p-4 border dark:border-gray-700 rounded-lg hover:shadow-md dark:hover:shadow-gray-900/50 transition-all group bg-white dark:bg-gray-800"
                        >
                          <img
                            src={plant.image}
                            alt={plant.commonName}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {plant.commonName}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{plant.category}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                              <span>{plant.daysToMaturity}</span>
                              <span>•</span>
                              <span>{plant.difficulty}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Leaf className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No plants to plant in {season.toLowerCase()} for Zone {selectedZone}
                        {selectedMonth !== 'All' && ` in ${selectedMonth}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Helpful Tips */}
          <div className="mt-8 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6">
            <h3 className="font-bold text-emerald-900 dark:text-emerald-300 mb-4">🌿 Planting Tips</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-emerald-800 dark:text-emerald-300">
              <div>
                <p className="font-semibold mb-2">Cool-Season Crops</p>
                <ul className="space-y-1 text-emerald-700 dark:text-emerald-400">
                  <li>• Plant in early spring or fall</li>
                  <li>• Tolerate light frost</li>
                  <li>• Examples: Lettuce, peas, broccoli</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">Warm-Season Crops</p>
                <ul className="space-y-1 text-emerald-700 dark:text-emerald-400">
                  <li>• Plant after last frost date</li>
                  <li>• Need warm soil (60°F+)</li>
                  <li>• Examples: Tomatoes, peppers, squash</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">Succession Planting</p>
                <ul className="space-y-1 text-emerald-700 dark:text-emerald-400">
                  <li>• Plant every 2-3 weeks</li>
                  <li>• Extends harvest season</li>
                  <li>• Best for fast crops like lettuce</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">Fall Planting</p>
                <ul className="space-y-1 text-emerald-700 dark:text-emerald-400">
                  <li>• Count back from first frost</li>
                  <li>• Add 2 weeks for slower growth</li>
                  <li>• Many crops sweeten after frost</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

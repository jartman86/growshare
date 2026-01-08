'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SAMPLE_PLANT_GUIDES } from '@/lib/resources-data'
import { Calendar, ArrowLeft, Leaf, Thermometer, Info } from 'lucide-react'

export default function PlantingCalendarPage() {
  const [selectedZone, setSelectedZone] = useState('7')
  const [selectedMonth, setSelectedMonth] = useState('All')

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

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-white hover:text-cyan-200 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Resources
            </Link>
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4">
                <Calendar className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Planting Calendar</h1>
              <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
                Find the best planting times for your USDA hardiness zone
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Zone & Month Selection */}
          <div className="bg-white rounded-xl border p-6 mb-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-blue-600" />
                  Select Your USDA Hardiness Zone
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {zones.map((zone) => (
                    <button
                      key={zone}
                      onClick={() => setSelectedZone(zone)}
                      className={`px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                        selectedZone === zone
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Zone {zone}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-600">
                  <a href="https://planthardiness.ars.usda.gov/" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
                    Find your zone →
                  </a>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  Filter by Month (Optional)
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Zone {selectedZone} Information</p>
                  <p>Showing plants suitable for USDA Hardiness Zone {selectedZone}. Planting times may vary based on local microclimates and last frost dates.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Seasonal Calendar */}
          <div className="space-y-6">
            {Object.entries(calendarData).map(([season, plants]) => (
              <div key={season} className="bg-white rounded-xl border overflow-hidden">
                <div className={`p-6 ${
                  season === 'Spring' ? 'bg-green-50 border-b border-green-200' :
                  season === 'Summer' ? 'bg-yellow-50 border-b border-yellow-200' :
                  season === 'Fall' ? 'bg-orange-50 border-b border-orange-200' :
                  'bg-blue-50 border-b border-blue-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      {season === 'Spring' && '🌱'}
                      {season === 'Summer' && '☀️'}
                      {season === 'Fall' && '🍂'}
                      {season === 'Winter' && '❄️'}
                      {season}
                    </h2>
                    <span className="text-sm text-gray-600">
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
                          className="flex items-start gap-3 p-4 border rounded-lg hover:shadow-md transition-all group"
                        >
                          <img
                            src={plant.image}
                            alt={plant.commonName}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                              {plant.commonName}
                            </h3>
                            <p className="text-sm text-gray-600 mb-1">{plant.category}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
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
                      <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">
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
          <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-xl p-6">
            <h3 className="font-bold text-emerald-900 mb-4">🌿 Planting Tips</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-emerald-800">
              <div>
                <p className="font-semibold mb-2">Cool-Season Crops</p>
                <ul className="space-y-1">
                  <li>• Plant in early spring or fall</li>
                  <li>• Tolerate light frost</li>
                  <li>• Examples: Lettuce, peas, broccoli</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">Warm-Season Crops</p>
                <ul className="space-y-1">
                  <li>• Plant after last frost date</li>
                  <li>• Need warm soil (60°F+)</li>
                  <li>• Examples: Tomatoes, peppers, squash</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">Succession Planting</p>
                <ul className="space-y-1">
                  <li>• Plant every 2-3 weeks</li>
                  <li>• Extends harvest season</li>
                  <li>• Best for fast crops like lettuce</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">Fall Planting</p>
                <ul className="space-y-1">
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

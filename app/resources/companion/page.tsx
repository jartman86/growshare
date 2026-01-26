'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SAMPLE_PLANT_GUIDES } from '@/lib/resources-data'
import { Heart, XCircle, ArrowLeft, Search, Leaf, Info } from 'lucide-react'

export default function CompanionPlantingPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const plantsWithCompanions = SAMPLE_PLANT_GUIDES.filter(
    (plant) => plant.companionPlants.length > 0 || plant.avoidPlanting.length > 0
  )

  const filteredPlants = plantsWithCompanions.filter((plant) =>
    plant.commonName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <div className="text-white relative overflow-hidden h-[350px]">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70 z-10"></div>
          <Image
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&q=80"
            alt="Companion planting garden"
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
                <Leaf className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">Companion Planting Guide</h1>
              <p className="text-xl text-emerald-100 max-w-2xl mx-auto drop-shadow-md">
                Discover which plants grow well together and which to keep apart
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <Info className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">What is Companion Planting?</h3>
                <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                  Companion planting is the practice of growing different plants together for mutual benefit. Good companions can:
                </p>
                <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                  <li>• Repel pests naturally</li>
                  <li>• Attract beneficial insects and pollinators</li>
                  <li>• Improve soil health and nutrient availability</li>
                  <li>• Provide shade or physical support</li>
                  <li>• Enhance flavor and growth</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for a plant to see its companions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Companion Chart */}
          <div className="space-y-4">
            {filteredPlants.map((plant) => (
              <div key={plant.id} className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <img
                      src={plant.image}
                      alt={plant.commonName}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <Link
                        href={`/resources/${plant.id}`}
                        className="text-2xl font-bold text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        {plant.commonName}
                      </Link>
                      <p className="text-gray-600 dark:text-gray-400 italic">{plant.scientificName}</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                        {plant.category}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Good Companions */}
                    {plant.companionPlants.length > 0 && (
                      <div>
                        <h3 className="font-bold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                          <Heart className="h-5 w-5" />
                          Good Companions ({plant.companionPlants.length})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {plant.companionPlants.map((companion, index) => (
                            <span
                              key={index}
                              className="px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium"
                            >
                              {companion}
                            </span>
                          ))}
                        </div>
                        <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                          These plants benefit {plant.commonName} by repelling pests, improving soil, or attracting beneficial insects.
                        </p>
                      </div>
                    )}

                    {/* Avoid Planting With */}
                    {plant.avoidPlanting.length > 0 && (
                      <div>
                        <h3 className="font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                          <XCircle className="h-5 w-5" />
                          Avoid Planting With ({plant.avoidPlanting.length})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {plant.avoidPlanting.map((avoid, index) => (
                            <span
                              key={index}
                              className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium"
                            >
                              {avoid}
                            </span>
                          ))}
                        </div>
                        <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                          These plants may compete for nutrients, attract pests, or inhibit {plant.commonName}'s growth.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPlants.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-12 text-center">
              <Leaf className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No plants found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try a different search term or browse our complete plant library.
              </p>
            </div>
          )}

          {/* Classic Combinations */}
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Classic Companion Combinations</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-bold text-green-900 dark:text-green-300 mb-2">🌽 Three Sisters</h3>
                <p className="text-sm text-green-800 dark:text-green-300 mb-2">
                  <strong>Corn + Beans + Squash</strong>
                </p>
                <p className="text-sm text-green-700 dark:text-green-400">
                  Native American technique: Corn provides support for beans, beans fix nitrogen, squash shades soil and deters pests.
                </p>
              </div>

              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <h3 className="font-bold text-red-900 dark:text-red-300 mb-2">🍅 Tomato & Basil</h3>
                <p className="text-sm text-red-800 dark:text-red-300 mb-2">
                  <strong>Tomatoes + Basil</strong>
                </p>
                <p className="text-sm text-red-700 dark:text-red-400">
                  Basil repels aphids, mosquitoes, and hornworms while improving tomato flavor. Perfect culinary pair too!
                </p>
              </div>

              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <h3 className="font-bold text-orange-900 dark:text-orange-300 mb-2">🥕 Carrot & Onion</h3>
                <p className="text-sm text-orange-800 dark:text-orange-300 mb-2">
                  <strong>Carrots + Onions/Leeks</strong>
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-400">
                  Onions repel carrot rust fly, while carrots repel onion fly. Mutual pest protection!
                </p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-bold text-purple-900 dark:text-purple-300 mb-2">🌻 Marigold Magic</h3>
                <p className="text-sm text-purple-800 dark:text-purple-300 mb-2">
                  <strong>Marigolds + Most Vegetables</strong>
                </p>
                <p className="text-sm text-purple-700 dark:text-purple-400">
                  Marigolds repel aphids, whiteflies, and nematodes. Plant throughout your garden as pest deterrent.
                </p>
              </div>
            </div>
          </div>

          {/* Principles */}
          <div className="mt-8 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6">
            <h3 className="font-bold text-emerald-900 dark:text-emerald-300 mb-4">🌱 Companion Planting Principles</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-emerald-800 dark:text-emerald-300">
              <div>
                <p className="font-semibold mb-2">Height & Light</p>
                <p className="text-emerald-700 dark:text-emerald-400">Tall plants can provide shade for cool-season crops that bolt in heat (like lettuce under tomatoes).</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Nutrient Needs</p>
                <p className="text-emerald-700 dark:text-emerald-400">Heavy feeders (tomatoes) pair well with nitrogen-fixers (beans) that improve soil.</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Root Depth</p>
                <p className="text-emerald-700 dark:text-emerald-400">Deep-rooted plants (tomatoes) pair well with shallow-rooted plants (lettuce) to avoid competition.</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Pest Confusion</p>
                <p className="text-emerald-700 dark:text-emerald-400">Intermixing different plant families confuses pests that search for specific host plants.</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Beneficial Attractors</p>
                <p className="text-emerald-700 dark:text-emerald-400">Flowering herbs attract pollinators and predatory insects that control pests naturally.</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Physical Support</p>
                <p className="text-emerald-700 dark:text-emerald-400">Sturdy plants can support vining plants (corn for beans), maximizing space.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

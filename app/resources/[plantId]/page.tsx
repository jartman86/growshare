import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SAMPLE_PLANT_GUIDES } from '@/lib/resources-data'
import * as perenual from '@/lib/perenual'
import {
  ArrowLeft,
  Sun,
  Droplet,
  Leaf,
  Clock,
  Thermometer,
  Ruler,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Bug,
  ShieldAlert,
  Heart,
  XCircle,
  Utensils,
  Package,
  Globe,
} from 'lucide-react'

async function getPlantData(plantId: string) {
  // Check if it's a Perenual ID
  if (plantId.startsWith('perenual-')) {
    const perenualId = parseInt(plantId.replace('perenual-', ''))

    if (!perenual.isConfigured()) {
      return null
    }

    try {
      const plantData = await perenual.getPlantDetails(perenualId)
      const guide = perenual.convertToPlantGuide(plantData)
      return { ...guide, source: 'perenual' }
    } catch (error) {
      console.error('Error fetching plant from Perenual:', error)
      return null
    }
  }

  // Check local sample data
  const localPlant = SAMPLE_PLANT_GUIDES.find((g) => g.id === plantId)
  if (localPlant) {
    return { ...localPlant, source: 'local' }
  }

  return null
}

export default async function PlantGuidePage({
  params,
}: {
  params: Promise<{ plantId: string }>
}) {
  const { plantId } = await params
  const guide = await getPlantData(plantId)

  if (!guide) {
    notFound()
  }

  const getDifficultyColor = () => {
    switch (guide.difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'Challenging':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const isApiPlant = guide.source === 'perenual'

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Image */}
        <div className="relative h-96 overflow-hidden">
          <img src={guide.image} alt={guide.commonName} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="mx-auto max-w-7xl">
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 text-white hover:text-emerald-300 mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Resources
              </Link>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                  {guide.category}
                </span>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${getDifficultyColor()}`}>
                  {guide.difficulty}
                </div>
                {isApiPlant && (
                  <div className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    Perenual
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{guide.commonName}</h1>
                <p className="text-xl italic text-gray-600 dark:text-gray-400 mb-6">{guide.scientificName}</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{guide.description || 'No description available.'}</p>
                {guide.nativeTo && (
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    <strong>Native to:</strong> {guide.nativeTo}
                  </p>
                )}
              </div>

              {/* Growing Requirements */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Growing Requirements</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                      <Sun className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Sunlight</p>
                      <p className="text-gray-700 dark:text-gray-300">{guide.sunlight || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Droplet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Water Needs</p>
                      <p className="text-gray-700 dark:text-gray-300">{guide.water || 'Not specified'}</p>
                    </div>
                  </div>

                  {guide.hardinessZones && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Hardiness Zones</p>
                        <p className="text-gray-700 dark:text-gray-300">USDA Zones {guide.hardinessZones}</p>
                      </div>
                    </div>
                  )}

                  {guide.soilPH && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Thermometer className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Soil pH</p>
                        <p className="text-gray-700 dark:text-gray-300">{guide.soilPH}</p>
                      </div>
                    </div>
                  )}

                  {guide.spacing && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <Ruler className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Spacing</p>
                        <p className="text-gray-700 dark:text-gray-300">{guide.spacing}</p>
                      </div>
                    </div>
                  )}

                  {guide.daysToMaturity && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                        <Clock className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Days to Maturity</p>
                        <p className="text-gray-700 dark:text-gray-300">{guide.daysToMaturity}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Soil Type */}
                {guide.soilType && guide.soilType.length > 0 && (
                  <div className="mt-6 pt-6 border-t dark:border-gray-700">
                    <p className="font-semibold text-gray-900 dark:text-white mb-2">Soil Type</p>
                    <div className="flex flex-wrap gap-2">
                      {guide.soilType.map((soil: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                        >
                          {soil}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fertilizer */}
                {guide.fertilizer && (
                  <div className="mt-4">
                    <p className="font-semibold text-gray-900 dark:text-white mb-2">Fertilizer</p>
                    <p className="text-gray-700 dark:text-gray-300">{guide.fertilizer}</p>
                  </div>
                )}
              </div>

              {/* Growing Tips */}
              {guide.growingTips && guide.growingTips.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Lightbulb className="h-6 w-6 text-yellow-500" />
                    Growing Tips
                  </h2>
                  <ul className="space-y-3">
                    {guide.growingTips.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Companion Planting */}
              {((guide.companionPlants && guide.companionPlants.length > 0) ||
                (guide.avoidPlanting && guide.avoidPlanting.length > 0)) && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Companion Planting</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {guide.companionPlants && guide.companionPlants.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                          <Heart className="h-5 w-5" />
                          Good Companions
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {guide.companionPlants.map((plant: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm"
                            >
                              {plant}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {guide.avoidPlanting && guide.avoidPlanting.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                          <XCircle className="h-5 w-5" />
                          Avoid Planting With
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {guide.avoidPlanting.map((plant: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm"
                            >
                              {plant}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Pests & Diseases */}
              {((guide.commonPests && guide.commonPests.length > 0) ||
                (guide.commonDiseases && guide.commonDiseases.length > 0)) && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Common Issues</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {guide.commonPests && guide.commonPests.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-orange-700 dark:text-orange-400 mb-3 flex items-center gap-2">
                          <Bug className="h-5 w-5" />
                          Common Pests
                        </h3>
                        <ul className="space-y-2">
                          {guide.commonPests.map((pest: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                              <span className="text-orange-600 dark:text-orange-400">•</span>
                              <span>{pest}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {guide.commonDiseases && guide.commonDiseases.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                          <ShieldAlert className="h-5 w-5" />
                          Common Diseases
                        </h3>
                        <ul className="space-y-2">
                          {guide.commonDiseases.map((disease: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                              <span className="text-red-600 dark:text-red-400">•</span>
                              <span>{disease}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Troubleshooting */}
              {guide.troubleshooting && guide.troubleshooting.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-orange-500" />
                    Troubleshooting
                  </h2>
                  <ul className="space-y-3">
                    {guide.troubleshooting.map((issue: string, index: number) => (
                      <li key={index} className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                        <p className="text-gray-800 dark:text-gray-200">{issue}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Harvesting */}
              {(guide.harvestTips || guide.storageInstructions) && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Harvesting & Storage</h2>
                  <div className="space-y-4">
                    {guide.harvestTips && (
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Harvest Tips</h3>
                        <p className="text-gray-700 dark:text-gray-300">{guide.harvestTips}</p>
                      </div>
                    )}
                    {guide.storageInstructions && (
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Storage Instructions</h3>
                        <p className="text-gray-700 dark:text-gray-300">{guide.storageInstructions}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Culinary & Nutrition */}
              {(guide.culinaryUses || guide.nutritionalInfo) && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Utensils className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    Culinary & Nutrition
                  </h2>
                  {guide.culinaryUses && guide.culinaryUses.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Culinary Uses</h3>
                      <div className="flex flex-wrap gap-2">
                        {guide.culinaryUses.map((use: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm"
                          >
                            {use}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {guide.nutritionalInfo && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Nutritional Information</h3>
                      <p className="text-gray-700 dark:text-gray-300">{guide.nutritionalInfo}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                {/* Quick Facts */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Quick Facts</h3>
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-gray-600 dark:text-gray-400">Category</dt>
                      <dd className="font-semibold text-gray-900 dark:text-white">{guide.category}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-600 dark:text-gray-400">Difficulty</dt>
                      <dd className="font-semibold text-gray-900 dark:text-white">{guide.difficulty}</dd>
                    </div>
                    {guide.depth && (
                      <div>
                        <dt className="text-gray-600 dark:text-gray-400">Planting Depth</dt>
                        <dd className="font-semibold text-gray-900 dark:text-white">{guide.depth}</dd>
                      </div>
                    )}
                    {guide.daysToGermination && (
                      <div>
                        <dt className="text-gray-600 dark:text-gray-400">Germination</dt>
                        <dd className="font-semibold text-gray-900 dark:text-white">{guide.daysToGermination}</dd>
                      </div>
                    )}
                    {guide.plantingSeasons && guide.plantingSeasons.length > 0 && (
                      <div>
                        <dt className="text-gray-600 dark:text-gray-400">Planting Seasons</dt>
                        <dd className="font-semibold text-gray-900 dark:text-white">
                          {guide.plantingSeasons.join(', ')}
                        </dd>
                      </div>
                    )}
                    {guide.harvestSeasons && guide.harvestSeasons.length > 0 && (
                      <div>
                        <dt className="text-gray-600 dark:text-gray-400">Harvest Seasons</dt>
                        <dd className="font-semibold text-gray-900 dark:text-white">
                          {guide.harvestSeasons.join(', ')}
                        </dd>
                      </div>
                    )}
                    {guide.popularityScore && (
                      <div className="pt-3 border-t dark:border-gray-700">
                        <dt className="text-gray-600 dark:text-gray-400 flex items-center gap-1 mb-1">
                          <TrendingUp className="h-3 w-3" />
                          Popularity
                        </dt>
                        <dd className="font-semibold text-gray-900 dark:text-white">{guide.popularityScore}%</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Varieties */}
                {guide.varieties && guide.varieties.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      Popular Varieties
                    </h3>
                    <ul className="space-y-2">
                      {guide.varieties.map((variety: string, index: number) => (
                        <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                          <span className="text-emerald-600 dark:text-emerald-400">•</span>
                          <span>{variety}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Data Source */}
                <div className={`rounded-xl p-6 ${
                  isApiPlant
                    ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'
                    : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                }`}>
                  <h3 className={`font-semibold mb-2 ${
                    isApiPlant ? 'text-purple-900 dark:text-purple-300' : 'text-blue-900 dark:text-blue-300'
                  }`}>
                    {isApiPlant ? '🌐 Data Source' : '📊 Data Sources'}
                  </h3>
                  <p className={`text-sm mb-2 ${
                    isApiPlant ? 'text-purple-800 dark:text-purple-400' : 'text-blue-800 dark:text-blue-400'
                  }`}>
                    {isApiPlant
                      ? 'Information from Perenual Plant API'
                      : 'Information compiled from:'
                    }
                  </p>
                  {!isApiPlant && (
                    <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
                      <li>• USDA Plants Database</li>
                      <li>• OpenFarm Community</li>
                      <li>• Extension Services</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

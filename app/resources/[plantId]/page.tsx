import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SAMPLE_PLANT_GUIDES } from '@/lib/resources-data'
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
} from 'lucide-react'

export default async function PlantGuidePage({
  params,
}: {
  params: Promise<{ plantId: string }>
}) {
  const { plantId } = await params
  const guide = SAMPLE_PLANT_GUIDES.find((g) => g.id === plantId)

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
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
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
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="bg-white rounded-xl border p-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{guide.commonName}</h1>
                <p className="text-xl italic text-gray-600 mb-6">{guide.scientificName}</p>
                <p className="text-gray-700 leading-relaxed">{guide.description}</p>
                {guide.nativeTo && (
                  <p className="mt-4 text-sm text-gray-600">
                    <strong>Native to:</strong> {guide.nativeTo}
                  </p>
                )}
              </div>

              {/* Growing Requirements */}
              <div className="bg-white rounded-xl border p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Growing Requirements</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Sun className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Sunlight</p>
                      <p className="text-gray-700">{guide.sunlight}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Droplet className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Water Needs</p>
                      <p className="text-gray-700">{guide.water}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Leaf className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Hardiness Zones</p>
                      <p className="text-gray-700">USDA Zones {guide.hardinessZones}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Thermometer className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Soil pH</p>
                      <p className="text-gray-700">{guide.soilPH}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Ruler className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Spacing</p>
                      <p className="text-gray-700">{guide.spacing}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-pink-100 rounded-lg">
                      <Clock className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Days to Maturity</p>
                      <p className="text-gray-700">{guide.daysToMaturity}</p>
                    </div>
                  </div>
                </div>

                {/* Soil Type */}
                <div className="mt-6 pt-6 border-t">
                  <p className="font-semibold text-gray-900 mb-2">Soil Type</p>
                  <div className="flex flex-wrap gap-2">
                    {guide.soilType.map((soil, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {soil}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Fertilizer */}
                {guide.fertilizer && (
                  <div className="mt-4">
                    <p className="font-semibold text-gray-900 mb-2">Fertilizer</p>
                    <p className="text-gray-700">{guide.fertilizer}</p>
                  </div>
                )}
              </div>

              {/* Growing Tips */}
              <div className="bg-white rounded-xl border p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-yellow-500" />
                  Growing Tips
                </h2>
                <ul className="space-y-3">
                  {guide.growingTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Companion Planting */}
              <div className="bg-white rounded-xl border p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Companion Planting</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Good Companions
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {guide.companionPlants.map((plant, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                        >
                          {plant}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                      <XCircle className="h-5 w-5" />
                      Avoid Planting With
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {guide.avoidPlanting.map((plant, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                        >
                          {plant}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pests & Diseases */}
              <div className="bg-white rounded-xl border p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Issues</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                      <Bug className="h-5 w-5" />
                      Common Pests
                    </h3>
                    <ul className="space-y-2">
                      {guide.commonPests.map((pest, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <span className="text-orange-600">•</span>
                          <span>{pest}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5" />
                      Common Diseases
                    </h3>
                    <ul className="space-y-2">
                      {guide.commonDiseases.map((disease, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <span className="text-red-600">•</span>
                          <span>{disease}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Troubleshooting */}
              <div className="bg-white rounded-xl border p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-orange-500" />
                  Troubleshooting
                </h2>
                <ul className="space-y-3">
                  {guide.troubleshooting.map((issue, index) => (
                    <li key={index} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-gray-800">{issue}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Harvesting */}
              <div className="bg-white rounded-xl border p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Harvesting & Storage</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Harvest Tips</h3>
                    <p className="text-gray-700">{guide.harvestTips}</p>
                  </div>
                  {guide.storageInstructions && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Storage Instructions</h3>
                      <p className="text-gray-700">{guide.storageInstructions}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Culinary & Nutrition */}
              {(guide.culinaryUses || guide.nutritionalInfo) && (
                <div className="bg-white rounded-xl border p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Utensils className="h-6 w-6 text-purple-600" />
                    Culinary & Nutrition
                  </h2>
                  {guide.culinaryUses && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Culinary Uses</h3>
                      <div className="flex flex-wrap gap-2">
                        {guide.culinaryUses.map((use, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                          >
                            {use}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {guide.nutritionalInfo && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Nutritional Information</h3>
                      <p className="text-gray-700">{guide.nutritionalInfo}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                {/* Quick Facts */}
                <div className="bg-white rounded-xl border p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Quick Facts</h3>
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-gray-600">Category</dt>
                      <dd className="font-semibold text-gray-900">{guide.category}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-600">Difficulty</dt>
                      <dd className="font-semibold text-gray-900">{guide.difficulty}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-600">Planting Depth</dt>
                      <dd className="font-semibold text-gray-900">{guide.depth}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-600">Germination</dt>
                      <dd className="font-semibold text-gray-900">{guide.daysToGermination}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-600">Planting Seasons</dt>
                      <dd className="font-semibold text-gray-900">
                        {guide.plantingSeasons.join(', ')}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-600">Harvest Seasons</dt>
                      <dd className="font-semibold text-gray-900">
                        {guide.harvestSeasons.join(', ')}
                      </dd>
                    </div>
                    <div className="pt-3 border-t">
                      <dt className="text-gray-600 flex items-center gap-1 mb-1">
                        <TrendingUp className="h-3 w-3" />
                        Popularity
                      </dt>
                      <dd className="font-semibold text-gray-900">{guide.popularityScore}%</dd>
                    </div>
                  </dl>
                </div>

                {/* Varieties */}
                {guide.varieties && guide.varieties.length > 0 && (
                  <div className="bg-white rounded-xl border p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Package className="h-5 w-5 text-emerald-600" />
                      Popular Varieties
                    </h3>
                    <ul className="space-y-2">
                      {guide.varieties.map((variety, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-emerald-600">•</span>
                          <span>{variety}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Data Source */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="font-semibold text-blue-900 mb-2">📊 Data Sources</h3>
                  <p className="text-sm text-blue-800 mb-2">
                    Information compiled from:
                  </p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• USDA Plants Database</li>
                    <li>• OpenFarm Community</li>
                    <li>• Extension Services</li>
                  </ul>
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

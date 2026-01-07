import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin,
  Ruler,
  Droplet,
  Zap,
  Home,
  Fence,
  Sun,
  CheckCircle,
  Star,
  ChevronLeft,
  Share2,
  Heart,
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ImageGallery } from '@/components/plot/image-gallery'
import { BookingCard } from '@/components/plot/booking-card'
import { SAMPLE_PLOTS } from '@/lib/sample-data'
import { formatCurrency } from '@/lib/utils'

export default async function PlotDetailPage({
  params,
}: {
  params: Promise<{ plotId: string }>
}) {
  const { plotId } = await params

  // Find the plot in sample data
  const plot = SAMPLE_PLOTS.find((p) => p.id === plotId)

  if (!plot) {
    notFound()
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        {/* Back Button & Actions */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/explore"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Back to explore</span>
            </Link>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="h-4 w-4" />
                <span className="text-sm font-medium">Share</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Heart className="h-4 w-4" />
                <span className="text-sm font-medium">Save</span>
              </button>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <ImageGallery images={plot.images} title={plot.title} />
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Plot Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Basic Info */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{plot.title}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {plot.city}, {plot.state}
                    </span>
                  </div>
                  {plot.averageRating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{plot.averageRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Key Features */}
              <div className="flex flex-wrap gap-4 pb-8 border-b">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                  <Ruler className="h-5 w-5 text-gray-700" />
                  <span className="font-medium">{plot.acreage} acres</span>
                </div>

                {plot.hasIrrigation && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                    <Droplet className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Irrigation</span>
                  </div>
                )}

                {plot.hasFencing && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                    <Fence className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">Fenced</span>
                  </div>
                )}

                {plot.hasGreenhouse && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-lg">
                    <Home className="h-5 w-5 text-orange-600" />
                    <span className="font-medium text-orange-900">Greenhouse</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About this plot</h2>
                <p className="text-gray-700 leading-relaxed">
                  This {plot.acreage}-acre plot offers excellent growing conditions with {plot.soilType.join(', ').toLowerCase()} soil.
                  Located in {plot.city}, {plot.state}, the plot provides {plot.waterAccess.map(w => w.toLowerCase().replace('_', ' ')).join(', ')} water access.
                  {plot.hasIrrigation && ' The property includes a complete irrigation system for optimal water management.'}
                  {plot.hasFencing && ' Fully fenced perimeter provides security and helps manage your growing space.'}
                  {plot.hasGreenhouse && ' The greenhouse extends your growing season and protects sensitive crops.'}
                </p>
              </div>

              {/* What this place offers */}
              <div className="pb-8 border-b">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What this place offers</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Droplet className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Water Access</p>
                      <p className="text-sm text-gray-600">{plot.waterAccess.join(', ')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Sun className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Soil Type</p>
                      <p className="text-sm text-gray-600">{plot.soilType.join(', ')}</p>
                    </div>
                  </div>

                  {plot.hasIrrigation && (
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Irrigation System</p>
                        <p className="text-sm text-gray-600">Full coverage</p>
                      </div>
                    </div>
                  )}

                  {plot.hasFencing && (
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Fencing</p>
                        <p className="text-sm text-gray-600">Complete perimeter</p>
                      </div>
                    </div>
                  )}

                  {plot.hasGreenhouse && (
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Greenhouse</p>
                        <p className="text-sm text-gray-600">Climate controlled</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Electricity</p>
                      <p className="text-sm text-gray-600">Available on-site</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Owner Section */}
              <div className="pb-8 border-b">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Meet your host</h2>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {plot.ownerName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{plot.ownerName}</h3>
                    <p className="text-gray-600 mb-4">Landowner since 2020</p>
                    <p className="text-gray-700">
                      Passionate about sustainable agriculture and helping new farmers get started.
                      I believe everyone should have access to quality farmland.
                    </p>
                    <div className="mt-4 flex gap-4 text-sm">
                      <div>
                        <span className="font-semibold">Response rate:</span> 100%
                      </div>
                      <div>
                        <span className="font-semibold">Response time:</span> Within an hour
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
                <p className="text-gray-700 mb-4">
                  {plot.city}, {plot.state}
                </p>
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Map view</p>
                    <p className="text-sm text-gray-500">Exact location shown after booking</p>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  ⭐ {plot.averageRating?.toFixed(1)} · No reviews yet
                </h2>
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">Be the first to review this plot!</p>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Card */}
            <div>
              <BookingCard
                pricePerMonth={plot.pricePerMonth}
                averageRating={plot.averageRating}
                reviewCount={0}
                plotTitle={plot.title}
              />
            </div>
          </div>
        </div>

        {/* Similar Plots */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-16 border-t">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar plots nearby</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SAMPLE_PLOTS.filter((p) => p.id !== plotId)
              .slice(0, 3)
              .map((similarPlot) => (
                <Link
                  key={similarPlot.id}
                  href={`/explore/${similarPlot.id}`}
                  className="group"
                >
                  <div className="rounded-lg overflow-hidden mb-3">
                    <img
                      src={similarPlot.images[0]}
                      alt={similarPlot.title}
                      className="w-full aspect-video object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                    {similarPlot.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {similarPlot.city}, {similarPlot.state}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-2">
                    {formatCurrency(similarPlot.pricePerMonth)}/month
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

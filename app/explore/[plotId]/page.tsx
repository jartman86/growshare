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
import { PlotReviewCard } from '@/components/plot/plot-review-card'
import { formatCurrency } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

async function getPlot(plotId: string) {
  try {
    const plot = await prisma.plot.findUnique({
      where: { id: plotId },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
            isVerified: true,
            createdAt: true,
          },
        },
        amenities: true,
        soilTests: {
          orderBy: { testDate: 'desc' },
          take: 1,
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            content: true,
            createdAt: true,
            response: true,
            respondedAt: true,
            helpfulCount: true,
            notHelpfulCount: true,
            authorId: true,
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        bookings: {
          where: { status: 'ACTIVE' },
          include: {
            renter: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
      },
    })

    if (plot) {
      // Increment view count asynchronously
      prisma.plot.update({
        where: { id: plotId },
        data: { viewCount: { increment: 1 } },
      }).catch((err: any) => console.error('Failed to increment view count:', err))
    }

    return plot
  } catch (error) {
    console.error('Error fetching plot:', error)
    return null
  }
}

export default async function PlotDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ plotId: string }>
  searchParams: Promise<{ booking?: string }>
}) {
  const { plotId } = await params
  const { booking } = await searchParams
  const { userId } = await auth()

  const plot = await getPlot(plotId)

  if (!plot) {
    notFound()
  }

  // Check if current user is the plot owner
  let isOwner = false
  let currentUser: { id: string } | null = null
  if (userId) {
    currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })
    isOwner = currentUser?.id === plot.owner.id
  }

  const ownerName = `${plot.owner.firstName} ${plot.owner.lastName}`
  const reviewCount = plot.reviews?.length || 0

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
                  {plot.description || `This ${plot.acreage}-acre plot offers excellent growing conditions with ${plot.soilType?.join(', ').toLowerCase()} soil.
                  Located in ${plot.city}, ${plot.state}, the plot provides ${plot.waterAccess?.map((w: string) => w.toLowerCase().replace('_', ' ')).join(', ')} water access.
                  ${plot.hasIrrigation ? ' The property includes a complete irrigation system for optimal water management.' : ''}
                  ${plot.hasFencing ? ' Fully fenced perimeter provides security and helps manage your growing space.' : ''}
                  ${plot.hasGreenhouse ? ' The greenhouse extends your growing season and protects sensitive crops.' : ''}`}
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
                  {plot.owner.avatar ? (
                    <img
                      src={plot.owner.avatar}
                      alt={ownerName}
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      {plot.owner.firstName.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{ownerName}</h3>
                    <p className="text-gray-600 mb-4">
                      Landowner since {new Date(plot.owner.createdAt).getFullYear()}
                    </p>
                    <p className="text-gray-700">
                      {plot.owner.bio || 'Passionate about sustainable agriculture and helping new farmers get started. I believe everyone should have access to quality farmland.'}
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
                  {reviewCount > 0 ? (
                    <>⭐ {plot.averageRating?.toFixed(1)} · {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</>
                  ) : (
                    <>⭐ No reviews yet</>
                  )}
                </h2>
                {reviewCount > 0 ? (
                  <div className="space-y-4">
                    {plot.reviews.map((review: any) => (
                      <PlotReviewCard
                        key={review.id}
                        review={review}
                        isOwner={isOwner}
                        ownerName={ownerName}
                        isOwnReview={currentUser?.id === review.authorId}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">
                      Be the first to review this plot!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Booking Card */}
            <div>
              <BookingCard
                plotId={plot.id}
                pricePerMonth={plot.pricePerMonth}
                pricePerSeason={plot.pricePerSeason ?? undefined}
                pricePerYear={plot.pricePerYear ?? undefined}
                averageRating={plot.averageRating ?? undefined}
                reviewCount={reviewCount}
                plotTitle={plot.title}
                instantBook={plot.instantBook}
                autoOpen={booking === 'true'}
              />
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </>
  )
}

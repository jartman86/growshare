'use client'

import { useState, useEffect } from 'react'
import { notFound, useParams, useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { StarRating } from '@/components/reviews/star-rating'
import { ReviewCard } from '@/components/reviews/review-card'
import { ReviewForm } from '@/components/reviews/review-form'
import type { Review } from '@/lib/reviews-data'
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  TrendingUp,
  User,
  Wrench,
  Package,
  Edit,
  Filter,
  Loader2,
} from 'lucide-react'

interface Tool {
  id: string
  name: string
  description: string
  category: string
  condition: string
  images: string[]
  ownerId: string
  owner: {
    id: string
    firstName: string
    lastName: string
    avatar: string | null
    isVerified: boolean
    bio: string | null
    location: string | null
  }
  listingType: string
  salePrice: number | null
  dailyRate: number | null
  weeklyRate: number | null
  depositRequired: number | null
  status: string
  location: string | null
  availableFrom: string | null
  availableTo: string | null
  createdAt: string
  rentals: Array<{ id: string; startDate: string; endDate: string; status: string }>
  _count?: {
    rentals: number
  }
}

interface ApiReview {
  id: string
  rating: number
  title?: string
  content: string
  createdAt: string
  response?: string
  respondedAt?: string
  author: {
    id: string
    firstName: string
    lastName: string
    avatar?: string
    isVerified?: boolean
  }
  toolRental?: {
    id: string
    tool: {
      id: string
      name: string
    }
  }
}

interface ReviewSummary {
  averageRating: number
  totalReviews: number
  ratingDistribution: { 1: number; 2: number; 3: number; 4: number; 5: number }
  verifiedRentalCount: number
  verifiedPurchaseCount: number
}

export default function ToolDetailPage() {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const { isSignedIn } = useUser()
  const toolId = params.toolId as string

  // Tool state
  const [tool, setTool] = useState<Tool | null>(null)
  const [loadingTool, setLoadingTool] = useState(true)
  const [toolError, setToolError] = useState<string | null>(null)

  // Reviews state
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating_high' | 'rating_low'>('recent')
  const [filterRating, setFilterRating] = useState<number | undefined>(undefined)
  const [apiReviews, setApiReviews] = useState<ApiReview[]>([])
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Fetch tool from API
  useEffect(() => {
    async function fetchTool() {
      try {
        setLoadingTool(true)
        const response = await fetch(`/api/tools/${toolId}`)
        if (!response.ok) {
          if (response.status === 404) {
            setToolError('not_found')
          } else {
            setToolError('Failed to load tool')
          }
          return
        }
        const data = await response.json()
        setTool(data)
      } catch (error) {
        console.error('Error fetching tool:', error)
        setToolError('Failed to load tool')
      } finally {
        setLoadingTool(false)
      }
    }
    fetchTool()
  }, [toolId])

  // Fetch reviews from API
  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch(`/api/reviews?toolId=${toolId}`)
        if (response.ok) {
          const data = await response.json()
          setApiReviews(data)
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        setLoadingReviews(false)
      }
    }
    fetchReviews()
  }, [toolId])

  // Transform API reviews to the format expected by ReviewCard
  const transformReview = (apiReview: ApiReview): Review => ({
    id: apiReview.id,
    targetType: 'tool',
    targetId: toolId,
    targetName: tool?.name || '',
    reviewerId: apiReview.author.id,
    reviewerName: `${apiReview.author.firstName} ${apiReview.author.lastName}`,
    reviewerAvatar: apiReview.author.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${apiReview.author.firstName}`,
    rating: apiReview.rating,
    title: apiReview.title || '',
    content: apiReview.content,
    verifiedRental: true, // All tool reviews are from verified rentals
    helpfulCount: 0,
    notHelpfulCount: 0,
    replyCount: 0,
    createdAt: new Date(apiReview.createdAt),
    isEdited: false,
    ownerResponse: apiReview.response ? {
      content: apiReview.response,
      respondedAt: new Date(apiReview.respondedAt || apiReview.createdAt),
      responderName: tool ? `${tool.owner.firstName} ${tool.owner.lastName}` : 'Owner',
    } : undefined,
  })

  // Loading state
  if (loadingTool) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading tool details...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Error state
  if (toolError === 'not_found' || !tool) {
    notFound()
  }

  if (toolError) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error loading tool</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{toolError}</p>
            <Link href="/tools" className="text-orange-600 hover:text-orange-700 font-medium">
              Back to Tools
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Computed values
  const ownerName = `${tool.owner.firstName} ${tool.owner.lastName}`
  const ownerAvatar = tool.owner.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${tool.owner.firstName}`
  const ownerLocation = tool.owner.location || tool.location || 'Unknown Location'
  const statusLower = tool.status.toLowerCase()
  const listingTypeLower = tool.listingType.toLowerCase()

  // Calculate weekly/monthly costs
  const dailyRate = tool.dailyRate || 0
  const weeklyRate = tool.weeklyRate || dailyRate * 7 * 0.85 // 15% weekly discount if not set
  const monthlyRate = dailyRate * 30 * 0.7 // 30% monthly discount

  // Transform reviews for display
  const reviews = apiReviews.map(transformReview)

  // Calculate review summary from fetched reviews
  const reviewSummary: ReviewSummary = {
    averageRating: reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0,
    totalReviews: reviews.length,
    ratingDistribution: {
      1: reviews.filter(r => r.rating === 1).length,
      2: reviews.filter(r => r.rating === 2).length,
      3: reviews.filter(r => r.rating === 3).length,
      4: reviews.filter(r => r.rating === 4).length,
      5: reviews.filter(r => r.rating === 5).length,
    },
    verifiedRentalCount: reviews.length, // All reviews are from verified rentals
    verifiedPurchaseCount: 0,
  }

  // Filter and sort reviews
  const filteredReviews = filterRating
    ? reviews.filter(r => r.rating === filterRating)
    : reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'rating_high':
        return b.rating - a.rating
      case 'rating_low':
        return a.rating - b.rating
      case 'recent':
      default:
        return b.createdAt.getTime() - a.createdAt.getTime()
    }
  })

  const requireAuth = (callback: () => void) => {
    if (!isSignedIn) {
      router.push(`/sign-in?redirect_url=${encodeURIComponent(pathname)}`)
      return
    }
    callback()
  }

  const handleSubmitReview = async (reviewData: { rating: number; title: string; content: string }) => {
    setSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId,
          rating: reviewData.rating,
          title: reviewData.title,
          content: reviewData.content,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setSubmitError(data.error || 'Failed to submit review')
        return
      }

      // Add the new review to the list
      setApiReviews(prev => [data, ...prev])
      setShowReviewForm(false)
    } catch {
      setSubmitError('Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Calculate next available date from active rentals
  const activeRentals = tool.rentals.filter(r =>
    r.status === 'ACTIVE' && new Date(r.endDate) > new Date()
  )
  const nextAvailable = activeRentals.length > 0
    ? new Date(Math.max(...activeRentals.map(r => new Date(r.endDate).getTime())))
    : null

  // Format category for display
  const categoryDisplay = tool.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const conditionDisplay = tool.condition.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tools
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Images */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
                <div className="relative h-96 bg-gray-100 dark:bg-gray-700">
                  {tool.images[0] ? (
                    <Image
                      src={tool.images[0]}
                      alt={tool.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Wrench className="h-24 w-24 text-gray-400" />
                    </div>
                  )}
                  {/* Status Badge */}
                  {statusLower === 'available' ? (
                    <div className="absolute top-4 right-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-lg">
                      Available Now
                    </div>
                  ) : statusLower === 'rented' ? (
                    <div className="absolute top-4 right-4 px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-lg">
                      Currently Rented
                    </div>
                  ) : (
                    <div className="absolute top-4 right-4 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-lg capitalize">
                      {statusLower}
                    </div>
                  )}
                  {dailyRate === 0 && (
                    <div className="absolute top-4 left-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-lg">
                      FREE TO BORROW
                    </div>
                  )}
                </div>
                {tool.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 p-4 bg-gray-50 dark:bg-gray-900">
                    {tool.images.map((image, index) => (
                      <div key={index} className="relative h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity">
                        <Image
                          src={image}
                          alt={`${tool.name} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tool Details */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{tool.name}</h1>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full font-medium">
                        {categoryDisplay}
                      </span>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-medium">
                        {conditionDisplay}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{reviewSummary.averageRating.toFixed(1)}</span>
                    <span className="text-gray-600 dark:text-gray-400">({reviewSummary.totalReviews} reviews)</span>
                  </div>
                </div>

                <div className="prose dark:prose-invert max-w-none mb-8">
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{tool.description}</p>
                </div>

                {/* Location */}
                {(tool.location || tool.owner.location) && (
                  <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <MapPin className="h-5 w-5 text-orange-600" />
                      <span>{tool.location || tool.owner.location}</span>
                    </div>
                  </div>
                )}

                {/* Availability */}
                {(tool.availableFrom || tool.availableTo) && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      Availability Window
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {tool.availableFrom && (
                        <span>From: {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(tool.availableFrom))}</span>
                      )}
                      {tool.availableFrom && tool.availableTo && <span className="mx-2">-</span>}
                      {tool.availableTo && (
                        <span>To: {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(tool.availableTo))}</span>
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Tool History & Stats</h3>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{tool._count?.rentals ?? tool.rentals.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Times Rented</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{reviewSummary.averageRating.toFixed(1)}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{reviewSummary.totalReviews}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Reviews</div>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-8" id="reviews">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews & Ratings</h3>
                  <button
                    onClick={() => requireAuth(() => setShowReviewForm(!showReviewForm))}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    Write a Review
                  </button>
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <div className="mb-8">
                    {submitError && (
                      <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        <p className="text-red-800 dark:text-red-400">{submitError}</p>
                      </div>
                    )}
                    <ReviewForm
                      targetName={tool.name}
                      targetType="tool"
                      onSubmit={handleSubmitReview}
                      onCancel={() => {
                        setShowReviewForm(false)
                        setSubmitError(null)
                      }}
                      isVerified={false}
                    />
                    {submitting && (
                      <div className="mt-4 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Submitting review...</span>
                      </div>
                    )}
                  </div>
                )}

                {loadingReviews ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : reviewSummary.totalReviews > 0 ? (
                  <>
                    {/* Review Summary */}
                    <div className="mb-8 p-6 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Overall Rating */}
                        <div className="text-center">
                          <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                            {reviewSummary.averageRating.toFixed(1)}
                          </div>
                          <StarRating rating={reviewSummary.averageRating} size="lg" />
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Based on {reviewSummary.totalReviews} review{reviewSummary.totalReviews !== 1 ? 's' : ''}
                          </p>
                          {(reviewSummary.verifiedPurchaseCount > 0 || reviewSummary.verifiedRentalCount > 0) && (
                            <p className="text-xs text-blue-700 dark:text-blue-400 mt-2">
                              {reviewSummary.verifiedRentalCount + reviewSummary.verifiedPurchaseCount} verified transaction{(reviewSummary.verifiedRentalCount + reviewSummary.verifiedPurchaseCount) !== 1 ? 's' : ''}
                            </p>
                          )}
                        </div>

                        {/* Rating Distribution */}
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((rating) => {
                            const count = reviewSummary.ratingDistribution[rating as keyof typeof reviewSummary.ratingDistribution]
                            const percentage = reviewSummary.totalReviews > 0
                              ? (count / reviewSummary.totalReviews) * 100
                              : 0

                            return (
                              <button
                                key={rating}
                                onClick={() => setFilterRating(filterRating === rating ? undefined : rating)}
                                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                                  filterRating === rating ? 'bg-yellow-100 dark:bg-yellow-900/40' : 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                                }`}
                              >
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-8">{rating} ★</span>
                                <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-yellow-400 transition-all"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">{count}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Sort & Filter Options */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {filterRating ? `Showing ${filterRating}-star reviews` : 'All reviews'}
                        </span>
                        {filterRating && (
                          <button
                            onClick={() => setFilterRating(undefined)}
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            Clear filter
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="recent">Most Recent</option>
                          <option value="helpful">Most Helpful</option>
                          <option value="rating_high">Highest Rating</option>
                          <option value="rating_low">Lowest Rating</option>
                        </select>
                      </div>
                    </div>

                    {/* Reviews List */}
                    {sortedReviews.length > 0 ? (
                      <div className="space-y-6">
                        {sortedReviews.map((review) => (
                          <ReviewCard key={review.id} review={review} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                        No {filterRating}-star reviews yet
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Star className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No reviews yet</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Be the first to review this tool!</p>
                    <button
                      onClick={() => requireAuth(() => setShowReviewForm(true))}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      <Edit className="h-5 w-5" />
                      Write the First Review
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Rental Card & Owner */}
            <div className="lg:col-span-1 space-y-6">
              {/* Pricing Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 sticky top-20">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {listingTypeLower === 'sale' ? 'Purchase Information' :
                   listingTypeLower === 'both' ? 'Pricing & Availability' :
                   'Rental Information'}
                </h3>

                {/* Sale Price */}
                {(listingTypeLower === 'sale' || listingTypeLower === 'both') && tool.salePrice && (
                  <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {listingTypeLower === 'both' ? 'Purchase Price' : 'Price'}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <DollarSign className="h-6 w-6 text-purple-600" />
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">{tool.salePrice}</span>
                    </div>
                  </div>
                )}

                {/* Rental Pricing */}
                {(listingTypeLower === 'rent' || listingTypeLower === 'both') && (
                  <div className="mb-6">
                    {listingTypeLower === 'both' && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Or Rent:</div>
                    )}
                    {dailyRate === 0 ? (
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">Free to Borrow</div>
                        {tool.depositRequired && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">Just pay ${tool.depositRequired} deposit</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-baseline justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Daily Rate</span>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-5 w-5 text-orange-600" />
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{dailyRate}</span>
                          </div>
                        </div>
                        {tool.weeklyRate && (
                          <div className="flex items-baseline justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Weekly Rate</span>
                            <span className="font-semibold text-gray-900 dark:text-white">${weeklyRate.toFixed(0)}</span>
                          </div>
                        )}
                        <div className="flex items-baseline justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Monthly (30 days)</span>
                          <span className="font-semibold text-gray-900 dark:text-white">${monthlyRate.toFixed(0)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Rental Terms */}
                {(listingTypeLower === 'rent' || listingTypeLower === 'both') && tool.depositRequired && (
                  <div className="space-y-3 mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Shield className="h-4 w-4" />
                        <span>Deposit Required</span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">${tool.depositRequired}</span>
                    </div>
                  </div>
                )}

                {/* CTA Buttons */}
                {statusLower === 'available' ? (
                  <div className="space-y-3">
                    {listingTypeLower === 'sale' && (
                      <button
                        onClick={() => requireAuth(() => {})}
                        className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                      >
                        Buy Now
                      </button>
                    )}
                    {listingTypeLower === 'rent' && (
                      <button
                        onClick={() => requireAuth(() => {})}
                        className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                      >
                        Request to Rent
                      </button>
                    )}
                    {listingTypeLower === 'both' && (
                      <>
                        <button
                          onClick={() => requireAuth(() => {})}
                          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                        >
                          Buy Now - ${tool.salePrice}
                        </button>
                        <button
                          onClick={() => requireAuth(() => {})}
                          className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                        >
                          Rent - ${dailyRate}/day
                        </button>
                      </>
                    )}
                  </div>
                ) : statusLower === 'rented' && nextAvailable ? (
                  <div>
                    <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg text-center mb-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Next Available</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {new Intl.DateTimeFormat('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        }).format(nextAvailable)}
                      </p>
                    </div>
                    <button
                      onClick={() => requireAuth(() => {})}
                      className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors mb-3"
                    >
                      Reserve for Next
                    </button>
                  </div>
                ) : statusLower === 'sold' ? (
                  <button className="w-full bg-gray-400 text-white py-3 rounded-lg font-semibold cursor-not-allowed mb-3" disabled>
                    Sold
                  </button>
                ) : (
                  <button className="w-full bg-gray-400 text-white py-3 rounded-lg font-semibold cursor-not-allowed mb-3" disabled>
                    Currently Unavailable
                  </button>
                )}

                <button
                  onClick={() => requireAuth(() => {})}
                  className="w-full border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 mt-3"
                >
                  <MessageSquare className="h-5 w-5" />
                  Message Owner
                </button>
              </div>

              {/* Owner Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tool Owner</h3>
                <Link href={`/profile/${tool.owner.id}`} className="flex items-center gap-3 mb-4 hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                  <Image
                    src={ownerAvatar}
                    alt={ownerName}
                    width={64}
                    height={64}
                    className="rounded-full border-2 border-gray-200 dark:border-gray-600"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">{ownerName}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span>{ownerLocation}</span>
                    </div>
                    {tool.owner.isVerified && (
                      <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                </Link>

                {tool.owner.bio && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{tool.owner.bio}</p>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Listed</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {new Intl.DateTimeFormat('en-US', {
                        month: 'short',
                        year: 'numeric',
                      }).format(new Date(tool.createdAt))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Response Time</span>
                    <span className="font-semibold text-gray-900 dark:text-white">Within 2 hours</span>
                  </div>
                </div>

                <Link
                  href={`/profile/${tool.owner.id}`}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <User className="h-4 w-4" />
                  View Profile
                </Link>
              </div>

              {/* Safety Tips */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Rental Tips
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Inspect the tool before taking it</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Take photos of the condition</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Follow all safety instructions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Return clean and on time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Report any issues immediately</span>
                  </li>
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

export interface Review {
  id: string
  // What is being reviewed
  targetType: 'tool' | 'resource' | 'user'
  targetId: string
  targetName: string

  // Reviewer info
  reviewerId: string
  reviewerName: string
  reviewerAvatar: string
  reviewerLevel?: number

  // Review content
  rating: number // 1-5
  title: string
  content: string
  pros?: string[]
  cons?: string[]
  photos?: string[]

  // Context
  verifiedPurchase?: boolean
  verifiedRental?: boolean
  rentalDuration?: string // e.g., "2 weeks"

  // Engagement
  helpfulCount: number
  notHelpfulCount: number
  replyCount: number

  // Metadata
  createdAt: Date
  updatedAt?: Date
  isEdited: boolean

  // Owner response
  ownerResponse?: {
    content: string
    respondedAt: Date
    responderName: string
  }
}

export interface ReviewSummary {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
  verifiedPurchaseCount: number
  verifiedRentalCount: number
}

// Sample reviews for tools
export const SAMPLE_REVIEWS: Review[] = [
  {
    id: 'review-1',
    targetType: 'tool',
    targetId: 'tool-1',
    targetName: 'Professional Garden Tiller',
    reviewerId: 'user-2',
    reviewerName: 'Michael Rodriguez',
    reviewerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    reviewerLevel: 8,
    rating: 5,
    title: 'Excellent tiller, made my garden prep so easy!',
    content: 'I rented this tiller for a weekend project and it exceeded my expectations. The engine started on the first pull and ran smoothly throughout. It handled my clay-heavy soil without any issues. Sarah was great to work with - very responsive and the tool was in perfect condition.',
    pros: ['Powerful engine', 'Easy to start', 'Well maintained', 'Great owner communication'],
    cons: ['A bit heavy to transport'],
    photos: [
      'https://images.unsplash.com/photo-1592424002053-21f369ce4e0f?w=800&h=600&fit=crop',
    ],
    verifiedRental: true,
    rentalDuration: '2 days',
    helpfulCount: 12,
    notHelpfulCount: 0,
    replyCount: 1,
    createdAt: new Date('2024-07-15T10:30:00'),
    isEdited: false,
    ownerResponse: {
      content: 'Thank you so much Michael! I\'m glad the tiller worked well for your project. You were a great renter and took excellent care of the equipment. Welcome back anytime!',
      respondedAt: new Date('2024-07-15T14:20:00'),
      responderName: 'Sarah Chen',
    },
  },
  {
    id: 'review-2',
    targetType: 'tool',
    targetId: 'tool-1',
    targetName: 'Professional Garden Tiller',
    reviewerId: 'user-5',
    reviewerName: 'Lisa Thompson',
    reviewerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    reviewerLevel: 5,
    rating: 4,
    title: 'Good tiller, gets the job done',
    content: 'Solid piece of equipment. Did exactly what I needed it to do for my raised bed preparation. The tiller worked well and was reasonably easy to operate. Only minor issue was that it was a bit louder than I expected, but that\'s typical for gas-powered equipment.',
    pros: ['Effective tilling', 'Good value', 'Owner provided helpful usage tips'],
    cons: ['Noisy', 'Gas smell'],
    verifiedRental: true,
    rentalDuration: '1 day',
    helpfulCount: 7,
    notHelpfulCount: 1,
    replyCount: 0,
    createdAt: new Date('2024-06-28T16:45:00'),
    isEdited: false,
  },
  {
    id: 'review-3',
    targetType: 'tool',
    targetId: 'tool-2',
    targetName: 'Electric Leaf Blower',
    reviewerId: 'user-1',
    reviewerName: 'Sarah Chen',
    reviewerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    reviewerLevel: 12,
    rating: 5,
    title: 'Perfect for quick cleanups!',
    content: 'I purchased this leaf blower and it\'s been fantastic. Being electric, it\'s quieter than gas models and there\'s no fumes. Perfect for clearing my patio and pathways. The variable speed control is really useful - you can go gentle for delicate areas or full blast for stubborn leaves.',
    pros: ['Quiet operation', 'No emissions', 'Variable speed', 'Lightweight'],
    cons: [],
    photos: [
      'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=800&h=600&fit=crop',
    ],
    verifiedPurchase: true,
    helpfulCount: 15,
    notHelpfulCount: 0,
    replyCount: 0,
    createdAt: new Date('2024-07-10T09:15:00'),
    isEdited: false,
  },
  {
    id: 'review-4',
    targetType: 'tool',
    targetId: 'tool-3',
    targetName: 'Pressure Washer',
    reviewerId: 'user-4',
    reviewerName: 'Jennifer Kim',
    reviewerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer',
    reviewerLevel: 6,
    rating: 5,
    title: 'Incredible cleaning power!',
    content: 'Rented this pressure washer to clean my deck and driveway before a family gathering. This thing is a beast! Years of grime came off in minutes. The adjustable nozzles are great for different surfaces. Robert was helpful in showing me how to use it safely and effectively.',
    pros: ['Powerful cleaning', 'Multiple nozzle options', 'Easy to use', 'Great instructions from owner'],
    cons: ['Uses a lot of water'],
    verifiedRental: true,
    rentalDuration: '3 days',
    helpfulCount: 9,
    notHelpfulCount: 0,
    replyCount: 1,
    createdAt: new Date('2024-07-05T11:20:00'),
    isEdited: false,
  },
  {
    id: 'review-5',
    targetType: 'tool',
    targetId: 'tool-4',
    targetName: 'Chainsaw (Gas-Powered)',
    reviewerId: 'user-3',
    reviewerName: 'Robert Martinez',
    reviewerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    reviewerLevel: 10,
    rating: 4,
    title: 'Powerful saw, but requires experience',
    content: 'This is a professional-grade chainsaw and it shows. Cut through several large branches that fell during a storm. Very powerful and well-maintained. If you\'re new to chainsaws, make sure you get proper instruction first - this is not a beginner tool.',
    pros: ['Very powerful', 'Sharp chain', 'Reliable', 'Well maintained'],
    cons: ['Heavy', 'Requires safety knowledge', 'Loud'],
    verifiedRental: true,
    rentalDuration: '1 day',
    helpfulCount: 11,
    notHelpfulCount: 2,
    replyCount: 0,
    createdAt: new Date('2024-06-20T14:30:00'),
    isEdited: true,
    updatedAt: new Date('2024-06-21T09:00:00'),
  },
  {
    id: 'review-6',
    targetType: 'tool',
    targetId: 'tool-8',
    targetName: 'Pole Saw (Extendable)',
    reviewerId: 'user-2',
    reviewerName: 'Michael Rodriguez',
    reviewerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    reviewerLevel: 8,
    rating: 5,
    title: 'Best purchase for tree maintenance',
    content: 'Bought this pole saw after renting it twice. It\'s perfect for trimming high branches without getting a ladder. The extension feature works smoothly and locks securely. The saw head is sharp and cuts cleanly. Great quality for the price.',
    pros: ['Extends to 12 feet', 'Lightweight', 'Sharp blade', 'Good value', 'No ladder needed'],
    cons: ['Takes practice to use at full extension'],
    verifiedPurchase: true,
    helpfulCount: 8,
    notHelpfulCount: 0,
    replyCount: 0,
    createdAt: new Date('2024-07-18T13:45:00'),
    isEdited: false,
  },
  {
    id: 'review-7',
    targetType: 'tool',
    targetId: 'tool-5',
    targetName: 'Wood Chipper',
    reviewerId: 'user-5',
    reviewerName: 'Lisa Thompson',
    reviewerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    reviewerLevel: 5,
    rating: 3,
    title: 'Works okay but jammed a few times',
    content: 'Rented this wood chipper for yard cleanup. It handled small branches fine, but jammed twice on slightly larger pieces. Had to stop and clear it out. Maybe I was feeding it too fast? The owner was responsive when I had questions, which was helpful.',
    pros: ['Good for small branches', 'Owner responsive to questions'],
    cons: ['Jammed on larger pieces', 'Instructions could be clearer'],
    verifiedRental: true,
    rentalDuration: '1 day',
    helpfulCount: 4,
    notHelpfulCount: 3,
    replyCount: 1,
    createdAt: new Date('2024-07-01T10:15:00'),
    isEdited: false,
    ownerResponse: {
      content: 'Thanks for the feedback Lisa. I\'m sorry about the jams - this model works best with branches under 2 inches. I\'ve updated my listing with more detailed guidelines on proper feeding techniques. Hope it still helped with your cleanup!',
      respondedAt: new Date('2024-07-01T15:30:00'),
      responderName: 'David Park',
    },
  },
]

// Helper function to get reviews for a specific target
export function getReviewsForTarget(targetType: string, targetId: string): Review[] {
  return SAMPLE_REVIEWS.filter(
    (review) => review.targetType === targetType && review.targetId === targetId
  )
}

// Helper function to calculate review summary
export function getReviewSummary(reviews: Review[]): ReviewSummary {
  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      verifiedPurchaseCount: 0,
      verifiedRentalCount: 0,
    }
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
  const averageRating = totalRating / reviews.length

  const ratingDistribution = reviews.reduce(
    (dist, review) => {
      dist[review.rating as keyof typeof dist]++
      return dist
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  )

  const verifiedPurchaseCount = reviews.filter((r) => r.verifiedPurchase).length
  const verifiedRentalCount = reviews.filter((r) => r.verifiedRental).length

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: reviews.length,
    ratingDistribution,
    verifiedPurchaseCount,
    verifiedRentalCount,
  }
}

// Helper function to sort reviews
export function sortReviews(
  reviews: Review[],
  sortBy: 'recent' | 'helpful' | 'rating_high' | 'rating_low'
): Review[] {
  const sorted = [...reviews]

  switch (sortBy) {
    case 'recent':
      return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    case 'helpful':
      return sorted.sort((a, b) => b.helpfulCount - a.helpfulCount)
    case 'rating_high':
      return sorted.sort((a, b) => b.rating - a.rating)
    case 'rating_low':
      return sorted.sort((a, b) => a.rating - b.rating)
    default:
      return sorted
  }
}

// Helper function to filter reviews by rating
export function filterReviewsByRating(reviews: Review[], rating?: number): Review[] {
  if (!rating) return reviews
  return reviews.filter((review) => review.rating === rating)
}

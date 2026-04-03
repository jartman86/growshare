export interface Review {
  id: string
  rating: number
  title?: string
  content: string
  pros?: string[]
  cons?: string[]
  photos?: string[]
  reviewerId: string
  reviewerName: string
  reviewerAvatar: string
  reviewerLevel?: number
  verifiedPurchase?: boolean
  verifiedRental?: boolean
  rentalDuration?: string
  isEdited?: boolean
  targetType?: string
  targetId?: string
  targetName?: string
  helpfulCount: number
  notHelpfulCount: number
  replyCount: number
  createdAt: Date
  ownerResponse?: {
    responderName: string
    respondedAt: Date
    content: string
  }
}

export type ReviewType = 'PLOT' | 'TOOL' | 'USER'

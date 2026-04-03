export type ForumCategory = string

export interface CommunityTopic {
  id: string
  title: string
  content: string
  category: ForumCategory
  authorName: string
  authorAvatar?: string | null
  tags: string[]
  isPinned: boolean
  isSolved: boolean
  views: number
  replyCount: number
  upvotes: number
  createdAt: Date
}

export interface ForumReply {
  id: string
  topicId: string
  content: string
  authorName: string
  authorAvatar?: string | null
  isAccepted: boolean
  upvotes: number
  images?: string[]
  createdAt: Date
  updatedAt: Date
}

/**
 * User Profiles & Achievements System
 *
 * Tracks user progress, achievements, and gamification elements
 */

export type AchievementCategory =
  | 'Getting Started'
  | 'Community'
  | 'Growing'
  | 'Marketplace'
  | 'Learning'
  | 'Social'
  | 'Expert'

export type AchievementTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum'

export interface Achievement {
  id: string
  name: string
  description: string
  category: AchievementCategory
  tier: AchievementTier
  icon: string // emoji or icon identifier
  points: number
  requirement: string
  unlockedBy?: number // percentage of users who have this
  secret?: boolean // hidden until unlocked
}

export interface UserLevel {
  level: number
  name: string
  minPoints: number
  maxPoints: number
  benefits: string[]
  badge: string
}

export interface UserProfile {
  id: string
  username: string
  displayName: string
  avatar: string
  bio?: string
  location?: string
  joinedAt: Date

  // Gamification Stats
  totalPoints: number
  level: number
  achievements: string[] // achievement IDs

  // Activity Stats
  plotsRented: number
  journalEntries: number
  marketplaceSales: number
  marketplacePurchases: number
  coursesCompleted: number
  forumPosts: number
  forumReplies: number
  eventsAttended: number
  eventsHosted: number

  // Social
  following: string[] // user IDs
  followers: string[] // user IDs

  // Specialties
  specialties: string[] // "Organic Farming", "Permaculture", etc.

  // Timestamps
  lastActive: Date
  updatedAt: Date
}

export interface ActivityItem {
  id: string
  userId: string
  type: 'achievement' | 'journal' | 'marketplace' | 'forum' | 'event' | 'course' | 'review'
  title: string
  description: string
  points?: number
  timestamp: Date
  metadata?: any
}

// Achievement Definitions
export const ACHIEVEMENTS: Achievement[] = [
  // Getting Started
  {
    id: 'welcome',
    name: 'Welcome to GrowShare',
    description: 'Complete your profile and get started',
    category: 'Getting Started',
    tier: 'Bronze',
    icon: '👋',
    points: 10,
    requirement: 'Complete profile setup',
    unlockedBy: 98,
  },
  {
    id: 'first-plot',
    name: 'Plot Pioneer',
    description: 'Rent your first plot',
    category: 'Getting Started',
    tier: 'Bronze',
    icon: '🌱',
    points: 50,
    requirement: 'Rent 1 plot',
    unlockedBy: 75,
  },
  {
    id: 'first-journal',
    name: 'Garden Chronicler',
    description: 'Create your first journal entry',
    category: 'Growing',
    tier: 'Bronze',
    icon: '📔',
    points: 25,
    requirement: 'Create 1 journal entry',
    unlockedBy: 82,
  },

  // Growing
  {
    id: 'journal-10',
    name: 'Dedicated Diarist',
    description: 'Create 10 journal entries',
    category: 'Growing',
    tier: 'Silver',
    icon: '📚',
    points: 100,
    requirement: 'Create 10 journal entries',
    unlockedBy: 45,
  },
  {
    id: 'first-harvest',
    name: 'First Harvest',
    description: 'Record your first harvest',
    category: 'Growing',
    tier: 'Silver',
    icon: '🌾',
    points: 150,
    requirement: 'Record 1 harvest',
    unlockedBy: 68,
  },
  {
    id: 'harvest-expert',
    name: 'Harvest Master',
    description: 'Record 10 successful harvests',
    category: 'Growing',
    tier: 'Gold',
    icon: '🏆',
    points: 500,
    requirement: 'Record 10 harvests',
    unlockedBy: 23,
  },

  // Community
  {
    id: 'first-post',
    name: 'Voice Heard',
    description: 'Start your first forum discussion',
    category: 'Community',
    tier: 'Bronze',
    icon: '💬',
    points: 50,
    requirement: 'Create 1 forum topic',
    unlockedBy: 65,
  },
  {
    id: 'helpful-neighbor',
    name: 'Helpful Neighbor',
    description: 'Reply to 10 forum discussions',
    category: 'Community',
    tier: 'Silver',
    icon: '🤝',
    points: 250,
    requirement: 'Post 10 forum replies',
    unlockedBy: 38,
  },
  {
    id: 'community-leader',
    name: 'Community Leader',
    description: 'Earn 100 upvotes on your forum posts',
    category: 'Community',
    tier: 'Gold',
    icon: '⭐',
    points: 750,
    requirement: 'Get 100 upvotes',
    unlockedBy: 12,
  },

  // Learning
  {
    id: 'first-course',
    name: 'Eager Learner',
    description: 'Complete your first course',
    category: 'Learning',
    tier: 'Bronze',
    icon: '🎓',
    points: 100,
    requirement: 'Complete 1 course',
    unlockedBy: 58,
  },
  {
    id: 'course-5',
    name: 'Knowledge Seeker',
    description: 'Complete 5 courses',
    category: 'Learning',
    tier: 'Silver',
    icon: '📖',
    points: 400,
    requirement: 'Complete 5 courses',
    unlockedBy: 28,
  },
  {
    id: 'all-certs',
    name: 'Master Gardener',
    description: 'Earn all certification courses',
    category: 'Learning',
    tier: 'Platinum',
    icon: '🌟',
    points: 2000,
    requirement: 'Complete all certified courses',
    unlockedBy: 5,
    secret: true,
  },

  // Marketplace
  {
    id: 'first-sale',
    name: 'Market Debut',
    description: 'Make your first marketplace sale',
    category: 'Marketplace',
    tier: 'Bronze',
    icon: '💰',
    points: 100,
    requirement: 'Sell 1 item',
    unlockedBy: 42,
  },
  {
    id: 'seller-10',
    name: 'Successful Seller',
    description: 'Complete 10 marketplace sales',
    category: 'Marketplace',
    tier: 'Silver',
    icon: '🛒',
    points: 500,
    requirement: 'Sell 10 items',
    unlockedBy: 18,
  },
  {
    id: 'top-seller',
    name: 'Market Master',
    description: 'Earn 5-star rating as seller',
    category: 'Marketplace',
    tier: 'Gold',
    icon: '🌟',
    points: 1000,
    requirement: '5-star rating with 20+ reviews',
    unlockedBy: 8,
  },

  // Events
  {
    id: 'first-event',
    name: 'Event Explorer',
    description: 'Attend your first community event',
    category: 'Social',
    tier: 'Bronze',
    icon: '🎪',
    points: 25,
    requirement: 'Attend 1 event',
    unlockedBy: 71,
  },
  {
    id: 'event-host',
    name: 'Event Organizer',
    description: 'Host your first community event',
    category: 'Social',
    tier: 'Silver',
    icon: '📅',
    points: 200,
    requirement: 'Host 1 event',
    unlockedBy: 22,
  },
  {
    id: 'social-butterfly',
    name: 'Social Butterfly',
    description: 'Attend 10 community events',
    category: 'Social',
    tier: 'Gold',
    icon: '🦋',
    points: 500,
    requirement: 'Attend 10 events',
    unlockedBy: 15,
  },

  // Expert/Advanced
  {
    id: 'plot-lister',
    name: 'Land Sharer',
    description: 'List your plot for others to rent',
    category: 'Expert',
    tier: 'Silver',
    icon: '🏡',
    points: 300,
    requirement: 'List 1 plot',
    unlockedBy: 32,
  },
  {
    id: 'point-milestone-1k',
    name: '1K Club',
    description: 'Earn 1,000 total points',
    category: 'Expert',
    tier: 'Silver',
    icon: '🎯',
    points: 0, // bonus achievement
    requirement: 'Earn 1,000 points',
    unlockedBy: 35,
  },
  {
    id: 'point-milestone-5k',
    name: '5K Legend',
    description: 'Earn 5,000 total points',
    category: 'Expert',
    tier: 'Gold',
    icon: '💎',
    points: 0,
    requirement: 'Earn 5,000 points',
    unlockedBy: 12,
  },
  {
    id: 'point-milestone-10k',
    name: 'GrowShare Elite',
    description: 'Earn 10,000 total points',
    category: 'Expert',
    tier: 'Platinum',
    icon: '👑',
    points: 0,
    requirement: 'Earn 10,000 points',
    unlockedBy: 3,
    secret: true,
  },
]

// Level System
export const USER_LEVELS: UserLevel[] = [
  {
    level: 1,
    name: 'Seedling',
    minPoints: 0,
    maxPoints: 99,
    badge: '🌱',
    benefits: ['Access to all basic features', 'Community forum access'],
  },
  {
    level: 2,
    name: 'Sprout',
    minPoints: 100,
    maxPoints: 249,
    badge: '🌿',
    benefits: ['All Seedling benefits', 'Profile customization', 'Post photos in forum'],
  },
  {
    level: 3,
    name: 'Young Plant',
    minPoints: 250,
    maxPoints: 499,
    badge: '🪴',
    benefits: ['All Sprout benefits', 'Verified badge', 'Priority support'],
  },
  {
    level: 4,
    name: 'Established Grower',
    minPoints: 500,
    maxPoints: 999,
    badge: '🌾',
    benefits: ['All Young Plant benefits', 'Featured listings', 'Event badges'],
  },
  {
    level: 5,
    name: 'Expert Gardener',
    minPoints: 1000,
    maxPoints: 2499,
    badge: '🌳',
    benefits: ['All Established benefits', 'Expert flair in forum', 'Course discounts'],
  },
  {
    level: 6,
    name: 'Master Grower',
    minPoints: 2500,
    maxPoints: 4999,
    badge: '🏆',
    benefits: ['All Expert benefits', 'Featured profile', 'Beta feature access'],
  },
  {
    level: 7,
    name: 'Community Legend',
    minPoints: 5000,
    maxPoints: 9999,
    badge: '⭐',
    benefits: ['All Master benefits', 'Mentor status', 'Exclusive events'],
  },
  {
    level: 8,
    name: 'GrowShare Guardian',
    minPoints: 10000,
    maxPoints: 999999,
    badge: '👑',
    benefits: ['All Legend benefits', 'Lifetime premium', 'Advisory board invitation'],
  },
]

// Sample User Profiles
export const SAMPLE_USERS: UserProfile[] = [
  {
    id: 'user-1',
    username: 'sarahchen',
    displayName: 'Sarah Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    bio: 'Organic farmer passionate about heirloom tomatoes and sustainable agriculture. Teaching others to grow their own food!',
    location: 'Portland, OR',
    joinedAt: new Date('2024-01-15'),
    totalPoints: 2847,
    level: 6,
    achievements: ['welcome', 'first-plot', 'first-journal', 'journal-10', 'first-harvest', 'harvest-expert', 'first-post', 'helpful-neighbor', 'first-course', 'course-5', 'first-sale', 'seller-10', 'first-event', 'plot-lister', 'point-milestone-1k'],
    plotsRented: 3,
    journalEntries: 47,
    marketplaceSales: 23,
    marketplacePurchases: 8,
    coursesCompleted: 6,
    forumPosts: 15,
    forumReplies: 89,
    eventsAttended: 12,
    eventsHosted: 2,
    following: ['user-2', 'user-3', 'user-5'],
    followers: ['user-2', 'user-3', 'user-4', 'user-6', 'user-7'],
    specialties: ['Organic Farming', 'Heirloom Varieties', 'Tomatoes'],
    lastActive: new Date('2024-07-20'),
    updatedAt: new Date('2024-07-20'),
  },
  {
    id: 'user-2',
    username: 'mikerodriguez',
    displayName: 'Michael Rodriguez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    bio: 'Market gardener specializing in organic pest management. Always happy to share IPM tips!',
    location: 'Eugene, OR',
    joinedAt: new Date('2024-02-01'),
    totalPoints: 1892,
    level: 5,
    achievements: ['welcome', 'first-plot', 'first-journal', 'journal-10', 'first-harvest', 'first-post', 'helpful-neighbor', 'first-course', 'first-sale', 'first-event', 'event-host', 'plot-lister', 'point-milestone-1k'],
    plotsRented: 2,
    journalEntries: 31,
    marketplaceSales: 18,
    marketplacePurchases: 12,
    coursesCompleted: 4,
    forumPosts: 22,
    forumReplies: 67,
    eventsAttended: 8,
    eventsHosted: 1,
    following: ['user-1', 'user-4'],
    followers: ['user-1', 'user-3', 'user-5'],
    specialties: ['Pest Management', 'Organic Methods', 'Market Gardening'],
    lastActive: new Date('2024-07-19'),
    updatedAt: new Date('2024-07-19'),
  },
  {
    id: 'user-3',
    username: 'emmathompson',
    displayName: 'Emma Thompson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    bio: 'Herb enthusiast and seed saver. Love organizing seed swaps and sharing garden wisdom.',
    location: 'Salem, OR',
    joinedAt: new Date('2024-03-10'),
    totalPoints: 1456,
    level: 5,
    achievements: ['welcome', 'first-plot', 'first-journal', 'first-harvest', 'first-post', 'helpful-neighbor', 'first-course', 'first-event', 'event-host', 'social-butterfly', 'point-milestone-1k'],
    plotsRented: 1,
    journalEntries: 28,
    marketplaceSales: 9,
    marketplacePurchases: 15,
    coursesCompleted: 3,
    forumPosts: 18,
    forumReplies: 54,
    eventsAttended: 15,
    eventsHosted: 3,
    following: ['user-1', 'user-2', 'user-4', 'user-5'],
    followers: ['user-1', 'user-6'],
    specialties: ['Herbs', 'Seed Saving', 'Community Building'],
    lastActive: new Date('2024-07-20'),
    updatedAt: new Date('2024-07-20'),
  },
]

// Helper function to calculate level from points
export function getLevelFromPoints(points: number): UserLevel {
  for (let i = USER_LEVELS.length - 1; i >= 0; i--) {
    if (points >= USER_LEVELS[i].minPoints) {
      return USER_LEVELS[i]
    }
  }
  return USER_LEVELS[0]
}

// Helper function to get progress to next level
export function getProgressToNextLevel(points: number): {
  currentLevel: UserLevel
  nextLevel: UserLevel | null
  progress: number // 0-100
  pointsNeeded: number
} {
  const currentLevel = getLevelFromPoints(points)
  const currentLevelIndex = USER_LEVELS.findIndex(l => l.level === currentLevel.level)
  const nextLevel = currentLevelIndex < USER_LEVELS.length - 1 ? USER_LEVELS[currentLevelIndex + 1] : null

  if (!nextLevel) {
    return {
      currentLevel,
      nextLevel: null,
      progress: 100,
      pointsNeeded: 0,
    }
  }

  const pointsInCurrentLevel = points - currentLevel.minPoints
  const pointsNeededForLevel = nextLevel.minPoints - currentLevel.minPoints
  const progress = Math.floor((pointsInCurrentLevel / pointsNeededForLevel) * 100)
  const pointsNeeded = nextLevel.minPoints - points

  return {
    currentLevel,
    nextLevel,
    progress,
    pointsNeeded,
  }
}

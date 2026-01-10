export type ChallengeType = 'individual' | 'team' | 'community'
export type ChallengeDifficulty = 'beginner' | 'intermediate' | 'advanced'
export type ChallengeStatus = 'upcoming' | 'active' | 'completed' | 'expired'
export type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'year-round'

export interface Challenge {
  id: string
  title: string
  slug: string
  description: string
  longDescription: string
  type: ChallengeType
  difficulty: ChallengeDifficulty
  status: ChallengeStatus
  season: Season

  // Timing
  startDate: Date
  endDate: Date
  duration: string // e.g., "30 days", "3 months"

  // Requirements
  requirements: string[]
  tasks: ChallengeTask[]

  // Rewards
  rewards: {
    points: number
    badges?: string[]
    title?: string
    description: string
  }

  // Participation
  participants: number
  maxParticipants?: number
  completions: number

  // Media
  image: string
  icon: string

  // Progress tracking
  category: string
  tags: string[]

  // Social
  featured: boolean
  createdBy?: string
}

export interface ChallengeTask {
  id: string
  description: string
  points: number
  required: boolean
  completed?: boolean
}

export interface UserChallengeProgress {
  userId: string
  challengeId: string
  status: 'not_started' | 'in_progress' | 'completed' | 'failed'
  progress: number // 0-100
  completedTasks: string[] // task IDs
  startedAt?: Date
  completedAt?: Date
  totalPoints: number
}

// Sample challenges
export const SAMPLE_CHALLENGES: Challenge[] = [
  {
    id: 'challenge-1',
    title: 'Spring Seedling Starter',
    slug: 'spring-seedling-starter',
    description: 'Start your spring garden by growing at least 3 different vegetables from seed',
    longDescription: "Welcome spring by starting your own seedlings! This challenge will help you learn the basics of seed starting and get your garden off to a great start. You'll gain confidence in growing from seed and save money compared to buying transplants.",
    type: 'individual',
    difficulty: 'beginner',
    status: 'active',
    season: 'spring',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-05-31'),
    duration: '3 months',
    requirements: [
      'Start at least 3 different vegetable varieties from seed',
      'Document your progress with photos',
      'Successfully transplant seedlings to garden or containers',
    ],
    tasks: [
      {
        id: 'task-1-1',
        description: 'Choose your seed varieties and purchase/trade for seeds',
        points: 50,
        required: true,
      },
      {
        id: 'task-1-2',
        description: 'Plant seeds in starter containers',
        points: 100,
        required: true,
      },
      {
        id: 'task-1-3',
        description: 'Share a photo of your seedlings sprouting',
        points: 75,
        required: true,
      },
      {
        id: 'task-1-4',
        description: 'Successfully transplant seedlings to final location',
        points: 150,
        required: true,
      },
      {
        id: 'task-1-5',
        description: 'Share tips or lessons learned in the forum',
        points: 50,
        required: false,
      },
    ],
    rewards: {
      points: 500,
      badges: ['Seed Starter', 'Spring Grower'],
      title: 'Seedling Master',
      description: 'Earn 500 points, the "Seed Starter" badge, and unlock the "Seedling Master" title',
    },
    participants: 142,
    completions: 89,
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=400&fit=crop',
    icon: '🌱',
    category: 'Growing',
    tags: ['seeds', 'spring', 'vegetables', 'beginner-friendly'],
    featured: true,
  },
  {
    id: 'challenge-2',
    title: 'Summer Harvest Challenge',
    slug: 'summer-harvest-challenge',
    description: 'Harvest and document at least 20 pounds of produce from your garden this summer',
    longDescription: "Track your summer bounty and compete with fellow gardeners! This challenge encourages you to maximize your harvest, keep good records, and celebrate the fruits of your labor. Whether it's tomatoes, squash, or cucumbers, every pound counts!",
    type: 'individual',
    difficulty: 'intermediate',
    status: 'active',
    season: 'summer',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-08-31'),
    duration: '3 months',
    requirements: [
      'Harvest at least 20 pounds total from your garden',
      'Track harvests with dates and weights',
      'Share photos of your best harvests',
    ],
    tasks: [
      {
        id: 'task-2-1',
        description: 'Set up a harvest tracking system (journal, app, spreadsheet)',
        points: 50,
        required: true,
      },
      {
        id: 'task-2-2',
        description: 'Reach 5 pounds harvested',
        points: 100,
        required: true,
      },
      {
        id: 'task-2-3',
        description: 'Reach 10 pounds harvested',
        points: 100,
        required: true,
      },
      {
        id: 'task-2-4',
        description: 'Reach 20 pounds harvested',
        points: 200,
        required: true,
      },
      {
        id: 'task-2-5',
        description: 'Share your best harvest photo',
        points: 75,
        required: true,
      },
      {
        id: 'task-2-6',
        description: 'Share or donate surplus harvest to neighbors',
        points: 100,
        required: false,
      },
    ],
    rewards: {
      points: 750,
      badges: ['Harvest Hero', 'Summer Bounty'],
      description: 'Earn 750 points and the "Harvest Hero" badge',
    },
    participants: 98,
    completions: 47,
    image: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=800&h=400&fit=crop',
    icon: '🍅',
    category: 'Growing',
    tags: ['harvest', 'summer', 'tracking', 'competition'],
    featured: true,
  },
  {
    id: 'challenge-3',
    title: 'Composting Champion',
    slug: 'composting-champion',
    description: 'Start and maintain a compost system for 60 days',
    longDescription: "Turn your food scraps and yard waste into black gold! This challenge will help you establish a composting habit and learn the science of decomposition. By the end, you'll have rich compost to feed your garden and reduce waste going to landfills.",
    type: 'individual',
    difficulty: 'beginner',
    status: 'active',
    season: 'year-round',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    duration: '60 days from start',
    requirements: [
      'Set up a composting system (bin, pile, or tumbler)',
      'Add materials regularly for 60 days',
      'Monitor and maintain proper conditions',
    ],
    tasks: [
      {
        id: 'task-3-1',
        description: 'Set up your compost bin or pile',
        points: 100,
        required: true,
      },
      {
        id: 'task-3-2',
        description: 'Add your first batch of materials (greens + browns)',
        points: 50,
        required: true,
      },
      {
        id: 'task-3-3',
        description: 'Maintain for 30 days with regular additions',
        points: 150,
        required: true,
      },
      {
        id: 'task-3-4',
        description: 'Complete 60 days of composting',
        points: 200,
        required: true,
      },
      {
        id: 'task-3-5',
        description: 'Share tips about what worked well for you',
        points: 50,
        required: false,
      },
    ],
    rewards: {
      points: 600,
      badges: ['Composting Champion', 'Waste Warrior'],
      description: 'Earn 600 points and become a certified composting champion',
    },
    participants: 76,
    completions: 54,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&h=400&fit=crop',
    icon: '♻️',
    category: 'Sustainability',
    tags: ['composting', 'sustainability', 'year-round', 'beginner-friendly'],
    featured: false,
  },
  {
    id: 'challenge-4',
    title: 'Tool Sharing Hero',
    slug: 'tool-sharing-hero',
    description: 'Share your tools with at least 5 different community members',
    longDescription: "Be the community hero by sharing your tools and equipment! This challenge celebrates the sharing economy and helps build stronger community connections. Every tool shared saves resources and builds trust within GrowShare.",
    type: 'individual',
    difficulty: 'beginner',
    status: 'active',
    season: 'year-round',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    duration: 'Ongoing',
    requirements: [
      'List at least 3 tools on GrowShare',
      'Successfully lend tools to 5 different members',
      'Maintain a 4.5+ star rating',
    ],
    tasks: [
      {
        id: 'task-4-1',
        description: 'List your first 3 tools on the marketplace',
        points: 100,
        required: true,
      },
      {
        id: 'task-4-2',
        description: 'Complete your first successful tool rental',
        points: 100,
        required: true,
      },
      {
        id: 'task-4-3',
        description: 'Lend to 3 different community members',
        points: 150,
        required: true,
      },
      {
        id: 'task-4-4',
        description: 'Lend to 5 different community members',
        points: 200,
        required: true,
      },
      {
        id: 'task-4-5',
        description: 'Receive a 5-star review',
        points: 50,
        required: false,
      },
    ],
    rewards: {
      points: 650,
      badges: ['Tool Sharing Hero', 'Community Builder'],
      description: 'Earn 650 points and the "Tool Sharing Hero" badge',
    },
    participants: 53,
    completions: 31,
    image: 'https://images.unsplash.com/photo-1580169980114-ccd0babfa840?w=800&h=400&fit=crop',
    icon: '🔧',
    category: 'Community',
    tags: ['tool-sharing', 'community', 'year-round'],
    featured: false,
  },
  {
    id: 'challenge-5',
    title: 'Fall Garden Preparation',
    slug: 'fall-garden-prep',
    description: 'Prepare your garden for winter and plant fall crops',
    longDescription: "Don't let your garden rest just yet! This fall challenge helps you extend your growing season, put your garden to bed properly, and set yourself up for success next spring. Learn cover cropping, mulching, and fall planting techniques.",
    type: 'individual',
    difficulty: 'intermediate',
    status: 'upcoming',
    season: 'fall',
    startDate: new Date('2024-09-01'),
    endDate: new Date('2024-11-30'),
    duration: '3 months',
    requirements: [
      'Plant at least 2 fall crops',
      'Prepare garden beds for winter',
      'Document your fall garden activities',
    ],
    tasks: [
      {
        id: 'task-5-1',
        description: 'Plant fall crops (lettuce, kale, garlic, etc.)',
        points: 150,
        required: true,
      },
      {
        id: 'task-5-2',
        description: 'Add compost or amendments to beds',
        points: 100,
        required: true,
      },
      {
        id: 'task-5-3',
        description: 'Mulch beds or plant cover crop',
        points: 150,
        required: true,
      },
      {
        id: 'task-5-4',
        description: 'Clean and store tools properly',
        points: 50,
        required: true,
      },
      {
        id: 'task-5-5',
        description: 'Share your fall garden plan in the forum',
        points: 50,
        required: false,
      },
    ],
    rewards: {
      points: 550,
      badges: ['Fall Planner', 'Season Extender'],
      description: 'Earn 550 points and prepare for a successful spring',
    },
    participants: 0,
    completions: 0,
    image: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=800&h=400&fit=crop',
    icon: '🍂',
    category: 'Growing',
    tags: ['fall', 'preparation', 'cover-crops', 'planning'],
    featured: true,
  },
  {
    id: 'challenge-6',
    title: 'Community Garden Team Challenge',
    slug: 'community-garden-team',
    description: 'Work with your local group to create or maintain a community garden space',
    longDescription: "Team up with your local GrowShare group to build community! This team challenge brings neighbors together to create or improve shared growing spaces. Great for building connections and learning from experienced gardeners.",
    type: 'team',
    difficulty: 'intermediate',
    status: 'active',
    season: 'year-round',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    duration: 'Ongoing',
    requirements: [
      'Form a team of at least 3 members',
      'Complete at least 5 community workdays',
      'Document your progress with photos',
    ],
    tasks: [
      {
        id: 'task-6-1',
        description: 'Form your team (min 3 members)',
        points: 100,
        required: true,
      },
      {
        id: 'task-6-2',
        description: 'Plan your community garden project',
        points: 100,
        required: true,
      },
      {
        id: 'task-6-3',
        description: 'Complete 3 community workdays',
        points: 300,
        required: true,
      },
      {
        id: 'task-6-4',
        description: 'Complete 5 community workdays',
        points: 400,
        required: true,
      },
      {
        id: 'task-6-5',
        description: 'Share photos and progress updates',
        points: 100,
        required: true,
      },
    ],
    rewards: {
      points: 1000,
      badges: ['Team Builder', 'Community Champion'],
      description: 'Earn 1000 points per team member and special team badge',
    },
    participants: 24,
    maxParticipants: 100,
    completions: 4,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop',
    icon: '👥',
    category: 'Community',
    tags: ['team', 'community-garden', 'collaboration', 'year-round'],
    featured: true,
  },
]

// Helper functions
export function getActiveChallenges(): Challenge[] {
  return SAMPLE_CHALLENGES.filter((c) => c.status === 'active')
}

export function getUpcomingChallenges(): Challenge[] {
  return SAMPLE_CHALLENGES.filter((c) => c.status === 'upcoming')
}

export function getFeaturedChallenges(): Challenge[] {
  return SAMPLE_CHALLENGES.filter((c) => c.featured)
}

export function getChallengesByDifficulty(difficulty: ChallengeDifficulty): Challenge[] {
  return SAMPLE_CHALLENGES.filter((c) => c.difficulty === difficulty)
}

export function getChallengesBySeason(season: Season): Challenge[] {
  return SAMPLE_CHALLENGES.filter((c) => c.season === season || c.season === 'year-round')
}

export function getChallengeBySlug(slug: string): Challenge | undefined {
  return SAMPLE_CHALLENGES.find((c) => c.slug === slug)
}

export function calculateChallengeProgress(
  challenge: Challenge,
  completedTasks: string[]
): number {
  const requiredTasks = challenge.tasks.filter((t) => t.required)
  const completedRequiredTasks = requiredTasks.filter((t) =>
    completedTasks.includes(t.id)
  )
  return Math.round((completedRequiredTasks.length / requiredTasks.length) * 100)
}

export function getDifficultyColor(difficulty: ChallengeDifficulty): string {
  switch (difficulty) {
    case 'beginner':
      return 'text-green-600 bg-green-100'
    case 'intermediate':
      return 'text-yellow-600 bg-yellow-100'
    case 'advanced':
      return 'text-red-600 bg-red-100'
  }
}

export function getSeasonColor(season: Season): string {
  switch (season) {
    case 'spring':
      return 'text-green-600 bg-green-100'
    case 'summer':
      return 'text-yellow-600 bg-yellow-100'
    case 'fall':
      return 'text-orange-600 bg-orange-100'
    case 'winter':
      return 'text-blue-600 bg-blue-100'
    case 'year-round':
      return 'text-purple-600 bg-purple-100'
  }
}

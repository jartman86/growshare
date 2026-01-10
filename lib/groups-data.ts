export interface LocalGroup {
  id: string
  name: string
  slug: string
  description: string
  location: {
    city: string
    state: string
    zipCode?: string
    radius?: number // miles
  }
  coverImage: string
  memberCount: number
  activeMembers: number // active in last 30 days
  founded: Date

  // Leadership
  leaders: {
    id: string
    name: string
    avatar: string
    role: 'founder' | 'moderator' | 'coordinator'
  }[]

  // Stats
  stats: {
    events: number
    resources: number
    tools: number
    posts: number
  }

  // Settings
  isPublic: boolean
  requiresApproval: boolean
  tags: string[]

  // Activity
  lastActivity: Date
  upcomingEvents?: number
}

export interface GroupMember {
  userId: string
  groupId: string
  userName: string
  userAvatar: string
  role: 'member' | 'moderator' | 'leader'
  joinedAt: Date
  lastActive: Date
  contributions: {
    posts: number
    events: number
    tools: number
  }
}

// Sample local groups
export const SAMPLE_LOCAL_GROUPS: LocalGroup[] = [
  {
    id: 'group-1',
    name: 'Portland Urban Gardeners',
    slug: 'portland-urban-gardeners',
    description: 'A community of urban gardeners in Portland helping each other grow food in small spaces. We share tools, seeds, knowledge, and host regular meetups and workshops.',
    location: {
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      radius: 15,
    },
    coverImage: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&h=400&fit=crop',
    memberCount: 247,
    activeMembers: 89,
    founded: new Date('2023-03-15'),
    leaders: [
      {
        id: 'user-1',
        name: 'Sarah Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        role: 'founder',
      },
      {
        id: 'user-2',
        name: 'Michael Rodriguez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
        role: 'moderator',
      },
    ],
    stats: {
      events: 42,
      resources: 28,
      tools: 65,
      posts: 312,
    },
    isPublic: true,
    requiresApproval: false,
    tags: ['urban-gardening', 'tool-sharing', 'community-garden', 'workshops'],
    lastActivity: new Date('2024-07-21T16:30:00'),
    upcomingEvents: 3,
  },
  {
    id: 'group-2',
    name: 'Seattle Backyard Farmers',
    slug: 'seattle-backyard-farmers',
    description: 'Turning Seattle backyards into productive food gardens! Join us for seed swaps, harvest celebrations, and learn sustainable farming practices perfect for Pacific Northwest climate.',
    location: {
      city: 'Seattle',
      state: 'WA',
      radius: 20,
    },
    coverImage: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&h=400&fit=crop',
    memberCount: 183,
    activeMembers: 67,
    founded: new Date('2023-05-20'),
    leaders: [
      {
        id: 'user-3',
        name: 'Robert Martinez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
        role: 'founder',
      },
    ],
    stats: {
      events: 28,
      resources: 19,
      tools: 43,
      posts: 189,
    },
    isPublic: true,
    requiresApproval: false,
    tags: ['backyard-farming', 'pacific-northwest', 'seed-saving', 'permaculture'],
    lastActivity: new Date('2024-07-20T14:20:00'),
    upcomingEvents: 2,
  },
  {
    id: 'group-3',
    name: 'Eugene Permaculture Collective',
    slug: 'eugene-permaculture',
    description: 'Dedicated to regenerative agriculture and permaculture principles. We focus on building soil health, water conservation, and creating resilient food systems in the Eugene area.',
    location: {
      city: 'Eugene',
      state: 'OR',
      radius: 25,
    },
    coverImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&h=400&fit=crop',
    memberCount: 94,
    activeMembers: 41,
    founded: new Date('2023-08-10'),
    leaders: [
      {
        id: 'user-5',
        name: 'Lisa Thompson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
        role: 'founder',
      },
      {
        id: 'user-6',
        name: 'David Park',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
        role: 'coordinator',
      },
    ],
    stats: {
      events: 15,
      resources: 31,
      tools: 27,
      posts: 98,
    },
    isPublic: true,
    requiresApproval: true,
    tags: ['permaculture', 'regenerative-agriculture', 'composting', 'water-conservation'],
    lastActivity: new Date('2024-07-19T11:45:00'),
    upcomingEvents: 1,
  },
  {
    id: 'group-4',
    name: 'Beaverton Community Gardens',
    slug: 'beaverton-community-gardens',
    description: 'Managing community garden plots and sharing growing tips for the Beaverton area. Great for beginners and experienced gardeners alike!',
    location: {
      city: 'Beaverton',
      state: 'OR',
      radius: 10,
    },
    coverImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=400&fit=crop',
    memberCount: 156,
    activeMembers: 52,
    founded: new Date('2023-04-01'),
    leaders: [
      {
        id: 'user-4',
        name: 'Jennifer Kim',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer',
        role: 'founder',
      },
    ],
    stats: {
      events: 22,
      resources: 17,
      tools: 38,
      posts: 145,
    },
    isPublic: true,
    requiresApproval: false,
    tags: ['community-garden', 'plot-rental', 'beginners-welcome', 'organic'],
    lastActivity: new Date('2024-07-21T09:15:00'),
    upcomingEvents: 4,
  },
  {
    id: 'group-5',
    name: 'Vancouver Urban Homesteaders',
    slug: 'vancouver-urban-homesteaders',
    description: 'Urban homesteading in Vancouver, WA! Chickens, bees, gardens, preservation, and self-sufficiency. Learn to grow, preserve, and store your own food.',
    location: {
      city: 'Vancouver',
      state: 'WA',
      radius: 12,
    },
    coverImage: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=1200&h=400&fit=crop',
    memberCount: 128,
    activeMembers: 48,
    founded: new Date('2023-06-12'),
    leaders: [
      {
        id: 'user-7',
        name: 'Emily Watson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        role: 'founder',
      },
    ],
    stats: {
      events: 19,
      resources: 24,
      tools: 31,
      posts: 167,
    },
    isPublic: true,
    requiresApproval: false,
    tags: ['homesteading', 'chickens', 'beekeeping', 'food-preservation', 'self-sufficiency'],
    lastActivity: new Date('2024-07-18T15:30:00'),
    upcomingEvents: 2,
  },
]

// Helper functions
export function getGroupsByLocation(city: string, state?: string): LocalGroup[] {
  return SAMPLE_LOCAL_GROUPS.filter(
    (group) =>
      group.location.city.toLowerCase() === city.toLowerCase() &&
      (!state || group.location.state.toLowerCase() === state.toLowerCase())
  )
}

export function getGroupBySlug(slug: string): LocalGroup | undefined {
  return SAMPLE_LOCAL_GROUPS.find((group) => group.slug === slug)
}

export function getGroupById(id: string): LocalGroup | undefined {
  return SAMPLE_LOCAL_GROUPS.find((group) => group.id === id)
}

export function getNearbyGroups(userCity: string, userState: string): LocalGroup[] {
  // In a real app, this would use geolocation and radius
  // For now, return groups in the same state
  return SAMPLE_LOCAL_GROUPS.filter(
    (group) => group.location.state === userState
  ).sort((a, b) => b.memberCount - a.memberCount)
}

export function getPopularGroups(limit: number = 5): LocalGroup[] {
  return [...SAMPLE_LOCAL_GROUPS]
    .sort((a, b) => b.memberCount - a.memberCount)
    .slice(0, limit)
}

export function getActiveGroups(limit: number = 5): LocalGroup[] {
  return [...SAMPLE_LOCAL_GROUPS]
    .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
    .slice(0, limit)
}

export function formatGroupMemberCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return count.toString()
}

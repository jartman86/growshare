// Badge definitions for the gamification system
export const BADGES = {
  // Milestone Badges
  FIRST_PLOT_RENTED: {
    name: 'First Steps',
    description: 'Rented your first plot',
    category: 'MILESTONE',
    tier: 'BRONZE',
    icon: '🌱',
    points: 100,
    criteria: { type: 'PLOT_RENTED', count: 1 }
  },
  FIRST_HARVEST: {
    name: 'First Harvest',
    description: 'Logged your first harvest',
    category: 'MILESTONE',
    tier: 'BRONZE',
    icon: '🥕',
    points: 150,
    criteria: { type: 'HARVEST_LOGGED', count: 1 }
  },
  ONE_YEAR_ANNIVERSARY: {
    name: 'Seasoned Grower',
    description: 'One year of continuous farming',
    category: 'MILESTONE',
    tier: 'GOLD',
    icon: '🎂',
    points: 1000,
    criteria: { type: 'DAYS_ACTIVE', count: 365 }
  },

  // Skill Certifications
  SOIL_HEALTH_CERTIFIED: {
    name: 'Soil Health Certified',
    description: 'Completed Soil Health Fundamentals course',
    category: 'SKILL',
    tier: 'SILVER',
    icon: '🌍',
    points: 250,
    criteria: { type: 'COURSE_COMPLETED', courseId: 'soil-health-fundamentals' }
  },
  ORGANIC_PRACTICES: {
    name: 'Organic Practitioner',
    description: 'Certified in organic farming practices',
    category: 'SKILL',
    tier: 'GOLD',
    icon: '🌿',
    points: 500,
    criteria: { type: 'COURSE_COMPLETED', courseId: 'organic-practices' }
  },
  PERMACULTURE_PRACTITIONER: {
    name: 'Permaculture Practitioner',
    description: 'Master of permaculture design',
    category: 'SKILL',
    tier: 'PLATINUM',
    icon: '🌳',
    points: 1000,
    criteria: { type: 'COURSE_COMPLETED', courseId: 'permaculture-design' }
  },

  // Community Contributions
  HELPFUL_NEIGHBOR: {
    name: 'Helpful Neighbor',
    description: 'Answered 10 community questions',
    category: 'COMMUNITY',
    tier: 'BRONZE',
    icon: '🤝',
    points: 200,
    criteria: { type: 'FORUM_ANSWERS', count: 10 }
  },
  MENTOR: {
    name: 'Mentor',
    description: 'Mentored a new farmer',
    category: 'COMMUNITY',
    tier: 'GOLD',
    icon: '👨‍🌾',
    points: 500,
    criteria: { type: 'MENTORSHIP_COMPLETED', count: 1 }
  },

  // Production Records
  HUNDRED_POUNDS: {
    name: '100 Pound Club',
    description: 'Harvested 100 pounds of produce',
    category: 'PRODUCTION',
    tier: 'BRONZE',
    icon: '⚖️',
    points: 300,
    criteria: { type: 'TOTAL_HARVEST', amount: 100 }
  },
  THOUSAND_POUNDS: {
    name: 'Tons of Produce',
    description: 'Harvested 1,000 pounds of produce',
    category: 'PRODUCTION',
    tier: 'GOLD',
    icon: '🏆',
    points: 2000,
    criteria: { type: 'TOTAL_HARVEST', amount: 1000 }
  },
  DIVERSE_GROWER: {
    name: 'Diverse Grower',
    description: 'Grown 10+ different crop varieties',
    category: 'PRODUCTION',
    tier: 'SILVER',
    icon: '🌈',
    points: 400,
    criteria: { type: 'CROP_DIVERSITY', count: 10 }
  },

  // Stewardship Awards
  LAND_IMPROVER: {
    name: 'Land Improver',
    description: 'Documented significant land improvements',
    category: 'STEWARDSHIP',
    tier: 'GOLD',
    icon: '🌾',
    points: 750,
    criteria: { type: 'LAND_IMPROVEMENT', documented: true }
  },
  POLLINATOR_CHAMPION: {
    name: 'Pollinator Champion',
    description: 'Created pollinator habitat',
    category: 'STEWARDSHIP',
    tier: 'SILVER',
    icon: '🐝',
    points: 400,
    criteria: { type: 'POLLINATOR_HABITAT', created: true }
  },
  CARBON_HERO: {
    name: 'Carbon Hero',
    description: 'Sequestered significant carbon through regenerative practices',
    category: 'STEWARDSHIP',
    tier: 'PLATINUM',
    icon: '♻️',
    points: 1500,
    criteria: { type: 'CARBON_SEQUESTRATION', verified: true }
  },
}

// Points system
export const POINTS = {
  PLOT_LISTED: 50,
  PLOT_RENTED: 100,
  JOURNAL_ENTRY: 10,
  HARVEST_LOGGED: 25,
  COURSE_STARTED: 10,
  COURSE_COMPLETED: 100,
  REVIEW_GIVEN: 15,
  PRODUCE_SOLD: 50,
  FORUM_POST: 5,
  FORUM_ANSWER: 15,
  PROFILE_COMPLETE: 50,
}

// User levels
export const LEVELS = {
  1: { title: 'Seedling', minPoints: 0 },
  2: { title: 'Sprout', minPoints: 100 },
  3: { title: 'Growing', minPoints: 400 },
  4: { title: 'Blooming', minPoints: 900 },
  5: { title: 'Thriving', minPoints: 1600 },
  6: { title: 'Harvester', minPoints: 2500 },
  7: { title: 'Cultivator', minPoints: 3600 },
  8: { title: 'Steward', minPoints: 4900 },
  9: { title: 'Master Grower', minPoints: 6400 },
  10: { title: 'Agricultural Legend', minPoints: 8100 },
}

// Soil types
export const SOIL_TYPES = [
  { value: 'CLAY', label: 'Clay' },
  { value: 'SANDY', label: 'Sandy' },
  { value: 'LOAM', label: 'Loam' },
  { value: 'SILT', label: 'Silt' },
  { value: 'PEAT', label: 'Peat' },
  { value: 'CHALK', label: 'Chalk' },
]

// Water access types
export const WATER_ACCESS_TYPES = [
  { value: 'NONE', label: 'None' },
  { value: 'WELL', label: 'Well' },
  { value: 'MUNICIPAL', label: 'Municipal Water' },
  { value: 'POND', label: 'Pond' },
  { value: 'STREAM', label: 'Stream/River' },
  { value: 'IRRIGATION', label: 'Irrigation System' },
]

// USDA Hardiness Zones
export const USDA_ZONES = [
  '3a', '3b', '4a', '4b', '5a', '5b', '6a', '6b',
  '7a', '7b', '8a', '8b', '9a', '9b', '10a', '10b', '11a', '11b'
]

// Crop categories
export const CROP_CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Herbs',
  'Grains',
  'Legumes',
  'Root Crops',
  'Leafy Greens',
  'Brassicas',
  'Nightshades',
  'Alliums',
]

// Produce categories for marketplace
export const PRODUCE_CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Herbs',
  'Eggs',
  'Meat',
  'Dairy',
  'Honey',
  'Mushrooms',
  'Flowers',
  'Seeds',
  'Other',
]

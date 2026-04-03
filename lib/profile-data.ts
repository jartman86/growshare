export type BadgeCategory = 'growing' | 'community' | 'marketplace' | 'learning' | 'special'
export type BadgeTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum'

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: BadgeCategory
  tier: BadgeTier
  requirement: string
  points: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  tier: BadgeTier
  requirement: string
  points: number
  unlockedBy?: number
}

export interface UserLevel {
  level: number
  name: string
  badge: string
  minPoints: number
  benefits: string[]
}

export interface LevelBenefit {
  level: number
  description: string
}

export interface UserProfile {
  id: string
  username: string
  displayName: string
  avatar: string
  bio?: string
  totalPoints: number
  level: number
  badges: Badge[]
  achievements: Achievement[]
}

const LEVEL_THRESHOLDS: { level: number; name: string; badge: string; minPoints: number }[] = [
  { level: 1, name: 'Seedling', badge: '🌱', minPoints: 0 },
  { level: 2, name: 'Sprout', badge: '🌿', minPoints: 100 },
  { level: 3, name: 'Grower', badge: '🌻', minPoints: 400 },
  { level: 4, name: 'Cultivator', badge: '🌾', minPoints: 900 },
  { level: 5, name: 'Harvester', badge: '🌽', minPoints: 1600 },
  { level: 6, name: 'Farmer', badge: '🚜', minPoints: 2500 },
  { level: 7, name: 'Master Grower', badge: '🏆', minPoints: 3600 },
  { level: 8, name: 'Garden Sage', badge: '🌳', minPoints: 4900 },
  { level: 9, name: 'Earth Guardian', badge: '🌍', minPoints: 6400 },
  { level: 10, name: 'Legend', badge: '👑', minPoints: 8100 },
]

export function getLevelFromPoints(points: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_THRESHOLDS[i].minPoints) {
      return LEVEL_THRESHOLDS[i].level
    }
  }
  return 1
}

export function getLevelInfo(points: number): UserLevel {
  let levelData = LEVEL_THRESHOLDS[0]
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_THRESHOLDS[i].minPoints) {
      levelData = LEVEL_THRESHOLDS[i]
      break
    }
  }
  return {
    level: levelData.level,
    name: levelData.name,
    badge: levelData.badge,
    minPoints: levelData.minPoints,
    benefits: [],
  }
}

export function getNextLevelInfo(points: number): UserLevel | null {
  const currentLevel = getLevelFromPoints(points)
  const nextThreshold = LEVEL_THRESHOLDS.find((t) => t.level === currentLevel + 1)
  if (!nextThreshold) return null
  return {
    level: nextThreshold.level,
    name: nextThreshold.name,
    badge: nextThreshold.badge,
    minPoints: nextThreshold.minPoints,
    benefits: [],
  }
}

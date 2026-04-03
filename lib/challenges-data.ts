export type ChallengeDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
export type ChallengeSeason = 'SPRING' | 'SUMMER' | 'FALL' | 'WINTER' | 'YEAR_ROUND'

export interface ChallengeTask {
  id: string
  title: string
  required: boolean
}

export interface Challenge {
  id: string
  title: string
  slug: string
  description: string
  image: string
  icon: string
  type: 'individual' | 'team' | 'community'
  difficulty: ChallengeDifficulty
  status: 'upcoming' | 'active' | 'completed' | 'expired'
  season: ChallengeSeason
  startDate: Date
  endDate: Date
  duration: string
  tasks: ChallengeTask[]
  participants: number
  completions: number
  rewards: {
    points: number
    badges?: string[]
    title?: string
    description: string
  }
}

export function getDifficultyColor(difficulty: ChallengeDifficulty): string {
  const colors: Record<string, string> = {
    BEGINNER: 'text-green-600',
    INTERMEDIATE: 'text-yellow-600',
    ADVANCED: 'text-orange-600',
    EXPERT: 'text-red-600',
  }
  return colors[difficulty] || 'text-gray-600'
}

export function getSeasonColor(season: ChallengeSeason): string {
  const colors: Record<string, string> = {
    SPRING: 'text-green-600',
    SUMMER: 'text-yellow-600',
    FALL: 'text-orange-600',
    WINTER: 'text-blue-600',
    YEAR_ROUND: 'text-purple-600',
  }
  return colors[season] || 'text-gray-600'
}

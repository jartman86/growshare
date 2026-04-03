export type GroupRole = 'LEADER' | 'MODERATOR' | 'MEMBER'

export interface LocalGroup {
  id: string
  name: string
  slug: string
  description: string
  coverImage: string
  location: { city: string; state: string }
  isPublic: boolean
  requiresApproval: boolean
  memberCount: number
  activeMembers: number
  upcomingEvents?: number
  tags: string[]
  leaders: { id: string; name: string; avatar: string }[]
}

export type CommunityGroup = LocalGroup

export function formatGroupMemberCount(count: number): string {
  if (count === 1) return '1 member'
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k members`
  return `${count} members`
}

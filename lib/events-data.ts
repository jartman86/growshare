export type CommunityEventCategory =
  | 'Workshop'
  | 'Meetup'
  | 'Festival'
  | 'Market'
  | 'Class'
  | 'Volunteer'
  | 'Tour'
  | 'Social'

export interface Event {
  id: string
  title: string
  description: string
  category: CommunityEventCategory
  image?: string
  date: Date
  endDate?: Date
  city: string
  state: string
  isVirtual: boolean
  price: number
  capacity?: number
  attendees: number
  organizerName: string
  organizerAvatar?: string
}

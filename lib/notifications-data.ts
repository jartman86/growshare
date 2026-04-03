export type NotificationType =
  | 'BOOKING_REQUEST'
  | 'BOOKING_APPROVED'
  | 'BOOKING_REJECTED'
  | 'PAYMENT_RECEIVED'
  | 'REVIEW_RECEIVED'
  | 'MESSAGE_RECEIVED'
  | 'FORUM_REPLY'
  | 'ACHIEVEMENT_UNLOCKED'
  | 'SYSTEM'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  link?: string
  createdAt: Date
}

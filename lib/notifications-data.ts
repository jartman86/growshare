/**
 * Notifications & Activity Feed System
 *
 * Tracks user notifications and community activity
 */

export type NotificationType =
  | 'tool_rental_request'
  | 'tool_rental_approved'
  | 'tool_rental_declined'
  | 'tool_return_reminder'
  | 'tool_purchase_inquiry'
  | 'new_follower'
  | 'achievement_unlocked'
  | 'forum_reply'
  | 'forum_mention'
  | 'event_reminder'
  | 'event_rsvp'
  | 'plot_available'
  | 'plot_request'
  | 'marketplace_message'
  | 'review_received'
  | 'level_up'

export interface Notification {
  id: string
  userId: string // recipient
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: Date

  // Related entities
  actorId?: string // who triggered this notification
  actorName?: string
  actorAvatar?: string

  // Links
  linkUrl?: string
  linkText?: string

  // Metadata
  metadata?: {
    toolId?: string
    toolName?: string
    achievementId?: string
    achievementName?: string
    eventId?: string
    eventName?: string
    plotId?: string
    forumPostId?: string
    reviewId?: string
    points?: number
  }
}

export interface ActivityFeedItem {
  id: string
  type: 'achievement' | 'rental' | 'forum_post' | 'review' | 'level_up' | 'follow' | 'marketplace_sale' | 'event_rsvp'
  userId: string
  userName: string
  userAvatar: string
  action: string
  target?: string
  timestamp: Date
  icon: string // emoji or icon identifier
  color: string // badge color
}

// Sample Notifications for user-1 (Sarah Chen)
export const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    type: 'tool_rental_request',
    title: 'New Tool Rental Request',
    message: 'Michael Rodriguez wants to rent your Gas-Powered Tiller',
    read: false,
    createdAt: new Date('2024-07-22T14:30:00'),
    actorId: 'user-2',
    actorName: 'Michael Rodriguez',
    actorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    linkUrl: '/tools/tool-1',
    linkText: 'View Request',
    metadata: {
      toolId: 'tool-1',
      toolName: 'Gas-Powered Tiller',
    },
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    type: 'new_follower',
    title: 'New Follower',
    message: 'Emma Thompson started following you',
    read: false,
    createdAt: new Date('2024-07-22T10:15:00'),
    actorId: 'user-3',
    actorName: 'Emma Thompson',
    actorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    linkUrl: '/profile/emmathompson',
    linkText: 'View Profile',
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    type: 'achievement_unlocked',
    title: 'Achievement Unlocked!',
    message: 'You earned "Tool Sharer" achievement for listing 5 tools',
    read: false,
    createdAt: new Date('2024-07-21T16:45:00'),
    linkUrl: '/profile/sarahchen/achievements',
    linkText: 'View Achievements',
    metadata: {
      achievementId: 'tool-sharer',
      achievementName: 'Tool Sharer',
      points: 250,
    },
  },
  {
    id: 'notif-4',
    userId: 'user-1',
    type: 'review_received',
    title: 'New Review',
    message: 'Michael Rodriguez left a 5-star review for your Drip Irrigation Kit',
    read: true,
    createdAt: new Date('2024-07-20T12:00:00'),
    actorId: 'user-2',
    actorName: 'Michael Rodriguez',
    actorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    linkUrl: '/tools/tool-3',
    linkText: 'View Review',
    metadata: {
      toolId: 'tool-3',
      toolName: 'Drip Irrigation Starter Kit',
    },
  },
  {
    id: 'notif-5',
    userId: 'user-1',
    type: 'forum_reply',
    title: 'New Reply',
    message: 'Someone replied to your post in "Organic Pest Management"',
    read: true,
    createdAt: new Date('2024-07-19T09:30:00'),
    actorId: 'user-3',
    actorName: 'Emma Thompson',
    actorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    linkUrl: '/community',
    linkText: 'View Discussion',
    metadata: {
      forumPostId: 'post-123',
    },
  },
  {
    id: 'notif-6',
    userId: 'user-1',
    type: 'tool_return_reminder',
    title: 'Tool Return Reminder',
    message: 'Your rental of Electric Lawn Mower is due tomorrow',
    read: true,
    createdAt: new Date('2024-07-18T08:00:00'),
    linkUrl: '/tools/my-rentals',
    linkText: 'View Rentals',
    metadata: {
      toolId: 'tool-7',
      toolName: 'Electric Lawn Mower',
    },
  },
  {
    id: 'notif-7',
    userId: 'user-1',
    type: 'event_reminder',
    title: 'Event Tomorrow',
    message: 'Reminder: Summer Harvest Festival starts tomorrow at 10:00 AM',
    read: true,
    createdAt: new Date('2024-07-17T18:00:00'),
    linkUrl: '/events',
    linkText: 'View Event',
    metadata: {
      eventId: 'event-1',
      eventName: 'Summer Harvest Festival',
    },
  },
  {
    id: 'notif-8',
    userId: 'user-1',
    type: 'level_up',
    title: 'Level Up!',
    message: 'Congratulations! You reached Level 6: Garden Guru',
    read: true,
    createdAt: new Date('2024-07-15T14:20:00'),
    linkUrl: '/profile/sarahchen',
    linkText: 'View Profile',
    metadata: {
      points: 2500,
    },
  },
]

// Sample Activity Feed (community-wide or filtered by network)
export const SAMPLE_ACTIVITY_FEED: ActivityFeedItem[] = [
  {
    id: 'activity-1',
    type: 'achievement',
    userId: 'user-2',
    userName: 'Michael Rodriguez',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    action: 'unlocked',
    target: 'Master Grower achievement',
    timestamp: new Date('2024-07-22T16:00:00'),
    icon: '🏆',
    color: 'bg-yellow-100 text-yellow-700',
  },
  {
    id: 'activity-2',
    type: 'review',
    userId: 'user-3',
    userName: 'Emma Thompson',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    action: 'left a 5-star review for',
    target: 'Garden Tool Set',
    timestamp: new Date('2024-07-22T14:45:00'),
    icon: '⭐',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    id: 'activity-3',
    type: 'rental',
    userId: 'user-1',
    userName: 'Sarah Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    action: 'listed',
    target: 'Hori Hori Garden Knife for sale',
    timestamp: new Date('2024-07-22T11:30:00'),
    icon: '🔧',
    color: 'bg-orange-100 text-orange-700',
  },
  {
    id: 'activity-4',
    type: 'forum_post',
    userId: 'user-2',
    userName: 'Michael Rodriguez',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    action: 'started a discussion',
    target: '"Best Organic Fertilizers"',
    timestamp: new Date('2024-07-22T09:15:00'),
    icon: '💬',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'activity-5',
    type: 'level_up',
    userId: 'user-3',
    userName: 'Emma Thompson',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    action: 'reached',
    target: 'Level 5: Master Grower',
    timestamp: new Date('2024-07-21T17:00:00'),
    icon: '🌟',
    color: 'bg-green-100 text-green-700',
  },
  {
    id: 'activity-6',
    type: 'event_rsvp',
    userId: 'user-1',
    userName: 'Sarah Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    action: 'is attending',
    target: 'Summer Harvest Festival',
    timestamp: new Date('2024-07-21T15:30:00'),
    icon: '📅',
    color: 'bg-pink-100 text-pink-700',
  },
  {
    id: 'activity-7',
    type: 'marketplace_sale',
    userId: 'user-2',
    userName: 'Michael Rodriguez',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    action: 'sold',
    target: 'Compost Tumbler',
    timestamp: new Date('2024-07-21T10:00:00'),
    icon: '💰',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    id: 'activity-8',
    type: 'follow',
    userId: 'user-3',
    userName: 'Emma Thompson',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    action: 'started following',
    target: 'Sarah Chen',
    timestamp: new Date('2024-07-21T08:45:00'),
    icon: '👥',
    color: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: 'activity-9',
    type: 'achievement',
    userId: 'user-1',
    userName: 'Sarah Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    action: 'unlocked',
    target: 'Tool Sharer achievement',
    timestamp: new Date('2024-07-20T16:45:00'),
    icon: '🏅',
    color: 'bg-yellow-100 text-yellow-700',
  },
  {
    id: 'activity-10',
    type: 'forum_post',
    userId: 'user-3',
    userName: 'Emma Thompson',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    action: 'replied to',
    target: '"Seed Saving Tips"',
    timestamp: new Date('2024-07-20T13:20:00'),
    icon: '💬',
    color: 'bg-blue-100 text-blue-700',
  },
]

// Helper functions
export function getUnreadCount(notifications: Notification[]): number {
  return notifications.filter((n) => !n.read).length
}

export function getNotificationsByType(
  notifications: Notification[],
  type: NotificationType
): Notification[] {
  return notifications.filter((n) => n.type === type)
}

export function markAsRead(notificationId: string): void {
  // TODO: Would update backend here
  void notificationId
}

export function markAllAsRead(userId: string): void {
  // TODO: Would update backend here
  void userId
}

export function getRecentActivity(limit: number = 10): ActivityFeedItem[] {
  return SAMPLE_ACTIVITY_FEED.slice(0, limit)
}

export function getActivityByType(type: ActivityFeedItem['type']): ActivityFeedItem[] {
  return SAMPLE_ACTIVITY_FEED.filter((item) => item.type === type)
}

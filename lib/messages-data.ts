export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: Date
  read: boolean
  attachments?: {
    type: 'image' | 'file'
    url: string
    name: string
  }[]
}

export interface Conversation {
  id: string
  participantIds: string[]
  participants: {
    id: string
    name: string
    avatar: string
    status?: 'online' | 'offline' | 'away'
  }[]
  lastMessage: Message
  unreadCount: number
  createdAt: Date
  updatedAt: Date
  // Context if conversation started from a specific item
  context?: {
    type: 'tool' | 'event' | 'forum_post'
    id: string
    name: string
  }
}

// Sample messages for conversations
export const SAMPLE_MESSAGES: Message[] = [
  // Conversation 1: About Garden Tiller rental
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'user-2',
    senderName: 'Michael Rodriguez',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    content: "Hi Sarah! I'm interested in renting your Garden Tiller this weekend. Is it still available?",
    timestamp: new Date('2024-07-20T09:15:00'),
    read: true,
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'user-1',
    senderName: 'Sarah Chen',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    content: "Hi Michael! Yes, it's available. I can do Saturday or Sunday. Which day works better for you?",
    timestamp: new Date('2024-07-20T09:45:00'),
    read: true,
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    senderId: 'user-2',
    senderName: 'Michael Rodriguez',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    content: 'Saturday morning would be perfect! What time should I pick it up?',
    timestamp: new Date('2024-07-20T10:00:00'),
    read: true,
  },
  {
    id: 'msg-4',
    conversationId: 'conv-1',
    senderId: 'user-1',
    senderName: 'Sarah Chen',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    content: "How about 9 AM? I'll have it ready with a full tank of gas. The deposit is $50, and I'll show you how to use it.",
    timestamp: new Date('2024-07-20T10:30:00'),
    read: true,
  },
  {
    id: 'msg-5',
    conversationId: 'conv-1',
    senderId: 'user-2',
    senderName: 'Michael Rodriguez',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    content: 'Perfect! See you Saturday at 9. What\'s your address?',
    timestamp: new Date('2024-07-20T10:45:00'),
    read: true,
  },
  {
    id: 'msg-6',
    conversationId: 'conv-1',
    senderId: 'user-1',
    senderName: 'Sarah Chen',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    content: "I'm at 123 Garden Lane, Portland. Look for the blue house with the big vegetable garden out front. 😊",
    timestamp: new Date('2024-07-20T11:00:00'),
    read: false,
  },

  // Conversation 2: About Seed Swap Event
  {
    id: 'msg-7',
    conversationId: 'conv-2',
    senderId: 'user-4',
    senderName: 'Jennifer Kim',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer',
    content: 'Hey! I saw you RSVP\'d for the Community Seed Swap. Do you have any tomato seeds you\'d be willing to trade?',
    timestamp: new Date('2024-07-19T14:20:00'),
    read: true,
  },
  {
    id: 'msg-8',
    conversationId: 'conv-2',
    senderId: 'user-1',
    senderName: 'Sarah Chen',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    content: 'Absolutely! I have Cherokee Purple and Brandywine heirloom varieties. What do you have for trade?',
    timestamp: new Date('2024-07-19T15:10:00'),
    read: true,
  },
  {
    id: 'msg-9',
    conversationId: 'conv-2',
    senderId: 'user-4',
    senderName: 'Jennifer Kim',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer',
    content: "Perfect! I have a bunch of pepper seeds - jalapeño, bell, and habanero. I also have some zinnia and sunflower seeds if you're interested in flowers.",
    timestamp: new Date('2024-07-19T16:30:00'),
    read: true,
  },
  {
    id: 'msg-10',
    conversationId: 'conv-2',
    senderId: 'user-1',
    senderName: 'Sarah Chen',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    content: "Jalapeños would be amazing! And I'd love some zinnia seeds. See you at the event!",
    timestamp: new Date('2024-07-19T17:00:00'),
    read: false,
  },

  // Conversation 3: Forum discussion follow-up
  {
    id: 'msg-11',
    conversationId: 'conv-3',
    senderId: 'user-3',
    senderName: 'Robert Martinez',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    content: 'Thanks for your advice on the forum about dealing with aphids! The neem oil spray worked wonders.',
    timestamp: new Date('2024-07-18T11:00:00'),
    read: true,
  },
  {
    id: 'msg-12',
    conversationId: 'conv-3',
    senderId: 'user-1',
    senderName: 'Sarah Chen',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    content: "So glad it helped! Neem oil is one of my go-to solutions. How's your garden doing now?",
    timestamp: new Date('2024-07-18T13:30:00'),
    read: true,
  },
  {
    id: 'msg-13',
    conversationId: 'conv-3',
    senderId: 'user-3',
    senderName: 'Robert Martinez',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    content: 'Much better! The aphids are gone and my roses are thriving. I also wanted to ask - do you sell any compost? I saw you mentioned composting in another post.',
    timestamp: new Date('2024-07-18T14:00:00'),
    read: true,
  },
  {
    id: 'msg-14',
    conversationId: 'conv-3',
    senderId: 'user-1',
    senderName: 'Sarah Chen',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    content: "I don't sell it, but I usually have extra! You're welcome to come grab a few bags if you need some. Free for fellow GrowShare members. 😊",
    timestamp: new Date('2024-07-21T10:15:00'),
    read: false,
  },

  // Conversation 4: New conversation (unread)
  {
    id: 'msg-15',
    conversationId: 'conv-4',
    senderId: 'user-5',
    senderName: 'Lisa Thompson',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    content: 'Hi! I noticed you\'re growing kale. I\'m having trouble with mine - the leaves keep getting holes. Any suggestions?',
    timestamp: new Date('2024-07-21T16:45:00'),
    read: false,
  },
]

// Sample conversations
export const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    participantIds: ['user-1', 'user-2'],
    participants: [
      {
        id: 'user-2',
        name: 'Michael Rodriguez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
        status: 'online',
      },
    ],
    lastMessage: SAMPLE_MESSAGES.find((m) => m.id === 'msg-6')!,
    unreadCount: 1,
    createdAt: new Date('2024-07-20T09:15:00'),
    updatedAt: new Date('2024-07-20T11:00:00'),
    context: {
      type: 'tool',
      id: 'tool-1',
      name: 'Professional Garden Tiller',
    },
  },
  {
    id: 'conv-2',
    participantIds: ['user-1', 'user-4'],
    participants: [
      {
        id: 'user-4',
        name: 'Jennifer Kim',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer',
        status: 'away',
      },
    ],
    lastMessage: SAMPLE_MESSAGES.find((m) => m.id === 'msg-10')!,
    unreadCount: 1,
    createdAt: new Date('2024-07-19T14:20:00'),
    updatedAt: new Date('2024-07-19T17:00:00'),
    context: {
      type: 'event',
      id: 'event-2',
      name: 'Community Seed Swap',
    },
  },
  {
    id: 'conv-3',
    participantIds: ['user-1', 'user-3'],
    participants: [
      {
        id: 'user-3',
        name: 'Robert Martinez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
        status: 'offline',
      },
    ],
    lastMessage: SAMPLE_MESSAGES.find((m) => m.id === 'msg-14')!,
    unreadCount: 1,
    createdAt: new Date('2024-07-18T11:00:00'),
    updatedAt: new Date('2024-07-21T10:15:00'),
    context: {
      type: 'forum_post',
      id: 'topic-3',
      name: 'Aphids on my roses - help!',
    },
  },
  {
    id: 'conv-4',
    participantIds: ['user-1', 'user-5'],
    participants: [
      {
        id: 'user-5',
        name: 'Lisa Thompson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
        status: 'online',
      },
    ],
    lastMessage: SAMPLE_MESSAGES.find((m) => m.id === 'msg-15')!,
    unreadCount: 1,
    createdAt: new Date('2024-07-21T16:45:00'),
    updatedAt: new Date('2024-07-21T16:45:00'),
  },
]

// Helper functions
export function getConversationMessages(conversationId: string): Message[] {
  return SAMPLE_MESSAGES.filter((m) => m.conversationId === conversationId).sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  )
}

export function getUnreadConversationsCount(conversations: Conversation[]): number {
  return conversations.filter((c) => c.unreadCount > 0).length
}

export function getTotalUnreadCount(conversations: Conversation[]): number {
  return conversations.reduce((sum, c) => sum + c.unreadCount, 0)
}

export function markConversationAsRead(conversationId: string): void {
  const conversation = SAMPLE_CONVERSATIONS.find((c) => c.id === conversationId)
  if (conversation) {
    conversation.unreadCount = 0
    const messages = getConversationMessages(conversationId)
    messages.forEach((m) => {
      m.read = true
    })
  }
}

export function formatMessageTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

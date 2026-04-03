export interface ConversationParticipant {
  id: string
  name: string
  avatar: string
  isOnline?: boolean
  status?: string
}

export interface Conversation {
  id: string
  participantIds?: string[]
  participants: ConversationParticipant[]
  lastMessage: {
    id?: string
    content: string
    senderId: string
    senderName?: string
    senderAvatar?: string
    createdAt?: Date
    timestamp: Date
    read?: boolean
    [key: string]: unknown
  }
  context?: {
    type: string
    name: string
    id?: string
  }
  unreadCount: number
  createdAt?: Date
  updatedAt: Date
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  createdAt?: Date
  timestamp: Date
  read?: boolean
  readAt?: Date
  [key: string]: unknown
}

export function formatMessageTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

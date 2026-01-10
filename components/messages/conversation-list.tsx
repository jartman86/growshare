'use client'

import { Conversation, formatMessageTime } from '@/lib/messages-data'
import { Search, Circle } from 'lucide-react'
import { useState } from 'react'

interface ConversationListProps {
  conversations: Conversation[]
  selectedConversationId?: string
  onSelectConversation: (conversationId: string) => void
  currentUserId: string
}

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  currentUserId,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true
    const otherParticipant = conv.participants[0]
    return otherParticipant.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const sortedConversations = filteredConversations.sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  )

  return (
    <div className="flex flex-col h-full bg-white border-r">
      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {sortedConversations.length > 0 ? (
          sortedConversations.map((conversation) => {
            const otherParticipant = conversation.participants[0]
            const isSelected = conversation.id === selectedConversationId
            const isUnread = conversation.unreadCount > 0
            const lastMessagePreview =
              conversation.lastMessage.content.length > 60
                ? conversation.lastMessage.content.slice(0, 60) + '...'
                : conversation.lastMessage.content

            return (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`w-full p-4 border-b hover:bg-gray-50 transition-colors text-left ${
                  isSelected ? 'bg-green-50 border-l-4 border-l-green-600' : ''
                }`}
              >
                <div className="flex gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={otherParticipant.avatar}
                      alt={otherParticipant.name}
                      className="w-12 h-12 rounded-full border-2 border-gray-200"
                    />
                    {/* Online status */}
                    {otherParticipant.status === 'online' && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                    {otherParticipant.status === 'away' && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3
                        className={`font-semibold truncate ${
                          isUnread ? 'text-gray-900' : 'text-gray-700'
                        }`}
                      >
                        {otherParticipant.name}
                      </h3>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {formatMessageTime(conversation.lastMessage.timestamp)}
                      </span>
                    </div>

                    {/* Context badge */}
                    {conversation.context && (
                      <div className="mb-1">
                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                          {conversation.context.type === 'tool' && '🔧 '}
                          {conversation.context.type === 'event' && '📅 '}
                          {conversation.context.type === 'forum_post' && '💬 '}
                          {conversation.context.name}
                        </span>
                      </div>
                    )}

                    {/* Last message preview */}
                    <p
                      className={`text-sm truncate ${
                        isUnread ? 'text-gray-900 font-medium' : 'text-gray-600'
                      }`}
                    >
                      {conversation.lastMessage.senderId === currentUserId && 'You: '}
                      {lastMessagePreview}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  {isUnread && (
                    <div className="flex-shrink-0 flex items-center">
                      <div className="w-5 h-5 bg-green-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {conversation.unreadCount}
                      </div>
                    </div>
                  )}
                </div>
              </button>
            )
          })
        ) : (
          <div className="p-8 text-center text-gray-500">
            {searchQuery ? 'No conversations found' : 'No messages yet'}
          </div>
        )}
      </div>
    </div>
  )
}

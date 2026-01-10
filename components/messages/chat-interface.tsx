'use client'

import { useState, useRef, useEffect } from 'react'
import { Message, Conversation, formatMessageTime } from '@/lib/messages-data'
import { Send, Image, Paperclip, MoreVertical, Info, Circle } from 'lucide-react'
import Link from 'next/link'

interface ChatInterfaceProps {
  conversation: Conversation
  messages: Message[]
  currentUserId: string
  onSendMessage: (content: string) => void
}

export function ChatInterface({
  conversation,
  messages,
  currentUserId,
  onSendMessage,
}: ChatInterfaceProps) {
  const [messageText, setMessageText] = useState('')
  const [showInfo, setShowInfo] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const otherParticipant = conversation.participants[0]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (messageText.trim()) {
      onSendMessage(messageText)
      setMessageText('')
    }
  }

  const formatFullTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-3">
          {/* Avatar with status */}
          <div className="relative">
            <Link href={`/profile/${otherParticipant.id}`}>
              <img
                src={otherParticipant.avatar}
                alt={otherParticipant.name}
                className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-green-500 transition-colors cursor-pointer"
              />
            </Link>
            {otherParticipant.status === 'online' && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            )}
            {otherParticipant.status === 'away' && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 border-2 border-white rounded-full" />
            )}
          </div>

          <div>
            <Link
              href={`/profile/${otherParticipant.id}`}
              className="font-semibold text-gray-900 hover:text-green-600 transition-colors"
            >
              {otherParticipant.name}
            </Link>
            {otherParticipant.status && (
              <p className="text-xs text-gray-500 capitalize">{otherParticipant.status}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Info className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Context Banner */}
      {conversation.context && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-200">
          <p className="text-sm text-blue-900">
            {conversation.context.type === 'tool' && '🔧 '}
            {conversation.context.type === 'event' && '📅 '}
            {conversation.context.type === 'forum_post' && '💬 '}
            <span className="font-medium">About:</span> {conversation.context.name}
          </p>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isCurrentUser = message.senderId === currentUserId
          const showAvatar =
            index === 0 || messages[index - 1].senderId !== message.senderId
          const showTimestamp =
            index === messages.length - 1 ||
            messages[index + 1].senderId !== message.senderId ||
            messages[index + 1].timestamp.getTime() - message.timestamp.getTime() >
              300000 // 5 minutes

          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0 w-8">
                {showAvatar && !isCurrentUser && (
                  <img
                    src={message.senderAvatar}
                    alt={message.senderName}
                    className="w-8 h-8 rounded-full border border-gray-200"
                  />
                )}
              </div>

              {/* Message Content */}
              <div
                className={`flex-1 max-w-md ${isCurrentUser ? 'items-end' : 'items-start'} flex flex-col`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    isCurrentUser
                      ? 'bg-green-600 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </div>

                {/* Timestamp */}
                {showTimestamp && (
                  <p
                    className={`text-xs text-gray-500 mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}
                  >
                    {formatFullTime(message.timestamp)}
                  </p>
                )}
              </div>

              {/* Spacer for current user messages */}
              {isCurrentUser && <div className="w-8" />}
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
        <div className="flex items-end gap-2">
          {/* Attachment buttons */}
          <button
            type="button"
            className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            title="Attach image"
          >
            <Image className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            title="Attach file"
          >
            <Paperclip className="h-5 w-5" />
          </button>

          {/* Text input */}
          <div className="flex-1">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              style={{
                minHeight: '40px',
                maxHeight: '120px',
              }}
            />
          </div>

          {/* Send button */}
          <button
            type="submit"
            disabled={!messageText.trim()}
            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
      </form>

      {/* Info Sidebar */}
      {showInfo && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white border-l shadow-lg p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Conversation Info</h3>
            <button
              onClick={() => setShowInfo(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          {/* Participant Info */}
          <div className="text-center mb-6">
            <img
              src={otherParticipant.avatar}
              alt={otherParticipant.name}
              className="w-20 h-20 rounded-full border-2 border-gray-200 mx-auto mb-3"
            />
            <h4 className="font-semibold text-gray-900">{otherParticipant.name}</h4>
            <Link
              href={`/profile/${otherParticipant.id}`}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View Profile
            </Link>
          </div>

          {/* Context */}
          {conversation.context && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">About</h4>
              <p className="text-sm text-gray-600">{conversation.context.name}</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              Mute conversation
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              Delete conversation
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

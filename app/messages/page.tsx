'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import {
  SAMPLE_CONVERSATIONS,
  getConversationMessages,
  markConversationAsRead,
} from '@/lib/messages-data'
import { ConversationList } from '@/components/messages/conversation-list'
import { ChatInterface } from '@/components/messages/chat-interface'
import { NewMessageModal } from '@/components/messages/new-message-modal'
import { Plus, MessageSquare } from 'lucide-react'

export default function MessagesPage() {
  const [conversations] = useState(SAMPLE_CONVERSATIONS)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    conversations.length > 0 ? conversations[0].id : null
  )
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)

  const currentUserId = 'user-1' // Current logged-in user (Sarah Chen)

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  )
  const selectedMessages = selectedConversationId
    ? getConversationMessages(selectedConversationId)
    : []

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId)
    markConversationAsRead(conversationId)
  }

  const handleSendMessage = (content: string) => {
    // TODO: Send message to backend
    console.log('Sending message:', content)
    // In a real app, this would add the message to the conversation
  }

  const handleSendNewMessage = (userId: string, message: string) => {
    // TODO: Create new conversation and send message
    console.log('New message to user:', userId, message)
    setShowNewMessageModal(false)
  }

  return (
    <>
      <Header />

      <main className="h-screen flex flex-col bg-gray-50">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-8 w-8" />
                <h1 className="text-3xl font-bold">Messages</h1>
              </div>
              <button
                onClick={() => setShowNewMessageModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                <Plus className="h-5 w-5" />
                New Message
              </button>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-hidden">
          <div className="mx-auto max-w-7xl h-full">
            <div className="grid grid-cols-12 gap-0 h-full">
              {/* Conversations Sidebar */}
              <div className="col-span-12 md:col-span-4 lg:col-span-3 h-full border-r bg-white">
                <ConversationList
                  conversations={conversations}
                  selectedConversationId={selectedConversationId ?? undefined}
                  onSelectConversation={handleSelectConversation}
                  currentUserId={currentUserId}
                />
              </div>

              {/* Chat Area */}
              <div className="col-span-12 md:col-span-8 lg:col-span-9 h-full relative">
                {selectedConversation ? (
                  <ChatInterface
                    conversation={selectedConversation}
                    messages={selectedMessages}
                    currentUserId={currentUserId}
                    onSendMessage={handleSendMessage}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-white">
                    <div className="text-center">
                      <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Select a conversation
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Choose a conversation from the list to start messaging
                      </p>
                      <button
                        onClick={() => setShowNewMessageModal(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                      >
                        <Plus className="h-5 w-5" />
                        Start New Conversation
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* New Message Modal */}
      <NewMessageModal
        isOpen={showNewMessageModal}
        onClose={() => setShowNewMessageModal(false)}
        onSend={handleSendNewMessage}
      />
    </>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { ConversationList } from '@/components/messages/conversation-list'
import { ChatInterface } from '@/components/messages/chat-interface'
import { NewMessageModal } from '@/components/messages/new-message-modal'
import { Plus, MessageSquare, Loader2 } from 'lucide-react'

interface User {
  id: string
  firstName: string
  lastName: string
  avatar: string | null
}

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  subject: string | null
  isRead: boolean
  createdAt: string
  sender: User
  receiver: User
}

interface Conversation {
  userId: string
  user: User
  lastMessage: Message
  unreadCount: number
  messages: Message[]
}

export default function MessagesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedUserId = searchParams.get('userId')

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string>('')

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedUserId && conversations.length > 0) {
      const conversation = conversations.find(c => c.userId === selectedUserId)
      if (conversation) {
        handleSelectConversation(conversation.userId)
      }
    }
  }, [selectedUserId, conversations])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/messages')
      if (!response.ok) throw new Error('Failed to fetch conversations')
      const data = await response.json()
      setConversations(data)

      // Get current user ID from first message
      if (data.length > 0) {
        const firstConv = data[0]
        const uid = firstConv.lastMessage.senderId === firstConv.userId
          ? firstConv.lastMessage.receiverId
          : firstConv.lastMessage.senderId
        setCurrentUserId(uid)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectConversation = async (conversationId: string) => {
    const conversation = conversations.find(c => c.userId === conversationId)
    if (!conversation) return

    setSelectedConversation(conversation)
    router.push(`/messages?userId=${conversationId}`, { scroll: false })

    try {
      const response = await fetch(`/api/messages?userId=${conversationId}`)
      if (!response.ok) throw new Error('Failed to fetch messages')
      const data = await response.json()
      setMessages(data)

      // Update conversation to mark as read
      setConversations(prev =>
        prev.map(c =>
          c.userId === conversationId
            ? { ...c, unreadCount: 0 }
            : c
        )
      )
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation) return

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: selectedConversation.userId,
          content,
        }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      const sentMessage = await response.json()
      setMessages(prev => [...prev, sentMessage])

      // Update conversation last message
      setConversations(prev =>
        prev.map(c =>
          c.userId === selectedConversation.userId
            ? { ...c, lastMessage: sentMessage }
            : c
        )
      )
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    }
  }

  const handleSendNewMessage = async (receiverId: string, message: string) => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId,
          content: message,
        }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      setShowNewMessageModal(false)
      await fetchConversations()

      // Select the new conversation
      router.push(`/messages?userId=${receiverId}`)
    } catch (error) {
      console.error('Error sending new message:', error)
      alert('Failed to send message')
    }
  }

  // Convert API conversation format to component format
  const formattedConversations = conversations.map(c => ({
    id: c.userId,
    participantIds: [c.user.id, currentUserId],
    participants: [
      {
        id: c.user.id,
        name: `${c.user.firstName} ${c.user.lastName}`,
        avatar: c.user.avatar || '',
      }
    ],
    lastMessage: {
      id: c.lastMessage.id,
      senderId: c.lastMessage.senderId,
      content: c.lastMessage.content,
      timestamp: new Date(c.lastMessage.createdAt),
    },
    unreadCount: c.unreadCount,
    createdAt: new Date(c.lastMessage.createdAt),
    updatedAt: new Date(c.lastMessage.createdAt),
  }))

  const selectedConvFormatted = selectedConversation ? {
    id: selectedConversation.userId,
    participantIds: [selectedConversation.user.id, currentUserId],
    participants: [
      {
        id: selectedConversation.user.id,
        name: `${selectedConversation.user.firstName} ${selectedConversation.user.lastName}`,
        avatar: selectedConversation.user.avatar || '',
      }
    ],
    lastMessage: {
      id: selectedConversation.lastMessage.id,
      senderId: selectedConversation.lastMessage.senderId,
      content: selectedConversation.lastMessage.content,
      timestamp: new Date(selectedConversation.lastMessage.createdAt),
    },
    unreadCount: selectedConversation.unreadCount,
    createdAt: new Date(selectedConversation.lastMessage.createdAt),
    updatedAt: new Date(selectedConversation.lastMessage.createdAt),
  } : null

  const formattedMessages = messages.map(m => ({
    id: m.id,
    conversationId: selectedConversation?.userId || '',
    senderId: m.senderId,
    senderName: m.senderId === currentUserId
      ? 'You'
      : `${m.sender.firstName} ${m.sender.lastName}`,
    senderAvatar: m.sender.avatar || '',
    content: m.content,
    timestamp: new Date(m.createdAt),
    read: m.isRead,
  }))

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </main>
      </>
    )
  }

  return (
    <>
      <Header />

      <main className="h-screen flex flex-col topo-lines">
        {/* Page Header */}
        <div className="garden-gradient-vibrant topo-dense text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2d5016]/20 to-transparent"></div>
          <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-8 w-8 drop-shadow-md" />
                <h1 className="text-3xl font-bold drop-shadow-lg">Messages</h1>
              </div>
              <button
                onClick={() => setShowNewMessageModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-[#4a7c2c] rounded-lg font-semibold hover:bg-[#f4e4c1] transition-all shadow-lg hover:shadow-xl"
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
              <div className="col-span-12 md:col-span-4 lg:col-span-3 h-full border-r-2 border-[#8bc34a]/30 bg-gradient-to-b from-white to-[#aed581]/10">
                <ConversationList
                  conversations={formattedConversations}
                  selectedConversationId={selectedConversation?.userId}
                  onSelectConversation={handleSelectConversation}
                  currentUserId={currentUserId}
                />
              </div>

              {/* Chat Area */}
              <div className="col-span-12 md:col-span-8 lg:col-span-9 h-full relative">
                {selectedConvFormatted ? (
                  <ChatInterface
                    conversation={selectedConvFormatted}
                    messages={formattedMessages}
                    currentUserId={currentUserId}
                    onSendMessage={handleSendMessage}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-white/80 backdrop-blur-sm">
                    <div className="text-center">
                      <MessageSquare className="h-16 w-16 text-[#aed581] mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-[#2d5016] mb-2">
                        Select a conversation
                      </h3>
                      <p className="text-[#4a3f35] mb-6">
                        Choose a conversation from the list to start messaging
                      </p>
                      <button
                        onClick={() => setShowNewMessageModal(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6ba03f] to-[#4a7c2c] text-white rounded-lg font-semibold hover:from-[#4a7c2c] hover:to-[#2d5016] transition-all shadow-lg hover:shadow-xl"
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

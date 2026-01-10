'use client'

import { useState } from 'react'
import { X, Search, Send } from 'lucide-react'

interface User {
  id: string
  name: string
  avatar: string
  location?: string
}

interface NewMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: (userId: string, message: string) => void
}

// Sample users for demonstration
const SAMPLE_USERS: User[] = [
  {
    id: 'user-2',
    name: 'Michael Rodriguez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    location: 'Portland, OR',
  },
  {
    id: 'user-3',
    name: 'Robert Martinez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    location: 'Seattle, WA',
  },
  {
    id: 'user-4',
    name: 'Jennifer Kim',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer',
    location: 'Portland, OR',
  },
  {
    id: 'user-5',
    name: 'Lisa Thompson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    location: 'Eugene, OR',
  },
  {
    id: 'user-6',
    name: 'David Park',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    location: 'Portland, OR',
  },
]

export function NewMessageModal({ isOpen, onClose, onSend }: NewMessageModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [message, setMessage] = useState('')

  if (!isOpen) return null

  const filteredUsers = SAMPLE_USERS.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSend = () => {
    if (selectedUser && message.trim()) {
      onSend(selectedUser.id, message)
      setSelectedUser(null)
      setMessage('')
      setSearchQuery('')
      onClose()
    }
  }

  const handleClose = () => {
    setSelectedUser(null)
    setMessage('')
    setSearchQuery('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">New Message</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!selectedUser ? (
            <>
              {/* User Search */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  To:
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
              </div>

              {/* User List */}
              <div className="space-y-2">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full border-2 border-gray-200"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        {user.location && (
                          <p className="text-sm text-gray-600">{user.location}</p>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No users found</p>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Selected User */}
              <div className="mb-4 flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-10 h-10 rounded-full border-2 border-green-300"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{selectedUser.name}</p>
                  {selectedUser.location && (
                    <p className="text-sm text-gray-600">{selectedUser.location}</p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-1 hover:bg-green-100 rounded transition-colors"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Message:
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message..."
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-2">
                  {message.length} / 2000 characters
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {selectedUser && (
          <div className="p-6 border-t bg-gray-50">
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="h-5 w-5" />
                Send Message
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { X, Search, Send, Loader2 } from 'lucide-react'

interface User {
  id: string
  firstName: string
  lastName: string
  avatar: string | null
  location?: string | null
}

interface NewMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: (userId: string, message: string) => void
}

export function NewMessageModal({ isOpen, onClose, onSend }: NewMessageModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [message, setMessage] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchUsers()
    }
  }, [isOpen])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch {
      // Silently ignore errors fetching users
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
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

  const getUserAvatar = (user: User) => {
    return user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`
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
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                      <img
                        src={getUserAvatar(user)}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-12 h-12 rounded-full border-2 border-gray-200"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        {user.location && (
                          <p className="text-sm text-gray-600">{user.location}</p>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    {users.length === 0 ? 'No users available' : 'No users found'}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Selected User */}
              <div className="mb-4 flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <img
                  src={getUserAvatar(selectedUser)}
                  alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                  className="w-10 h-10 rounded-full border-2 border-green-300"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
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

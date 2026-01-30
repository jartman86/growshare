'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, CheckCheck, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Notification {
  id: string
  type: string
  title: string
  content: string
  link: string | null
  isRead: boolean
  createdAt: string
}

export function NotificationDropdown() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isOpen) fetchNotifications()
  }, [isOpen])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/notifications/unread-count')
      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.count)
      }
    } catch {
      // Error fetching unread count
    }
  }

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/notifications?limit=10')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      }
    } catch {
      // Error fetching notifications
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId }),
      })
      if (response.ok) {
        setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n))
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch {
      // Error marking notification as read
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true }),
      })
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
        setUnreadCount(0)
      }
    } catch {
      // Error marking all as read
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) markAsRead(notification.id)
    if (notification.link) {
      router.push(notification.link)
      setIsOpen(false)
    }
  }

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return dateString
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-600 dark:text-white hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-[100] max-h-[500px] flex flex-col">
          <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                <CheckCheck className="h-4 w-4" />
                Mark all read
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-600 dark:text-gray-400 text-center">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y dark:divide-gray-700">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${!notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className={`font-semibold text-sm ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                            {notification.title}
                          </h4>
                          {!notification.isRead && <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5" />}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{notification.content}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{formatTime(notification.createdAt)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

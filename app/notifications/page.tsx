'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  Award,
  MessageSquare,
  Calendar,
  Wrench,
  Star,
  Users,
  TrendingUp,
  Filter,
  Loader2,
  BookOpen,
  ShoppingBag,
  Home,
  FileText,
} from 'lucide-react'

interface Notification {
  id: string
  type: string
  title: string
  content: string
  link: string | null
  isRead: boolean
  createdAt: string
  metadata: any
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'TOOL_RENTAL_REQUEST':
    case 'TOOL_RENTAL_APPROVED':
    case 'TOOL_RENTAL_DECLINED':
    case 'TOOL_RETURN_REMINDER':
      return <Wrench className="h-6 w-6" />
    case 'NEW_FOLLOWER':
      return <Users className="h-6 w-6" />
    case 'BADGE_EARNED':
    case 'ACHIEVEMENT_UNLOCKED':
      return <Award className="h-6 w-6" />
    case 'FORUM_REPLY':
    case 'FORUM_MENTION':
    case 'POST_COMMENT':
      return <MessageSquare className="h-6 w-6" />
    case 'EVENT_REMINDER':
    case 'EVENT_STARTING':
      return <Calendar className="h-6 w-6" />
    case 'NEW_REVIEW':
      return <Star className="h-6 w-6" />
    case 'LEVEL_UP':
      return <TrendingUp className="h-6 w-6" />
    case 'COURSE_COMPLETED':
    case 'LESSON_AVAILABLE':
      return <BookOpen className="h-6 w-6" />
    case 'MARKETPLACE_SALE':
    case 'ORDER_RECEIVED':
      return <ShoppingBag className="h-6 w-6" />
    case 'BOOKING_REQUEST':
    case 'BOOKING_APPROVED':
    case 'BOOKING_DECLINED':
      return <Home className="h-6 w-6" />
    case 'INSTRUCTOR_APPROVED':
    case 'INSTRUCTOR_APPLICATION':
      return <FileText className="h-6 w-6" />
    default:
      return <Bell className="h-6 w-6" />
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'TOOL_RENTAL_REQUEST':
    case 'TOOL_RENTAL_APPROVED':
    case 'TOOL_RENTAL_DECLINED':
    case 'TOOL_RETURN_REMINDER':
      return 'text-orange-600 bg-orange-100'
    case 'NEW_FOLLOWER':
      return 'text-indigo-600 bg-indigo-100'
    case 'BADGE_EARNED':
    case 'ACHIEVEMENT_UNLOCKED':
      return 'text-yellow-600 bg-yellow-100'
    case 'FORUM_REPLY':
    case 'FORUM_MENTION':
    case 'POST_COMMENT':
      return 'text-blue-600 bg-blue-100'
    case 'EVENT_REMINDER':
    case 'EVENT_STARTING':
      return 'text-pink-600 bg-pink-100'
    case 'NEW_REVIEW':
      return 'text-purple-600 bg-purple-100'
    case 'LEVEL_UP':
      return 'text-green-600 bg-green-100'
    case 'COURSE_COMPLETED':
    case 'LESSON_AVAILABLE':
      return 'text-emerald-600 bg-emerald-100'
    case 'MARKETPLACE_SALE':
    case 'ORDER_RECEIVED':
      return 'text-cyan-600 bg-cyan-100'
    case 'BOOKING_REQUEST':
    case 'BOOKING_APPROVED':
    case 'BOOKING_DECLINED':
      return 'text-teal-600 bg-teal-100'
    case 'INSTRUCTOR_APPROVED':
    case 'INSTRUCTOR_APPLICATION':
      return 'text-violet-600 bg-violet-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

const formatTimeAgo = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minutes ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function NotificationsPage() {
  const [filterType, setFilterType] = useState<'all' | 'unread'>('all')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNotifications()
  }, [filterType])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterType === 'unread') {
        params.set('unreadOnly', 'true')
      }
      params.set('limit', '50')

      const response = await fetch(`/api/notifications?${params}`)
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      } else if (response.status === 401) {
        setError('Please sign in to view notifications')
      } else {
        setError('Failed to load notifications')
      }
    } catch (err) {
      setError('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId }),
      })

      if (response.ok) {
        setNotifications(notifications.map(n =>
          n.id === notificationId ? { ...n, isRead: true } : n
        ))
      }
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true }),
      })

      if (response.ok) {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })))
      }
    } catch (err) {
      console.error('Error marking all as read:', err)
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-screen topo-lines">
        {/* Header Section */}
        <div className="garden-gradient-sunrise topo-dense text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2d5016]/20 to-transparent"></div>
          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-12 w-12 drop-shadow-md" />
              <h1 className="text-4xl font-bold drop-shadow-lg">Notifications</h1>
            </div>
            <p className="text-[#f4e4c1] text-lg drop-shadow-md font-medium">
              Stay updated with what's happening in your community
            </p>
            {unreadCount > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg shadow-md">
                <span className="font-semibold drop-shadow-sm">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Filter & Actions */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 p-4 mb-6 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${
                    filterType === 'all'
                      ? 'bg-gradient-to-r from-[#8bc34a] to-[#6ba03f] text-white shadow-md'
                      : 'text-[#4a3f35] hover:bg-[#aed581]/20 border border-[#8bc34a]/30'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilterType('unread')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${
                    filterType === 'unread'
                      ? 'bg-gradient-to-r from-[#8bc34a] to-[#6ba03f] text-white shadow-md'
                      : 'text-[#4a3f35] hover:bg-[#aed581]/20 border border-[#8bc34a]/30'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#4a7c2c] hover:bg-[#aed581]/20 rounded-lg transition-colors"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : error ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 p-12 text-center shadow-md">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{error}</h3>
              {error.includes('sign in') && (
                <Link
                  href="/sign-in"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors mt-4"
                >
                  Sign In
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`bg-white/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 hover:shadow-lg transition-all ${
                      !notification.isRead ? 'ring-2 ring-[#8bc34a]/50 border-[#4a7c2c]/50' : ''
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex gap-4">
                        {/* Icon */}
                        <div className={`p-3 rounded-full flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-900 mb-1">
                                {notification.title}
                              </h3>

                              <p className="text-gray-600 mb-3">{notification.content}</p>

                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <Clock className="h-4 w-4" />
                                  <span>{formatTimeAgo(notification.createdAt)}</span>
                                </div>

                                {notification.link && (
                                  <Link
                                    href={notification.link}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                  >
                                    View details →
                                  </Link>
                                )}
                              </div>
                            </div>

                            {/* Mark as read button */}
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Mark as read"
                              >
                                <Check className="h-5 w-5 text-blue-600" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 p-12 text-center shadow-md">
                  <Bell className="h-16 w-16 text-[#4a7c2c] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[#2d5016] mb-2">
                    {filterType === 'unread' ? 'All caught up!' : 'No notifications yet'}
                  </h3>
                  <p className="text-[#4a3f35]">
                    {filterType === 'unread'
                      ? 'You have no unread notifications'
                      : "We'll notify you when something happens"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

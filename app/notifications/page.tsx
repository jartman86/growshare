'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SAMPLE_NOTIFICATIONS, type NotificationType, markAsRead, markAllAsRead, getUnreadCount } from '@/lib/notifications-data'
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
} from 'lucide-react'

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'tool_rental_request':
    case 'tool_rental_approved':
    case 'tool_rental_declined':
    case 'tool_return_reminder':
    case 'tool_purchase_inquiry':
      return <Wrench className="h-6 w-6" />
    case 'new_follower':
    case 'follow':
      return <Users className="h-6 w-6" />
    case 'achievement_unlocked':
      return <Award className="h-6 w-6" />
    case 'forum_reply':
    case 'forum_mention':
      return <MessageSquare className="h-6 w-6" />
    case 'event_reminder':
    case 'event_rsvp':
      return <Calendar className="h-6 w-6" />
    case 'review_received':
      return <Star className="h-6 w-6" />
    case 'level_up':
      return <TrendingUp className="h-6 w-6" />
    default:
      return <Bell className="h-6 w-6" />
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'tool_rental_request':
    case 'tool_rental_approved':
    case 'tool_rental_declined':
    case 'tool_return_reminder':
    case 'tool_purchase_inquiry':
      return 'text-orange-600 bg-orange-100'
    case 'new_follower':
    case 'follow':
      return 'text-indigo-600 bg-indigo-100'
    case 'achievement_unlocked':
      return 'text-yellow-600 bg-yellow-100'
    case 'forum_reply':
    case 'forum_mention':
      return 'text-blue-600 bg-blue-100'
    case 'event_reminder':
    case 'event_rsvp':
      return 'text-pink-600 bg-pink-100'
    case 'review_received':
      return 'text-purple-600 bg-purple-100'
    case 'level_up':
      return 'text-green-600 bg-green-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

const formatTimeAgo = (date: Date) => {
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
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS)

  const filteredNotifications = filterType === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications

  const unreadCount = getUnreadCount(notifications)

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId)
    setNotifications(notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    ))
  }

  const handleMarkAllAsRead = () => {
    markAllAsRead('user-1')
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-12 w-12" />
              <h1 className="text-4xl font-bold">Notifications</h1>
            </div>
            <p className="text-blue-100 text-lg">
              Stay updated with what's happening in your community
            </p>
            {unreadCount > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-500 rounded-lg">
                <span className="font-semibold">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Filter & Actions */}
          <div className="bg-white rounded-xl border p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterType === 'all'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilterType('unread')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterType === 'unread'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl border hover:shadow-md transition-shadow ${
                    !notification.read ? 'ring-2 ring-blue-200' : ''
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

                            {/* Actor info if present */}
                            {notification.actorAvatar && (
                              <div className="flex items-center gap-2 mb-3">
                                <img
                                  src={notification.actorAvatar}
                                  alt={notification.actorName}
                                  className="w-8 h-8 rounded-full"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                  {notification.actorName}
                                </span>
                              </div>
                            )}

                            <p className="text-gray-600 mb-3">{notification.message}</p>

                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Clock className="h-4 w-4" />
                                <span>{formatTimeAgo(notification.createdAt)}</span>
                              </div>

                              {notification.linkUrl && (
                                <Link
                                  href={notification.linkUrl}
                                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                  {notification.linkText || 'View'} →
                                </Link>
                              )}
                            </div>
                          </div>

                          {/* Mark as read button */}
                          {!notification.read && (
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
              <div className="bg-white rounded-xl border p-12 text-center">
                <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {filterType === 'unread' ? 'All caught up!' : 'No notifications yet'}
                </h3>
                <p className="text-gray-600">
                  {filterType === 'unread'
                    ? 'You have no unread notifications'
                    : 'We'll notify you when something happens'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

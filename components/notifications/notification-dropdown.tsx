'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Notification, getUnreadCount, markAsRead, markAllAsRead } from '@/lib/notifications-data'
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
  X,
} from 'lucide-react'

interface NotificationDropdownProps {
  notifications: Notification[]
  onClose: () => void
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'tool_rental_request':
    case 'tool_rental_approved':
    case 'tool_rental_declined':
    case 'tool_return_reminder':
    case 'tool_purchase_inquiry':
      return <Wrench className="h-5 w-5" />
    case 'new_follower':
    case 'follow':
      return <Users className="h-5 w-5" />
    case 'achievement_unlocked':
      return <Award className="h-5 w-5" />
    case 'forum_reply':
    case 'forum_mention':
      return <MessageSquare className="h-5 w-5" />
    case 'event_reminder':
    case 'event_rsvp':
      return <Calendar className="h-5 w-5" />
    case 'review_received':
      return <Star className="h-5 w-5" />
    case 'level_up':
      return <TrendingUp className="h-5 w-5" />
    default:
      return <Bell className="h-5 w-5" />
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
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export function NotificationDropdown({ notifications, onClose }: NotificationDropdownProps) {
  const unreadCount = getUnreadCount(notifications)
  const recentNotifications = notifications.slice(0, 5)

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId)
    // Would trigger a refresh of notifications here
  }

  const handleMarkAllAsRead = () => {
    markAllAsRead('user-1') // Would use actual user ID
    // Would trigger a refresh of notifications here
  }

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border overflow-hidden z-50">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600">{unreadCount} unread</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {recentNotifications.length > 0 ? (
          <>
            {recentNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex gap-3">
                  {/* Icon */}
                  <div className={`p-2 rounded-full flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Mark as read"
                        >
                          <Check className="h-3 w-3 text-blue-600" />
                        </button>
                      )}
                    </div>

                    {/* Actor info if present */}
                    {notification.actorAvatar && (
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={notification.actorAvatar}
                          alt={notification.actorName}
                          className="w-5 h-5 rounded-full"
                        />
                        <span className="text-xs font-medium text-gray-700">
                          {notification.actorName}
                        </span>
                      </div>
                    )}

                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimeAgo(notification.createdAt)}</span>
                      </div>

                      {notification.linkUrl && (
                        <Link
                          href={notification.linkUrl}
                          onClick={onClose}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {notification.linkText || 'View'}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No notifications yet</p>
            <p className="text-sm text-gray-500 mt-1">
              We'll notify you when something happens
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {recentNotifications.length > 0 && (
        <div className="p-3 border-t bg-gray-50">
          <Link
            href="/notifications"
            onClick={onClose}
            className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All Notifications
          </Link>
        </div>
      )}
    </div>
  )
}

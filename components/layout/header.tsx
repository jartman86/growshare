'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import {
  MapIcon,
  ShoppingBagIcon,
  BookOpenIcon,
  MessageSquareIcon,
  LayoutDashboardIcon,
  Sprout,
  TrophyIcon,
  WrenchIcon,
  Bell,
  Mail,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { NotificationDropdown } from '@/components/notifications/notification-dropdown'
import { SAMPLE_NOTIFICATIONS, getUnreadCount } from '@/lib/notifications-data'
import { SAMPLE_CONVERSATIONS, getUnreadConversationsCount } from '@/lib/messages-data'

const navigationItems2025 = [
  { name: 'Explore', href: '/explore', icon: MapIcon },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboardIcon },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingBagIcon },
  { name: 'Tools', href: '/tools', icon: WrenchIcon },
  { name: 'Knowledge Hub', href: '/knowledge', icon: BookOpenIcon },
  { name: 'Community', href: '/community', icon: MessageSquareIcon },
  { name: 'Leaderboard', href: '/leaderboard', icon: TrophyIcon },
]

export function Header() {
  const pathname = usePathname()
  const { isSignedIn, user } = useUser()
  const [showNotifications, setShowNotifications] = useState(false)
  const unreadCount = getUnreadCount(SAMPLE_NOTIFICATIONS)
  const unreadMessagesCount = getUnreadConversationsCount(SAMPLE_CONVERSATIONS)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Sprout className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900">GrowShare</span>
          </Link>

          {/* Main Navigation */}
          <div className="flex items-center space-x-1">
            {navigationItems2025.map((item) => {
              const Icon = item.icon
              const isActive = pathname.startsWith(item.href)

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <>
                {/* Messages Icon */}
                <Link
                  href="/messages"
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Mail className="h-5 w-5 text-gray-700" />
                  {unreadMessagesCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                    </span>
                  )}
                </Link>

                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Bell className="h-5 w-5 text-gray-700" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <NotificationDropdown
                      notifications={SAMPLE_NOTIFICATIONS}
                      onClose={() => setShowNotifications(false)}
                    />
                  )}
                </div>

                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: 'h-9 w-9'
                    }
                  }}
                />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors">
                    Get Started
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="border-t border-gray-200 md:hidden">
        <div className="flex items-center justify-around py-2">
          {navigationItems2025.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center space-y-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                  isActive
                    ? 'text-green-700'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </header>
  )
}

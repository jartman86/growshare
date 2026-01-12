'use client'

import { useState, useEffect } from 'react'
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
  Users,
  Target,
  BookIcon,
  CalendarIcon,
  BugIcon,
  FlowerIcon,
  CalendarDays,
  User as UserIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { NavDropdown } from '@/components/ui/dropdown-menu'
import { NotificationDropdown } from '@/components/notifications/notification-dropdown'
import { SAMPLE_NOTIFICATIONS, getUnreadCount } from '@/lib/notifications-data'
import { SAMPLE_CONVERSATIONS, getUnreadConversationsCount } from '@/lib/messages-data'

const standaloneNavItems = [
  { name: 'Explore', href: '/explore', icon: MapIcon },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingBagIcon },
  { name: 'Tools', href: '/tools', icon: WrenchIcon },
]

const dashboardDropdownItems = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: <LayoutDashboardIcon className="h-4 w-4" />,
    description: 'Your activity hub',
  },
  {
    label: 'Journal',
    href: '/dashboard/journal',
    icon: <BookIcon className="h-4 w-4" />,
    description: 'Track your crops',
  },
  {
    label: 'Challenges',
    href: '/challenges',
    icon: <Target className="h-4 w-4" />,
    description: 'Compete and earn',
  },
  {
    label: 'Leaderboard',
    href: '/leaderboard',
    icon: <TrophyIcon className="h-4 w-4" />,
    description: 'Top growers',
  },
]

const learningDropdownItems = [
  {
    label: 'Courses',
    href: '/knowledge',
    icon: <BookOpenIcon className="h-4 w-4" />,
    description: 'Educational courses',
  },
  {
    label: 'Resources',
    href: '/resources',
    icon: <Sprout className="h-4 w-4" />,
    description: 'Plant guides & tips',
  },
]

const communityDropdownItems = [
  {
    label: 'Forum',
    href: '/community',
    icon: <MessageSquareIcon className="h-4 w-4" />,
    description: 'Discussions & topics',
  },
  {
    label: 'Groups',
    href: '/groups',
    icon: <Users className="h-4 w-4" />,
    description: 'Join local groups',
  },
  {
    label: 'Events',
    href: '/events',
    icon: <CalendarDays className="h-4 w-4" />,
    description: 'Upcoming events',
  },
]

// Bottom mobile navigation - only most essential items (Profile is dynamic, added in component)
const mobileNavItems = [
  { name: 'Explore', href: '/explore', icon: MapIcon },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboardIcon },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingBagIcon },
  { name: 'Community', href: '/community', icon: MessageSquareIcon },
]

export function Header() {
  const pathname = usePathname()
  const { isSignedIn, user } = useUser()
  const [showNotifications, setShowNotifications] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const unreadCount = getUnreadCount(SAMPLE_NOTIFICATIONS)
  const unreadMessagesCount = getUnreadConversationsCount(SAMPLE_CONVERSATIONS)

  // Fetch user's username for profile link
  useEffect(() => {
    if (isSignedIn) {
      fetch('/api/profile')
        .then((res) => res.json())
        .then((data) => {
          if (data.username) {
            setUsername(data.username)
          }
        })
        .catch((err) => console.error('Failed to fetch username:', err))
    }
  }, [isSignedIn])

  const isDashboardActive =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/challenges') ||
    pathname.startsWith('/leaderboard') ||
    pathname.startsWith('/journal')

  const isLearningActive =
    pathname.startsWith('/knowledge') ||
    pathname.startsWith('/resources')

  const isCommunityActive =
    pathname.startsWith('/community') ||
    pathname.startsWith('/groups') ||
    pathname.startsWith('/events')

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b-2 border-[#8bc34a]/30 bg-gradient-to-r from-[#f4e4c1]/95 via-white/95 to-[#aed581]/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-md">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <Sprout className="h-8 w-8 text-[#4a7c2c] transition-transform group-hover:scale-110 group-hover:rotate-12" />
              <span className="text-xl font-bold bg-gradient-to-r from-[#2d5016] to-[#4a7c2c] bg-clip-text text-transparent">GrowShare</span>
            </Link>

            {/* Main Navigation - Desktop */}
            <div className="hidden lg:flex items-center space-x-1">
              {/* Standalone Nav Items */}
              {standaloneNavItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname.startsWith(item.href)

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-gradient-to-r from-[#8bc34a] to-[#6ba03f] text-white shadow-md'
                        : 'text-[#4a3f35] hover:bg-[#aed581]/20 hover:text-[#2d5016]'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}

              {/* Learning Dropdown */}
              <NavDropdown
                trigger="Learning"
                icon={<BookOpenIcon className="h-4 w-4" />}
                items={learningDropdownItems}
                isActive={isLearningActive}
              />

              {/* Dashboard Dropdown */}
              <NavDropdown
                trigger="Dashboard"
                icon={<LayoutDashboardIcon className="h-4 w-4" />}
                items={dashboardDropdownItems}
                isActive={isDashboardActive}
              />

              {/* Community Dropdown */}
              <NavDropdown
                trigger="Community"
                icon={<MessageSquareIcon className="h-4 w-4" />}
                items={communityDropdownItems}
                isActive={isCommunityActive}
              />
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {isSignedIn ? (
                <>
                  {/* Messages Icon */}
                  <Link
                    href="/messages"
                    className="relative p-2 rounded-lg hover:bg-[#aed581]/30 transition-all hover:scale-105"
                  >
                    <Mail className="h-5 w-5 text-[#4a7c2c]" />
                    {unreadMessagesCount > 0 && (
                      <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-gradient-to-br from-[#87ceeb] to-[#457b9d] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-md">
                        {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                      </span>
                    )}
                  </Link>

                  {/* Notification Bell */}
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative p-2 rounded-lg hover:bg-[#aed581]/30 transition-all hover:scale-105"
                    >
                      <Bell className="h-5 w-5 text-[#4a7c2c]" />
                      {unreadCount > 0 && (
                        <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-gradient-to-br from-[#ef233c] to-[#d62828] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-md">
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

                  {/* Profile Link */}
                  {username && (
                    <Link
                      href={`/profile/${username}`}
                      className="p-2 rounded-lg hover:bg-[#aed581]/30 transition-all hover:scale-105"
                      title="View Profile"
                    >
                      <UserIcon className="h-5 w-5 text-[#4a7c2c]" />
                    </Link>
                  )}

                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: 'h-9 w-9 ring-2 ring-green-100 hover:ring-green-200 transition-all',
                      },
                    }}
                  />
                </>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button className="rounded-lg px-4 py-2 text-sm font-medium text-[#4a7c2c] hover:bg-[#aed581]/20 hover:text-[#2d5016] transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="rounded-lg bg-gradient-to-r from-[#6ba03f] to-[#4a7c2c] px-4 py-2 text-sm font-medium text-white hover:from-[#4a7c2c] hover:to-[#2d5016] transition-all hover:shadow-lg hover:scale-105">
                      Get Started
                    </button>
                  </SignUpButton>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Navigation */}
      {isSignedIn && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-[#f4e4c1]/95 via-white/95 to-[#aed581]/95 backdrop-blur border-t-2 border-[#8bc34a]/30 shadow-lg">
          <div className="grid grid-cols-5 gap-1 px-2 py-2">
            {mobileNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname.startsWith(item.href)

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 text-xs font-medium transition-all',
                    isActive
                      ? 'text-white bg-gradient-to-br from-[#6ba03f] to-[#4a7c2c] shadow-md'
                      : 'text-[#4a3f35] hover:text-[#2d5016] hover:bg-[#aed581]/20'
                  )}
                >
                  <Icon className={cn('h-5 w-5', isActive && 'scale-110')} />
                  <span className="text-[10px]">{item.name}</span>
                </Link>
              )
            })}

            {/* Profile Link */}
            {username && (
              <Link
                href={`/profile/${username}`}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 text-xs font-medium transition-all',
                  pathname.startsWith(`/profile/${username}`)
                    ? 'text-white bg-gradient-to-br from-[#6ba03f] to-[#4a7c2c] shadow-md'
                    : 'text-[#4a3f35] hover:text-[#2d5016] hover:bg-[#aed581]/20'
                )}
              >
                <UserIcon className={cn('h-5 w-5', pathname.startsWith(`/profile/${username}`) && 'scale-110')} />
                <span className="text-[10px]">Profile</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  )
}

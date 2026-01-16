'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
  List,
  CalendarIcon,
  BugIcon,
  FlowerIcon,
  CalendarDays,
  User as UserIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { NavDropdown } from '@/components/ui/dropdown-menu'
import { NotificationDropdown } from '@/components/notifications/notification-dropdown'

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

const bookingsDropdownItems = [
  {
    label: 'My Bookings',
    href: '/my-bookings',
    icon: <CalendarIcon className="h-4 w-4" />,
    description: 'Your plot bookings',
  },
  {
    label: 'Manage Bookings',
    href: '/manage-bookings',
    icon: <CalendarDays className="h-4 w-4" />,
    description: 'Review requests',
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
  const [username, setUsername] = useState<string | null>(null)
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0)

  // Fetch user's username and unread message count
  useEffect(() => {
    if (isSignedIn) {
      // Fetch username
      fetch('/api/profile')
        .then((res) => res.json())
        .then((data) => {
          if (data.username) {
            setUsername(data.username)
          }
        })
        .catch((err) => console.error('Failed to fetch username:', err))

      // Fetch unread message count
      fetch('/api/messages/unread-count')
        .then((res) => res.json())
        .then((data) => {
          if (typeof data.count === 'number') {
            setUnreadMessagesCount(data.count)
          }
        })
        .catch((err) => console.error('Failed to fetch unread count:', err))
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

  const isBookingsActive =
    pathname.startsWith('/my-bookings') ||
    pathname.startsWith('/manage-bookings')

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b-2 border-[#8bc34a]/30 bg-gradient-to-r from-[#f4e4c1]/95 via-white/95 to-[#aed581]/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-md">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-32 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <Image
                src="/growshare-logo.png"
                alt="GrowShare"
                width={480}
                height={144}
                className="transition-transform group-hover:scale-105 h-28 w-auto"
                priority
              />
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
                        ? 'bg-[#5a7f3a] text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
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

              {/* Bookings Dropdown */}
              {isSignedIn && (
                <NavDropdown
                  trigger="Bookings"
                  icon={<CalendarIcon className="h-4 w-4" />}
                  items={bookingsDropdownItems}
                  isActive={isBookingsActive}
                />
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {isSignedIn ? (
                <>
                  {/* Messages Icon */}
                  <Link
                    href="/messages"
                    className="relative p-2 rounded-lg hover:bg-gray-100 transition-all"
                    title="Messages"
                  >
                    <Mail className="h-5 w-5 text-gray-700" />
                    {unreadMessagesCount > 0 && (
                      <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#5a7f3a] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                        {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                      </span>
                    )}
                  </Link>

                  {/* My Plots Link */}
                  <Link
                    href="/my-plots"
                    className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                    title="My Plots"
                  >
                    <List className="h-5 w-5 text-gray-700" />
                  </Link>

                  {/* Notification Bell */}
                  <NotificationDropdown />

                  {/* Profile Link */}
                  {username && (
                    <Link
                      href={`/profile/${username}`}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                      title="View Profile"
                    >
                      <UserIcon className="h-5 w-5 text-gray-700" />
                    </Link>
                  )}

                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: 'h-9 w-9 ring-2 ring-gray-200 hover:ring-gray-300 transition-all',
                      },
                    }}
                  />
                </>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="rounded-md bg-[#5a7f3a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4a6f2a] transition-all shadow-sm hover:shadow">
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

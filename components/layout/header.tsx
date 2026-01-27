'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { SignInButton, SignUpButton, useUser } from '@clerk/nextjs'
import {
  MapIcon,
  ShoppingBagIcon,
  BookOpenIcon,
  MessageSquareIcon,
  Sprout,
  TrophyIcon,
  WrenchIcon,
  Bell,
  Mail,
  Users,
  Target,
  CalendarDays,
  Plus,
  User as UserIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { NavDropdown } from '@/components/ui/dropdown-menu'
import { NotificationDropdown } from '@/components/notifications/notification-dropdown'
import { SearchBar } from '@/components/layout/search-bar'
import { VerificationBanner } from '@/components/verification/verification-banner'
import { UserMenuDropdown } from '@/components/layout/user-menu-dropdown'

// Top-level standalone nav items (no dropdown)
const standaloneNavItems = [
  { name: 'Explore', href: '/explore', icon: MapIcon },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingBagIcon },
]

// Community dropdown - includes social features + gamification
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

// Learn dropdown - educational content
const learnDropdownItems = [
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

// List dropdown - all listing/sharing actions
const listDropdownItems = [
  {
    label: 'List a Plot',
    href: '/list-plot',
    icon: <MapIcon className="h-4 w-4" />,
    description: 'Rent out your land',
  },
  {
    label: 'List Produce',
    href: '/dashboard/sell/new',
    icon: <Sprout className="h-4 w-4" />,
    description: 'Sell your harvest',
  },
  {
    label: 'List a Tool',
    href: '/tools/list',
    icon: <WrenchIcon className="h-4 w-4" />,
    description: 'Share your equipment',
  },
  {
    label: 'Browse Tools',
    href: '/tools',
    icon: <WrenchIcon className="h-4 w-4" />,
    description: 'Find equipment to rent',
  },
]

// Mobile bottom navigation
const mobileNavItems = [
  { name: 'Explore', href: '/explore', icon: MapIcon },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingBagIcon },
  { name: 'Community', href: '/community', icon: MessageSquareIcon },
]

export function Header() {
  const pathname = usePathname()
  const { isSignedIn, user } = useUser()
  const [username, setUsername] = useState<string | null>(null)
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  const [firstName, setFirstName] = useState<string | null>(null)
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isInstructor, setIsInstructor] = useState(false)
  const [showMobileListMenu, setShowMobileListMenu] = useState(false)

  // Fetch user's profile data
  useEffect(() => {
    if (isSignedIn) {
      fetch('/api/profile')
        .then((res) => res.json())
        .then((data) => {
          if (data.username) {
            setUsername(data.username)
          }
          if (data.avatar) {
            setUserAvatar(data.avatar)
          }
          if (data.firstName) {
            setFirstName(data.firstName)
          }
          if (data.role && data.role.includes('ADMIN')) {
            setIsAdmin(true)
          }
          if (data.isInstructor) {
            setIsInstructor(true)
          }
        })
        .catch((err) => console.error('Failed to fetch profile:', err))
    }
  }, [isSignedIn])

  // Poll unread message count every 30 seconds
  useEffect(() => {
    if (!isSignedIn) return

    const fetchUnreadCount = () => {
      fetch('/api/messages/unread-count')
        .then((res) => res.json())
        .then((data) => {
          if (typeof data.count === 'number') {
            setUnreadMessagesCount(data.count)
          }
        })
        .catch((err) => console.error('Failed to fetch unread count:', err))
    }

    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [isSignedIn])

  // Active state checks
  const isCommunityActive =
    pathname.startsWith('/community') ||
    pathname.startsWith('/groups') ||
    pathname.startsWith('/events') ||
    pathname.startsWith('/challenges') ||
    pathname.startsWith('/leaderboard')

  const isLearnActive =
    pathname.startsWith('/knowledge') ||
    pathname.startsWith('/resources')

  const isListActive =
    pathname.startsWith('/list-plot') ||
    pathname.startsWith('/dashboard/sell/new') ||
    pathname.startsWith('/tools/list') ||
    pathname === '/tools'

  return (
    <>
      {isSignedIn && <VerificationBanner />}
      <header className="sticky top-0 z-50 w-full border-b-2 border-[#8bc34a]/30 dark:border-gray-700 bg-gradient-to-r from-[#f4e4c1]/95 via-white/95 to-[#aed581]/95 dark:from-gray-900/95 dark:via-gray-900/95 dark:to-gray-800/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 shadow-md">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <Image
                src="/growshare-logo.png"
                alt="GrowShare"
                width={125}
                height={40}
                className="transition-transform group-hover:scale-105"
                priority
              />
            </Link>

            {/* Main Navigation - Desktop */}
            <div className="hidden lg:flex items-center space-x-2">
              {/* Standalone Nav Items (Explore, Marketplace) */}
              {standaloneNavItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname.startsWith(item.href)

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-base font-medium transition-all',
                      isActive
                        ? 'bg-[#5a7f3a] text-white shadow-sm dark:bg-green-700'
                        : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}

              {/* Community Dropdown */}
              <NavDropdown
                trigger="Community"
                icon={<MessageSquareIcon className="h-5 w-5" />}
                items={communityDropdownItems}
                isActive={isCommunityActive}
              />

              {/* Learn Dropdown */}
              <NavDropdown
                trigger="Learn"
                icon={<BookOpenIcon className="h-5 w-5" />}
                items={[
                  ...learnDropdownItems,
                  ...(isInstructor ? [{
                    label: 'Instructor Dashboard',
                    href: '/instructor',
                    icon: <Sprout className="h-4 w-4" />,
                    description: 'Manage your courses',
                  }] : []),
                ]}
                isActive={isLearnActive || pathname.startsWith('/instructor')}
              />

              {/* List Dropdown (authenticated only) */}
              {isSignedIn && (
                <NavDropdown
                  trigger="List"
                  icon={<Plus className="h-5 w-5" />}
                  items={listDropdownItems}
                  isActive={isListActive}
                />
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="hidden sm:block">
                <SearchBar />
              </div>

              {isSignedIn ? (
                <>
                  {/* Notifications */}
                  <NotificationDropdown />

                  {/* Messages Icon */}
                  <Link
                    href="/messages"
                    className="relative p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                    title="Messages"
                  >
                    <Mail className="h-5 w-5 text-gray-700 dark:text-white" />
                    {unreadMessagesCount > 0 && (
                      <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#5a7f3a] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                        {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                      </span>
                    )}
                  </Link>

                  {/* User Menu Dropdown */}
                  <UserMenuDropdown
                    username={username}
                    avatar={userAvatar}
                    firstName={firstName}
                    isAdmin={isAdmin}
                  />
                </>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors">
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

      {/* Mobile Bottom Navigation - Premium with 44px touch targets */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        {isSignedIn ? (
          <div className="grid grid-cols-5 px-1 py-1.5 safe-area-pb">
            {/* Main nav items */}
            {mobileNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname.startsWith(item.href)

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center gap-0.5 rounded-xl min-h-[56px] px-1 font-medium transition-all active:scale-95',
                    isActive
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  )}
                >
                  <div className={cn(
                    'p-2 rounded-xl transition-colors',
                    isActive && 'bg-green-100 dark:bg-green-900/40'
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-[11px]">{item.name}</span>
                </Link>
              )
            })}

            {/* List/Create Button */}
            <button
              onClick={() => setShowMobileListMenu(!showMobileListMenu)}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 rounded-xl min-h-[56px] px-1 font-medium transition-all active:scale-95',
                showMobileListMenu
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              )}
            >
              <div className={cn(
                'p-2 rounded-xl transition-colors',
                showMobileListMenu && 'bg-green-100 dark:bg-green-900/40'
              )}>
                <Plus className="h-6 w-6" />
              </div>
              <span className="text-[11px]">Create</span>
            </button>

            {/* Account Button */}
            <Link
              href="/dashboard"
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 rounded-xl min-h-[56px] px-1 font-medium transition-all active:scale-95',
                pathname.startsWith('/dashboard') || pathname.startsWith('/settings') || pathname.startsWith('/profile')
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              )}
            >
              <div className={cn(
                'p-2 rounded-xl transition-colors',
                (pathname.startsWith('/dashboard') || pathname.startsWith('/settings') || pathname.startsWith('/profile')) && 'bg-green-100 dark:bg-green-900/40'
              )}>
                <UserIcon className="h-6 w-6" />
              </div>
              <span className="text-[11px]">Account</span>
            </Link>
          </div>
        ) : (
          /* Mobile nav for unauthenticated users */
          <div className="grid grid-cols-4 px-2 py-1.5 safe-area-pb">
            {/* Explore */}
            <Link
              href="/explore"
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 rounded-xl min-h-[56px] px-1 font-medium transition-all active:scale-95',
                pathname.startsWith('/explore')
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              )}
            >
              <div className={cn(
                'p-2 rounded-xl transition-colors',
                pathname.startsWith('/explore') && 'bg-green-100 dark:bg-green-900/40'
              )}>
                <MapIcon className="h-6 w-6" />
              </div>
              <span className="text-[11px]">Explore</span>
            </Link>

            {/* Marketplace */}
            <Link
              href="/marketplace"
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 rounded-xl min-h-[56px] px-1 font-medium transition-all active:scale-95',
                pathname.startsWith('/marketplace')
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              )}
            >
              <div className={cn(
                'p-2 rounded-xl transition-colors',
                pathname.startsWith('/marketplace') && 'bg-green-100 dark:bg-green-900/40'
              )}>
                <ShoppingBagIcon className="h-6 w-6" />
              </div>
              <span className="text-[11px]">Market</span>
            </Link>

            {/* Sign In */}
            <SignInButton mode="modal">
              <button className="flex flex-col items-center justify-center gap-0.5 rounded-xl min-h-[56px] px-1 font-medium transition-all active:scale-95 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <div className="p-2 rounded-xl">
                  <UserIcon className="h-6 w-6" />
                </div>
                <span className="text-[11px]">Sign In</span>
              </button>
            </SignInButton>

            {/* Get Started */}
            <SignUpButton mode="modal">
              <button className="flex flex-col items-center justify-center gap-0.5 rounded-xl min-h-[56px] px-1 font-medium transition-all active:scale-95 text-green-600 dark:text-green-400">
                <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/40">
                  <Plus className="h-6 w-6" />
                </div>
                <span className="text-[11px]">Join</span>
              </button>
            </SignUpButton>
          </div>
        )}

        {/* Mobile List Menu Popup (only for signed-in users) */}
        {isSignedIn && showMobileListMenu && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setShowMobileListMenu(false)}
            />
            {/* Menu */}
            <div className="absolute bottom-full left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50 animate-in slide-in-from-bottom-2">
              <div className="p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Create Listing</p>
                {listDropdownItems.slice(0, 3).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setShowMobileListMenu(false)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-gray-400">{item.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

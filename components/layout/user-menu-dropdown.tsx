'use client'

import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { useClerk } from '@clerk/nextjs'
import Link from 'next/link'
import {
  LayoutDashboardIcon,
  CalendarIcon,
  MapIcon,
  ShoppingBagIcon,
  Package,
  UserIcon,
  Settings,
  Mail,
  Shield,
  LogOut,
  ChevronDown,
} from 'lucide-react'

interface UserMenuDropdownProps {
  username: string | null
  avatar: string | null
  firstName: string | null
  isAdmin: boolean
}

export function UserMenuDropdown({ username, avatar, firstName, isAdmin }: UserMenuDropdownProps) {
  const [open, setOpen] = React.useState(false)
  const { signOut } = useClerk()

  const handleSignOut = () => {
    setOpen(false)
    signOut({ redirectUrl: '/' })
  }

  return (
    <DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen}>
      <DropdownMenuPrimitive.Trigger asChild>
        <button
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          {avatar ? (
            <img
              src={avatar}
              alt={firstName || 'User'}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-200"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-sm font-medium ring-2 ring-gray-200">
              {firstName?.charAt(0) || 'U'}
            </div>
          )}
          <ChevronDown
            className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
          />
        </button>
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="end"
          sideOffset={8}
          className="
            z-[100] min-w-[240px] bg-white rounded-xl shadow-lg border border-gray-200
            overflow-hidden
            animate-in fade-in-0 zoom-in-95
            data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
          "
        >
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-sm font-medium text-gray-900">{firstName || 'User'}</p>
            {username && (
              <p className="text-xs text-gray-500">@{username}</p>
            )}
          </div>

          {/* Quick Access Section */}
          <div className="py-1">
            <DropdownMenuPrimitive.Item asChild>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 focus:bg-green-50 focus:outline-none transition-colors cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <LayoutDashboardIcon className="h-4 w-4 text-gray-400" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuPrimitive.Item>
            <DropdownMenuPrimitive.Item asChild>
              <Link
                href="/my-bookings"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 focus:bg-green-50 focus:outline-none transition-colors cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <CalendarIcon className="h-4 w-4 text-gray-400" />
                <span>My Bookings</span>
              </Link>
            </DropdownMenuPrimitive.Item>
            <DropdownMenuPrimitive.Item asChild>
              <Link
                href="/my-plots"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 focus:bg-green-50 focus:outline-none transition-colors cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <MapIcon className="h-4 w-4 text-gray-400" />
                <span>My Plots</span>
              </Link>
            </DropdownMenuPrimitive.Item>
            <DropdownMenuPrimitive.Item asChild>
              <Link
                href="/dashboard/orders"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 focus:bg-green-50 focus:outline-none transition-colors cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <ShoppingBagIcon className="h-4 w-4 text-gray-400" />
                <span>My Orders</span>
              </Link>
            </DropdownMenuPrimitive.Item>
          </div>

          {/* Selling Section */}
          <div className="py-1 border-t border-gray-100">
            <p className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Selling</p>
            <DropdownMenuPrimitive.Item asChild>
              <Link
                href="/dashboard/sell"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 focus:bg-green-50 focus:outline-none transition-colors cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <ShoppingBagIcon className="h-4 w-4 text-gray-400" />
                <span>Seller Dashboard</span>
              </Link>
            </DropdownMenuPrimitive.Item>
            <DropdownMenuPrimitive.Item asChild>
              <Link
                href="/dashboard/sell/orders"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 focus:bg-green-50 focus:outline-none transition-colors cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <Package className="h-4 w-4 text-gray-400" />
                <span>Incoming Orders</span>
              </Link>
            </DropdownMenuPrimitive.Item>
            <DropdownMenuPrimitive.Item asChild>
              <Link
                href="/manage-bookings"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 focus:bg-green-50 focus:outline-none transition-colors cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <CalendarIcon className="h-4 w-4 text-gray-400" />
                <span>Manage Bookings</span>
              </Link>
            </DropdownMenuPrimitive.Item>
          </div>

          {/* Account Section */}
          <div className="py-1 border-t border-gray-100">
            <p className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Account</p>
            {username && (
              <DropdownMenuPrimitive.Item asChild>
                <Link
                  href={`/profile/${username}`}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 focus:bg-green-50 focus:outline-none transition-colors cursor-pointer"
                  onClick={() => setOpen(false)}
                >
                  <UserIcon className="h-4 w-4 text-gray-400" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuPrimitive.Item>
            )}
            <DropdownMenuPrimitive.Item asChild>
              <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 focus:bg-green-50 focus:outline-none transition-colors cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <Settings className="h-4 w-4 text-gray-400" />
                <span>Settings</span>
              </Link>
            </DropdownMenuPrimitive.Item>
            <DropdownMenuPrimitive.Item asChild>
              <Link
                href="/messages"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 focus:bg-green-50 focus:outline-none transition-colors cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <Mail className="h-4 w-4 text-gray-400" />
                <span>Messages</span>
              </Link>
            </DropdownMenuPrimitive.Item>
          </div>

          {/* Admin Section (conditional) */}
          {isAdmin && (
            <div className="py-1 border-t border-gray-100">
              <DropdownMenuPrimitive.Item asChild>
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 focus:bg-green-50 focus:outline-none transition-colors cursor-pointer"
                  onClick={() => setOpen(false)}
                >
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span>Admin Dashboard</span>
                </Link>
              </DropdownMenuPrimitive.Item>
            </div>
          )}

          {/* Sign Out */}
          <div className="py-1 border-t border-gray-100">
            <DropdownMenuPrimitive.Item asChild>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 focus:bg-red-50 focus:outline-none transition-colors cursor-pointer w-full text-left"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </DropdownMenuPrimitive.Item>
          </div>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  )
}

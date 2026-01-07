'use client'

import Link from 'next/link'
import {
  Plus,
  Search,
  BookOpen,
  ShoppingBag,
  MessageSquare,
  Calendar,
  FileText,
  Award,
} from 'lucide-react'

interface QuickActionsProps {
  userRole: string
}

export function QuickActions({ userRole }: QuickActionsProps) {
  const isLandowner = userRole.includes('LANDOWNER')
  const isRenter = userRole.includes('RENTER')

  const actions = [
    ...(isLandowner
      ? [
          {
            label: 'List a Plot',
            href: '/list-plot',
            icon: Plus,
            color: 'bg-green-600 hover:bg-green-700',
          },
        ]
      : []),
    ...(isRenter
      ? [
          {
            label: 'Find Plots',
            href: '/explore',
            icon: Search,
            color: 'bg-blue-600 hover:bg-blue-700',
          },
        ]
      : []),
    {
      label: 'Learning Hub',
      href: '/knowledge',
      icon: BookOpen,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      label: 'Marketplace',
      href: '/marketplace',
      icon: ShoppingBag,
      color: 'bg-orange-600 hover:bg-orange-700',
    },
    {
      label: 'Messages',
      href: '/messages',
      icon: MessageSquare,
      color: 'bg-pink-600 hover:bg-pink-700',
    },
    {
      label: 'My Bookings',
      href: '/dashboard/bookings',
      icon: Calendar,
      color: 'bg-teal-600 hover:bg-teal-700',
    },
    {
      label: 'Crop Journal',
      href: '/dashboard/journal',
      icon: FileText,
      color: 'bg-indigo-600 hover:bg-indigo-700',
    },
    {
      label: 'View Badges',
      href: '#badges',
      icon: Award,
      color: 'bg-yellow-600 hover:bg-yellow-700',
    },
  ]

  return (
    <div className="bg-white rounded-xl border p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className={`${action.color} text-white rounded-lg p-4 flex flex-col items-center gap-2 transition-all hover:scale-105 hover:shadow-lg`}
          >
            <action.icon className="h-6 w-6" />
            <span className="text-sm font-medium text-center">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

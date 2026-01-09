'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, Calendar, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const communityNavItems = [
  {
    name: 'Forum',
    href: '/community',
    icon: MessageSquare,
    description: 'Discuss and share knowledge',
  },
  {
    name: 'Events',
    href: '/events',
    icon: Calendar,
    description: 'Meetups and workshops',
  },
  {
    name: 'Activity Feed',
    href: '/activity',
    icon: TrendingUp,
    description: 'See what others are doing',
  },
]

export function CommunitySidebar() {
  const pathname = usePathname()

  return (
    <div className="bg-white rounded-xl border p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Community</h3>
      <nav className="space-y-1">
        {communityNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-start gap-3 px-3 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <div className={cn('font-medium text-sm', isActive && 'font-semibold')}>
                  {item.name}
                </div>
                <div className="text-xs text-gray-600 mt-0.5">{item.description}</div>
              </div>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

'use client'

import { MapPin, Calendar, ShoppingBag, Star, TrendingUp, Award } from 'lucide-react'

interface StatsCardsProps {
  stats: {
    plots: number
    bookings: number
    sales: number
    rating: number
    totalPoints: number
    badges: number
  }
  userRole: string
}

export function StatsCards({ stats, userRole }: StatsCardsProps) {
  const isLandowner = userRole.includes('LANDOWNER')
  const isRenter = userRole.includes('RENTER')

  const cards = [
    ...(isLandowner
      ? [
          {
            label: 'Active Plots',
            value: stats.plots,
            icon: MapPin,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
          },
        ]
      : []),
    ...(isRenter
      ? [
          {
            label: 'Active Bookings',
            value: stats.bookings,
            icon: Calendar,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
          },
        ]
      : []),
    {
      label: 'Sales Made',
      value: stats.sales,
      icon: ShoppingBag,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Average Rating',
      value: stats.rating.toFixed(1),
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      suffix: '/5.0',
    },
    {
      label: 'Total Points',
      value: stats.totalPoints.toLocaleString(),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Badges Earned',
      value: stats.badges,
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{card.label}</p>
              <p className="text-3xl font-bold text-gray-900">
                {card.value}
                {card.suffix && (
                  <span className="text-lg text-gray-500">{card.suffix}</span>
                )}
              </p>
            </div>

            <div className={`${card.bgColor} ${card.color} p-3 rounded-lg`}>
              <card.icon className="h-6 w-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

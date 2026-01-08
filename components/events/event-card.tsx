'use client'

import Link from 'next/link'
import { Event } from '@/lib/events-data'
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Star,
  Video,
} from 'lucide-react'

interface EventCardProps {
  event: Event
  featured?: boolean
}

export function EventCard({ event, featured = false }: EventCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  const now = new Date()
  const isPast = event.date < now
  const spotsLeft = event.capacity ? event.capacity - event.attendees : null
  const isAlmostFull = spotsLeft !== null && spotsLeft <= 5 && spotsLeft > 0

  return (
    <Link href={`/events/${event.id}`}>
      <div
        className={`bg-white rounded-xl border hover:shadow-lg transition-all cursor-pointer overflow-hidden h-full flex flex-col ${
          isPast ? 'opacity-75' : ''
        } ${featured ? 'ring-2 ring-yellow-400' : ''}`}
      >
        {/* Image */}
        {event.image && (
          <div className="relative aspect-video overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {featured && (
              <div className="absolute top-3 left-3">
                <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-semibold shadow-lg">
                  <Star className="h-3 w-3" />
                  Featured
                </div>
              </div>
            )}
            {event.isVirtual && (
              <div className="absolute top-3 right-3">
                <div className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-semibold shadow-lg">
                  <Video className="h-3 w-3" />
                  Virtual
                </div>
              </div>
            )}
            {isPast && (
              <div className="absolute top-3 left-3">
                <div className="px-3 py-1 bg-gray-600 text-white rounded-full text-xs font-semibold shadow-lg">
                  Past Event
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Category & Price */}
          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              {event.category}
            </span>
            <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
              {event.price === 0 ? (
                <span className="text-green-600">FREE</span>
              ) : (
                <>
                  <DollarSign className="h-4 w-4" />
                  {event.price}
                </>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 hover:text-green-600 transition-colors">
            {event.title}
          </h3>

          {/* Date & Time */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span>
                {formatTime(event.date)}
                {event.endDate && ` - ${formatTime(event.endDate)}`}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">
                {event.isVirtual ? 'Virtual Event' : `${event.city}, ${event.state}`}
              </span>
            </div>
          </div>

          {/* Organizer */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b">
            {event.organizerAvatar && (
              <img
                src={event.organizerAvatar}
                alt={event.organizerName}
                className="w-6 h-6 rounded-full"
              />
            )}
            <span className="text-sm text-gray-600">by {event.organizerName}</span>
          </div>

          {/* Stats */}
          <div className="mt-auto space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <Users className="h-4 w-4" />
                <span>{event.attendees} attending</span>
              </div>
              {event.capacity && (
                <span className="text-gray-500">
                  {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left
                </span>
              )}
            </div>

            {isAlmostFull && !isPast && (
              <div className="px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-xs text-orange-800 font-medium">
                  ⚡ Almost full! Only {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} remaining
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

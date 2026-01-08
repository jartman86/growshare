import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SAMPLE_EVENTS } from '@/lib/events-data'
import { RSVPButton } from '@/components/events/rsvp-button'
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Star,
  Video,
  CheckCircle,
  AlertCircle,
  Backpack,
} from 'lucide-react'

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const { eventId } = await params
  const event = SAMPLE_EVENTS.find((e) => e.id === eventId)

  if (!event) {
    notFound()
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
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

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Image */}
        {event.image && (
          <div className="relative h-96 overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="mx-auto max-w-7xl">
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 text-white hover:text-green-300 mb-4"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Events
                </Link>
                {event.isFeatured && (
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 font-semibold">Featured Event</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {!event.image && (
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Link>
          )}

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Title & Category */}
              <div className="bg-white rounded-xl border p-8 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {event.category}
                  </span>
                  {event.isVirtual && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      <Video className="h-4 w-4" />
                      Virtual Event
                    </div>
                  )}
                  {isPast && (
                    <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      Past Event
                    </div>
                  )}
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-6">{event.title}</h1>

                {/* Organizer */}
                <div className="flex items-center gap-3 pb-6 border-b">
                  {event.organizerAvatar && (
                    <img
                      src={event.organizerAvatar}
                      alt={event.organizerName}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Organized by</p>
                    <p className="font-semibold text-gray-900">{event.organizerName}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="pt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">About This Event</h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {event.description}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                {event.tags.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Requirements & What to Bring */}
              {(event.requirements || event.whatToBring) && (
                <div className="bg-white rounded-xl border p-8">
                  {event.requirements && event.requirements.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                        Requirements
                      </h3>
                      <ul className="space-y-2">
                        {event.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700">
                            <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {event.whatToBring && event.whatToBring.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Backpack className="h-5 w-5 text-green-600" />
                        What to Bring
                      </h3>
                      <ul className="space-y-2">
                        {event.whatToBring.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                {/* RSVP Card */}
                <div className="bg-white rounded-xl border p-6">
                  <div className="text-center mb-6">
                    {event.price === 0 ? (
                      <p className="text-3xl font-bold text-green-600">FREE</p>
                    ) : (
                      <div>
                        <p className="text-3xl font-bold text-gray-900">${event.price}</p>
                        <p className="text-sm text-gray-600">per person</p>
                      </div>
                    )}
                  </div>

                  <RSVPButton event={event} isPast={isPast} />

                  {/* Capacity Info */}
                  {event.capacity && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Attendees:</span>
                        <span className="font-semibold text-gray-900">
                          {event.attendees} / {event.capacity}
                        </span>
                      </div>
                      {spotsLeft !== null && spotsLeft > 0 && spotsLeft <= 5 && (
                        <p className="mt-2 text-xs text-orange-600 font-medium">
                          ⚡ Only {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} remaining!
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Event Details */}
                <div className="bg-white rounded-xl border p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Event Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">{formatDate(event.date)}</p>
                        <p className="text-sm text-gray-600">
                          {formatTime(event.date)}
                          {event.endDate && ` - ${formatTime(event.endDate)}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">{event.location}</p>
                        {event.isVirtual ? (
                          <p className="text-sm text-gray-600">Virtual event via Zoom</p>
                        ) : (
                          <p className="text-sm text-gray-600">
                            {event.address}
                            <br />
                            {event.city}, {event.state}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {event.attendees} {event.attendees === 1 ? 'person' : 'people'} attending
                        </p>
                        {event.capacity && (
                          <p className="text-sm text-gray-600">
                            Capacity: {event.capacity} {event.capacity === 1 ? 'person' : 'people'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Share */}
                <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                  <h3 className="font-semibold text-blue-900 mb-3">💡 Share This Event</h3>
                  <p className="text-sm text-blue-800 mb-4">
                    Help spread the word and invite fellow growers!
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                      Copy Link
                    </button>
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

'use client'

import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getGroupBySlug } from '@/lib/groups-data'
import {
  ArrowLeft,
  MapPin,
  Users,
  Calendar,
  MessageSquare,
  Wrench,
  BookOpen,
  TrendingUp,
  Settings,
  Share2,
  Bell,
  BellOff,
  Lock,
  Globe,
  CheckCircle,
  Clock,
} from 'lucide-react'

export default function GroupDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const group = getGroupBySlug(slug)

  if (!group) {
    notFound()
  }

  const currentUserId = 'user-1' // Current user
  const isLeader = group.leaders.some((leader) => leader.id === currentUserId)
  const isMember = true // For demo purposes

  // Sample recent activity
  const recentActivity = [
    {
      id: '1',
      type: 'event',
      user: 'Sarah Chen',
      action: 'created a new event',
      target: 'Summer Harvest Festival',
      timestamp: new Date('2024-07-21T14:00:00'),
    },
    {
      id: '2',
      type: 'post',
      user: 'Michael Rodriguez',
      action: 'posted in',
      target: 'General Discussion',
      timestamp: new Date('2024-07-21T12:30:00'),
    },
    {
      id: '3',
      type: 'tool',
      user: 'Jennifer Kim',
      action: 'shared a tool',
      target: 'Electric Tiller',
      timestamp: new Date('2024-07-20T16:45:00'),
    },
  ]

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Cover Image */}
        <div className="relative h-64 bg-gray-200">
          <img
            src={group.coverImage}
            alt={group.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Back Button */}
          <div className="absolute top-4 left-4">
            <Link
              href="/groups"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg font-medium hover:bg-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Groups
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 -mt-16 pb-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Group Header Card */}
              <div className="bg-white rounded-xl border p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{group.name}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {group.location.city}, {group.location.state}
                        {group.location.radius && ` • ${group.location.radius} mi radius`}
                      </div>
                      {group.isPublic ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <Globe className="h-4 w-4" />
                          Public
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-600">
                          <Lock className="h-4 w-4" />
                          Private
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Share2 className="h-5 w-5 text-gray-600" />
                    </button>
                    {isLeader && (
                      <Link
                        href={`/groups/${group.slug}/settings`}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Settings className="h-5 w-5 text-gray-600" />
                      </Link>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 mb-6">{group.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {group.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                {!isMember ? (
                  <button className="w-full md:w-auto px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
                    {group.requiresApproval ? (
                      <>
                        <CheckCircle className="h-5 w-5 inline mr-2" />
                        Request to Join
                      </>
                    ) : (
                      'Join Group'
                    )}
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button className="flex-1 px-6 py-3 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition-colors flex items-center justify-center gap-2">
                      <Bell className="h-5 w-5" />
                      Following
                    </button>
                    <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                      <MessageSquare className="h-5 w-5 inline mr-2" />
                      Post
                    </button>
                  </div>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border p-4 text-center">
                  <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{group.stats.events}</div>
                  <div className="text-sm text-gray-600">Events</div>
                </div>
                <div className="bg-white rounded-xl border p-4 text-center">
                  <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{group.stats.posts}</div>
                  <div className="text-sm text-gray-600">Posts</div>
                </div>
                <div className="bg-white rounded-xl border p-4 text-center">
                  <Wrench className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{group.stats.tools}</div>
                  <div className="text-sm text-gray-600">Tools Shared</div>
                </div>
                <div className="bg-white rounded-xl border p-4 text-center">
                  <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{group.stats.resources}</div>
                  <div className="text-sm text-gray-600">Resources</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-semibold">{activity.user}</span>{' '}
                          <span className="text-gray-600">{activity.action}</span>{' '}
                          <span className="font-semibold">{activity.target}</span>
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3" />
                          {activity.timestamp.toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Members Card */}
              <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Members</h3>
                  <Link
                    href={`/groups/${group.slug}/members`}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    View all →
                  </Link>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-gray-600" />
                    <span className="font-semibold text-gray-900">{group.memberCount}</span>
                    <span className="text-gray-600">total members</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-gray-900">{group.activeMembers}</span>
                    <span className="text-gray-600">active this month</span>
                  </div>
                </div>

                {/* Leader Profiles */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900">Group Leaders</h4>
                  {group.leaders.map((leader) => (
                    <Link
                      key={leader.id}
                      href={`/profile/${leader.id}`}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <img
                        src={leader.avatar}
                        alt={leader.name}
                        className="w-10 h-10 rounded-full border-2 border-gray-200"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{leader.name}</p>
                        <p className="text-xs text-gray-600 capitalize">{leader.role}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Group Info */}
              <div className="bg-white rounded-xl border p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Group Info</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-gray-600 mb-1">Founded</div>
                    <div className="font-semibold text-gray-900">
                      {group.founded.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">Location</div>
                    <div className="font-semibold text-gray-900">
                      {group.location.city}, {group.location.state}
                      {group.location.zipCode && ` ${group.location.zipCode}`}
                    </div>
                  </div>
                  {group.upcomingEvents && group.upcomingEvents > 0 && (
                    <div>
                      <div className="text-gray-600 mb-1">Upcoming Events</div>
                      <div className="font-semibold text-gray-900">
                        {group.upcomingEvents} event{group.upcomingEvents !== 1 ? 's' : ''}
                      </div>
                    </div>
                  )}
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

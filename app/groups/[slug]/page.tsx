'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { useUser } from '@clerk/nextjs'
import {
  ArrowLeft,
  MapPin,
  Users,
  Calendar,
  MessageSquare,
  Settings,
  Share2,
  Bell,
  BellOff,
  Lock,
  Globe,
  CheckCircle,
  Clock,
  Loader2,
  UserPlus,
  LogOut,
} from 'lucide-react'

interface GroupData {
  id: string
  name: string
  slug: string
  description: string
  coverImage: string
  icon: string | null
  location: {
    city: string | null
    state: string | null
    country: string
  }
  isPublic: boolean
  requiresApproval: boolean
  tags: string[]
  memberCount: number
  eventCount: number
  postCount: number
  creator: {
    id: string
    name: string
    avatar: string | null
  }
  leaders: {
    id: string
    name: string
    avatar: string | null
    role: string
  }[]
  upcomingEvents: {
    id: string
    title: string
    description: string | null
    location: string | null
    startTime: string
    endTime: string | null
    attendeeCount: number
    maxAttendees: number | null
    host: {
      id: string
      name: string
      avatar: string | null
    }
  }[]
  recentPosts: {
    id: string
    content: string
    images: string[]
    createdAt: string
    author: {
      id: string
      name: string
      avatar: string | null
    }
  }[]
  userMembership: {
    role: string
    joinedAt: string
  } | null
  createdAt: string
}

export default function GroupDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const { isSignedIn } = useUser()
  const [group, setGroup] = useState<GroupData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [joining, setJoining] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    fetchGroup()
  }, [slug])

  const fetchGroup = async () => {
    try {
      const response = await fetch(`/api/groups/${slug}`)
      if (!response.ok) {
        if (response.status === 404) {
          setError('Group not found')
        } else if (response.status === 403) {
          setError('This group is private')
        } else {
          setError('Failed to load group')
        }
        return
      }
      const data = await response.json()
      setGroup(data)
    } catch (err) {
      setError('Failed to load group')
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async () => {
    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }

    setJoining(true)
    try {
      const response = await fetch(`/api/groups/${slug}/membership`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        setGroup(prev => prev ? {
          ...prev,
          memberCount: prev.memberCount + 1,
          userMembership: data.membership,
        } : null)
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to join group')
      }
    } catch (err) {
      alert('Failed to join group')
    } finally {
      setJoining(false)
    }
  }

  const handleLeave = async () => {
    if (!confirm('Are you sure you want to leave this group?')) return

    setLeaving(true)
    try {
      const response = await fetch(`/api/groups/${slug}/membership`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setGroup(prev => prev ? {
          ...prev,
          memberCount: prev.memberCount - 1,
          userMembership: null,
        } : null)
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to leave group')
      }
    } catch (err) {
      alert('Failed to leave group')
    } finally {
      setLeaving(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: group?.name,
          text: group?.description,
          url: window.location.href,
        })
      } catch (err) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </main>
        <Footer />
      </>
    )
  }

  if (error || !group) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {error || 'Group not found'}
            </h1>
            <Link
              href="/groups"
              className="text-green-600 dark:text-green-400 hover:underline"
            >
              Back to Groups
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const isMember = !!group.userMembership
  const isAdmin = group.userMembership?.role === 'admin'
  const isModerator = group.userMembership?.role === 'moderator'
  const canManage = isAdmin || isModerator

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Cover Image */}
        <div className="relative h-64 bg-gray-200 dark:bg-gray-800">
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
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{group.name}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      {group.location.city && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {group.location.city}, {group.location.state}
                        </div>
                      )}
                      {group.isPublic ? (
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <Globe className="h-4 w-4" />
                          Public
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Lock className="h-4 w-4" />
                          Private
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleShare}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Share2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    {isAdmin && (
                      <Link
                        href={`/groups/${group.slug}/settings`}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </Link>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-6">{group.description}</p>

                {/* Tags */}
                {group.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {group.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                {!isMember ? (
                  <button
                    onClick={handleJoin}
                    disabled={joining}
                    className="w-full md:w-auto px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {joining ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : group.requiresApproval ? (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        Request to Join
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-5 w-5" />
                        Join Group
                      </>
                    )}
                  </button>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg font-medium">
                      <CheckCircle className="h-5 w-5" />
                      {isAdmin ? 'Admin' : isModerator ? 'Moderator' : 'Member'}
                    </div>
                    {!isAdmin && (
                      <button
                        onClick={handleLeave}
                        disabled={leaving}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                      >
                        {leaving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <LogOut className="h-4 w-4" />
                        )}
                        Leave Group
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 text-center">
                  <Users className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{group.memberCount}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Members</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 text-center">
                  <Calendar className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{group.eventCount}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Events</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 text-center">
                  <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{group.postCount}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Posts</div>
                </div>
              </div>

              {/* Upcoming Events */}
              {group.upcomingEvents.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upcoming Events</h2>
                  <div className="space-y-4">
                    {group.upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                          <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                          {event.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{event.description}</p>
                          )}
                          <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500 dark:text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(event.startTime).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                              })}
                            </span>
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {event.attendeeCount}{event.maxAttendees ? `/${event.maxAttendees}` : ''} attending
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Posts */}
              {group.recentPosts.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    {group.recentPosts.map((post) => (
                      <div key={post.id} className="flex items-start gap-3 pb-4 border-b dark:border-gray-700 last:border-0 last:pb-0">
                        {post.author.avatar ? (
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 dark:text-white">
                            <span className="font-semibold">{post.author.name}</span>
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{post.content}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500 mt-2">
                            <Clock className="h-3 w-3" />
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
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
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Members Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Leaders</h3>
                  <Link
                    href={`/groups/${group.slug}/members`}
                    className="text-sm text-green-600 dark:text-green-400 hover:underline font-medium"
                  >
                    View all →
                  </Link>
                </div>

                {/* Leader Profiles */}
                <div className="space-y-3">
                  {group.leaders.map((leader) => (
                    <Link
                      key={leader.id}
                      href={`/profile/${leader.id}`}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {leader.avatar ? (
                        <img
                          src={leader.avatar}
                          alt={leader.name}
                          className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-600"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{leader.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{leader.role}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Group Info */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Group Info</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-gray-600 dark:text-gray-400 mb-1">Founded</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {new Date(group.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  {group.location.city && (
                    <div>
                      <div className="text-gray-600 dark:text-gray-400 mb-1">Location</div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {group.location.city}, {group.location.state}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-gray-600 dark:text-gray-400 mb-1">Created by</div>
                    <Link
                      href={`/profile/${group.creator.id}`}
                      className="font-semibold text-green-600 dark:text-green-400 hover:underline"
                    >
                      {group.creator.name}
                    </Link>
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

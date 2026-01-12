import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Award,
  MessageSquare,
  Globe,
  Edit,
  Mail,
  Star,
  BookOpen,
  Wrench,
  ShoppingBag,
  MapPinIcon,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const { userId } = await auth()

  // Fetch user from database
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      posts: {
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        take: 6,
      },
      ownedPlots: {
        where: { status: { in: ['ACTIVE', 'DRAFT'] } },
        take: 4,
      },
      produceListings: {
        where: { status: 'AVAILABLE' },
        take: 4,
      },
      userBadges: {
        include: { badge: true },
        orderBy: { earnedAt: 'desc' },
        take: 6,
      },
    },
  })

  if (!user) {
    notFound()
  }

  const isOwnProfile = userId && user.clerkId === userId

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(date)
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Cover Image */}
        {user.coverImage && (
          <div
            className="h-64 bg-cover bg-center"
            style={{ backgroundImage: `url(${user.coverImage})` }}
          />
        )}
        {!user.coverImage && (
          <div className="h-64 bg-gradient-to-r from-green-600 to-emerald-600" />
        )}

        <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          {/* Profile Header Card */}
          <Card className="relative z-10 -mt-20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0 -mt-16 md:-mt-0">
                  <img
                    src={user.avatar || '/default-avatar.png'}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-xl"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-1">
                        {user.firstName} {user.lastName}
                      </h1>
                      <p className="text-gray-600">@{user.username}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {user.role.map((role) => (
                          <span
                            key={role}
                            className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {isOwnProfile ? (
                        <Link
                          href="/profile/edit"
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                          Edit Profile
                        </Link>
                      ) : (
                        <Link
                          href={`/messages?user=${user.id}`}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                          Message
                        </Link>
                      )}
                    </div>
                  </div>

                  {user.bio && (
                    <p className="text-gray-700 mb-4 max-w-2xl leading-relaxed">
                      {user.bio}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    {user.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    {user.website && (
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-green-600"
                      >
                        <Globe className="h-4 w-4" />
                        <span>Website</span>
                      </a>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {formatDate(user.createdAt)}</span>
                    </div>
                    {user.isVerified && (
                      <div className="flex items-center gap-1 text-green-600">
                        <Award className="h-4 w-4" />
                        <span className="font-medium">Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Level & Points */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Level {user.level}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                          style={{
                            width: `${((user.totalPoints % 1000) / 1000) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {user.totalPoints} pts
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="text-2xl font-bold text-gray-900">
                      {user.userBadges.length}
                    </span>
                    <span className="text-gray-600">badges</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3 mt-8">
            {/* Left Column - Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Blog Posts */}
              {user.posts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Recent Posts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {user.posts.map((post) => (
                        <Link
                          key={post.id}
                          href={`/profile/${username}/posts/${post.slug}`}
                          className="group border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                        >
                          {post.coverImage && (
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-40 object-cover"
                            />
                          )}
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                                {post.type}
                              </span>
                              <span className="text-xs text-gray-500">
                                {post.publishedAt &&
                                  new Date(post.publishedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors mb-1">
                              {post.title}
                            </h3>
                            {post.excerpt && (
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {post.excerpt}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                    {user.posts.length >= 6 && (
                      <Link
                        href={`/profile/${username}/posts`}
                        className="mt-4 inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                      >
                        View all posts →
                      </Link>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Plots for Rent */}
              {user.ownedPlots.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPinIcon className="h-5 w-5" />
                      Plots Available
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {user.ownedPlots.map((plot) => (
                        <Link
                          key={plot.id}
                          href={`/explore/${plot.id}`}
                          className="group border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <h3 className="font-semibold text-gray-900 group-hover:text-green-600 mb-1">
                            {plot.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {plot.city}, {plot.state}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              {plot.acreage} acres
                            </span>
                            <span className="font-semibold text-green-600">
                              ${plot.pricePerMonth}/mo
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Produce Listings */}
              {user.produceListings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5" />
                      Marketplace Listings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {user.produceListings.map((listing) => (
                        <Link
                          key={listing.id}
                          href={`/marketplace/${listing.id}`}
                          className="group border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <h3 className="font-semibold text-gray-900 group-hover:text-green-600 mb-1">
                            {listing.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {listing.category}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              {listing.quantity} {listing.unit}
                            </span>
                            <span className="font-semibold text-green-600">
                              ${listing.pricePerUnit}/{listing.unit}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Badges */}
              {user.userBadges.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-500" />
                      Recent Badges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      {user.userBadges.map((userBadge) => (
                        <div
                          key={userBadge.id}
                          className="flex flex-col items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
                          title={userBadge.badge.description}
                        >
                          <span className="text-3xl mb-1">{userBadge.badge.icon}</span>
                          <span className="text-xs text-center text-gray-600">
                            {userBadge.badge.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Total Points</dt>
                      <dd className="font-semibold text-gray-900">
                        {user.totalPoints.toLocaleString()}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Level</dt>
                      <dd className="font-semibold text-gray-900">{user.level}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Badges</dt>
                      <dd className="font-semibold text-gray-900">
                        {user.userBadges.length}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Posts</dt>
                      <dd className="font-semibold text-gray-900">
                        {user.posts.length}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Plots</dt>
                      <dd className="font-semibold text-gray-900">
                        {user.ownedPlots.length}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

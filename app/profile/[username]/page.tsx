import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SAMPLE_USERS, ACHIEVEMENTS, getProgressToNextLevel } from '@/lib/profile-data'
import { FollowButton } from '@/components/profile/follow-button'
import { LevelProgress } from '@/components/profile/level-progress'
import { AchievementBadge } from '@/components/profile/achievement-badge'
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  Users,
  ShoppingBag,
  MessageSquare,
  CalendarDays,
  BookOpen,
  Leaf,
  Star,
} from 'lucide-react'

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const user = SAMPLE_USERS.find((u) => u.username === username)

  if (!user) {
    notFound()
  }

  const levelInfo = getProgressToNextLevel(user.totalPoints)
  const userAchievements = ACHIEVEMENTS.filter((a) => user.achievements.includes(a.id))

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(date)
  }

  const stats = [
    { icon: Leaf, label: 'Plots Rented', value: user.plotsRented, color: 'text-green-600' },
    { icon: BookOpen, label: 'Journal Entries', value: user.journalEntries, color: 'text-blue-600' },
    { icon: ShoppingBag, label: 'Sales', value: user.marketplaceSales, color: 'text-purple-600' },
    { icon: MessageSquare, label: 'Forum Posts', value: user.forumPosts + user.forumReplies, color: 'text-orange-600' },
    { icon: CalendarDays, label: 'Events Attended', value: user.eventsAttended, color: 'text-pink-600' },
    { icon: Award, label: 'Courses Done', value: user.coursesCompleted, color: 'text-indigo-600' },
  ]

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 text-white hover:text-emerald-200 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Leaderboard
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border shadow-lg -mt-12 relative z-10">
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar & Basic Info */}
                <div className="flex-shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-1">
                        {user.displayName}
                      </h1>
                      <p className="text-gray-600">@{user.username}</p>
                    </div>
                    <FollowButton userId={user.id} />
                  </div>

                  {user.bio && (
                    <p className="text-gray-700 mb-4 max-w-2xl">{user.bio}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    {user.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {formatDate(user.joinedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{user.followers.length}</span>
                      <span>Followers</span>
                      <span className="text-gray-400">•</span>
                      <span className="font-semibold text-gray-900">{user.following.length}</span>
                      <span>Following</span>
                    </div>
                  </div>

                  {/* Specialties */}
                  {user.specialties.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-900 mb-2">Specialties:</p>
                      <div className="flex flex-wrap gap-2">
                        {user.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Level Progress */}
              <div className="mt-6 pt-6 border-t">
                <LevelProgress
                  currentLevel={levelInfo.currentLevel}
                  nextLevel={levelInfo.nextLevel}
                  progress={levelInfo.progress}
                  pointsNeeded={levelInfo.pointsNeeded}
                  totalPoints={user.totalPoints}
                />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl border p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">{stat.label}</h3>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3 mt-8">
            {/* Left Column - Achievements */}
            <div className="lg:col-span-2 space-y-8">
              {/* Achievements */}
              <div className="bg-white rounded-xl border p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Award className="h-6 w-6 text-yellow-500" />
                    Achievements
                  </h2>
                  <span className="text-sm text-gray-600">
                    {userAchievements.length} / {ACHIEVEMENTS.filter(a => !a.secret).length} earned
                  </span>
                </div>

                {userAchievements.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {userAchievements.map((achievement) => (
                      <AchievementBadge key={achievement.id} achievement={achievement} unlocked />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No achievements yet. Start exploring GrowShare!</p>
                  </div>
                )}

                <Link
                  href={`/profile/${user.username}/achievements`}
                  className="mt-6 inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  View All Achievements
                  <TrendingUp className="h-4 w-4" />
                </Link>
              </div>

              {/* Activity Feed */}
              <div className="bg-white rounded-xl border p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 pb-4 border-b">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Leaf className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">Recorded harvest for Heritage Tomatoes</p>
                      <p className="text-sm text-gray-600">Earned 150 points • 2 days ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pb-4 border-b">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <ShoppingBag className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">Listed Heirloom Tomato Seedlings</p>
                      <p className="text-sm text-gray-600">3 days ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pb-4 border-b">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Award className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">Unlocked "Harvest Master" achievement</p>
                      <p className="text-sm text-gray-600">Earned 500 points • 5 days ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">Posted in "Organic Pest Management"</p>
                      <p className="text-sm text-gray-600">1 week ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Points Card */}
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-6 w-6" />
                  <h3 className="text-lg font-bold">Total Points</h3>
                </div>
                <p className="text-5xl font-bold mb-2">{user.totalPoints.toLocaleString()}</p>
                <p className="text-yellow-100 text-sm">
                  {levelInfo.pointsNeeded > 0
                    ? `${levelInfo.pointsNeeded.toLocaleString()} points to ${levelInfo.nextLevel?.name}`
                    : 'Max level reached!'}
                </p>
              </div>

              {/* Recent Achievements */}
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-bold text-gray-900 mb-4">Recent Achievements</h3>
                <div className="space-y-3">
                  {userAchievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3">
                      <span className="text-3xl">{achievement.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{achievement.name}</p>
                        <p className="text-xs text-gray-600">+{achievement.points} pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Summary */}
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-bold text-gray-900 mb-4">Profile Stats</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Level</dt>
                    <dd className="font-semibold text-gray-900">
                      {levelInfo.currentLevel.level} - {levelInfo.currentLevel.name}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Achievements</dt>
                    <dd className="font-semibold text-gray-900">{userAchievements.length}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Community Rank</dt>
                    <dd className="font-semibold text-emerald-600">#42</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

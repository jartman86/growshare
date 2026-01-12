import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { LevelProgress } from '@/components/dashboard/level-progress'
import { BadgeShowcase } from '@/components/dashboard/badge-showcase'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { auth, currentUser } from '@clerk/nextjs/server'

// Mock user data - in production, this would come from database/API
const mockUserData = {
  user: {
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex@growshare.com',
    role: ['RENTER'],
    totalPoints: 1250,
    level: 4,
  },
  stats: {
    plots: 0,
    bookings: 2,
    sales: 5,
    rating: 4.8,
    totalPoints: 1250,
    badges: 6,
  },
  earnedBadges: [
    'FIRST_PLOT_RENTED',
    'FIRST_HARVEST',
    'SOIL_HEALTH_CERTIFIED',
    'HELPFUL_NEIGHBOR',
    'HUNDRED_POUNDS',
    'DIVERSE_GROWER',
  ],
  recentActivities: [
    {
      id: '1',
      type: 'BADGE_EARNED',
      title: '100 Pound Club Badge Earned!',
      description: 'Harvested 100 pounds of produce',
      points: 300,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: '2',
      type: 'PRODUCE_SOLD',
      title: 'Sold Fresh Tomatoes',
      description: '15 lbs to Mountain View Restaurant',
      points: 50,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
    {
      id: '3',
      type: 'JOURNAL_ENTRY',
      title: 'Added Crop Journal Entry',
      description: 'Updated tomato growth progress',
      points: 10,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: '4',
      type: 'COURSE_COMPLETED',
      title: 'Completed Soil Health Fundamentals',
      description: 'Earned certification',
      points: 100,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
      id: '5',
      type: 'FIRST_HARVEST',
      title: 'First Harvest Logged',
      description: '25 lbs of tomatoes harvested',
      points: 150,
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    },
  ],
}

export default async function DashboardPage() {
  const { userId } = await auth()
  const clerkUser = await currentUser()
  const { user, stats, earnedBadges, recentActivities } = mockUserData

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* CLERK USER ID - TEMPORARY DEBUG INFO */}
        {userId && clerkUser && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-lg font-bold text-yellow-900 mb-2">🔧 Clerk User Info (for setup)</h2>
              <div className="bg-white p-3 rounded border border-yellow-300 font-mono text-sm space-y-1">
                <div><strong>Clerk ID:</strong> {userId}</div>
                <div><strong>Email:</strong> {clerkUser.emailAddresses[0]?.emailAddress}</div>
                <div><strong>Name:</strong> {clerkUser.firstName} {clerkUser.lastName}</div>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {user.firstName}! 👋
            </h1>
            <p className="text-green-100 text-lg">
              You're growing stronger every day. Let's see your progress!
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Level Progress */}
          <LevelProgress totalPoints={user.totalPoints} level={user.level} />

          {/* Stats Cards */}
          <StatsCards stats={stats} userRole={user.role.join(',')} />

          {/* Quick Actions */}
          <QuickActions userRole={user.role.join(',')} />

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Activity Feed - 2 columns */}
            <div className="lg:col-span-2">
              <ActivityFeed activities={recentActivities} />
            </div>

            {/* Upcoming Section - 1 column */}
            <div className="space-y-6">
              {/* Upcoming Tasks */}
              <div className="bg-white rounded-xl border p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        Water tomatoes
                      </p>
                      <p className="text-xs text-gray-600">Due tomorrow</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        Harvest carrots
                      </p>
                      <p className="text-xs text-gray-600">Due in 3 days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        Complete Organic Practices course
                      </p>
                      <p className="text-xs text-gray-600">70% complete</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weather Widget Placeholder */}
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Weather Today</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-bold">72°F</p>
                    <p className="text-blue-100">Partly Cloudy</p>
                  </div>
                  <div className="text-6xl">☀️</div>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-300 grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-blue-100">Humidity</p>
                    <p className="font-semibold">65%</p>
                  </div>
                  <div>
                    <p className="text-blue-100">Wind</p>
                    <p className="font-semibold">8 mph</p>
                  </div>
                  <div>
                    <p className="text-blue-100">Rain</p>
                    <p className="font-semibold">10%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Badge Showcase */}
          <div id="badges">
            <BadgeShowcase earnedBadges={earnedBadges} />
          </div>

          {/* Achievements Timeline (Coming Soon) */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Growing Journey
            </h2>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-6">
                {[
                  {
                    icon: '🌱',
                    title: 'Started Your Journey',
                    date: '3 months ago',
                    description: 'Signed up and created your GrowShare profile',
                  },
                  {
                    icon: '📍',
                    title: 'Rented First Plot',
                    date: '2 months ago',
                    description: '5-acre organic farm in Asheville, NC',
                  },
                  {
                    icon: '🎓',
                    title: 'First Certification',
                    date: '1 month ago',
                    description: 'Completed Soil Health Fundamentals',
                  },
                  {
                    icon: '🥕',
                    title: 'First Harvest',
                    date: '2 weeks ago',
                    description: 'Harvested 25 lbs of fresh tomatoes',
                  },
                  {
                    icon: '💯',
                    title: '100 Pound Milestone',
                    date: 'Today',
                    description: 'Total harvest reached 100 lbs!',
                  },
                ].map((milestone, index) => (
                  <div key={index} className="relative flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold z-10">
                      {milestone.icon}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">
                          {milestone.title}
                        </h3>
                        <span className="text-xs text-gray-500">{milestone.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

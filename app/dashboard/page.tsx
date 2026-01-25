import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { LevelProgress } from '@/components/dashboard/level-progress'
import { BadgeShowcase } from '@/components/dashboard/badge-showcase'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { ConnectSetupBanner } from '@/components/payments/connect-setup-banner'

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
  const { user, stats, earnedBadges, recentActivities } = mockUserData

  return (
    <>
      <Header />

      <main className="min-h-screen topo-lines">
        {/* Hero Section */}
        <div className="text-white relative overflow-hidden h-[300px]">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60 z-10"></div>
          <Image
            src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1920&q=80"
            alt="Thriving garden landscape"
            fill
            className="object-cover"
          />
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">
                Welcome back, {user.firstName}! 👋
              </h1>
              <p className="text-[#f4e4c1] text-lg drop-shadow-md font-medium">
                You're growing stronger every day. Let's see your progress!
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Connect Setup Banner for Landowners */}
          <ConnectSetupBanner />

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
              <div className="bg-white/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 p-6">
                <h3 className="text-lg font-bold text-[#2d5016] mb-4">Upcoming</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-[#a8dadc]/20 rounded-lg border border-[#87ceeb]/30">
                    <div className="w-2 h-2 bg-[#457b9d] rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-[#2d5016] text-sm">
                        Water tomatoes
                      </p>
                      <p className="text-xs text-[#4a3f35]">Due tomorrow</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-[#aed581]/20 rounded-lg border border-[#8bc34a]/30">
                    <div className="w-2 h-2 bg-[#4a7c2c] rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-[#2d5016] text-sm">
                        Harvest carrots
                      </p>
                      <p className="text-xs text-[#4a3f35]">Due in 3 days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-[#b19cd9]/20 rounded-lg border border-[#9c4dcc]/30">
                    <div className="w-2 h-2 bg-[#9c4dcc] rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-[#2d5016] text-sm">
                        Complete Organic Practices course
                      </p>
                      <p className="text-xs text-[#4a3f35]">70% complete</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weather Widget Placeholder */}
              <div className="bg-gradient-to-br from-[#87ceeb] to-[#457b9d] rounded-xl p-6 text-white shadow-lg">
                <h3 className="text-lg font-bold mb-2 drop-shadow-md">Weather Today</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-bold drop-shadow-md">72°F</p>
                    <p className="text-[#a8dadc] drop-shadow-sm">Partly Cloudy</p>
                  </div>
                  <div className="text-6xl">☀️</div>
                </div>
                <div className="mt-4 pt-4 border-t border-[#a8dadc]/40 grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-[#a8dadc]">Humidity</p>
                    <p className="font-semibold drop-shadow-sm">65%</p>
                  </div>
                  <div>
                    <p className="text-[#a8dadc]">Wind</p>
                    <p className="font-semibold drop-shadow-sm">8 mph</p>
                  </div>
                  <div>
                    <p className="text-[#a8dadc]">Rain</p>
                    <p className="font-semibold drop-shadow-sm">10%</p>
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
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 p-6 shadow-md">
            <h2 className="text-2xl font-bold text-[#2d5016] mb-4">
              Your Growing Journey
            </h2>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#8bc34a] to-[#4a7c2c]"></div>
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
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#6ba03f] to-[#4a7c2c] rounded-full flex items-center justify-center text-white font-bold z-10 shadow-md">
                      {milestone.icon}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-[#2d5016]">
                          {milestone.title}
                        </h3>
                        <span className="text-xs text-[#4a3f35]">{milestone.date}</span>
                      </div>
                      <p className="text-sm text-[#4a3f35] mt-1">
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

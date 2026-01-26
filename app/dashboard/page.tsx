import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { LevelProgress } from '@/components/dashboard/level-progress'
import { BadgeShowcase } from '@/components/dashboard/badge-showcase'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { ConnectSetupBanner } from '@/components/payments/connect-setup-banner'
import { VerificationBanner } from '@/components/verification/verification-banner'
import { ensureUser } from '@/lib/ensure-user'
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  // Get current user and check onboarding status
  const currentUser = await ensureUser()

  if (!currentUser) {
    redirect('/sign-in')
  }

  if (!currentUser.onboardingComplete) {
    redirect('/onboarding')
  }

  // Fetch user with related data
  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    include: {
      userBadges: {
        include: {
          badge: true,
        },
      },
      activities: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      ownedPlots: {
        where: { status: { in: ['ACTIVE', 'RENTED'] } },
      },
      rentedPlots: {
        where: { status: { in: ['ACTIVE', 'APPROVED'] } },
      },
    },
  })

  if (!user) {
    redirect('/sign-in')
  }

  // Calculate stats
  const stats = {
    plots: user.ownedPlots.length,
    bookings: user.rentedPlots.length,
    sales: 0, // Would need marketplace sales data
    rating: 4.8, // Would calculate from reviews
    totalPoints: user.totalPoints,
    badges: user.userBadges.length,
  }

  // Map earned badges to their IDs
  const earnedBadges = user.userBadges.map(ub => ub.badge.id)

  // Format activities for the activity feed
  const recentActivities = user.activities.map(activity => ({
    id: activity.id,
    type: activity.type,
    title: activity.title,
    description: activity.description || '',
    points: activity.points,
    timestamp: activity.createdAt,
  }))

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
          {/* Email Verification Banner */}
          <VerificationBanner className="rounded-lg" />

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
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#2d5016] dark:text-green-400">Upcoming</h3>
                  <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full">Coming Soon</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-[#a8dadc]/20 dark:bg-blue-900/20 rounded-lg border border-[#87ceeb]/30 dark:border-blue-800">
                    <div className="w-2 h-2 bg-[#457b9d] dark:bg-blue-400 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-[#2d5016] dark:text-white text-sm">
                        Water tomatoes
                      </p>
                      <p className="text-xs text-[#4a3f35] dark:text-gray-400">Due tomorrow</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-[#aed581]/20 dark:bg-green-900/20 rounded-lg border border-[#8bc34a]/30 dark:border-green-800">
                    <div className="w-2 h-2 bg-[#4a7c2c] dark:bg-green-400 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-[#2d5016] dark:text-white text-sm">
                        Harvest carrots
                      </p>
                      <p className="text-xs text-[#4a3f35] dark:text-gray-400">Due in 3 days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-[#b19cd9]/20 dark:bg-purple-900/20 rounded-lg border border-[#9c4dcc]/30 dark:border-purple-800">
                    <div className="w-2 h-2 bg-[#9c4dcc] dark:bg-purple-400 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-[#2d5016] dark:text-white text-sm">
                        Complete Organic Practices course
                      </p>
                      <p className="text-xs text-[#4a3f35] dark:text-gray-400">70% complete</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weather Widget Placeholder */}
              <div className="bg-gradient-to-br from-[#87ceeb] to-[#457b9d] rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold drop-shadow-md">Weather Today</h3>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Coming Soon</span>
                </div>
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

          {/* View All Achievements CTA */}
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl p-6 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-white text-center md:text-left">
                <h2 className="text-2xl font-bold">Track Your Full Journey</h2>
                <p className="text-emerald-100 mt-1">
                  View all badges, milestones, streaks, and achievements in one place
                </p>
              </div>
              <Link
                href="/dashboard/achievements"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors shadow-md"
              >
                View Achievements
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

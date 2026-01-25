import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CommunitySidebar } from '@/components/community/community-sidebar'
import { SAMPLE_ACTIVITY_FEED, type ActivityFeedItem } from '@/lib/notifications-data'
import {
  TrendingUp,
  Users,
  Clock,
} from 'lucide-react'

const formatTimeAgo = (date: Date) => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export default function ActivityFeedPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen topo-lines">
        {/* Header Section */}
        <div className="text-white relative overflow-hidden h-[300px]">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60 z-10"></div>
          <Image
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&q=80"
            alt="Active community members gardening together"
            fill
            className="object-cover"
          />
          <div className="relative z-20 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 h-full flex items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-12 w-12 drop-shadow-md" />
                <h1 className="text-4xl font-bold drop-shadow-lg">Activity Feed</h1>
              </div>
              <p className="text-[#f4e4c1] text-lg drop-shadow-md font-medium">
                See what's happening in your GrowShare community
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <CommunitySidebar />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Filter Options */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 p-4 mb-6 shadow-md">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-[#2d5016]">Show:</span>
              <button className="px-4 py-2 bg-gradient-to-r from-[#8bc34a] to-[#6ba03f] text-white rounded-lg text-sm font-medium shadow-md">
                All Activity
              </button>
              <button className="px-4 py-2 text-[#4a3f35] hover:bg-[#aed581]/20 rounded-lg text-sm font-medium transition-colors border border-[#8bc34a]/30">
                Following Only
              </button>
              <button className="px-4 py-2 text-[#4a3f35] hover:bg-[#aed581]/20 rounded-lg text-sm font-medium transition-colors border border-[#8bc34a]/30">
                Achievements
              </button>
              <button className="px-4 py-2 text-[#4a3f35] hover:bg-[#aed581]/20 rounded-lg text-sm font-medium transition-colors border border-[#8bc34a]/30">
                Tools & Sales
              </button>
              <button className="px-4 py-2 text-[#4a3f35] hover:bg-[#aed581]/20 rounded-lg text-sm font-medium transition-colors border border-[#8bc34a]/30">
                Forum Posts
              </button>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="space-y-4">
            {SAMPLE_ACTIVITY_FEED.map((item) => (
              <div
                key={item.id}
                className="bg-white/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 p-6 hover:shadow-lg transition-all hover:border-[#4a7c2c]/50"
              >
                <div className="flex gap-4">
                  {/* User Avatar */}
                  <Link href={`/profile/${item.userId}`} className="flex-shrink-0">
                    <img
                      src={item.userAvatar}
                      alt={item.userName}
                      className="w-12 h-12 rounded-full border-2 border-gray-200 hover:border-green-500 transition-colors"
                    />
                  </Link>

                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <p className="text-gray-900">
                          <Link
                            href={`/profile/${item.userId}`}
                            className="font-semibold hover:text-green-600 transition-colors"
                          >
                            {item.userName}
                          </Link>
                          {' '}
                          <span className="text-gray-600">{item.action}</span>
                          {' '}
                          {item.target && (
                            <span className="font-semibold text-gray-900">{item.target}</span>
                          )}
                        </p>

                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{formatTimeAgo(item.timestamp)}</span>
                        </div>
                      </div>

                      {/* Activity Badge */}
                      <div className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium ${item.color}`}>
                        <span className="mr-1">{item.icon}</span>
                        {item.type === 'achievement' && 'Achievement'}
                        {item.type === 'rental' && 'Tool'}
                        {item.type === 'forum_post' && 'Forum'}
                        {item.type === 'review' && 'Review'}
                        {item.type === 'level_up' && 'Level Up'}
                        {item.type === 'follow' && 'Follow'}
                        {item.type === 'marketplace_sale' && 'Sale'}
                        {item.type === 'event_rsvp' && 'Event'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-8 text-center">
            <button className="px-6 py-3 bg-white/90 border-2 border-[#aed581]/30 text-[#2d5016] rounded-lg font-semibold hover:bg-[#aed581]/20 transition-all shadow-md">
              Load More Activity
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-gradient-to-br from-[#f4e4c1]/50 to-[#aed581]/30 rounded-xl border-2 border-[#8bc34a]/30 p-6 shadow-md">
            <div className="flex items-start gap-3">
              <Users className="h-6 w-6 text-[#4a7c2c] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-[#2d5016] mb-2">Build Your Network</h3>
                <p className="text-sm text-[#4a3f35] mb-3">
                  Follow other community members to see their activity in your feed. The more people you follow, the more personalized your feed becomes!
                </p>
                <Link
                  href="/community"
                  className="text-sm text-[#4a7c2c] hover:text-[#2d5016] font-medium"
                >
                  Explore Community Members →
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

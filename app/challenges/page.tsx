'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ChallengeCard } from '@/components/challenges/challenge-card'
import {
  SAMPLE_CHALLENGES,
  getActiveChallenges,
  getUpcomingChallenges,
  type ChallengeDifficulty,
  type Season,
} from '@/lib/challenges-data'
import { Trophy, Target, Search, Filter, X, TrendingUp, Calendar } from 'lucide-react'

export default function ChallengesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<ChallengeDifficulty | 'all'>('all')
  const [seasonFilter, setSeasonFilter] = useState<Season | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'upcoming'>('all')

  // Filter challenges
  const filteredChallenges = SAMPLE_CHALLENGES.filter((challenge) => {
    const matchesSearch =
      searchQuery === '' ||
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesDifficulty =
      difficultyFilter === 'all' || challenge.difficulty === difficultyFilter

    const matchesSeason =
      seasonFilter === 'all' ||
      challenge.season === seasonFilter ||
      challenge.season === 'year-round'

    const matchesStatus =
      statusFilter === 'all' || challenge.status === statusFilter

    return matchesSearch && matchesDifficulty && matchesSeason && matchesStatus
  })

  const hasActiveFilters =
    searchQuery !== '' ||
    difficultyFilter !== 'all' ||
    seasonFilter !== 'all' ||
    statusFilter !== 'all'

  const clearFilters = () => {
    setSearchQuery('')
    setDifficultyFilter('all')
    setSeasonFilter('all')
    setStatusFilter('all')
  }

  const activeChallenges = getActiveChallenges()
  const upcomingChallenges = getUpcomingChallenges()

  return (
    <>
      <Header />

      <main className="min-h-screen topo-lines">
        {/* Hero Section */}
        <div className="text-white relative overflow-hidden h-[450px]">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60 z-10"></div>
          <Image
            src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&q=80"
            alt="Agricultural challenge and teamwork"
            fill
            className="object-cover"
          />
          <div className="relative z-20 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="text-center w-full">
              <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
                <Trophy className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">Challenges & Seasonal Quests</h1>
              <p className="text-xl text-[#f4e4c1] max-w-2xl mx-auto mb-8 drop-shadow-md font-medium">
                Test your skills, earn rewards, and grow with the community through seasonal
                challenges and quests
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <p className="text-2xl font-bold drop-shadow-md">{activeChallenges.length}</p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Active</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <p className="text-2xl font-bold drop-shadow-md">{upcomingChallenges.length}</p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Upcoming</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <p className="text-2xl font-bold drop-shadow-md">
                    {SAMPLE_CHALLENGES.reduce((sum, c) => sum + c.participants, 0)}
                  </p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Participants</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <p className="text-2xl font-bold drop-shadow-md">
                    {SAMPLE_CHALLENGES.reduce((sum, c) => sum + c.rewards.points, 0)}
                  </p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Total Points</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Search & Filters */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 p-6 mb-8 shadow-md">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#4a7c2c]" />
                <input
                  type="text"
                  placeholder="Search challenges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-[#8bc34a]/30 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-600" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-gray-600" />
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Season Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <select
                  value={seasonFilter}
                  onChange={(e) => setSeasonFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Seasons</option>
                  <option value="spring">Spring</option>
                  <option value="summer">Summer</option>
                  <option value="fall">Fall</option>
                  <option value="winter">Winter</option>
                  <option value="year-round">Year-Round</option>
                </select>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="ml-auto flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredChallenges.length === SAMPLE_CHALLENGES.length ? (
                <>Showing all {filteredChallenges.length} challenges</>
              ) : (
                <>
                  Found {filteredChallenges.length} challenge
                  {filteredChallenges.length !== 1 ? 's' : ''}
                </>
              )}
            </p>
          </div>

          {/* Challenges Grid */}
          {filteredChallenges.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border p-12 text-center">
              <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No challenges found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filters to find challenges!
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Info Box */}
          <div className="mt-12 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200 p-8">
            <div className="flex items-start gap-4">
              <TrendingUp className="h-8 w-8 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  How Challenges Work
                </h2>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Join challenges to earn points, badges, and special titles</li>
                  <li>• Complete tasks to track your progress and stay motivated</li>
                  <li>• Team challenges let you collaborate with your local group</li>
                  <li>
                    • Seasonal challenges rotate throughout the year with fresh opportunities
                  </li>
                  <li>• Share your progress and tips with the community</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

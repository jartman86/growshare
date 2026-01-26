'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Trophy, Target, Search, Filter, X, TrendingUp, Calendar, Loader2, Clock, Star, Users } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

interface Challenge {
  id: string
  title: string
  slug: string
  description: string
  longDescription: string | null
  coverImage: string
  difficulty: string
  season: string
  status: string
  startDate: string
  endDate: string
  requirements: any
  pointsReward: number
  badge: {
    id: string
    name: string
    icon: string
    tier: string
  } | null
  tags: string[]
  maxParticipants: number | null
  participants: number
  creator: {
    id: string
    firstName: string
    lastName: string
    avatar: string | null
  }
  createdAt: string
}

export default function ChallengesPage() {
  const { isSignedIn } = useUser()
  const [searchQuery, setSearchQuery] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [seasonFilter, setSeasonFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchChallenges()
  }, [difficultyFilter, seasonFilter, statusFilter])

  const fetchChallenges = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (difficultyFilter !== 'all') params.set('difficulty', difficultyFilter)
      if (seasonFilter !== 'all') params.set('season', seasonFilter)
      if (statusFilter !== 'all') params.set('status', statusFilter)

      const response = await fetch(`/api/challenges?${params}`)
      if (response.ok) {
        const data = await response.json()
        setChallenges(data)
      } else {
        setError('Failed to load challenges')
      }
    } catch (err) {
      setError('Failed to load challenges')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchChallenges()
  }

  // Filter client-side for immediate feedback
  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch =
      searchQuery === '' ||
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesSearch
  })

  const activeChallenges = filteredChallenges.filter((c) => c.status === 'active')
  const upcomingChallenges = filteredChallenges.filter((c) => c.status === 'upcoming')

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

  const totalParticipants = challenges.reduce((sum, c) => sum + c.participants, 0)
  const totalPoints = challenges.reduce((sum, c) => sum + c.pointsReward, 0)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-700'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700'
      case 'advanced':
        return 'bg-orange-100 text-orange-700'
      case 'expert':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500 text-white'
      case 'upcoming':
        return 'bg-blue-500 text-white'
      case 'completed':
        return 'bg-gray-500 text-white'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`
  }

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
                  <p className="text-2xl font-bold drop-shadow-md">{totalParticipants}</p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Participants</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <p className="text-2xl font-bold drop-shadow-md">{totalPoints}</p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Total Points</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 p-6 mb-8 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <Filter className="h-5 w-5 text-[#4a7c2c]" />
              <h2 className="text-lg font-bold text-[#2d5016]">Find Challenges</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search challenges..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active Now</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              {/* Season Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Season
                </label>
                <select
                  value={seasonFilter}
                  onChange={(e) => setSeasonFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Seasons</option>
                  <option value="spring">Spring</option>
                  <option value="summer">Summer</option>
                  <option value="fall">Fall</option>
                  <option value="winter">Winter</option>
                  <option value="year-round">Year Round</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="mt-4 flex items-center gap-2 pt-4 border-t">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchQuery && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery('')}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                    {statusFilter}
                    <button onClick={() => setStatusFilter('all')}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {difficultyFilter !== 'all' && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-1">
                    {difficultyFilter}
                    <button onClick={() => setDifficultyFilter('all')}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {seasonFilter !== 'all' && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1">
                    {seasonFilter}
                    <button onClick={() => setSeasonFilter('all')}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="ml-2 text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="mb-4">
            <p className="text-gray-600">
              Showing {filteredChallenges.length} of {challenges.length} challenges
            </p>
          </div>

          {/* Challenges Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl border p-12 text-center">
              <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{error}</h3>
              <button
                onClick={fetchChallenges}
                className="text-green-600 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : filteredChallenges.length === 0 ? (
            <div className="bg-white rounded-xl border p-12 text-center">
              <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No challenges found</h3>
              <p className="text-gray-600 mb-6">
                {hasActiveFilters
                  ? 'Try adjusting your filters'
                  : 'Check back soon for new challenges!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.map((challenge) => (
                <Link
                  key={challenge.id}
                  href={`/challenges/${challenge.slug}`}
                  className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all group"
                >
                  <div className="relative h-48">
                    <Image
                      src={challenge.coverImage}
                      alt={challenge.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(challenge.status)}`}>
                        {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white text-xl font-bold drop-shadow-md line-clamp-2">
                        {challenge.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {challenge.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDateRange(challenge.startDate, challenge.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{challenge.participants}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span className="font-bold text-gray-900">{challenge.pointsReward} pts</span>
                      </div>
                      {challenge.badge && (
                        <span className="text-2xl">{challenge.badge.icon}</span>
                      )}
                    </div>
                    {challenge.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {challenge.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Info Box */}
          <div className="mt-12 bg-gradient-to-br from-[#f4e4c1]/50 to-[#aed581]/30 rounded-xl border-2 border-[#8bc34a]/30 p-8 shadow-md">
            <h3 className="text-xl font-bold text-[#2d5016] mb-4">How Challenges Work</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Target className="h-6 w-6 text-[#4a7c2c]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#2d5016] mb-1">Pick a Challenge</h4>
                  <p className="text-sm text-[#4a3f35]">
                    Browse active challenges and join ones that match your skill level
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <TrendingUp className="h-6 w-6 text-[#4a7c2c]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#2d5016] mb-1">Track Progress</h4>
                  <p className="text-sm text-[#4a3f35]">
                    Complete requirements and track your progress toward the goal
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Trophy className="h-6 w-6 text-[#4a7c2c]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#2d5016] mb-1">Earn Rewards</h4>
                  <p className="text-sm text-[#4a3f35]">
                    Complete challenges to earn points, badges, and special titles
                  </p>
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

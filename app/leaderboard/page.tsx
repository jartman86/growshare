'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SAMPLE_USERS, getLevelFromPoints } from '@/lib/profile-data'
import { Trophy, TrendingUp, Award, Medal, Crown } from 'lucide-react'

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<'all' | 'month' | 'week'>('all')

  // Sort users by points
  const sortedUsers = [...SAMPLE_USERS].sort((a, b) => b.totalPoints - a.totalPoints)

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Medal className="h-6 w-6 text-orange-600" />
      default:
        return null
    }
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white'
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4">
                <Trophy className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Community Leaderboard</h1>
              <p className="text-xl text-orange-100 max-w-2xl mx-auto">
                Top growers ranked by their contributions and achievements
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="bg-white rounded-xl border p-6 mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Rankings</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setTimeframe('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeframe === 'all'
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Time
                </button>
                <button
                  onClick={() => setTimeframe('month')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeframe === 'month'
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  This Month
                </button>
                <button
                  onClick={() => setTimeframe('week')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeframe === 'week'
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  This Week
                </button>
              </div>
            </div>
          </div>

          {/* Top 3 Podium */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {sortedUsers.slice(0, 3).map((user, index) => {
              const rank = index + 1
              const level = getLevelFromPoints(user.totalPoints)

              return (
                <Link
                  key={user.id}
                  href={`/profile/${user.username}`}
                  className={`${
                    rank === 1 ? 'md:order-2' : rank === 2 ? 'md:order-1 md:mt-8' : 'md:order-3 md:mt-8'
                  }`}
                >
                  <div className={`bg-white rounded-xl border-2 ${
                    rank === 1 ? 'border-yellow-400' : rank === 2 ? 'border-gray-400' : 'border-orange-400'
                  } p-6 hover:shadow-lg transition-all relative overflow-hidden group`}>
                    {/* Background gradient */}
                    <div className={`absolute inset-0 opacity-5 ${
                      rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                      rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                      'bg-gradient-to-br from-orange-400 to-orange-600'
                    }`} />

                    <div className="relative">
                      {/* Rank Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-full ${getRankBadge(rank)} flex items-center justify-center font-bold text-xl`}>
                          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                        </div>
                        {getRankIcon(rank)}
                      </div>

                      {/* Avatar */}
                      <div className="flex justify-center mb-4">
                        <img
                          src={user.avatar}
                          alt={user.displayName}
                          className={`w-20 h-20 rounded-full border-4 ${
                            rank === 1 ? 'border-yellow-400' : rank === 2 ? 'border-gray-400' : 'border-orange-400'
                          }`}
                        />
                      </div>

                      {/* User Info */}
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                          {user.displayName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">@{user.username}</p>

                        {/* Level */}
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <span className="text-2xl">{level.badge}</span>
                          <span className="text-sm font-medium text-gray-700">
                            Level {level.level}
                          </span>
                        </div>

                        {/* Points */}
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-3xl font-bold text-orange-600 mb-1">
                            {user.totalPoints.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600">Total Points</p>
                        </div>

                        {/* Stats */}
                        <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="font-semibold text-gray-900">{user.achievements.length}</p>
                            <p className="text-xs text-gray-600">Achievements</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.followers.length}</p>
                            <p className="text-xs text-gray-600">Followers</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Rest of Rankings */}
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Level
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Points
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Achievements
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Activity
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedUsers.slice(3).map((user, index) => {
                    const rank = index + 4
                    const level = getLevelFromPoints(user.totalPoints)

                    return (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-700">#{rank}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/profile/${user.username}`}
                            className="flex items-center gap-3 hover:text-orange-600 transition-colors"
                          >
                            <img
                              src={user.avatar}
                              alt={user.displayName}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">{user.displayName}</p>
                              <p className="text-sm text-gray-600">@{user.username}</p>
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{level.badge}</span>
                            <div>
                              <p className="font-medium text-gray-900">{level.level}</p>
                              <p className="text-xs text-gray-600">{level.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-lg font-bold text-orange-600">
                            {user.totalPoints.toLocaleString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4 text-yellow-600" />
                            <span className="font-semibold text-gray-900">
                              {user.achievements.length}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-emerald-600" />
                            <span className="text-sm text-gray-700">
                              {user.journalEntries + user.forumPosts + user.forumReplies} actions
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-blue-900 mb-3">📊 How Rankings Work</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <p className="font-semibold mb-2">Earn Points By:</p>
                <ul className="space-y-1">
                  <li>• Creating journal entries (25 pts)</li>
                  <li>• Recording harvests (150 pts)</li>
                  <li>• Posting in forums (50 pts)</li>
                  <li>• Completing courses (100-400 pts)</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">Level Up Benefits:</p>
                <ul className="space-y-1">
                  <li>• Unlock new features and badges</li>
                  <li>• Get featured profile visibility</li>
                  <li>• Access to exclusive events</li>
                  <li>• Priority support and discounts</li>
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

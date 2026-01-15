'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CommunitySidebar } from '@/components/community/community-sidebar'
import { SAMPLE_TOPICS, ForumCategory } from '@/lib/community-data'
import {
  MessageSquare,
  Search,
  Plus,
  Pin,
  CheckCircle,
  Eye,
  ArrowUp,
  MessageCircle,
  X,
} from 'lucide-react'

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ForumCategory | 'All'>('All')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'unanswered'>('recent')

  const categories: Array<ForumCategory | 'All'> = [
    'All',
    'General Discussion',
    'Growing Tips',
    'Pest & Disease',
    'Equipment & Tools',
    'Soil & Composting',
    'Seeds & Seedlings',
    'Harvesting & Storage',
    'Selling & Marketing',
    'Off Topic',
  ]

  const filteredTopics = SAMPLE_TOPICS.filter((topic) => {
    const matchesSearch =
      searchQuery === '' ||
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === 'All' || topic.category === selectedCategory

    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    // Always keep pinned topics at top
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1

    // Then sort by selected criteria
    switch (sortBy) {
      case 'popular':
        return b.upvotes - a.upvotes
      case 'unanswered':
        return a.replyCount - b.replyCount
      case 'recent':
      default:
        return b.updatedAt.getTime() - a.updatedAt.getTime()
    }
  })

  const hasActiveFilters = selectedCategory !== 'All'

  const clearFilters = () => {
    setSelectedCategory('All')
    setSearchQuery('')
  }

  const stats = {
    totalTopics: SAMPLE_TOPICS.length,
    totalReplies: SAMPLE_TOPICS.reduce((sum, t) => sum + t.replyCount, 0),
    activeMembers: 47,
    solvedTopics: SAMPLE_TOPICS.filter((t) => t.isSolved).length,
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="text-white relative overflow-hidden h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60 z-10"></div>
          <Image
            src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1920&q=80"
            alt="Community farm"
            fill
            className="object-cover"
          />
          <div className="relative z-20 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">Community Forum</h1>
              <p className="text-xl text-[#f4e4c1] max-w-2xl mx-auto drop-shadow-md font-medium">
                Connect with fellow growers, ask questions, share knowledge, and learn together
              </p>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <p className="text-2xl font-bold drop-shadow-md">{stats.totalTopics}</p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Topics</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <p className="text-2xl font-bold drop-shadow-md">{stats.totalReplies}</p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Replies</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <p className="text-2xl font-bold drop-shadow-md">{stats.activeMembers}</p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Members</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <p className="text-2xl font-bold drop-shadow-md">{stats.solvedTopics}</p>
                  <p className="text-sm text-[#f4e4c1] drop-shadow-sm">Solved</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Community Navigation */}
              <CommunitySidebar />

              {/* New Topic Button */}
              <Link
                href="/community/new"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6ba03f] to-[#4a7c2c] text-white rounded-lg font-semibold hover:from-[#4a7c2c] hover:to-[#2d5016] transition-all shadow-lg hover:shadow-xl"
              >
                <Plus className="h-5 w-5" />
                New Topic
              </Link>

              {/* Categories */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 p-4 mb-6 shadow-md">
                <h3 className="font-semibold text-[#2d5016] mb-3">Categories</h3>
                <div className="space-y-1">
                  {categories.map((category) => {
                    const count =
                      category === 'All'
                        ? SAMPLE_TOPICS.length
                        : SAMPLE_TOPICS.filter((t) => t.category === category).length
                    return (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          selectedCategory === category
                            ? 'bg-gradient-to-r from-[#8bc34a] to-[#6ba03f] text-white font-medium shadow-md'
                            : 'text-[#4a3f35] hover:bg-[#aed581]/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{category}</span>
                          <span
                            className={`text-xs ${
                              selectedCategory === category ? 'text-[#f4e4c1]' : 'text-[#4a3f35]'
                            }`}
                          >
                            {count}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Community Guidelines */}
              <div className="bg-[#a8dadc]/20 rounded-xl border-2 border-[#87ceeb]/30 p-4">
                <h3 className="font-semibold text-[#2d5016] mb-2">💡 Guidelines</h3>
                <ul className="text-xs text-[#4a3f35] space-y-1 font-medium">
                  <li>• Be respectful and kind</li>
                  <li>• Search before posting</li>
                  <li>• Use relevant categories</li>
                  <li>• Share knowledge freely</li>
                  <li>• Stay on topic</li>
                </ul>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Search & Filters */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 p-4 mb-6 shadow-md">
                {/* Search Bar */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#4a7c2c]" />
                    <input
                      type="text"
                      placeholder="Search topics, tags, or keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-[#8bc34a]/30 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Sort Options & Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-medium text-[#2d5016]">Sort by:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSortBy('recent')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all shadow-sm ${
                        sortBy === 'recent'
                          ? 'bg-gradient-to-r from-[#6ba03f] to-[#4a7c2c] text-white shadow-md'
                          : 'bg-[#aed581]/20 text-[#4a3f35] hover:bg-[#aed581]/40 border border-[#8bc34a]/30'
                      }`}
                    >
                      Recent
                    </button>
                    <button
                      onClick={() => setSortBy('popular')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all shadow-sm ${
                        sortBy === 'popular'
                          ? 'bg-gradient-to-r from-[#6ba03f] to-[#4a7c2c] text-white shadow-md'
                          : 'bg-[#aed581]/20 text-[#4a3f35] hover:bg-[#aed581]/40 border border-[#8bc34a]/30'
                      }`}
                    >
                      Popular
                    </button>
                    <button
                      onClick={() => setSortBy('unanswered')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all shadow-sm ${
                        sortBy === 'unanswered'
                          ? 'bg-gradient-to-r from-[#6ba03f] to-[#4a7c2c] text-white shadow-md'
                          : 'bg-[#aed581]/20 text-[#4a3f35] hover:bg-[#aed581]/40 border border-[#8bc34a]/30'
                      }`}
                    >
                      Unanswered
                    </button>
                  </div>

                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="ml-auto flex items-center gap-1 px-3 py-1 text-sm text-[#4a3f35] hover:text-[#2d5016] font-medium"
                    >
                      <X className="h-4 w-4" />
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Topics List */}
              {filteredTopics.length > 0 ? (
                <div className="space-y-3">
                  {filteredTopics.map((topic) => (
                    <Link
                      key={topic.id}
                      href={`/community/${topic.id}`}
                      className="block bg-white/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 hover:shadow-lg transition-all hover:border-[#4a7c2c]/50"
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Author Avatar */}
                          <img
                            src={topic.authorAvatar}
                            alt={topic.authorName}
                            className="w-10 h-10 rounded-full flex-shrink-0"
                          />

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {/* Title & Badges */}
                            <div className="flex items-start gap-2 mb-2">
                              <h3 className="text-lg font-bold text-[#2d5016] group-hover:text-[#4a7c2c] transition-colors flex-1">
                                {topic.title}
                              </h3>
                              {topic.isPinned && (
                                <div className="flex-shrink-0">
                                  <Pin className="h-5 w-5 text-[#9c4dcc]" />
                                </div>
                              )}
                              {topic.isSolved && (
                                <div className="flex-shrink-0">
                                  <CheckCircle className="h-5 w-5 text-[#4a7c2c]" />
                                </div>
                              )}
                            </div>

                            {/* Category & Tags */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="px-2 py-1 bg-[#a8dadc]/30 text-[#457b9d] rounded text-xs font-medium border border-[#87ceeb]/30">
                                {topic.category}
                              </span>
                              {topic.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-[#aed581]/20 text-[#4a3f35] rounded text-xs"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-[#4a3f35]">
                              <span className="font-medium text-[#2d5016]">{topic.authorName}</span>
                              <span>{formatTimeAgo(topic.updatedAt)}</span>
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span>{topic.views}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4" />
                                <span>{topic.replyCount}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ArrowUp className="h-4 w-4" />
                                <span>{topic.upvotes}</span>
                              </div>
                            </div>

                            {/* Last Reply */}
                            {topic.lastReplyBy && (
                              <div className="mt-2 pt-2 border-t border-[#aed581]/20 text-xs text-[#4a3f35]">
                                Last reply by <span className="font-medium">{topic.lastReplyBy}</span>{' '}
                                {formatTimeAgo(topic.lastReplyAt!)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 p-12 text-center shadow-md">
                  <MessageSquare className="h-12 w-12 text-[#4a7c2c] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[#2d5016] mb-2">No topics found</h3>
                  <p className="text-[#4a3f35] mb-6">
                    Try adjusting your search or filters, or start a new discussion!
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6ba03f] to-[#4a7c2c] text-white rounded-lg font-semibold hover:from-[#4a7c2c] hover:to-[#2d5016] transition-all shadow-lg hover:shadow-xl"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

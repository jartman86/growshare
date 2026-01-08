'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CourseCard } from '@/components/knowledge/course-card'
import { SAMPLE_COURSES, COURSE_CATEGORIES, CourseCategory } from '@/lib/course-data'
import { BookOpen, Search, Filter, Award } from 'lucide-react'

export default function KnowledgeHubPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory | 'All'>('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All')
  const [showOnlyFree, setShowOnlyFree] = useState(false)
  const [showOnlyCertified, setShowOnlyCertified] = useState(false)

  const filteredCourses = SAMPLE_COURSES.filter((course) => {
    const matchesSearch =
      searchQuery === '' ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory

    const matchesDifficulty =
      selectedDifficulty === 'All' || course.difficulty === selectedDifficulty

    const matchesFree = !showOnlyFree || course.price === 0

    const matchesCertified = !showOnlyCertified || course.certification

    return (
      matchesSearch &&
      matchesCategory &&
      matchesDifficulty &&
      matchesFree &&
      matchesCertified
    )
  })

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-12 w-12" />
              <h1 className="text-5xl font-bold">Knowledge Hub</h1>
            </div>
            <p className="text-blue-100 text-xl max-w-3xl">
              Learn from expert farmers and agronomists. Earn certifications that build trust
              with landowners and unlock new opportunities.
            </p>
            <div className="mt-8 flex items-center gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold">{SAMPLE_COURSES.length}</div>
                <div className="text-blue-200 text-sm">Courses Available</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">
                  {SAMPLE_COURSES.filter((c) => c.certification).length}
                </div>
                <div className="text-blue-200 text-sm">Certifications</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">
                  {SAMPLE_COURSES.filter((c) => c.price === 0).length}
                </div>
                <div className="text-blue-200 text-sm">Free Courses</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Filter className="h-5 w-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">Find Your Course</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses, topics, skills..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as CourseCategory | 'All')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Categories</option>
                  {COURSE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyFree}
                  onChange={(e) => setShowOnlyFree(e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Free courses only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyCertified}
                  onChange={(e) => setShowOnlyCertified(e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 flex items-center gap-1">
                  <Award className="h-4 w-4 text-yellow-600" />
                  Certification courses only
                </span>
              </label>
            </div>

            {/* Active Filters */}
            {(selectedCategory !== 'All' ||
              selectedDifficulty !== 'All' ||
              showOnlyFree ||
              showOnlyCertified ||
              searchQuery) && (
              <div className="mt-4 flex items-center gap-2 pt-4 border-t">
                <span className="text-sm text-gray-600">Active filters:</span>
                {selectedCategory !== 'All' && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {selectedCategory}
                  </span>
                )}
                {selectedDifficulty !== 'All' && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {selectedDifficulty}
                  </span>
                )}
                {showOnlyFree && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    Free
                  </span>
                )}
                {showOnlyCertified && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                    Certified
                  </span>
                )}
                {searchQuery && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    "{searchQuery}"
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedCategory('All')
                    setSelectedDifficulty('All')
                    setShowOnlyFree(false)
                    setShowOnlyCertified(false)
                    setSearchQuery('')
                  }}
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
              Showing {filteredCourses.length} of {SAMPLE_COURSES.length} courses
            </p>
          </div>

          {/* Course Grid */}
          {filteredCourses.length === 0 ? (
            <div className="bg-white rounded-xl border p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or search query
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All')
                  setSelectedDifficulty('All')
                  setShowOnlyFree(false)
                  setShowOnlyCertified(false)
                  setSearchQuery('')
                }}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

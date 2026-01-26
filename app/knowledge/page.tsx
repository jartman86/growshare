'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CourseCard } from '@/components/knowledge/course-card'
import { CalendarView } from '@/components/knowledge/calendar-view'
import { COURSE_CATEGORIES, CourseCategory } from '@/lib/course-data'
import { BookOpen, Search, Filter, Award, Calendar, LayoutGrid, Loader2, Plus } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

interface DBCourse {
  id: string
  title: string
  slug: string | null
  description: string
  category: string
  level: string
  thumbnailUrl: string | null
  accessType: string
  price: number | null
  isCertification: boolean
  isPublished: boolean
  instructor: {
    id: string
    firstName: string | null
    lastName: string | null
    avatar: string | null
  } | null
  _count: {
    modules: number
    progress: number
  }
}

export default function KnowledgeHubPage() {
  const { isSignedIn } = useUser()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory | 'All'>('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All')
  const [showOnlyFree, setShowOnlyFree] = useState(false)
  const [showOnlyCertified, setShowOnlyCertified] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid')
  const [dbCourses, setDbCourses] = useState<DBCourse[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      if (response.ok) {
        const data = await response.json()
        setDbCourses(data.courses || [])
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoadingCourses(false)
    }
  }

  // Map DB courses to display format
  const allCourses = dbCourses.map(course => ({
    id: course.id,
    title: course.title,
    description: course.description,
    category: course.category as CourseCategory,
    difficulty: course.level === 'BEGINNER' ? 'Beginner' :
                course.level === 'INTERMEDIATE' ? 'Intermediate' :
                course.level === 'ADVANCED' ? 'Advanced' : 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    duration: `${course._count.modules} modules`,
    instructor: course.instructor
      ? `${course.instructor.firstName || ''} ${course.instructor.lastName || ''}`.trim()
      : 'Instructor',
    instructorAvatar: course.instructor?.avatar || undefined,
    image: course.thumbnailUrl || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
    lessons: course._count.modules,
    enrolled: course._count.progress,
    rating: 4.5,
    reviews: 0,
    price: course.accessType === 'FREE' ? 0 : course.price || 0,
    certification: course.isCertification,
    points: 250,
    tags: [],
    skills: [],
  }))

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch =
      searchQuery === '' ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

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

      <main className="min-h-screen topo-lines">
        {/* Hero Section */}
        <div className="text-white relative overflow-hidden h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60 z-10"></div>
          <Image
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&q=80"
            alt="Learning and education in agriculture"
            fill
            className="object-cover"
          />
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 h-full flex items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-12 w-12 drop-shadow-md" />
              <h1 className="text-5xl font-bold drop-shadow-lg">Knowledge Hub</h1>
            </div>
            <p className="text-[#f4e4c1] text-xl max-w-3xl drop-shadow-md font-medium">
              Learn from expert farmers and agronomists. Earn certifications that build trust
              with landowners and unlock new opportunities.
            </p>
            <div className="mt-8 flex items-center gap-6">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                <div className="text-4xl font-bold drop-shadow-md">{allCourses.length}</div>
                <div className="text-[#f4e4c1] text-sm drop-shadow-sm">Courses Available</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                <div className="text-4xl font-bold drop-shadow-md">
                  {allCourses.filter((c) => c.certification).length}
                </div>
                <div className="text-[#f4e4c1] text-sm drop-shadow-sm">Certifications</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md">
                <div className="text-4xl font-bold drop-shadow-md">
                  {allCourses.filter((c) => c.price === 0).length}
                </div>
                <div className="text-[#f4e4c1] text-sm drop-shadow-sm">Free Courses</div>
              </div>
            </div>
          </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border-2 border-[#aed581]/30 dark:border-gray-700 shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-[#4a7c2c] dark:text-green-400" />
                <h2 className="text-xl font-bold text-[#2d5016] dark:text-white">Find Your Course</h2>
              </div>

              <div className="flex items-center gap-4">
                {/* Create Course Button */}
                <Link
                  href={isSignedIn ? '/instructor/courses/new' : '/sign-in?redirect_url=/instructor/courses/new'}
                  className="flex items-center gap-2 px-4 py-2 bg-[#5a7f3a] hover:bg-[#4a6b2e] text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Create Course</span>
                </Link>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span className="text-sm font-medium hidden sm:inline">Courses</span>
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                    viewMode === 'calendar'
                      ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium hidden sm:inline">Events</span>
                </button>
              </div>
              </div>
            </div>

            {viewMode === 'grid' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Search */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search courses, topics, skills..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value as CourseCategory | 'All')}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Difficulty</label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                    <span className="text-sm text-gray-700 dark:text-gray-300">Free courses only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showOnlyCertified}
                      onChange={(e) => setShowOnlyCertified(e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
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
                  <div className="mt-4 flex items-center gap-2 pt-4 border-t dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
                    {selectedCategory !== 'All' && (
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm">
                        {selectedCategory}
                      </span>
                    )}
                    {selectedDifficulty !== 'All' && (
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm">
                        {selectedDifficulty}
                      </span>
                    )}
                    {showOnlyFree && (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm">
                        Free
                      </span>
                    )}
                    {showOnlyCertified && (
                      <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm">
                        Certified
                      </span>
                    )}
                    {searchQuery && (
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
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
                      className="ml-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Content */}
          {viewMode === 'calendar' ? (
            <CalendarView />
          ) : (
            <>
              {/* Results */}
              <div className="mb-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Showing {filteredCourses.length} of {allCourses.length} courses
                </p>
              </div>

              {/* Course Grid */}
              {loadingCourses ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-12 text-center">
                  <BookOpen className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No courses found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
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
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

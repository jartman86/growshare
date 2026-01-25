'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  BookOpen,
  Loader2,
  CheckCircle,
  Clock,
  Play,
  Award,
  ArrowLeft,
  GraduationCap,
} from 'lucide-react'

interface Course {
  id: string
  title: string
  slug: string | null
  description: string
  thumbnailUrl: string | null
  category: string
  level: string
  instructor: {
    id: string
    firstName: string | null
    lastName: string | null
    avatar: string | null
  } | null
  totalModules: number
  completedModules: number
  progressPercent: number
  isCompleted: boolean
  completedAt: string | null
  lastAccessedAt: string
  accessType: string
}

interface CoursesData {
  courses: Course[]
  hasActiveSubscription: boolean
  totalCourses: number
  completedCourses: number
  inProgressCourses: number
}

export default function MyCoursesPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<CoursesData | null>(null)
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all')

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/my-courses')
      if (response.ok) {
        const coursesData = await response.json()
        setData(coursesData)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = data?.courses.filter(course => {
    if (filter === 'completed') return course.isCompleted
    if (filter === 'in-progress') return !course.isCompleted && course.progressPercent > 0
    return true
  }) || []

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Back & Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <GraduationCap className="h-8 w-8 text-green-600" />
                  My Courses
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Track your learning progress and continue where you left off
                </p>
              </div>

              <Link
                href="/knowledge"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                Browse Courses
              </Link>
            </div>
          </div>

          {/* Stats */}
          {data && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {data.totalCourses}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Enrolled Courses</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {data.inProgressCourses}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {data.completedCourses}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {(['all', 'in-progress', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === tab
                    ? 'bg-green-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border dark:border-gray-700'
                }`}
              >
                {tab === 'all' ? 'All Courses' : tab === 'in-progress' ? 'In Progress' : 'Completed'}
              </button>
            ))}
          </div>

          {/* Courses Grid */}
          {filteredCourses.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {filter === 'all' ? 'No courses yet' : `No ${filter} courses`}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {filter === 'all'
                  ? "You haven't enrolled in any courses yet. Start learning today!"
                  : filter === 'in-progress'
                    ? "You don't have any courses in progress."
                    : "You haven't completed any courses yet. Keep learning!"}
              </p>
              <Link
                href="/knowledge"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                <BookOpen className="h-5 w-5" />
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/learn/${course.id}`}
                  className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Thumbnail */}
                  <div className="relative h-40 bg-gray-200 dark:bg-gray-700">
                    {course.thumbnailUrl ? (
                      <Image
                        src={course.thumbnailUrl}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-gray-400" />
                      </div>
                    )}

                    {/* Play button overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="p-3 bg-white rounded-full">
                        <Play className="h-6 w-6 text-green-600 fill-green-600" />
                      </div>
                    </div>

                    {/* Completion badge */}
                    {course.isCompleted && (
                      <div className="absolute top-3 right-3 px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Completed
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded">
                        {course.category.replace('_', ' ')}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded">
                        {course.level}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {course.title}
                    </h3>

                    {/* Instructor */}
                    {course.instructor && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        {course.instructor.firstName} {course.instructor.lastName}
                      </p>
                    )}

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {course.completedModules} / {course.totalModules} modules
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {course.progressPercent}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            course.isCompleted ? 'bg-green-600' : 'bg-blue-600'
                          }`}
                          style={{ width: `${course.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Continue button */}
                    <button className="mt-4 w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                      {course.isCompleted ? (
                        <>
                          <Award className="h-4 w-4" />
                          View Certificate
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          Continue Learning
                        </>
                      )}
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

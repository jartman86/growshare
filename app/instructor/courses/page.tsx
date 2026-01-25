'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BookOpen,
  Plus,
  Users,
  Loader2,
  Eye,
  EyeOff,
  Edit3,
  MoreVertical,
  Trash2,
  ArrowLeft,
} from 'lucide-react'

interface Course {
  id: string
  title: string
  slug: string | null
  description: string
  category: string
  level: string
  thumbnailUrl: string | null
  accessType: string
  price: number | null
  isPublished: boolean
  createdAt: string
  _count: {
    progress: number
    modules: number
    purchases: number
  }
}

export default function InstructorCoursesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])
  const [isInstructor, setIsInstructor] = useState(false)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [showMenu, setShowMenu] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    checkInstructorAndFetch()
  }, [])

  const checkInstructorAndFetch = async () => {
    try {
      const statusResponse = await fetch('/api/instructors/application')
      if (statusResponse.ok) {
        const data = await statusResponse.json()
        if (!data.isInstructor) {
          router.push('/instructor/apply')
          return
        }
        setIsInstructor(true)
      }

      const coursesResponse = await fetch('/api/instructor/courses')
      if (coursesResponse.ok) {
        const data = await coursesResponse.json()
        setCourses(data.courses || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This cannot be undone.')) return

    setDeleting(courseId)
    try {
      const response = await fetch(`/api/instructor/courses/${courseId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setCourses(prev => prev.filter(c => c.id !== courseId))
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete course')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setDeleting(null)
      setShowMenu(null)
    }
  }

  const filteredCourses = courses.filter(course => {
    if (filter === 'published') return course.isPublished
    if (filter === 'draft') return !course.isPublished
    return true
  })

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

  if (!isInstructor) {
    return null
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <button
                onClick={() => router.push('/instructor')}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Courses
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage and edit your courses
              </p>
            </div>
            <Link
              href="/instructor/courses/new"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
            >
              <Plus className="h-5 w-5" />
              Create Course
            </Link>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            {(['all', 'published', 'draft'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                  filter === f
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {f} ({f === 'all'
                  ? courses.length
                  : f === 'published'
                    ? courses.filter(c => c.isPublished).length
                    : courses.filter(c => !c.isPublished).length
                })
              </button>
            ))}
          </div>

          {/* Courses Grid */}
          {filteredCourses.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {filter === 'all' ? 'No courses yet' : `No ${filter} courses`}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {filter === 'all'
                      ? 'Create your first course to start teaching'
                      : filter === 'published'
                        ? 'Publish a course to see it here'
                        : 'All your courses are published'
                    }
                  </p>
                  {filter === 'all' && (
                    <Link
                      href="/instructor/courses/new"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                      Create Your First Course
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    {course.thumbnailUrl ? (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.isPublished
                          ? 'bg-green-100 dark:bg-green-900/70 text-green-700 dark:text-green-400'
                          : 'bg-yellow-100 dark:bg-yellow-900/70 text-yellow-700 dark:text-yellow-400'
                      }`}>
                        {course.isPublished ? (
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" /> Published
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <EyeOff className="h-3 w-3" /> Draft
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <div className="relative">
                        <button
                          onClick={() => setShowMenu(showMenu === course.id ? null : course.id)}
                          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        {showMenu === course.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-10">
                            <Link
                              href={`/instructor/courses/${course.id}/edit`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <Edit3 className="h-4 w-4" />
                              Edit Course
                            </Link>
                            {!course.isPublished && course._count.purchases === 0 && (
                              <button
                                onClick={() => handleDelete(course.id)}
                                disabled={deleting === course.id}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                {deleting === course.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                                Delete Course
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {course._count.progress}
                        </span>
                        <span>{course._count.modules} modules</span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {course.accessType === 'FREE' ? 'Free' : `$${course.price || 0}`}
                      </span>
                    </div>
                    <Link
                      href={`/instructor/courses/${course.id}/edit`}
                      className="mt-4 block w-full text-center px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
                    >
                      Edit Course
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

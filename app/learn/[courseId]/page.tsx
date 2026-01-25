'use client'

import { useState, useEffect, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  BookOpen,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  Play,
  FileText,
  Award,
  ArrowLeft,
  Trophy,
} from 'lucide-react'

interface Module {
  id: string
  title: string
  description: string | null
  content: string
  videoUrl: string | null
  order: number
}

interface CourseData {
  course: {
    id: string
    title: string
    description: string
    thumbnailUrl: string | null
    category: string
    level: string
    isCertification: boolean
    certificateName: string | null
    instructor: {
      id: string
      firstName: string | null
      lastName: string | null
      avatar: string | null
    } | null
  }
  modules: Module[]
  progress: {
    completedModuleIds: string[]
    isCompleted: boolean
    completedAt: string | null
    progressPercent: number
  }
}

export default function LearnCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<CourseData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)
  const [completing, setCompleting] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    fetchCourse()
  }, [courseId])

  useEffect(() => {
    // Show success message if redirected after payment
    if (searchParams.get('success') === 'true') {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [searchParams])

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/learn/${courseId}`)
      if (response.ok) {
        const courseData = await response.json()
        setData(courseData)

        // Find first incomplete module or start at beginning
        const completedIds = courseData.progress.completedModuleIds || []
        const firstIncompleteIndex = courseData.modules.findIndex(
          (m: Module) => !completedIds.includes(m.id)
        )
        setCurrentModuleIndex(firstIncompleteIndex === -1 ? 0 : firstIncompleteIndex)
      } else if (response.status === 403) {
        setError('You do not have access to this course')
      } else if (response.status === 404) {
        setError('Course not found')
      } else {
        setError('Failed to load course')
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteModule = async () => {
    if (!data) return

    const module = data.modules[currentModuleIndex]
    if (data.progress.completedModuleIds.includes(module.id)) {
      // Already completed, go to next
      if (currentModuleIndex < data.modules.length - 1) {
        setCurrentModuleIndex(currentModuleIndex + 1)
      }
      return
    }

    setCompleting(true)
    try {
      const response = await fetch(`/api/learn/${courseId}/modules/${module.id}/complete`, {
        method: 'POST',
      })

      if (response.ok) {
        const result = await response.json()

        setData(prev => prev ? {
          ...prev,
          progress: {
            ...prev.progress,
            completedModuleIds: result.completedModuleIds,
            progressPercent: result.progressPercent,
            isCompleted: result.isCompleted,
          },
        } : null)

        if (result.justCompleted) {
          setShowCelebration(true)
        } else if (currentModuleIndex < data.modules.length - 1) {
          setCurrentModuleIndex(currentModuleIndex + 1)
        }
      }
    } catch (err) {
      console.error('Error completing module:', err)
    } finally {
      setCompleting(false)
    }
  }

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

  if (error || !data) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <BookOpen className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {error || 'Course not found'}
            </h1>
            <Link
              href="/knowledge"
              className="text-green-600 dark:text-green-400 hover:underline"
            >
              Browse courses
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const currentModule = data.modules[currentModuleIndex]
  const isModuleCompleted = data.progress.completedModuleIds.includes(currentModule?.id)

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */}
          <div className="lg:w-80 lg:min-h-screen bg-white dark:bg-gray-800 border-r dark:border-gray-700 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
            <div className="p-4 pt-6">
              <button
                onClick={() => router.push('/knowledge')}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Courses
              </button>

              <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                {data.course.title}
              </h2>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{data.progress.progressPercent}%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600 transition-all duration-300"
                    style={{ width: `${data.progress.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Module list */}
              <div className="space-y-1">
                {data.modules.map((module, index) => {
                  const isCompleted = data.progress.completedModuleIds.includes(module.id)
                  const isCurrent = index === currentModuleIndex

                  return (
                    <button
                      key={module.id}
                      onClick={() => setCurrentModuleIndex(index)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                        isCurrent
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {index + 1}. {module.title}
                        </p>
                      </div>
                      {module.videoUrl && <Play className="h-4 w-4 text-gray-400" />}
                    </button>
                  )
                })}
              </div>

              {/* Certificate section */}
              {data.course.isCertification && data.progress.isCompleted && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
                    <Award className="h-5 w-5" />
                    <span className="font-semibold">Certificate Earned!</span>
                  </div>
                  <Link
                    href={`/learn/${courseId}/certificate`}
                    className="text-sm text-green-600 dark:text-green-400 hover:underline"
                  >
                    View Certificate
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 lg:ml-80 pt-4 lg:pt-8 pb-24">
            <div className="max-w-4xl mx-auto px-4">
              {currentModule ? (
                <>
                  {/* Module header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span>Module {currentModuleIndex + 1} of {data.modules.length}</span>
                      {isModuleCompleted && (
                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <CheckCircle className="h-4 w-4" />
                          Completed
                        </span>
                      )}
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                      {currentModule.title}
                    </h1>
                    {currentModule.description && (
                      <p className="mt-2 text-gray-600 dark:text-gray-400">
                        {currentModule.description}
                      </p>
                    )}
                  </div>

                  {/* Video */}
                  {currentModule.videoUrl && (
                    <div className="mb-8 aspect-video bg-black rounded-lg overflow-hidden">
                      {currentModule.videoUrl.includes('youtube.com') || currentModule.videoUrl.includes('youtu.be') ? (
                        <iframe
                          src={currentModule.videoUrl.replace('watch?v=', 'embed/')}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      ) : currentModule.videoUrl.includes('vimeo.com') ? (
                        <iframe
                          src={currentModule.videoUrl.replace('vimeo.com', 'player.vimeo.com/video')}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={currentModule.videoUrl}
                          controls
                          className="w-full h-full"
                        />
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="prose dark:prose-invert max-w-none mb-8">
                    <div className="whitespace-pre-wrap">
                      {currentModule.content || (
                        <p className="text-gray-500 dark:text-gray-400 italic">
                          No additional content for this module.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-6 border-t dark:border-gray-700">
                    <button
                      onClick={() => setCurrentModuleIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentModuleIndex === 0}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                      Previous
                    </button>

                    <button
                      onClick={handleCompleteModule}
                      disabled={completing}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                        isModuleCompleted
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {completing ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Completing...
                        </>
                      ) : isModuleCompleted ? (
                        currentModuleIndex < data.modules.length - 1 ? (
                          <>
                            Next Module
                            <ChevronRight className="h-5 w-5" />
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-5 w-5" />
                            Completed
                          </>
                        )
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          {currentModuleIndex < data.modules.length - 1 ? 'Complete & Continue' : 'Complete Course'}
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setCurrentModuleIndex(prev => Math.min(data.modules.length - 1, prev + 1))}
                      disabled={currentModuleIndex === data.modules.length - 1}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No modules yet
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    This course doesn&apos;t have any content yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md text-center animate-bounce-once">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Trophy className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {data.progress.isCompleted ? 'Course Completed!' : 'Welcome!'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {data.progress.isCompleted
                ? `Congratulations! You've completed "${data.course.title}". ${data.course.isCertification ? 'Your certificate is now available!' : 'Keep up the great work!'}`
                : `You're now enrolled in "${data.course.title}". Let's start learning!`}
            </p>
            {data.progress.isCompleted && data.course.isCertification && (
              <Link
                href={`/learn/${courseId}/certificate`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors mb-4"
              >
                <Award className="h-5 w-5" />
                View Certificate
              </Link>
            )}
            <button
              onClick={() => setShowCelebration(false)}
              className="block w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              {data.progress.isCompleted ? 'Continue Learning' : 'Start Learning'}
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}

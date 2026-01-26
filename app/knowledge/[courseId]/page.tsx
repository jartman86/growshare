import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CourseCategory } from '@/lib/course-data'
import { EnrollButton } from '@/components/knowledge/enroll-button'
import { prisma } from '@/lib/prisma'
import {
  ArrowLeft,
  Clock,
  Users,
  Star,
  Award,
  BookOpen,
  CheckCircle,
  Play,
  FileText,
  Trophy,
} from 'lucide-react'

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params

  // Check database for the course
  const dbCourse = await prisma.course.findFirst({
    where: {
      OR: [
        { id: courseId },
        { slug: courseId },
      ],
      isPublished: true,
    },
    include: {
      instructor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
      modules: {
        orderBy: { order: 'asc' },
      },
      _count: {
        select: {
          progress: true,
        },
      },
    },
  })

  // Convert DB course to the format expected by the page
  const course = dbCourse ? {
    id: dbCourse.id,
    title: dbCourse.title,
    description: dbCourse.description,
    category: dbCourse.category as CourseCategory,
    difficulty: dbCourse.level === 'BEGINNER' ? 'Beginner' :
                dbCourse.level === 'INTERMEDIATE' ? 'Intermediate' :
                dbCourse.level === 'ADVANCED' ? 'Advanced' : 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    duration: `${dbCourse.modules.length} modules`,
    instructor: dbCourse.instructor
      ? `${dbCourse.instructor.firstName || ''} ${dbCourse.instructor.lastName || ''}`.trim()
      : 'Instructor',
    instructorAvatar: dbCourse.instructor?.avatar || undefined,
    image: dbCourse.thumbnailUrl || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
    lessons: dbCourse.modules.length,
    enrolled: dbCourse._count.progress,
    rating: 4.5,
    reviews: 0,
    price: dbCourse.accessType === 'FREE' ? 0 : dbCourse.price || 0,
    certification: dbCourse.isCertification,
    points: dbCourse.pointsAwarded || 250,
    tags: [],
    skills: [],
  } : null

  if (!course) {
    notFound()
  }

  // Use real modules from database
  const modules = dbCourse?.modules || []
  const totalLessons = modules.length

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <div className="border-b-2 border-[#8bc34a]/30 dark:border-gray-700 bg-gradient-to-br from-[#f4e4c1] via-white to-[#aed581]/30 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link
              href="/knowledge"
              className="inline-flex items-center gap-2 text-[#5a7f3a] hover:text-[#4a6b2e] dark:text-green-400 dark:hover:text-green-300 mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Knowledge Hub
            </Link>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Info */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-[#5a7f3a]/20 text-[#5a7f3a] dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-semibold">
                    {course.category}
                  </span>
                  <span className="px-3 py-1 bg-[#5a7f3a]/20 text-[#5a7f3a] dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-semibold">
                    {course.difficulty}
                  </span>
                  {course.certification && (
                    <span className="px-3 py-1 bg-amber-500 text-white rounded-full text-sm font-semibold flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      Certificate
                    </span>
                  )}
                </div>

                <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{course.title}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">{course.description}</p>

                {/* Instructor */}
                <div className="flex items-center gap-3 mb-6">
                  {course.instructorAvatar && (
                    <img
                      src={course.instructorAvatar}
                      alt={course.instructor}
                      className="w-12 h-12 rounded-full border-2 border-[#8bc34a]"
                    />
                  )}
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Instructor</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{course.instructor}</div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 flex-wrap text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{course.rating}</span>
                    <span className="text-gray-500 dark:text-gray-400">({course.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#5a7f3a] dark:text-green-400" />
                    <span>{course.enrolled.toLocaleString()} enrolled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#5a7f3a] dark:text-green-400" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-[#5a7f3a] dark:text-green-400" />
                    <span>{totalLessons} lessons</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Image */}
              <div>
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-64 object-cover rounded-xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* What You'll Learn */}
              <div className="bg-white rounded-xl border p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll Learn</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {course.skills.map((skill, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{skill}</span>
                    </div>
                  ))}
                  {course.tags.map((tag, index) => (
                    <div key={`tag-${index}`} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{tag}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Curriculum */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Course Curriculum</h2>
                {modules.length > 0 ? (
                  <div className="space-y-4">
                    {modules.map((module, index) => (
                      <div key={module.id} className="border dark:border-gray-700 rounded-lg">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Module {index + 1}: {module.title}
                          </h3>
                          {module.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{module.description}</p>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-3">
                            {module.videoUrl ? (
                              <Play className="h-4 w-4 text-blue-600" />
                            ) : (
                              <FileText className="h-4 w-4 text-green-600" />
                            )}
                            <span className="text-gray-700 dark:text-gray-300">
                              {module.videoUrl ? 'Video Lesson' : 'Reading Material'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No modules available yet.</p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Enroll Card */}
                <div className="bg-white rounded-xl border shadow-lg p-6">
                  <div className="mb-6">
                    {course.price === 0 ? (
                      <div className="text-4xl font-bold text-green-600">Free</div>
                    ) : (
                      <div>
                        <div className="text-4xl font-bold text-gray-900">${course.price}</div>
                        <div className="text-sm text-gray-600">One-time payment</div>
                      </div>
                    )}
                  </div>

                  <EnrollButton course={course} />

                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold text-gray-900 mb-3">This course includes:</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>{totalLessons} lessons</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>{course.duration} of content</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Lifetime access</span>
                      </li>
                      {course.certification && (
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Certificate of completion</span>
                        </li>
                      )}
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>+{course.points} points on completion</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Points Info */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-800 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      +{course.points}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Earn Points</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">On course completion</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Completing this course will earn you {course.points} points toward your
                    next level and unlock new badges!
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

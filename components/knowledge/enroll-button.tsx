'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Course } from '@/lib/course-data'
import { CheckCircle } from 'lucide-react'

interface EnrollButtonProps {
  course: Course
}

export function EnrollButton({ course }: EnrollButtonProps) {
  const router = useRouter()
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)

  const handleEnroll = async () => {
    setIsEnrolling(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In production, this would:
    // - Process payment if not free
    // - Enroll user in course
    // - Redirect to course content
    console.log('Enrolling in course:', course.id)

    setIsEnrolled(true)
    setIsEnrolling(false)

    // Show success message
    setTimeout(() => {
      alert(`🎉 Successfully enrolled in "${course.title}"! You can now access all course content.`)
    }, 100)
  }

  if (isEnrolled) {
    return (
      <div className="space-y-3">
        <button
          className="w-full bg-gray-100 text-gray-700 px-6 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
          disabled
        >
          <CheckCircle className="h-5 w-5 text-green-600" />
          Enrolled
        </button>
        <button
          onClick={() => router.push(`/dashboard/courses/${course.id}`)}
          className="w-full bg-green-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Go to Course
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={isEnrolling}
      className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isEnrolling ? 'Enrolling...' : course.price === 0 ? 'Enroll for Free' : `Enroll Now - $${course.price}`}
    </button>
  )
}

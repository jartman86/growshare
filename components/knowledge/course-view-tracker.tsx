'use client'

import { useEffect, useRef } from 'react'

interface CourseViewTrackerProps {
  courseId: string
}

export function CourseViewTracker({ courseId }: CourseViewTrackerProps) {
  const tracked = useRef(false)

  useEffect(() => {
    // Only track once per page load
    if (tracked.current) return
    tracked.current = true

    // Use a slight delay to avoid tracking bounces
    const timeoutId = setTimeout(() => {
      fetch(`/api/courses/${courseId}/view`, {
        method: 'POST',
      }).catch(() => {
        // Silently fail - view tracking is non-critical
      })
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [courseId])

  // This component doesn't render anything
  return null
}

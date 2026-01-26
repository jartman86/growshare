'use client'

import { useEffect, use } from 'react'
import { useRouter } from 'next/navigation'

export default function InstructorCoursePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()

  useEffect(() => {
    router.replace(`/instructor/courses/${id}/edit`)
  }, [id, router])

  return null
}

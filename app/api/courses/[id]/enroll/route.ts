import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ensureUser } from '@/lib/ensure-user'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ensureUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { id } = await params

    const course = await prisma.course.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        accessType: true,
        isPublished: true,
        instructorId: true,
      },
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    if (!course.isPublished && course.instructorId !== user.id) {
      return NextResponse.json(
        { error: 'Course is not available' },
        { status: 400 }
      )
    }

    // Only allow enrollment for free courses
    if (course.accessType !== 'FREE') {
      return NextResponse.json(
        { error: 'This course requires purchase or subscription' },
        { status: 400 }
      )
    }

    // Check if already enrolled
    const existingProgress = await prisma.courseProgress.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: id,
        },
      },
    })

    if (existingProgress) {
      return NextResponse.json({
        success: true,
        message: 'Already enrolled',
        alreadyEnrolled: true,
      })
    }

    // Create progress record to track enrollment
    await prisma.courseProgress.create({
      data: {
        userId: user.id,
        courseId: id,
        completedModuleIds: [],
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully enrolled',
      alreadyEnrolled: false,
    })
  } catch (error) {
    console.error('Error enrolling in course:', error)
    return NextResponse.json(
      { error: 'Failed to enroll' },
      { status: 500 }
    )
  }
}

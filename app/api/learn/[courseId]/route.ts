import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ensureUser } from '@/lib/ensure-user'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
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

    const { courseId } = await params

    const course = await prisma.course.findUnique({
      where: { id: courseId },
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
      },
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Check access
    const isInstructor = course.instructorId === user.id
    const isAdmin = user.role.includes('ADMIN')

    let hasAccess = isInstructor || isAdmin

    if (!hasAccess) {
      // Check for free enrollment or purchase
      if (course.accessType === 'FREE') {
        const progress = await prisma.courseProgress.findUnique({
          where: {
            userId_courseId: { userId: user.id, courseId },
          },
        })
        hasAccess = !!progress
      } else {
        // Check purchase
        const purchase = await prisma.coursePurchase.findUnique({
          where: {
            userId_courseId: { userId: user.id, courseId },
            status: 'COMPLETED',
          },
        })
        hasAccess = !!purchase

        // Check subscription
        if (!hasAccess && course.includeInSubscription) {
          const subscription = await prisma.subscription.findUnique({
            where: { userId: user.id },
          })
          hasAccess = subscription?.status === 'active' &&
            subscription.currentPeriodEnd > new Date()
        }
      }
    }

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get or create progress
    let progress = await prisma.courseProgress.findUnique({
      where: {
        userId_courseId: { userId: user.id, courseId },
      },
    })

    if (!progress) {
      progress = await prisma.courseProgress.create({
        data: {
          userId: user.id,
          courseId,
          completedModuleIds: [],
        },
      })
    }

    return NextResponse.json({
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
        thumbnailUrl: course.thumbnailUrl,
        category: course.category,
        level: course.level,
        isCertification: course.isCertification,
        certificateName: course.certificateName,
        instructor: course.instructor,
      },
      modules: course.modules,
      progress: {
        completedModuleIds: progress.completedModuleIds,
        isCompleted: progress.isCompleted,
        completedAt: progress.completedAt,
        certificateId: progress.certificateId,
        certificateIssuedAt: progress.certificateIssuedAt,
        progressPercent: course.modules.length > 0
          ? Math.round(((progress.completedModuleIds as string[]).length / course.modules.length) * 100)
          : 0,
      },
    })
  } catch (error) {
    console.error('Error fetching course content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}

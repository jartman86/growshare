import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ensureUser } from '@/lib/ensure-user'

export async function GET(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ensureUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get courses with progress (enrolled courses)
    const enrolledCourses = await prisma.courseProgress.findMany({
      where: { userId: user.id },
      include: {
        course: {
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
              select: {
                id: true,
              },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    // Get purchased courses
    const purchases = await prisma.coursePurchase.findMany({
      where: {
        userId: user.id,
        status: 'COMPLETED',
      },
      select: {
        courseId: true,
        purchasedAt: true,
      },
    })

    const purchasedCourseIds = new Set(purchases.map(p => p.courseId))

    // Get subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
    })

    const hasActiveSubscription = subscription &&
      subscription.status === 'active' &&
      subscription.currentPeriodEnd > new Date()

    // Format courses with progress data
    const courses = enrolledCourses.map(progress => {
      const totalModules = progress.course.modules.length
      const completedModules = (progress.completedModuleIds as string[]).length
      const progressPercent = totalModules > 0
        ? Math.round((completedModules / totalModules) * 100)
        : 0

      return {
        id: progress.course.id,
        title: progress.course.title,
        slug: progress.course.slug,
        description: progress.course.description,
        thumbnailUrl: progress.course.thumbnailUrl,
        category: progress.course.category,
        level: progress.course.level,
        instructor: progress.course.instructor,
        totalModules,
        completedModules,
        progressPercent,
        isCompleted: progress.isCompleted,
        completedAt: progress.completedAt,
        lastAccessedAt: progress.updatedAt,
        accessType: purchasedCourseIds.has(progress.course.id)
          ? 'purchased'
          : progress.course.accessType === 'FREE'
            ? 'free'
            : hasActiveSubscription
              ? 'subscription'
              : 'unknown',
      }
    })

    return NextResponse.json({
      courses,
      hasActiveSubscription,
      totalCourses: courses.length,
      completedCourses: courses.filter(c => c.isCompleted).length,
      inProgressCourses: courses.filter(c => !c.isCompleted && c.progressPercent > 0).length,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}

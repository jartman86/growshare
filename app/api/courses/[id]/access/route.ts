import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ensureUser } from '@/lib/ensure-user'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ hasAccess: false, reason: 'not_authenticated' })
    }

    const user = await ensureUser()
    if (!user) {
      return NextResponse.json({ hasAccess: false, reason: 'user_not_found' })
    }

    const { id } = await params

    const course = await prisma.course.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        accessType: true,
        price: true,
        isPublished: true,
        instructorId: true,
        includeInSubscription: true,
      },
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Course creator always has access
    if (course.instructorId === user.id) {
      return NextResponse.json({
        hasAccess: true,
        reason: 'instructor',
        course,
      })
    }

    // Admins have access
    if (user.role.includes('ADMIN')) {
      return NextResponse.json({
        hasAccess: true,
        reason: 'admin',
        course,
      })
    }

    // Check if course is free
    if (course.accessType === 'FREE') {
      // Check if user has enrolled (progress exists)
      const progress = await prisma.courseProgress.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: id,
          },
        },
      })

      if (progress) {
        return NextResponse.json({
          hasAccess: true,
          reason: 'enrolled_free',
          course,
        })
      }

      // Free courses need enrollment
      return NextResponse.json({
        hasAccess: false,
        reason: 'needs_enrollment',
        course,
      })
    }

    // Check for purchase
    const purchase = await prisma.coursePurchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: id,
        },
        status: 'COMPLETED',
      },
    })

    if (purchase) {
      return NextResponse.json({
        hasAccess: true,
        reason: 'purchased',
        course,
      })
    }

    // Check for subscription access
    if (course.accessType === 'SUBSCRIPTION' || course.accessType === 'BOTH') {
      if (course.includeInSubscription) {
        const subscription = await prisma.subscription.findUnique({
          where: { userId: user.id },
        })

        if (subscription && subscription.status === 'active') {
          // Verify subscription is still valid
          if (subscription.currentPeriodEnd > new Date()) {
            return NextResponse.json({
              hasAccess: true,
              reason: 'subscription',
              course,
            })
          }
        }
      }
    }

    // No access - determine what action is needed
    if (course.accessType === 'SUBSCRIPTION') {
      return NextResponse.json({
        hasAccess: false,
        reason: 'needs_subscription',
        course,
      })
    }

    if (course.accessType === 'ONE_TIME' || course.accessType === 'BOTH') {
      return NextResponse.json({
        hasAccess: false,
        reason: 'needs_purchase',
        course,
      })
    }

    return NextResponse.json({
      hasAccess: false,
      reason: 'unknown',
      course,
    })
  } catch (error) {
    console.error('Error checking course access:', error)
    return NextResponse.json(
      { error: 'Failed to check access' },
      { status: 500 }
    )
  }
}

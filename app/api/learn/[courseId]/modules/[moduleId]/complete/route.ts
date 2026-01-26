import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ensureUser } from '@/lib/ensure-user'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; moduleId: string }> }
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

    const { courseId, moduleId } = await params

    // Verify module belongs to course
    const module = await prisma.courseModule.findUnique({
      where: { id: moduleId },
    })

    if (!module || module.courseId !== courseId) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 })
    }

    // Get current progress
    const progress = await prisma.courseProgress.findUnique({
      where: {
        userId_courseId: { userId: user.id, courseId },
      },
    })

    if (!progress) {
      return NextResponse.json({ error: 'Not enrolled in this course' }, { status: 403 })
    }

    const completedModuleIds = progress.completedModuleIds as string[]

    // Add module to completed list if not already there
    if (!completedModuleIds.includes(moduleId)) {
      completedModuleIds.push(moduleId)
    }

    // Check if all modules are completed
    const allModules = await prisma.courseModule.findMany({
      where: { courseId },
      select: { id: true },
    })

    const isCompleted = allModules.every(m => completedModuleIds.includes(m.id))
    const progressPercent = Math.round((completedModuleIds.length / allModules.length) * 100)

    // Check if this is a certification course (for certificate generation)
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { isCertification: true },
    })

    // Generate certificate ID if course is completed and it's a certification course
    let certificateId: string | null = null
    if (isCompleted && !progress.isCompleted && course?.isCertification) {
      // Generate unique certificate ID: GS-CERT-XXXXXX
      const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
      const timestamp = Date.now().toString(36).toUpperCase().slice(-4)
      certificateId = `GS-CERT-${randomPart}${timestamp}`
    }

    // Update progress
    const updatedProgress = await prisma.courseProgress.update({
      where: { id: progress.id },
      data: {
        completedModuleIds,
        progressPercent,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
        ...(certificateId && {
          certificateId,
          certificateIssuedAt: new Date(),
        }),
      },
    })

    // Award gamification points if course was just completed
    if (isCompleted && !progress.isCompleted) {
      try {
        // Create activity for course completion
        await prisma.userActivity.create({
          data: {
            userId: user.id,
            type: 'COURSE_COMPLETED',
            title: 'Completed a course',
            points: 250, // Points for completing a course
            description: `Completed course`,
          },
        })

        // Update user's total points
        await prisma.user.update({
          where: { id: user.id },
          data: {
            totalPoints: { increment: 250 },
          },
        })
      } catch (error) {
        console.error('Error awarding course completion points:', error)
        // Don't fail the request if gamification fails
      }
    }

    return NextResponse.json({
      success: true,
      completedModuleIds,
      progressPercent,
      isCompleted,
      justCompleted: isCompleted && !progress.isCompleted,
      certificateId: updatedProgress.certificateId,
    })
  } catch (error) {
    console.error('Error completing module:', error)
    return NextResponse.json(
      { error: 'Failed to complete module' },
      { status: 500 }
    )
  }
}

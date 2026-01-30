import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ensureUser } from '@/lib/ensure-user'

export async function PATCH(
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

    // Check if user is admin
    if (!user.role.includes('ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { status, reviewNotes } = body

    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be APPROVED or REJECTED' },
        { status: 400 }
      )
    }

    // Find the application
    const application = await prisma.instructorApplication.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    if (application.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Application has already been reviewed' },
        { status: 400 }
      )
    }

    // Update application and user in a transaction
    const [updatedApplication] = await prisma.$transaction([
      prisma.instructorApplication.update({
        where: { id },
        data: {
          status,
          reviewNotes: reviewNotes || null,
          reviewedBy: user.id,
          reviewedAt: new Date(),
        },
      }),
      // If approved, update the user's instructor status
      ...(status === 'APPROVED'
        ? [
            prisma.user.update({
              where: { id: application.userId },
              data: {
                isInstructor: true,
                instructorApprovedAt: new Date(),
              },
            }),
          ]
        : []),
    ])

    // Send notification to applicant about their application status
    await prisma.notification.create({
      data: {
        userId: application.userId,
        type: status === 'APPROVED' ? 'INSTRUCTOR_APPROVED' : 'INSTRUCTOR_REJECTED',
        title: status === 'APPROVED'
          ? 'Instructor Application Approved!'
          : 'Instructor Application Update',
        content: status === 'APPROVED'
          ? 'Congratulations! Your instructor application has been approved. You can now create courses and share your knowledge with the community.'
          : `Your instructor application has been reviewed. ${reviewNotes ? `Feedback: ${reviewNotes}` : 'Please contact support for more information.'}`,
        link: status === 'APPROVED' ? '/instructor' : '/instructor/apply',
        metadata: {
          applicationId: id,
          status,
        },
      },
    })

    // Award points if approved
    if (status === 'APPROVED') {
      await prisma.user.update({
        where: { id: application.userId },
        data: {
          totalPoints: { increment: 500 },
        },
      })

      await prisma.userActivity.create({
        data: {
          userId: application.userId,
          type: 'ACHIEVEMENT_UNLOCKED',
          title: 'Became an Instructor',
          description: 'Your instructor application was approved!',
          points: 500,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: `Application ${status.toLowerCase()}`,
      application: updatedApplication,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    )
  }
}

export async function GET(
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

    // Check if user is admin
    if (!user.role.includes('ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    const application = await prisma.instructorApplication.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            username: true,
            avatar: true,
            bio: true,
            location: true,
            website: true,
            createdAt: true,
            totalPoints: true,
            level: true,
          },
        },
      },
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ application })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    )
  }
}

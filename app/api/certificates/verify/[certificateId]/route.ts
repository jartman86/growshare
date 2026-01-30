import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ certificateId: string }>
}

// Verify a certificate
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { certificateId } = await params

    if (!certificateId) {
      return NextResponse.json(
        { error: 'Certificate ID is required' },
        { status: 400 }
      )
    }

    // Find the certificate
    const progress = await prisma.courseProgress.findUnique({
      where: { certificateId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            certificateName: true,
            isCertification: true,
            instructor: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    })

    if (!progress) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Certificate not found'
        },
        { status: 404 }
      )
    }

    // Verify the certificate is for a certification course
    if (!progress.course.isCertification) {
      return NextResponse.json(
        {
          valid: false,
          error: 'This course does not issue certificates'
        },
        { status: 400 }
      )
    }

    // Verify the course was completed
    if (!progress.isCompleted || !progress.completedAt) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Course was not completed'
        },
        { status: 400 }
      )
    }

    // Return certificate details
    return NextResponse.json({
      valid: true,
      certificate: {
        id: progress.certificateId,
        issuedAt: progress.certificateIssuedAt || progress.completedAt,
        completedAt: progress.completedAt,
        recipient: {
          name: `${progress.user.firstName || ''} ${progress.user.lastName || ''}`.trim() || 'Student',
          avatar: progress.user.avatar,
        },
        course: {
          id: progress.course.id,
          title: progress.course.title,
          certificateName: progress.course.certificateName,
          instructor: progress.course.instructor
            ? `${progress.course.instructor.firstName || ''} ${progress.course.instructor.lastName || ''}`.trim()
            : null,
        },
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to verify certificate' },
      { status: 500 }
    )
  }
}

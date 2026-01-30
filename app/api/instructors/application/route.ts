import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ensureUser } from '@/lib/ensure-user'

export async function GET() {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ensureUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // If user is already an instructor, return that status
    if (user.isInstructor) {
      return NextResponse.json({
        isInstructor: true,
        application: null,
      })
    }

    // Check for existing application
    const application = await prisma.instructorApplication.findUnique({
      where: { userId: user.id },
    })

    return NextResponse.json({
      isInstructor: false,
      application,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch application status' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ensureUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check for existing application
    const application = await prisma.instructorApplication.findUnique({
      where: { userId: user.id },
    })

    if (!application) {
      return NextResponse.json(
        { error: 'No application found' },
        { status: 404 }
      )
    }

    // Can only update pending applications
    if (application.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Can only update pending applications' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { expertise, experience, bio, portfolioUrl, socialLinks } = body

    const updatedApplication = await prisma.instructorApplication.update({
      where: { userId: user.id },
      data: {
        ...(expertise && { expertise }),
        ...(experience && { experience: experience.trim() }),
        ...(bio && { bio: bio.trim() }),
        ...(portfolioUrl !== undefined && { portfolioUrl: portfolioUrl?.trim() || null }),
        ...(socialLinks !== undefined && { socialLinks }),
      },
    })

    return NextResponse.json({
      success: true,
      application: updatedApplication,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    )
  }
}

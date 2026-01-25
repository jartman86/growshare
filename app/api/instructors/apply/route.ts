import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ensureUser } from '@/lib/ensure-user'

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ensureUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user already has an application
    const existingApplication = await prisma.instructorApplication.findUnique({
      where: { userId: user.id },
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You already have an instructor application', application: existingApplication },
        { status: 400 }
      )
    }

    // Check if user is already an instructor
    if (user.isInstructor) {
      return NextResponse.json(
        { error: 'You are already an approved instructor' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { expertise, experience, bio, portfolioUrl, socialLinks } = body

    // Validate required fields
    if (!expertise || !Array.isArray(expertise) || expertise.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one area of expertise' },
        { status: 400 }
      )
    }

    if (!experience || experience.trim().length < 50) {
      return NextResponse.json(
        { error: 'Please provide at least 50 characters describing your experience' },
        { status: 400 }
      )
    }

    if (!bio || bio.trim().length < 50) {
      return NextResponse.json(
        { error: 'Please provide at least 50 characters for your bio' },
        { status: 400 }
      )
    }

    // Create the application
    const application = await prisma.instructorApplication.create({
      data: {
        userId: user.id,
        expertise,
        experience: experience.trim(),
        bio: bio.trim(),
        portfolioUrl: portfolioUrl?.trim() || null,
        socialLinks: socialLinks || null,
        status: 'PENDING',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Your instructor application has been submitted! We will review it shortly.',
      application,
    })
  } catch (error) {
    console.error('Error submitting instructor application:', error)
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}

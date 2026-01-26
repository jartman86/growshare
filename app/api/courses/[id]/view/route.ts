import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ensureUser } from '@/lib/ensure-user'

interface RouteParams {
  params: Promise<{ id: string }>
}

// Track a course view
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id },
      select: { id: true, isPublished: true },
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    if (!course.isPublished) {
      return NextResponse.json({ error: 'Course not available' }, { status: 404 })
    }

    // Increment view count
    await prisma.course.update({
      where: { id },
      data: {
        viewCount: { increment: 1 },
      },
    })

    // If user is logged in, track the activity
    try {
      const currentUser = await ensureUser()
      if (currentUser) {
        // Create activity record (but don't fail if this errors)
        await prisma.userActivity.create({
          data: {
            userId: currentUser.id,
            type: 'COURSE_VIEWED',
            title: 'Viewed a Course',
            description: `Viewed course`,
            metadata: { courseId: id },
          },
        }).catch(() => {
          // Silently ignore - activity tracking is optional
        })
      }
    } catch {
      // User not logged in - that's fine, still track the view
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking course view:', error)
    return NextResponse.json(
      { error: 'Failed to track view' },
      { status: 500 }
    )
  }
}

// Get course view count
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const course = await prisma.course.findUnique({
      where: { id },
      select: { viewCount: true },
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    return NextResponse.json({ viewCount: course.viewCount })
  } catch (error) {
    console.error('Error getting view count:', error)
    return NextResponse.json(
      { error: 'Failed to get view count' },
      { status: 500 }
    )
  }
}

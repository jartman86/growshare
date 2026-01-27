import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ensureUser } from '@/lib/ensure-user'
import { cookies } from 'next/headers'
import crypto from 'crypto'

interface RouteParams {
  params: Promise<{ id: string }>
}

// Get or create a session ID for anonymous view tracking
async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get('view_session')?.value

  if (!sessionId) {
    sessionId = crypto.randomUUID()
  }

  return sessionId
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

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0]

    // Check if user is logged in
    let currentUser = null
    try {
      currentUser = await ensureUser()
    } catch {
      // User not logged in - that's fine
    }

    let isNewView = false
    const sessionId = await getOrCreateSessionId()

    if (currentUser) {
      // Check if this user has already viewed this course today
      const existingView = await prisma.courseView.findFirst({
        where: {
          courseId: id,
          userId: currentUser.id,
          viewDate: today,
        },
      })

      if (!existingView) {
        // Create new view record
        await prisma.courseView.create({
          data: {
            courseId: id,
            userId: currentUser.id,
            viewDate: today,
          },
        })
        isNewView = true

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
    } else {
      // Anonymous user - track by session ID
      const existingView = await prisma.courseView.findFirst({
        where: {
          courseId: id,
          sessionId: sessionId,
          viewDate: today,
        },
      })

      if (!existingView) {
        // Create new view record
        await prisma.courseView.create({
          data: {
            courseId: id,
            sessionId: sessionId,
            viewDate: today,
          },
        })
        isNewView = true
      }
    }

    // Only increment view count if this is a new view (not already counted today)
    if (isNewView) {
      await prisma.course.update({
        where: { id },
        data: {
          viewCount: { increment: 1 },
        },
      })
    }

    // Set session cookie for anonymous users
    const response = NextResponse.json({ success: true, newView: isNewView })
    if (!currentUser) {
      response.cookies.set('view_session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
      })
    }

    return response
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

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ensureUser } from '@/lib/ensure-user'

// Create a new report (user endpoint)
export async function POST(request: NextRequest) {
  try {
    const currentUser = await ensureUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      type,
      reason,
      details,
      plotId,
      reviewId,
      messageId,
      listingId,
      toolId,
      postId,
      userId,
    } = body

    // Validate required fields
    if (!type || !reason) {
      return NextResponse.json(
        { error: 'Type and reason are required' },
        { status: 400 }
      )
    }

    // Validate that at least one content ID is provided
    const contentIds = { plotId, reviewId, messageId, listingId, toolId, postId, userId }
    const providedIds = Object.entries(contentIds).filter(([, v]) => v)

    if (providedIds.length === 0) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      )
    }

    if (providedIds.length > 1) {
      return NextResponse.json(
        { error: 'Only one content ID should be provided' },
        { status: 400 }
      )
    }

    // Prevent self-reporting
    if (userId === currentUser.id) {
      return NextResponse.json(
        { error: 'You cannot report yourself' },
        { status: 400 }
      )
    }

    // Check for duplicate report
    const existingReport = await prisma.report.findFirst({
      where: {
        reporterId: currentUser.id,
        status: 'PENDING',
        ...(plotId && { plotId }),
        ...(reviewId && { reviewId }),
        ...(messageId && { messageId }),
        ...(listingId && { listingId }),
        ...(toolId && { toolId }),
        ...(postId && { postId }),
        ...(userId && { userId }),
      },
    })

    if (existingReport) {
      return NextResponse.json(
        { error: 'You have already reported this content' },
        { status: 400 }
      )
    }

    const report = await prisma.report.create({
      data: {
        type,
        reason,
        details,
        reporterId: currentUser.id,
        plotId,
        reviewId,
        messageId,
        listingId,
        toolId,
        postId,
        userId,
      },
    })

    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    console.error('Error creating report:', error)
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    )
  }
}

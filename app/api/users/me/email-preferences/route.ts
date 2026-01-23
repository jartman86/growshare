import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get or create email preferences
    let preferences = await prisma.emailPreferences.findUnique({
      where: { userId: user.id },
    })

    if (!preferences) {
      // Create default preferences
      preferences = await prisma.emailPreferences.create({
        data: {
          userId: user.id,
          bookingRequests: true,
          bookingUpdates: true,
          newMessages: true,
          newReviews: true,
          marketplaceOrders: true,
          forumReplies: true,
          weeklyDigest: true,
        },
      })
    }

    return NextResponse.json(preferences)
  } catch (error) {
    console.error('Error fetching email preferences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch email preferences' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()

    // Validate that only allowed fields are being updated
    const allowedFields = [
      'bookingRequests',
      'bookingUpdates',
      'newMessages',
      'newReviews',
      'marketplaceOrders',
      'forumReplies',
      'weeklyDigest',
    ]

    const updateData: Record<string, boolean> = {}
    for (const field of allowedFields) {
      if (typeof body[field] === 'boolean') {
        updateData[field] = body[field]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Upsert preferences
    const preferences = await prisma.emailPreferences.upsert({
      where: { userId: user.id },
      update: updateData,
      create: {
        userId: user.id,
        ...updateData,
      },
    })

    return NextResponse.json(preferences)
  } catch (error) {
    console.error('Error updating email preferences:', error)
    return NextResponse.json(
      { error: 'Failed to update email preferences' },
      { status: 500 }
    )
  }
}

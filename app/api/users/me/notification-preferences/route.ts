import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ensureUser } from '@/lib/ensure-user'

// GET /api/users/me/notification-preferences - Get user's in-app notification preferences
export async function GET() {
  try {
    const { userId: clerkId } = await auth()

    if (!clerkId) {
      return NextResponse.json(
        { error: 'You must be signed in' },
        { status: 401 }
      )
    }

    const user = await ensureUser()
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get or create notification preferences
    let preferences = await prisma.notificationPreferences.findUnique({
      where: { userId: user.id },
    })

    if (!preferences) {
      preferences = await prisma.notificationPreferences.create({
        data: {
          userId: user.id,
        },
      })
    }

    return NextResponse.json(preferences)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch notification preferences' },
      { status: 500 }
    )
  }
}

// PATCH /api/users/me/notification-preferences - Update in-app notification preferences
export async function PATCH(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()

    if (!clerkId) {
      return NextResponse.json(
        { error: 'You must be signed in' },
        { status: 401 }
      )
    }

    const user = await ensureUser()
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const body = await request.json()

    // Validate fields
    const allowedFields = [
      'bookingRequests',
      'bookingUpdates',
      'newMessages',
      'newReviews',
      'marketplaceActivity',
      'forumActivity',
      'courseUpdates',
      'communityActivity',
      'systemAnnouncements',
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
    const preferences = await prisma.notificationPreferences.upsert({
      where: { userId: user.id },
      update: updateData,
      create: {
        userId: user.id,
        ...updateData,
      },
    })

    return NextResponse.json(preferences)
  } catch {
    return NextResponse.json(
      { error: 'Failed to update notification preferences' },
      { status: 500 }
    )
  }
}

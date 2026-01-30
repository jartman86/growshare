import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userBadges: {
          include: {
            badge: true,
          },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        ownedPlots: {
          where: { status: 'ACTIVE' },
          take: 5,
        },
        cropJournals: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            harvests: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: authUserId } = await auth()
    if (!authUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = await params
    const body = await request.json()

    // Get the current user from database
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: authUserId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user is updating their own profile
    if (currentUser.id !== userId) {
      return NextResponse.json(
        { error: 'You can only update your own profile' },
        { status: 403 }
      )
    }

    // Update allowed fields only
    const allowedFields = [
      'firstName',
      'lastName',
      'bio',
      'phoneNumber',
      'avatar',
      'preferredLanguage',
      'timezone',
    ]

    const updateData: any = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    })

    return NextResponse.json(updatedUser)
  } catch {
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

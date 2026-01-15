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
          where: { status: { in: ['ACTIVE', 'RENTED'] } },
        },
        rentedPlots: {
          where: { status: { in: ['ACTIVE', 'APPROVED'] } },
          include: {
            plot: true,
          },
        },
        cropJournals: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching current user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
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

    const body = await request.json()
    const { username, location, bio, role } = body

    // Check if username is already taken by another user
    if (username) {
      const existingUser = await prisma.user.findUnique({
        where: { username: username.toLowerCase() },
      })

      if (existingUser && existingUser.clerkId !== userId) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 400 }
        )
      }
    }

    // Update user profile
    const user = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        ...(username && { username: username.toLowerCase() }),
        ...(location && { location }),
        ...(bio !== undefined && { bio }),
        ...(role && { role }),
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    )
  }
}

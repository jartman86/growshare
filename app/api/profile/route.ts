import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        bio: true,
        location: true,
        website: true,
        coverImage: true,
        avatar: true,
        role: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { username, firstName, lastName, bio, location, website, avatar, coverImage } = body

    // Check if username is already taken (if changed)
    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          clerkId: { not: userId },
        },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 400 }
        )
      }
    }

    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        ...(username && { username }),
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && { location }),
        ...(website !== undefined && { website }),
        ...(avatar !== undefined && { avatar }),
        ...(coverImage !== undefined && { coverImage }),
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        bio: true,
        location: true,
        website: true,
        coverImage: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

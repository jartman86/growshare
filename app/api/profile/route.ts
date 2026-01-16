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

    // Parse request body with error handling
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { username, firstName, lastName, bio, location, website, avatar, coverImage } = body

    // Validate username format if provided
    if (username) {
      if (typeof username !== 'string' || username.trim().length === 0) {
        return NextResponse.json(
          { error: 'Username cannot be empty' },
          { status: 400 }
        )
      }

      // Username validation: alphanumeric, underscores, hyphens, 3-30 characters
      const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/
      if (!usernameRegex.test(username)) {
        return NextResponse.json(
          { error: 'Username must be 3-30 characters and contain only letters, numbers, underscores, or hyphens' },
          { status: 400 }
        )
      }

      // Check if username is already taken (if changed)
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

    // Update user profile with error handling
    let updatedUser
    try {
      updatedUser = await prisma.user.update({
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
    } catch (updateError: any) {
      console.error('Profile update error:', updateError)

      // Handle specific Prisma errors
      if (updateError.code === 'P2002') {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 400 }
        )
      }
      if (updateError.code === 'P2025') {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      // Re-throw for generic error handler
      throw updateError
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

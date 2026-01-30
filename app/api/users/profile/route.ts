import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// GET - Get current user's profile
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        avatar: true,
        coverImage: true,
        bio: true,
        location: true,
        website: true,
        socialLinks: true,
        role: true,
        status: true,
        isVerified: true,
        isPhoneVerified: true,
        isIdVerified: true,
        onboardingComplete: true,
        totalPoints: true,
        level: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PATCH - Update current user's profile
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const {
      firstName,
      lastName,
      username,
      avatar,
      coverImage,
      bio,
      location,
      website,
      socialLinks,
      role,
      onboardingComplete,
    } = body

    const updateData: Record<string, unknown> = {}

    // Validate and update fields
    if (firstName !== undefined) {
      if (firstName.length < 1 || firstName.length > 50) {
        return NextResponse.json(
          { error: 'First name must be 1-50 characters' },
          { status: 400 }
        )
      }
      updateData.firstName = firstName.trim()
    }

    if (lastName !== undefined) {
      if (lastName.length < 1 || lastName.length > 50) {
        return NextResponse.json(
          { error: 'Last name must be 1-50 characters' },
          { status: 400 }
        )
      }
      updateData.lastName = lastName.trim()
    }

    if (username !== undefined) {
      if (username && (username.length < 3 || username.length > 30)) {
        return NextResponse.json(
          { error: 'Username must be 3-30 characters' },
          { status: 400 }
        )
      }
      if (username && !/^[a-zA-Z0-9_]+$/.test(username)) {
        return NextResponse.json(
          { error: 'Username can only contain letters, numbers, and underscores' },
          { status: 400 }
        )
      }
      if (username) {
        const existingUser = await prisma.user.findUnique({
          where: { username },
        })
        if (existingUser && existingUser.id !== currentUser.id) {
          return NextResponse.json(
            { error: 'Username already taken' },
            { status: 400 }
          )
        }
      }
      updateData.username = username || null
    }

    if (avatar !== undefined) updateData.avatar = avatar
    if (coverImage !== undefined) updateData.coverImage = coverImage
    if (bio !== undefined) updateData.bio = bio?.slice(0, 500) || null
    if (location !== undefined) updateData.location = location
    if (website !== undefined) updateData.website = website
    if (socialLinks !== undefined) updateData.socialLinks = socialLinks

    if (role !== undefined) {
      const validRoles = ['LANDOWNER', 'RENTER', 'BUYER', 'ORGANIZATION']
      const filteredRoles = role.filter((r: string) => validRoles.includes(r))
      if (filteredRoles.length > 0) {
        updateData.role = filteredRoles
      }
    }

    if (onboardingComplete !== undefined) {
      updateData.onboardingComplete = Boolean(onboardingComplete)
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        avatar: true,
        coverImage: true,
        bio: true,
        location: true,
        website: true,
        socialLinks: true,
        role: true,
        onboardingComplete: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch {
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

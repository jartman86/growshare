import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureUser } from '@/lib/ensure-user'

export async function GET() {
  try {
    // First ensure user exists (auto-sync from Clerk)
    const baseUser = await ensureUser()

    if (!baseUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch with full includes
    const user = await prisma.user.findUnique({
      where: { id: baseUser.id },
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
    // Ensure user exists (auto-sync from Clerk)
    const currentUser = await ensureUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { username, location, bio, role, interests, experienceLevel } = body

    // Check if username is already taken by another user
    if (username) {
      const existingUser = await prisma.user.findUnique({
        where: { username: username.toLowerCase() },
      })

      if (existingUser && existingUser.id !== currentUser.id) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 400 }
        )
      }
    }

    // Update user profile
    // Mark onboarding complete if username is being set (required field during onboarding)
    const isCompletingOnboarding = username && !currentUser.onboardingComplete

    const user = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        ...(username && { username: username.toLowerCase() }),
        ...(location && { location }),
        ...(bio !== undefined && { bio }),
        ...(role && { role }),
        ...(interests && { interests }),
        ...(experienceLevel && { experienceLevel }),
        ...(isCompletingOnboarding && { onboardingComplete: true }),
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

import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (existingUser) {
      return NextResponse.json({
        message: 'User already synced',
        user: existingUser
      })
    }

    // Get full user data from Clerk
    const clerkUser = await currentUser()

    if (!clerkUser) {
      return NextResponse.json({ error: 'Could not fetch user data' }, { status: 500 })
    }

    // Generate username from Clerk username or email
    let username = clerkUser.username
    if (!username) {
      // Generate from email (part before @)
      const emailPrefix = clerkUser.emailAddresses[0].emailAddress.split('@')[0]
      username = emailPrefix.toLowerCase().replace(/[^a-z0-9]/g, '')
    }

    // Ensure username is unique
    let finalUsername = username
    let counter = 1
    while (await prisma.user.findUnique({ where: { username: finalUsername } })) {
      finalUsername = `${username}${counter}`
      counter++
    }

    // Create user in database
    const user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        username: finalUsername,
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        avatar: clerkUser.imageUrl,
        role: ['RENTER'], // Default role
        totalPoints: 0,
        level: 1,
      },
    })

    console.log('Created user in database:', user.id)

    // Award welcome badge
    const welcomeBadge = await prisma.badge.findFirst({
      where: { name: 'Welcome to GrowShare' },
    })

    if (welcomeBadge) {
      await prisma.userBadge.create({
        data: {
          userId: user.id,
          badgeId: welcomeBadge.id,
        },
      })

      // Add points for welcome badge
      await prisma.user.update({
        where: { id: user.id },
        data: { totalPoints: { increment: welcomeBadge.points } },
      })

      // Create activity
      await prisma.userActivity.create({
        data: {
          userId: user.id,
          type: 'BADGE_EARNED',
          title: 'Welcome to GrowShare!',
          description: 'Earned your first badge',
          points: welcomeBadge.points,
        },
      })
    }

    return NextResponse.json({
      message: 'User synced successfully',
      user
    })
  } catch (error) {
    console.error('Error syncing user:', error)
    return NextResponse.json({
      error: 'Failed to sync user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

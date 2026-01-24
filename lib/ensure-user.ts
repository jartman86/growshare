import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

/**
 * Ensures the authenticated user exists in the database.
 * If not, creates them automatically (fallback for webhook failures).
 * Returns the database user or null if not authenticated.
 */
export async function ensureUser() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  // Check if user already exists
  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (user) {
    return user
  }

  // User doesn't exist - create them (webhook may have failed)
  const clerkUser = await currentUser()

  if (!clerkUser) {
    return null
  }

  // Generate username from Clerk username or email
  let baseUsername = clerkUser.username
  if (!baseUsername) {
    const emailPrefix = clerkUser.emailAddresses[0].emailAddress.split('@')[0]
    baseUsername = emailPrefix.toLowerCase().replace(/[^a-z0-9]/g, '')
  }

  // Ensure username is unique
  let finalUsername = baseUsername
  let counter = 1
  while (await prisma.user.findUnique({ where: { username: finalUsername } })) {
    finalUsername = `${baseUsername}${counter}`
    counter++
  }

  // Create user in database
  try {
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        username: finalUsername,
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        avatar: clerkUser.imageUrl,
        role: ['RENTER'],
        totalPoints: 0,
        level: 1,
      },
    })

    console.log('Auto-synced user to database:', user.id)

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

      await prisma.user.update({
        where: { id: user.id },
        data: { totalPoints: { increment: welcomeBadge.points } },
      })

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

    return user
  } catch (error) {
    console.error('Error auto-syncing user:', error)
    // User may have been created by another request - try to fetch again
    return prisma.user.findUnique({
      where: { clerkId: userId },
    })
  }
}

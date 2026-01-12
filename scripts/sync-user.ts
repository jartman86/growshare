import { clerkClient } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function syncUser() {
  try {
    // Get all Clerk users
    const client = await clerkClient()
    const clerkUsers = await client.users.getUserList()

    console.log(`Found ${clerkUsers.data.length} Clerk users`)

    for (const clerkUser of clerkUsers.data) {
      console.log(`\nProcessing user: ${clerkUser.id}`)
      console.log(`Email: ${clerkUser.emailAddresses[0]?.emailAddress}`)

      // Check if user exists in database
      const existingUser = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
      })

      if (existingUser) {
        console.log('✓ User already exists in database')
        continue
      }

      // Create user in database
      const user = await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0].emailAddress,
          firstName: clerkUser.firstName || '',
          lastName: clerkUser.lastName || '',
          avatar: clerkUser.imageUrl,
          role: ['RENTER'],
          totalPoints: 0,
          level: 1,
        },
      })

      console.log(`✓ Created user in database: ${user.id}`)

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

        console.log(`✓ Awarded welcome badge (${welcomeBadge.points} points)`)
      }
    }

    console.log('\n✅ Sync complete!')
  } catch (error) {
    console.error('Error syncing users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

syncUser()

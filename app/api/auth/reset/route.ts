import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log(`Resetting user with Clerk ID: ${userId}`)

    // Find the user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({
        message: 'No user found to reset',
        clerkId: userId
      })
    }

    console.log(`Found user: ${user.email} (ID: ${user.id})`)
    console.log('Deleting user and all related records...')

    // Delete the user (cascades to related records)
    await prisma.user.delete({
      where: { id: user.id },
    })

    console.log('✅ User deleted successfully!')

    return NextResponse.json({
      message: 'User reset successfully! Now visit /api/auth/sync to recreate your account with a username.',
      deletedUser: {
        email: user.email,
        clerkId: userId
      }
    })
  } catch (error) {
    console.error('Error resetting user:', error)
    return NextResponse.json({
      error: 'Failed to reset user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the current user from database
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Fetch user's plots
    const plots = await prisma.plot.findMany({
      where: {
        ownerId: currentUser.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        bookings: {
          where: {
            status: {
              in: ['CONFIRMED', 'ACTIVE'],
            },
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    })

    return NextResponse.json(plots)
  } catch (error) {
    console.error('Error fetching user plots:', error)
    return NextResponse.json(
      { error: 'Failed to fetch plots' },
      { status: 500 }
    )
  }
}

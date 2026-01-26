import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
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

    // Simple query - no includes
    const plots = await prisma.plot.findMany({
      where: { ownerId: currentUser.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(plots)
  } catch (error) {
    console.error('[MY-PLOTS-V2] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch plots' },
      { status: 500 }
    )
  }
}

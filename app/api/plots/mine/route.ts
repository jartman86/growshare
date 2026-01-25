import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureUser } from '@/lib/ensure-user'

export async function GET() {
  try {
    const currentUser = await ensureUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const plots = await prisma.plot.findMany({
      where: {
        ownerId: currentUser.id,
      },
      select: {
        id: true,
        title: true,
        status: true,
        images: true,
        city: true,
        state: true,
        pricePerMonth: true,
        acreage: true,
      },
      orderBy: {
        createdAt: 'desc',
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

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureUser } from '@/lib/ensure-user'

// Get unread notification count
export async function GET(request: NextRequest) {
  try {
    // Get or create user in database (auto-sync from Clerk)
    const currentUser = await ensureUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const unreadCount = await prisma.notification.count({
      where: {
        userId: currentUser.id,
        isRead: false,
      },
    })

    return NextResponse.json({ count: unreadCount })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch unread count' },
      { status: 500 }
    )
  }
}

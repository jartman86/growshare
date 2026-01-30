import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ensureUser } from '@/lib/ensure-user'

interface RouteParams {
  params: Promise<{ slug: string }>
}

// Join a group
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const currentUser = await ensureUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params

    const group = await prisma.communityGroup.findUnique({
      where: { slug },
      include: {
        members: {
          where: { userId: currentUser.id },
        },
      },
    })

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    // Check if already a member
    if (group.members.length > 0) {
      return NextResponse.json({ error: 'You are already a member of this group' }, { status: 400 })
    }

    // For private groups that require approval, we could implement a request system
    // For now, just add them as a member
    const membership = await prisma.groupMember.create({
      data: {
        groupId: group.id,
        userId: currentUser.id,
        role: 'MEMBER',
      },
    })

    // Award points for joining a group
    try {
      await prisma.userActivity.create({
        data: {
          userId: currentUser.id,
          type: 'GROUP_JOINED',
          title: 'Joined a community group',
          description: `Joined ${group.name}`,
          points: 10,
          metadata: { groupId: group.id, groupName: group.name },
        },
      })

      await prisma.user.update({
        where: { id: currentUser.id },
        data: { totalPoints: { increment: 10 } },
      })
    } catch {
      // Failed to award points, but membership was created successfully
    }

    return NextResponse.json({
      success: true,
      membership: {
        role: membership.role,
        joinedAt: membership.joinedAt.toISOString(),
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to join group' }, { status: 500 })
  }
}

// Leave a group
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const currentUser = await ensureUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params

    const group = await prisma.communityGroup.findUnique({
      where: { slug },
      include: {
        members: {
          where: { userId: currentUser.id },
        },
        _count: {
          select: { members: true },
        },
      },
    })

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    const membership = group.members[0]
    if (!membership) {
      return NextResponse.json({ error: 'You are not a member of this group' }, { status: 400 })
    }

    // Prevent the last admin from leaving
    if (membership.role === 'ADMIN') {
      const adminCount = await prisma.groupMember.count({
        where: { groupId: group.id, role: 'ADMIN' },
      })
      if (adminCount === 1) {
        return NextResponse.json({
          error: 'You cannot leave as you are the only admin. Please promote another member first.',
        }, { status: 400 })
      }
    }

    await prisma.groupMember.delete({
      where: {
        groupId_userId: {
          groupId: group.id,
          userId: currentUser.id,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to leave group' }, { status: 500 })
  }
}

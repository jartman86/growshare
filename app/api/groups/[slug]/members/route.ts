import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ensureUser } from '@/lib/ensure-user'

interface RouteParams {
  params: Promise<{ slug: string }>
}

// Get all members of a group
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')

    const group = await prisma.communityGroup.findUnique({
      where: { slug },
    })

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    const members = await prisma.groupMember.findMany({
      where: {
        groupId: group.id,
        ...(role && { role: role.toUpperCase() as 'ADMIN' | 'MODERATOR' | 'MEMBER' }),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            location: true,
          },
        },
      },
      orderBy: [
        { role: 'asc' },
        { joinedAt: 'asc' },
      ],
    })

    const formattedMembers = members.map(m => ({
      id: m.user.id,
      name: `${m.user.firstName || ''} ${m.user.lastName || ''}`.trim() || 'Member',
      avatar: m.user.avatar,
      location: m.user.location,
      role: m.role.toLowerCase(),
      joinedAt: m.joinedAt.toISOString(),
    }))

    return NextResponse.json({
      members: formattedMembers,
      total: formattedMembers.length,
    })
  } catch (error) {
    console.error('Error fetching members:', error)
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
  }
}

// Update a member's role (admin only)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const currentUser = await ensureUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params
    const body = await request.json()
    const { userId, role } = body

    if (!userId || !role) {
      return NextResponse.json({ error: 'userId and role are required' }, { status: 400 })
    }

    const validRoles = ['ADMIN', 'MODERATOR', 'MEMBER']
    if (!validRoles.includes(role.toUpperCase())) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

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

    // Check if current user is admin
    const currentMembership = group.members[0]
    if (!currentMembership || currentMembership.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only admins can change member roles' }, { status: 403 })
    }

    // Check target member exists
    const targetMembership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: group.id,
          userId,
        },
      },
    })

    if (!targetMembership) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    // Prevent demoting the last admin
    if (targetMembership.role === 'ADMIN' && role.toUpperCase() !== 'ADMIN') {
      const adminCount = await prisma.groupMember.count({
        where: { groupId: group.id, role: 'ADMIN' },
      })
      if (adminCount === 1) {
        return NextResponse.json({
          error: 'Cannot demote the last admin. Promote another member first.',
        }, { status: 400 })
      }
    }

    const updatedMembership = await prisma.groupMember.update({
      where: {
        groupId_userId: {
          groupId: group.id,
          userId,
        },
      },
      data: { role: role.toUpperCase() },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      member: {
        id: updatedMembership.user.id,
        name: `${updatedMembership.user.firstName || ''} ${updatedMembership.user.lastName || ''}`.trim(),
        role: updatedMembership.role.toLowerCase(),
      },
    })
  } catch (error) {
    console.error('Error updating member role:', error)
    return NextResponse.json({ error: 'Failed to update member role' }, { status: 500 })
  }
}

// Remove a member (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const currentUser = await ensureUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

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

    // Check if current user is admin or moderator
    const currentMembership = group.members[0]
    if (!currentMembership || (currentMembership.role !== 'ADMIN' && currentMembership.role !== 'MODERATOR')) {
      return NextResponse.json({ error: 'Only admins and moderators can remove members' }, { status: 403 })
    }

    // Check target member exists
    const targetMembership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: group.id,
          userId,
        },
      },
    })

    if (!targetMembership) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    // Moderators cannot remove admins
    if (currentMembership.role === 'MODERATOR' && targetMembership.role === 'ADMIN') {
      return NextResponse.json({ error: 'Moderators cannot remove admins' }, { status: 403 })
    }

    // Cannot remove yourself (use leave endpoint)
    if (userId === currentUser.id) {
      return NextResponse.json({ error: 'Use the leave endpoint to remove yourself' }, { status: 400 })
    }

    await prisma.groupMember.delete({
      where: {
        groupId_userId: {
          groupId: group.id,
          userId,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing member:', error)
    return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 })
  }
}

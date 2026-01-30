import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ensureUser } from '@/lib/ensure-user'
import { auth } from '@clerk/nextjs/server'

interface RouteParams {
  params: Promise<{ slug: string }>
}

// Get single group by slug
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params
    const { userId: clerkId } = await auth()

    // Get current user if logged in
    let currentUserId: string | null = null
    if (clerkId) {
      const user = await prisma.user.findUnique({
        where: { clerkId },
        select: { id: true },
      })
      currentUserId = user?.id || null
    }

    const group = await prisma.communityGroup.findUnique({
      where: { slug },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
          orderBy: [
            { role: 'asc' }, // ADMINs first, then MODERATORs, then MEMBERs
            { joinedAt: 'asc' },
          ],
          take: 20,
        },
        events: {
          where: {
            startTime: { gte: new Date() },
          },
          orderBy: { startTime: 'asc' },
          take: 5,
          include: {
            host: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
            _count: {
              select: { attendees: true },
            },
          },
        },
        posts: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            events: true,
            posts: true,
          },
        },
      },
    })

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    // Check if group is private and user is not a member
    if (!group.isPublic && currentUserId) {
      const isMember = group.members.some(m => m.userId === currentUserId)
      if (!isMember) {
        return NextResponse.json({ error: 'This group is private' }, { status: 403 })
      }
    }

    // Get user's membership status
    let userMembership = null
    if (currentUserId) {
      const membership = await prisma.groupMember.findUnique({
        where: {
          groupId_userId: {
            groupId: group.id,
            userId: currentUserId,
          },
        },
      })
      userMembership = membership ? {
        role: membership.role,
        joinedAt: membership.joinedAt.toISOString(),
      } : null
    }

    // Format leaders (admins and moderators)
    const leaders = group.members
      .filter(m => m.role === 'ADMIN' || m.role === 'MODERATOR')
      .map(m => ({
        id: m.user.id,
        name: `${m.user.firstName || ''} ${m.user.lastName || ''}`.trim() || 'Member',
        avatar: m.user.avatar,
        role: m.role.toLowerCase(),
      }))

    // Format response
    const response = {
      id: group.id,
      name: group.name,
      slug: group.slug,
      description: group.description,
      coverImage: group.coverImage || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800',
      icon: group.icon,
      location: {
        city: group.city,
        state: group.state,
        country: group.country,
      },
      isPublic: group.isPublic,
      requiresApproval: group.requiresApproval,
      tags: group.tags,
      memberCount: group._count.members,
      eventCount: group._count.events,
      postCount: group._count.posts,
      creator: {
        id: group.creator.id,
        name: `${group.creator.firstName || ''} ${group.creator.lastName || ''}`.trim() || 'Creator',
        avatar: group.creator.avatar,
      },
      leaders,
      upcomingEvents: group.events.map(e => ({
        id: e.id,
        title: e.title,
        description: e.description,
        location: e.location,
        startTime: e.startTime.toISOString(),
        endTime: e.endTime?.toISOString(),
        attendeeCount: e._count.attendees,
        maxAttendees: e.maxAttendees,
        host: {
          id: e.host.id,
          name: `${e.host.firstName || ''} ${e.host.lastName || ''}`.trim(),
          avatar: e.host.avatar,
        },
      })),
      recentPosts: group.posts.map(p => ({
        id: p.id,
        content: p.content,
        images: p.images,
        createdAt: p.createdAt.toISOString(),
        author: {
          id: p.author.id,
          name: `${p.author.firstName || ''} ${p.author.lastName || ''}`.trim(),
          avatar: p.author.avatar,
        },
      })),
      userMembership,
      createdAt: group.createdAt.toISOString(),
      updatedAt: group.updatedAt.toISOString(),
    }

    return NextResponse.json(response)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch group' }, { status: 500 })
  }
}

// Update group settings (admin only)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const currentUser = await ensureUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params

    // Check if user is admin of this group
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

    const membership = group.members[0]
    if (!membership || membership.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only group admins can update settings' }, { status: 403 })
    }

    const body = await request.json()
    const allowedFields = [
      'name', 'description', 'coverImage', 'icon',
      'city', 'state', 'country',
      'isPublic', 'requiresApproval', 'tags',
    ]

    const updateData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    // If name is being updated, regenerate slug
    if (updateData.name && updateData.name !== group.name) {
      const baseSlug = (updateData.name as string)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      let newSlug = baseSlug
      let counter = 1
      while (await prisma.communityGroup.findFirst({
        where: { slug: newSlug, id: { not: group.id } },
      })) {
        newSlug = `${baseSlug}-${counter}`
        counter++
      }
      updateData.slug = newSlug
    }

    const updatedGroup = await prisma.communityGroup.update({
      where: { id: group.id },
      data: updateData,
    })

    return NextResponse.json(updatedGroup)
  } catch {
    return NextResponse.json({ error: 'Failed to update group' }, { status: 500 })
  }
}

// Delete group (admin only)
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
      },
    })

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    // Only the creator or an admin can delete
    const membership = group.members[0]
    const isCreator = group.creatorId === currentUser.id
    const isAdmin = membership?.role === 'ADMIN'

    if (!isCreator && !isAdmin) {
      return NextResponse.json({ error: 'Only the creator or an admin can delete this group' }, { status: 403 })
    }

    await prisma.communityGroup.delete({
      where: { id: group.id },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete group' }, { status: 500 })
  }
}

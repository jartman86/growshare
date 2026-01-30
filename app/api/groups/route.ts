import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ensureUser } from '@/lib/ensure-user'

// Get all groups
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const location = searchParams.get('location')
    const sortBy = searchParams.get('sortBy') || 'members'

    const groups = await prisma.communityGroup.findMany({
      where: {
        isPublic: true,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { tags: { hasSome: [search] } },
          ],
        }),
        ...(location && {
          OR: [
            { city: { equals: location, mode: 'insensitive' } },
            { state: { equals: location, mode: 'insensitive' } },
          ],
        }),
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
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
      orderBy: sortBy === 'name' ? { name: 'asc' } :
               sortBy === 'activity' ? { updatedAt: 'desc' } :
               { members: { _count: 'desc' } },
    })

    const formattedGroups = groups.map((group) => ({
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
      creator: group.creator,
      createdAt: group.createdAt.toISOString(),
      updatedAt: group.updatedAt.toISOString(),
    }))

    return NextResponse.json(formattedGroups)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 })
  }
}

// Create a new group
export async function POST(request: NextRequest) {
  try {
    const currentUser = await ensureUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      description,
      coverImage,
      icon,
      city,
      state,
      country,
      isPublic,
      requiresApproval,
      tags,
    } = body

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      )
    }

    // Generate slug from name
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    // Check for existing slug and add number if needed
    let slug = baseSlug
    let counter = 1
    while (await prisma.communityGroup.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const group = await prisma.communityGroup.create({
      data: {
        name,
        slug,
        description,
        coverImage,
        icon,
        city,
        state,
        country: country || 'USA',
        isPublic: isPublic ?? true,
        requiresApproval: requiresApproval ?? false,
        tags: tags || [],
        creatorId: currentUser.id,
        members: {
          create: {
            userId: currentUser.id,
            role: 'ADMIN',
          },
        },
      },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
      },
    })

    return NextResponse.json(group, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 })
  }
}

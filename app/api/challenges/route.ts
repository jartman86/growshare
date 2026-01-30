import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ensureUser } from '@/lib/ensure-user'

// Get all challenges
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const difficulty = searchParams.get('difficulty')
    const season = searchParams.get('season')
    const status = searchParams.get('status')

    const now = new Date()

    const challenges = await prisma.challenge.findMany({
      where: {
        status: { not: 'DRAFT' },
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { tags: { hasSome: [search] } },
          ],
        }),
        ...(difficulty && difficulty !== 'all' && { difficulty: difficulty as any }),
        ...(season && season !== 'all' && { season: season as any }),
        ...(status === 'active' && {
          startDate: { lte: now },
          endDate: { gte: now },
          status: 'ACTIVE',
        }),
        ...(status === 'upcoming' && {
          startDate: { gt: now },
          status: { in: ['ACTIVE', 'UPCOMING'] },
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
        badge: {
          select: {
            id: true,
            name: true,
            icon: true,
            tier: true,
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
      orderBy: { startDate: 'asc' },
    })

    const formattedChallenges = challenges.map((challenge) => ({
      id: challenge.id,
      title: challenge.title,
      slug: challenge.slug,
      description: challenge.description,
      longDescription: challenge.longDescription,
      coverImage: challenge.coverImage || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
      difficulty: challenge.difficulty.toLowerCase(),
      season: challenge.season.toLowerCase().replace('_', '-'),
      status: challenge.status.toLowerCase(),
      startDate: challenge.startDate.toISOString(),
      endDate: challenge.endDate.toISOString(),
      requirements: challenge.requirements,
      pointsReward: challenge.pointsReward,
      badge: challenge.badge,
      tags: challenge.tags,
      maxParticipants: challenge.maxParticipants,
      participants: challenge._count.participants,
      creator: challenge.creator,
      createdAt: challenge.createdAt.toISOString(),
    }))

    return NextResponse.json(formattedChallenges)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 })
  }
}

// Create a new challenge (admin only in real app)
export async function POST(request: NextRequest) {
  try {
    const currentUser = await ensureUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      longDescription,
      coverImage,
      difficulty,
      season,
      startDate,
      endDate,
      requirements,
      pointsReward,
      badgeId,
      tags,
      maxParticipants,
    } = body

    if (!title || !description || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Title, description, and dates are required' },
        { status: 400 }
      )
    }

    // Generate slug from title
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    let slug = baseSlug
    let counter = 1
    while (await prisma.challenge.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const challenge = await prisma.challenge.create({
      data: {
        title,
        slug,
        description,
        longDescription,
        coverImage,
        difficulty: difficulty?.toUpperCase() || 'BEGINNER',
        season: season?.toUpperCase().replace('-', '_') || 'YEAR_ROUND',
        status: new Date(startDate) <= new Date() ? 'ACTIVE' : 'UPCOMING',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        requirements,
        pointsReward: pointsReward || 100,
        badgeId,
        tags: tags || [],
        maxParticipants,
        creatorId: currentUser.id,
      },
    })

    return NextResponse.json(challenge, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create challenge' }, { status: 500 })
  }
}

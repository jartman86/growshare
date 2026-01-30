import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

interface RouteParams {
  params: Promise<{ slug: string }>
}

// Get single challenge by slug
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

    const challenge = await prisma.challenge.findUnique({
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
        badge: {
          select: {
            id: true,
            name: true,
            description: true,
            icon: true,
            tier: true,
          },
        },
        participants: {
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
            { status: 'asc' }, // COMPLETED first
            { progress: 'desc' },
          ],
          take: 20,
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
    })

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    // Get user's participation if logged in
    let userParticipation = null
    if (currentUserId) {
      const participation = await prisma.challengeParticipant.findUnique({
        where: {
          challengeId_userId: {
            challengeId: challenge.id,
            userId: currentUserId,
          },
        },
      })
      if (participation) {
        userParticipation = {
          status: participation.status.toLowerCase(),
          progress: participation.progress,
          progressData: participation.progressData,
          joinedAt: participation.joinedAt.toISOString(),
          completedAt: participation.completedAt?.toISOString(),
        }
      }
    }

    // Calculate stats
    const completedCount = await prisma.challengeParticipant.count({
      where: { challengeId: challenge.id, status: 'COMPLETED' },
    })

    // Determine if challenge is active
    const now = new Date()
    const isActive = challenge.status === 'ACTIVE' &&
      challenge.startDate <= now &&
      challenge.endDate >= now

    const isUpcoming = challenge.startDate > now

    // Parse requirements - could be array or object
    let tasks: { id: string; title: string; description: string; required: boolean; points: number }[] = []
    if (challenge.requirements) {
      const reqs = challenge.requirements as any
      if (Array.isArray(reqs)) {
        tasks = reqs.map((req, index) => ({
          id: `task-${index + 1}`,
          title: typeof req === 'string' ? req : req.title || `Task ${index + 1}`,
          description: typeof req === 'string' ? '' : req.description || '',
          required: typeof req === 'string' ? true : req.required !== false,
          points: typeof req === 'string' ? 0 : req.points || 0,
        }))
      }
    }

    // Format leaderboard
    const leaderboard = challenge.participants
      .filter(p => p.status === 'COMPLETED' || p.progress > 0)
      .map(p => ({
        id: p.user.id,
        name: `${p.user.firstName || ''} ${p.user.lastName || ''}`.trim() || 'Participant',
        avatar: p.user.avatar,
        progress: p.progress,
        status: p.status.toLowerCase(),
        completedAt: p.completedAt?.toISOString(),
      }))

    const response = {
      id: challenge.id,
      title: challenge.title,
      slug: challenge.slug,
      description: challenge.description,
      longDescription: challenge.longDescription,
      coverImage: challenge.coverImage || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
      difficulty: challenge.difficulty.toLowerCase(),
      season: challenge.season.toLowerCase().replace('_', '-'),
      status: challenge.status.toLowerCase(),
      isActive,
      isUpcoming,
      startDate: challenge.startDate.toISOString(),
      endDate: challenge.endDate.toISOString(),
      tasks,
      pointsReward: challenge.pointsReward,
      badge: challenge.badge,
      tags: challenge.tags,
      maxParticipants: challenge.maxParticipants,
      stats: {
        participants: challenge._count.participants,
        completed: completedCount,
        completionRate: challenge._count.participants > 0
          ? Math.round((completedCount / challenge._count.participants) * 100)
          : 0,
      },
      leaderboard,
      creator: {
        id: challenge.creator.id,
        name: `${challenge.creator.firstName || ''} ${challenge.creator.lastName || ''}`.trim() || 'Creator',
        avatar: challenge.creator.avatar,
      },
      userParticipation,
      createdAt: challenge.createdAt.toISOString(),
    }

    return NextResponse.json(response)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch challenge' }, { status: 500 })
  }
}

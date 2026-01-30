import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ensureUser } from '@/lib/ensure-user'

interface RouteParams {
  params: Promise<{ slug: string }>
}

// Join a challenge
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const currentUser = await ensureUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params

    const challenge = await prisma.challenge.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { participants: true },
        },
      },
    })

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    // Check if challenge is joinable
    const now = new Date()
    if (challenge.status !== 'ACTIVE' && challenge.status !== 'UPCOMING') {
      return NextResponse.json({ error: 'This challenge is not accepting participants' }, { status: 400 })
    }

    if (challenge.endDate < now) {
      return NextResponse.json({ error: 'This challenge has ended' }, { status: 400 })
    }

    // Check max participants
    if (challenge.maxParticipants && challenge._count.participants >= challenge.maxParticipants) {
      return NextResponse.json({ error: 'This challenge is full' }, { status: 400 })
    }

    // Check if already participating
    const existing = await prisma.challengeParticipant.findUnique({
      where: {
        challengeId_userId: {
          challengeId: challenge.id,
          userId: currentUser.id,
        },
      },
    })

    if (existing) {
      return NextResponse.json({ error: 'You are already participating in this challenge' }, { status: 400 })
    }

    // Create participation
    const participation = await prisma.challengeParticipant.create({
      data: {
        challengeId: challenge.id,
        userId: currentUser.id,
        status: 'JOINED',
        progress: 0,
        progressData: { completedTasks: [] },
      },
    })

    // Award points for joining
    try {
      await prisma.userActivity.create({
        data: {
          userId: currentUser.id,
          type: 'CHALLENGE_JOINED',
          title: 'Joined a challenge',
          description: `Joined ${challenge.title}`,
          points: 15,
          metadata: { challengeId: challenge.id, challengeTitle: challenge.title },
        },
      })

      await prisma.user.update({
        where: { id: currentUser.id },
        data: { totalPoints: { increment: 15 } },
      })
    } catch {
      // Failed to award points, but participation was created successfully
    }

    return NextResponse.json({
      success: true,
      participation: {
        status: participation.status.toLowerCase(),
        progress: participation.progress,
        progressData: participation.progressData,
        joinedAt: participation.joinedAt.toISOString(),
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to join challenge' }, { status: 500 })
  }
}

// Leave/drop a challenge
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const currentUser = await ensureUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params

    const challenge = await prisma.challenge.findUnique({
      where: { slug },
    })

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    const participation = await prisma.challengeParticipant.findUnique({
      where: {
        challengeId_userId: {
          challengeId: challenge.id,
          userId: currentUser.id,
        },
      },
    })

    if (!participation) {
      return NextResponse.json({ error: 'You are not participating in this challenge' }, { status: 400 })
    }

    // Can't leave if already completed
    if (participation.status === 'COMPLETED') {
      return NextResponse.json({ error: 'You cannot leave a completed challenge' }, { status: 400 })
    }

    // Mark as dropped rather than deleting (for tracking)
    await prisma.challengeParticipant.update({
      where: { id: participation.id },
      data: { status: 'DROPPED' },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to leave challenge' }, { status: 500 })
  }
}

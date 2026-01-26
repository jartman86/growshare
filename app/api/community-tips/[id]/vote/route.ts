import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ensureUser } from '@/lib/ensure-user'

interface RouteParams {
  params: Promise<{ id: string }>
}

// POST /api/community-tips/[id]/vote - Vote on a tip
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId: clerkId } = await auth()

    if (!clerkId) {
      return NextResponse.json(
        { error: 'You must be signed in to vote' },
        { status: 401 }
      )
    }

    const user = await ensureUser()
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { value } = body // 1 for upvote, -1 for downvote, 0 to remove vote

    if (value !== 1 && value !== -1 && value !== 0) {
      return NextResponse.json(
        { error: 'Vote value must be 1, -1, or 0' },
        { status: 400 }
      )
    }

    const tip = await prisma.communityTip.findUnique({
      where: { id },
    })

    if (!tip) {
      return NextResponse.json(
        { error: 'Tip not found' },
        { status: 404 }
      )
    }

    // Can't vote on your own tip
    if (tip.authorId === user.id) {
      return NextResponse.json(
        { error: 'You cannot vote on your own tip' },
        { status: 400 }
      )
    }

    // Check if user has already voted
    const existingVote = await prisma.communityTipVote.findUnique({
      where: {
        tipId_userId: {
          tipId: id,
          userId: user.id,
        },
      },
    })

    let upvoteDelta = 0
    let downvoteDelta = 0

    if (value === 0) {
      // Remove vote
      if (existingVote) {
        if (existingVote.value === 1) upvoteDelta = -1
        if (existingVote.value === -1) downvoteDelta = -1

        await prisma.communityTipVote.delete({
          where: { id: existingVote.id },
        })
      }
    } else if (existingVote) {
      // Update existing vote
      if (existingVote.value !== value) {
        // Switching vote
        if (existingVote.value === 1 && value === -1) {
          upvoteDelta = -1
          downvoteDelta = 1
        } else if (existingVote.value === -1 && value === 1) {
          upvoteDelta = 1
          downvoteDelta = -1
        }

        await prisma.communityTipVote.update({
          where: { id: existingVote.id },
          data: { value },
        })
      }
      // If same vote, do nothing
    } else {
      // Create new vote
      if (value === 1) upvoteDelta = 1
      if (value === -1) downvoteDelta = 1

      await prisma.communityTipVote.create({
        data: {
          tipId: id,
          userId: user.id,
          value,
        },
      })
    }

    // Update tip vote counts
    const updatedTip = await prisma.communityTip.update({
      where: { id },
      data: {
        upvotes: { increment: upvoteDelta },
        downvotes: { increment: downvoteDelta },
      },
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
    })

    // Get user's current vote
    const userVote = await prisma.communityTipVote.findUnique({
      where: {
        tipId_userId: {
          tipId: id,
          userId: user.id,
        },
      },
    })

    return NextResponse.json({
      ...updatedTip,
      userVote: userVote?.value || 0,
    })
  } catch (error) {
    console.error('Error voting on tip:', error)
    return NextResponse.json(
      { error: 'Failed to vote on tip' },
      { status: 500 }
    )
  }
}

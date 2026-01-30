import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// POST /api/users/[userId]/follow - Follow a user
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId: targetUserId } = await params

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Can't follow yourself
    if (currentUser.id === targetUserId) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      )
    }

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'Target user not found' },
        { status: 404 }
      )
    }

    // Create follow relationship
    // Let database unique constraint handle duplicate detection (prevents race condition)
    try {
      const follow = await prisma.follow.create({
        data: {
          followerId: currentUser.id,
          followingId: targetUserId,
        },
      })

      // Create activity for the followed user
      await prisma.userActivity.create({
        data: {
          userId: targetUserId,
          type: 'NEW_FOLLOWER',
          title: 'New Follower',
          description: `${currentUser.firstName} ${currentUser.lastName} started following you`,
          points: 5,
        },
      })

      return NextResponse.json({
        success: true,
        follow,
      })
    } catch (createError: any) {
      // Check if error is due to unique constraint violation
      if (createError.code === 'P2002') {
        return NextResponse.json(
          { error: 'Already following this user' },
          { status: 400 }
        )
      }
      throw createError // Re-throw if it's a different error
    }
  } catch {
    return NextResponse.json(
      { error: 'Failed to follow user' },
      { status: 500 }
    )
  }
}

// DELETE /api/users/[userId]/follow - Unfollow a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId: targetUserId } = await params

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Delete follow relationship
    const deletedFollow = await prisma.follow.deleteMany({
      where: {
        followerId: currentUser.id,
        followingId: targetUserId,
      },
    })

    if (deletedFollow.count === 0) {
      return NextResponse.json(
        { error: 'Not following this user' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Unfollowed successfully',
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to unfollow user' },
      { status: 500 }
    )
  }
}

// GET /api/users/[userId]/follow - Check if current user follows target user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId: targetUserId } = await params

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUser.id,
          followingId: targetUserId,
        },
      },
    })

    return NextResponse.json({
      isFollowing: !!follow,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to check follow status' },
      { status: 500 }
    )
  }
}

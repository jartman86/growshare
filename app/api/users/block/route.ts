import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// GET - Get list of blocked users
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const blockedUsers = await prisma.blockedUser.findMany({
      where: { blockerId: currentUser.id },
      include: {
        blocked: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(blockedUsers)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch blocked users' },
      { status: 500 }
    )
  }
}

// POST - Block a user
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { blockedUserId, reason } = body

    if (!blockedUserId) {
      return NextResponse.json(
        { error: 'User ID to block is required' },
        { status: 400 }
      )
    }

    // Can't block yourself
    if (blockedUserId === currentUser.id) {
      return NextResponse.json(
        { error: 'You cannot block yourself' },
        { status: 400 }
      )
    }

    // Check if user exists
    const userToBlock = await prisma.user.findUnique({
      where: { id: blockedUserId },
    })

    if (!userToBlock) {
      return NextResponse.json(
        { error: 'User to block not found' },
        { status: 404 }
      )
    }

    // Check if already blocked
    const existingBlock = await prisma.blockedUser.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId: currentUser.id,
          blockedId: blockedUserId,
        },
      },
    })

    if (existingBlock) {
      return NextResponse.json(
        { error: 'User is already blocked' },
        { status: 400 }
      )
    }

    const blockedUser = await prisma.blockedUser.create({
      data: {
        blockerId: currentUser.id,
        blockedId: blockedUserId,
        reason: reason || null,
      },
      include: {
        blocked: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'User blocked successfully',
      blockedUser,
    }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to block user' },
      { status: 500 }
    )
  }
}

// DELETE - Unblock a user
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const blockedUserId = searchParams.get('userId')

    if (!blockedUserId) {
      return NextResponse.json(
        { error: 'User ID to unblock is required' },
        { status: 400 }
      )
    }

    const existingBlock = await prisma.blockedUser.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId: currentUser.id,
          blockedId: blockedUserId,
        },
      },
    })

    if (!existingBlock) {
      return NextResponse.json(
        { error: 'User is not blocked' },
        { status: 404 }
      )
    }

    await prisma.blockedUser.delete({
      where: { id: existingBlock.id },
    })

    return NextResponse.json({
      success: true,
      message: 'User unblocked successfully',
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to unblock user' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ topicId: string }> }
) {
  try {
    const { topicId } = await params

    // Increment view count
    await prisma.forumTopic.update({
      where: { id: topicId },
      data: { views: { increment: 1 } },
    })

    const topic = await prisma.forumTopic.findUnique({
      where: { id: topicId },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            isVerified: true,
            bio: true,
            totalPoints: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                isVerified: true,
              },
            },
            votes: {
              select: { value: true },
            },
          },
          orderBy: [
            { isAccepted: 'desc' },
            { createdAt: 'asc' },
          ],
        },
        votes: {
          select: { value: true },
        },
      },
    })

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      )
    }

    // Calculate scores
    const topicScore = topic.votes.reduce((sum, vote) => sum + vote.value, 0)
    const repliesWithScores = topic.replies.map((reply) => {
      const score = reply.votes.reduce((sum, vote) => sum + vote.value, 0)
      return {
        ...reply,
        score,
        votes: undefined,
      }
    })

    return NextResponse.json({
      ...topic,
      score: topicScore,
      votes: undefined,
      replies: repliesWithScores,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch topic' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ topicId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { topicId } = await params

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const existingTopic = await prisma.forumTopic.findUnique({
      where: { id: topicId },
    })

    if (!existingTopic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      )
    }

    // Only author can edit content, admin can pin/lock
    const isAuthor = existingTopic.authorId === currentUser.id
    const body = await request.json()

    const updateData: any = {}

    // Author can edit these
    if (isAuthor) {
      if (body.title !== undefined) updateData.title = body.title
      if (body.content !== undefined) updateData.content = body.content
      if (body.tags !== undefined) updateData.tags = body.tags
      if (body.isSolved !== undefined) updateData.isSolved = body.isSolved
    }

    // Admin only (for now, allow author)
    if (isAuthor) {
      if (body.isPinned !== undefined) updateData.isPinned = body.isPinned
      if (body.isLocked !== undefined) updateData.isLocked = body.isLocked
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    const topic = await prisma.forumTopic.update({
      where: { id: topicId },
      data: updateData,
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

    return NextResponse.json(topic)
  } catch {
    return NextResponse.json(
      { error: 'Failed to update topic' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ topicId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { topicId } = await params

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const existingTopic = await prisma.forumTopic.findUnique({
      where: { id: topicId },
    })

    if (!existingTopic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      )
    }

    if (existingTopic.authorId !== currentUser.id) {
      return NextResponse.json(
        { error: 'You can only delete your own topics' },
        { status: 403 }
      )
    }

    await prisma.forumTopic.delete({
      where: { id: topicId },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete topic' },
      { status: 500 }
    )
  }
}

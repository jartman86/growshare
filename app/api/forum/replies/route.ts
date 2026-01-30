import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

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

    // Validate required fields
    if (!body.topicId) {
      return NextResponse.json(
        { error: 'Topic ID is required' },
        { status: 400 }
      )
    }

    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Check topic exists and is not locked
    const topic = await prisma.forumTopic.findUnique({
      where: { id: body.topicId },
      include: { author: true },
    })

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      )
    }

    if (topic.isLocked) {
      return NextResponse.json(
        { error: 'This topic is locked and cannot receive new replies' },
        { status: 400 }
      )
    }

    // If replying to another reply, verify parent exists
    if (body.parentId) {
      const parentReply = await prisma.forumReply.findUnique({
        where: { id: body.parentId },
      })

      if (!parentReply || parentReply.topicId !== body.topicId) {
        return NextResponse.json(
          { error: 'Parent reply not found' },
          { status: 404 }
        )
      }
    }

    const reply = await prisma.forumReply.create({
      data: {
        topicId: body.topicId,
        authorId: currentUser.id,
        parentId: body.parentId || null,
        content: body.content,
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

    // Notify topic author if not replying to own topic
    if (topic.authorId !== currentUser.id) {
      await createNotification({
        userId: topic.authorId,
        type: 'NEW_MESSAGE',
        title: 'New Reply to Your Topic',
        content: `${currentUser.firstName} ${currentUser.lastName} replied to "${topic.title}"`,
        link: `/community/${topic.id}`,
        metadata: { topicId: topic.id, replyId: reply.id },
      })
    }

    // Create activity
    await prisma.userActivity.create({
      data: {
        userId: currentUser.id,
        type: 'POST_CREATED',
        title: 'Replied to forum topic',
        description: topic.title,
        points: 2,
      },
    })

    // Add points
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { totalPoints: { increment: 2 } },
    })

    return NextResponse.json(reply, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create reply' },
      { status: 500 }
    )
  }
}

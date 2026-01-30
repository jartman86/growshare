import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ replyId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { replyId } = await params

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const existingReply = await prisma.forumReply.findUnique({
      where: { id: replyId },
      include: {
        topic: true,
      },
    })

    if (!existingReply) {
      return NextResponse.json(
        { error: 'Reply not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const updateData: any = {}

    // Author can edit content
    if (existingReply.authorId === currentUser.id) {
      if (body.content !== undefined) updateData.content = body.content
    }

    // Topic author can mark as accepted
    if (existingReply.topic.authorId === currentUser.id) {
      if (body.isAccepted !== undefined) {
        updateData.isAccepted = body.isAccepted

        // If accepting, mark topic as solved
        if (body.isAccepted) {
          await prisma.forumTopic.update({
            where: { id: existingReply.topicId },
            data: { isSolved: true },
          })
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    const reply = await prisma.forumReply.update({
      where: { id: replyId },
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

    return NextResponse.json(reply)
  } catch {
    return NextResponse.json(
      { error: 'Failed to update reply' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ replyId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { replyId } = await params

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const existingReply = await prisma.forumReply.findUnique({
      where: { id: replyId },
    })

    if (!existingReply) {
      return NextResponse.json(
        { error: 'Reply not found' },
        { status: 404 }
      )
    }

    if (existingReply.authorId !== currentUser.id) {
      return NextResponse.json(
        { error: 'You can only delete your own replies' },
        { status: 403 }
      )
    }

    await prisma.forumReply.delete({
      where: { id: replyId },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete reply' },
      { status: 500 }
    )
  }
}

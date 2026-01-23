import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

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
    const { topicId, replyId, value } = body

    // Validate vote value
    if (value !== 1 && value !== -1) {
      return NextResponse.json(
        { error: 'Vote value must be 1 (upvote) or -1 (downvote)' },
        { status: 400 }
      )
    }

    // Must vote on either topic or reply, not both
    if ((!topicId && !replyId) || (topicId && replyId)) {
      return NextResponse.json(
        { error: 'Must specify either topicId or replyId, not both' },
        { status: 400 }
      )
    }

    // Can't vote on own content
    if (topicId) {
      const topic = await prisma.forumTopic.findUnique({
        where: { id: topicId },
      })

      if (!topic) {
        return NextResponse.json(
          { error: 'Topic not found' },
          { status: 404 }
        )
      }

      if (topic.authorId === currentUser.id) {
        return NextResponse.json(
          { error: 'Cannot vote on your own topic' },
          { status: 400 }
        )
      }
    }

    if (replyId) {
      const reply = await prisma.forumReply.findUnique({
        where: { id: replyId },
      })

      if (!reply) {
        return NextResponse.json(
          { error: 'Reply not found' },
          { status: 404 }
        )
      }

      if (reply.authorId === currentUser.id) {
        return NextResponse.json(
          { error: 'Cannot vote on your own reply' },
          { status: 400 }
        )
      }
    }

    // Check for existing vote
    const existingVote = await prisma.forumVote.findFirst({
      where: {
        userId: currentUser.id,
        topicId: topicId || null,
        replyId: replyId || null,
      },
    })

    if (existingVote) {
      if (existingVote.value === value) {
        // Same vote - remove it (toggle off)
        await prisma.forumVote.delete({
          where: { id: existingVote.id },
        })
        return NextResponse.json({ action: 'removed', value: 0 })
      } else {
        // Different vote - update it
        const updatedVote = await prisma.forumVote.update({
          where: { id: existingVote.id },
          data: { value },
        })
        return NextResponse.json({ action: 'updated', value: updatedVote.value })
      }
    }

    // Create new vote
    const vote = await prisma.forumVote.create({
      data: {
        userId: currentUser.id,
        topicId: topicId || null,
        replyId: replyId || null,
        value,
      },
    })

    return NextResponse.json({ action: 'created', value: vote.value }, { status: 201 })
  } catch (error) {
    console.error('Error processing vote:', error)
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    )
  }
}

// Get user's votes for multiple items
export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams
    const topicIds = searchParams.get('topicIds')?.split(',').filter(Boolean)
    const replyIds = searchParams.get('replyIds')?.split(',').filter(Boolean)

    const where: any = {
      userId: currentUser.id,
    }

    if (topicIds && topicIds.length > 0) {
      where.topicId = { in: topicIds }
    }

    if (replyIds && replyIds.length > 0) {
      where.replyId = { in: replyIds }
    }

    const votes = await prisma.forumVote.findMany({
      where,
      select: {
        topicId: true,
        replyId: true,
        value: true,
      },
    })

    // Transform to a map for easy lookup
    const voteMap: Record<string, number> = {}
    for (const vote of votes) {
      const key = vote.topicId || vote.replyId
      if (key) {
        voteMap[key] = vote.value
      }
    }

    return NextResponse.json(voteMap)
  } catch (error) {
    console.error('Error fetching votes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch votes' },
      { status: 500 }
    )
  }
}

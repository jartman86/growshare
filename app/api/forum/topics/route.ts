import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const authorId = searchParams.get('authorId')
    const solved = searchParams.get('solved')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}

    if (category) {
      where.category = category
    }

    if (authorId) {
      where.authorId = authorId
    }

    if (solved === 'true') {
      where.isSolved = true
    } else if (solved === 'false') {
      where.isSolved = false
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ]
    }

    const [topics, total] = await Promise.all([
      prisma.forumTopic.findMany({
        where,
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
          _count: {
            select: { replies: true, votes: true },
          },
          votes: {
            select: { value: true },
          },
        },
        orderBy: [
          { isPinned: 'desc' },
          { createdAt: 'desc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.forumTopic.count({ where }),
    ])

    // Calculate vote scores
    const topicsWithScores = topics.map((topic) => {
      const score = topic.votes.reduce((sum, vote) => sum + vote.value, 0)
      return {
        ...topic,
        score,
        votes: undefined,
      }
    })

    return NextResponse.json({
      topics: topicsWithScores,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching forum topics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    )
  }
}

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
    if (!body.title || body.title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    if (!body.category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      )
    }

    const topic = await prisma.forumTopic.create({
      data: {
        authorId: currentUser.id,
        title: body.title,
        content: body.content,
        category: body.category,
        tags: body.tags || [],
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

    // Create activity
    await prisma.userActivity.create({
      data: {
        userId: currentUser.id,
        type: 'POST_CREATED',
        title: 'Created forum topic',
        description: topic.title,
        points: 5,
      },
    })

    // Add points
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { totalPoints: { increment: 5 } },
    })

    return NextResponse.json(topic, { status: 201 })
  } catch (error) {
    console.error('Error creating forum topic:', error)
    return NextResponse.json(
      { error: 'Failed to create topic' },
      { status: 500 }
    )
  }
}

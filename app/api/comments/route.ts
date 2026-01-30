import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import DOMPurify from 'isomorphic-dompurify'
import { rateLimit, getClientIdentifier, rateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'

// Get comments for a post
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    const searchParams = request.nextUrl.searchParams
    const postId = searchParams.get('postId')

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    // Check if post exists and user has access
    const post = await prisma.userPost.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: { id: true, clerkId: true, profileVisibility: true }
        }
      }
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Check access: public posts are accessible to all, private posts only to author
    if (post.author.profileVisibility === 'PRIVATE' && post.author.clerkId !== userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const comments = await prisma.postComment.findMany({
      where: { postId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(comments)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// Create a new comment
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limit: 30 comments per minute per user
    const rateLimitResult = rateLimit(
      getClientIdentifier(request, userId),
      RATE_LIMITS.mutation
    )
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult)
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { postId, content } = body

    if (!postId || !content) {
      return NextResponse.json(
        { error: 'Post ID and content are required' },
        { status: 400 }
      )
    }

    // Sanitize content to prevent XSS
    const sanitizedContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      ALLOWED_ATTR: ['href'],
    })

    if (sanitizedContent.length > 5000) {
      return NextResponse.json(
        { error: 'Comment too long (max 5000 characters)' },
        { status: 400 }
      )
    }

    // Check if post exists
    const post = await prisma.userPost.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const comment = await prisma.postComment.create({
      data: {
        postId,
        authorId: user.id,
        content: sanitizedContent,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    })

    return NextResponse.json(comment)
  } catch {
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}

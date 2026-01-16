import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// Helper function to validate URLs
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

// Get all posts or posts by a specific user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const username = searchParams.get('username')
    const type = searchParams.get('type')

    const where: any = {
      status: 'PUBLISHED',
    }

    if (username) {
      const user = await prisma.user.findUnique({
        where: { username },
        select: { id: true },
      })
      if (user) {
        where.authorId = user.id
      }
    }

    if (type) {
      where.type = type
    }

    const posts = await prisma.userPost.findMany({
      where,
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
      orderBy: { publishedAt: 'desc' },
      take: 20,
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// Create a new post
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const {
      title,
      content,
      excerpt,
      type,
      coverImage,
      images,
      videoUrl,
      tags,
      status,
    } = body

    // Validate required fields
    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Post title is required' },
        { status: 400 }
      )
    }

    if (title.length > 200) {
      return NextResponse.json(
        { error: 'Title cannot exceed 200 characters' },
        { status: 400 }
      )
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Post content is required' },
        { status: 400 }
      )
    }

    if (content.length > 100000) {
      return NextResponse.json(
        { error: 'Content cannot exceed 100,000 characters' },
        { status: 400 }
      )
    }

    if (excerpt && excerpt.length > 500) {
      return NextResponse.json(
        { error: 'Excerpt cannot exceed 500 characters' },
        { status: 400 }
      )
    }

    // Validate URLs if provided
    if (coverImage && !isValidUrl(coverImage)) {
      return NextResponse.json(
        { error: 'Invalid cover image URL' },
        { status: 400 }
      )
    }

    if (videoUrl && !isValidUrl(videoUrl)) {
      return NextResponse.json(
        { error: 'Invalid video URL' },
        { status: 400 }
      )
    }

    // Validate tags
    if (tags && Array.isArray(tags)) {
      if (tags.length > 10) {
        return NextResponse.json(
          { error: 'Cannot have more than 10 tags' },
          { status: 400 }
        )
      }
      for (const tag of tags) {
        if (typeof tag !== 'string' || tag.length > 50) {
          return NextResponse.json(
            { error: 'Each tag must be a string of 50 characters or less' },
            { status: 400 }
          )
        }
      }
    }

    // Generate slug from title with UUID for uniqueness
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 50) // Limit length

    // Use crypto.randomUUID() for collision-free uniqueness
    const uniqueId = crypto.randomUUID().split('-')[0] // First segment of UUID
    const slug = `${baseSlug}-${uniqueId}`

    const post = await prisma.userPost.create({
      data: {
        authorId: user.id,
        title,
        slug,
        content,
        excerpt,
        type: type || 'BLOG',
        status: status || 'PUBLISHED',
        coverImage,
        images: images || [],
        videoUrl,
        tags: tags || [],
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
      include: {
        author: {
          select: {
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    // Award points for creating content
    if (status === 'PUBLISHED') {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          totalPoints: { increment: 50 },
        },
      })

      // Create activity
      await prisma.userActivity.create({
        data: {
          userId: user.id,
          type: 'POST_CREATED',
          title: 'Content Published',
          description: `Published a new ${type.toLowerCase()}: ${title}`,
          points: 50,
        },
      })
    }

    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

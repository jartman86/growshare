import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

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

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + Date.now()

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

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

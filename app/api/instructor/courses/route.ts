import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ensureUser } from '@/lib/ensure-user'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
}

export async function GET() {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ensureUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.isInstructor) {
      return NextResponse.json({ error: 'Not an instructor' }, { status: 403 })
    }

    const courses = await prisma.course.findMany({
      where: { instructorId: user.id },
      include: {
        _count: {
          select: {
            progress: true,
            modules: true,
            purchases: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    // Calculate totals
    const totalStudents = courses.reduce((sum, course) => sum + course._count.progress, 0)
    const totalViews = courses.reduce((sum, course) => sum + course.viewCount, 0)

    const purchases = await prisma.coursePurchase.findMany({
      where: {
        courseId: { in: courses.map(c => c.id) },
        status: 'COMPLETED',
      },
      select: { instructorEarnings: true },
    })

    const totalEarnings = purchases.reduce((sum, p) => sum + p.instructorEarnings, 0)

    return NextResponse.json({
      courses,
      totalStudents,
      totalEarnings,
      totalViews,
    })
  } catch (error) {
    console.error('Error fetching instructor courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ensureUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.isInstructor) {
      return NextResponse.json({ error: 'Not an instructor' }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      description,
      category,
      level,
      thumbnailUrl,
      accessType,
      price,
      includeInSubscription,
      isCertification,
      certificateName,
    } = body

    // Validate required fields
    if (!title || title.trim().length < 5) {
      return NextResponse.json(
        { error: 'Title must be at least 5 characters' },
        { status: 400 }
      )
    }

    if (!description || description.trim().length < 50) {
      return NextResponse.json(
        { error: 'Description must be at least 50 characters' },
        { status: 400 }
      )
    }

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      )
    }

    // Generate unique slug
    let baseSlug = generateSlug(title)
    let slug = baseSlug
    let counter = 1

    while (await prisma.course.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Validate pricing
    if (accessType === 'ONE_TIME' || accessType === 'BOTH') {
      if (!price || price < 0) {
        return NextResponse.json(
          { error: 'Price is required for paid courses' },
          { status: 400 }
        )
      }
    }

    const course = await prisma.course.create({
      data: {
        title: title.trim(),
        slug,
        description: description.trim(),
        category,
        level: level || 'BEGINNER',
        thumbnailUrl,
        accessType: accessType || 'FREE',
        price: price || null,
        includeInSubscription: includeInSubscription || false,
        isCertification: isCertification || false,
        certificateName: isCertification ? certificateName : null,
        instructorId: user.id,
        isPublished: false,
      },
    })

    return NextResponse.json({
      success: true,
      course,
    })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    )
  }
}

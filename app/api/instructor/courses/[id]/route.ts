import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ensureUser } from '@/lib/ensure-user'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ensureUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { id } = await params

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            progress: true,
            purchases: true,
          },
        },
      },
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Check ownership or admin
    if (course.instructorId !== user.id && !user.role.includes('ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ course })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    const course = await prisma.course.findUnique({
      where: { id },
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    if (course.instructorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
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

    // Validate required fields if provided
    if (title !== undefined && title.trim().length < 5) {
      return NextResponse.json(
        { error: 'Title must be at least 5 characters' },
        { status: 400 }
      )
    }

    if (description !== undefined && description.trim().length < 50) {
      return NextResponse.json(
        { error: 'Description must be at least 50 characters' },
        { status: 400 }
      )
    }

    // Build update data
    const updateData: any = {}

    if (title !== undefined) updateData.title = title.trim()
    if (description !== undefined) updateData.description = description.trim()
    if (category !== undefined) updateData.category = category
    if (level !== undefined) updateData.level = level
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl
    if (accessType !== undefined) updateData.accessType = accessType
    if (price !== undefined) updateData.price = price
    if (includeInSubscription !== undefined) updateData.includeInSubscription = includeInSubscription
    if (isCertification !== undefined) updateData.isCertification = isCertification
    if (certificateName !== undefined) updateData.certificateName = isCertification ? certificateName : null

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      course: updatedCourse,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            purchases: true,
            progress: true,
          },
        },
      },
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    if (course.instructorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Only allow deletion of draft courses with no purchases
    if (course.isPublished) {
      return NextResponse.json(
        { error: 'Cannot delete published courses. Unpublish first.' },
        { status: 400 }
      )
    }

    if (course._count.purchases > 0) {
      return NextResponse.json(
        { error: 'Cannot delete courses with existing purchases' },
        { status: 400 }
      )
    }

    await prisma.course.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    )
  }
}

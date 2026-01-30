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
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    if (course.instructorId !== user.id && !user.role.includes('ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const modules = await prisma.courseModule.findMany({
      where: { courseId: id },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ modules })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch modules' },
      { status: 500 }
    )
  }
}

export async function POST(
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
    const { title, description, content, videoUrl } = body

    if (!title || title.trim().length < 3) {
      return NextResponse.json(
        { error: 'Module title must be at least 3 characters' },
        { status: 400 }
      )
    }

    // Get the next order number
    const lastModule = await prisma.courseModule.findFirst({
      where: { courseId: id },
      orderBy: { order: 'desc' },
    })

    const newOrder = (lastModule?.order ?? -1) + 1

    const module = await prisma.courseModule.create({
      data: {
        courseId: id,
        title: title.trim(),
        description: description?.trim() || null,
        content: content || '',
        videoUrl: videoUrl || null,
        order: newOrder,
      },
    })

    return NextResponse.json({
      success: true,
      module,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create module' },
      { status: 500 }
    )
  }
}

// Reorder modules
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
    const { moduleOrder } = body // Array of module IDs in new order

    if (!Array.isArray(moduleOrder)) {
      return NextResponse.json(
        { error: 'moduleOrder must be an array' },
        { status: 400 }
      )
    }

    // Update each module's order
    await Promise.all(
      moduleOrder.map((moduleId: string, index: number) =>
        prisma.courseModule.update({
          where: { id: moduleId },
          data: { order: index },
        })
      )
    )

    const modules = await prisma.courseModule.findMany({
      where: { courseId: id },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({
      success: true,
      modules,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to reorder modules' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ensureUser } from '@/lib/ensure-user'

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
      include: {
        modules: true,
      },
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    if (course.instructorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Validate course is ready to publish
    const errors: string[] = []

    if (!course.title || course.title.length < 5) {
      errors.push('Course title must be at least 5 characters')
    }

    if (!course.description || course.description.length < 50) {
      errors.push('Course description must be at least 50 characters')
    }

    if (!course.category) {
      errors.push('Course must have a category')
    }

    if (course.modules.length === 0) {
      errors.push('Course must have at least one module')
    }

    // Check if paid course has price
    if ((course.accessType === 'ONE_TIME' || course.accessType === 'BOTH') && (!course.price || course.price <= 0)) {
      errors.push('Paid courses must have a price')
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Course is not ready to publish', errors },
        { status: 400 }
      )
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: { isPublished: true },
    })

    return NextResponse.json({
      success: true,
      course: updatedCourse,
    })
  } catch (error) {
    console.error('Error publishing course:', error)
    return NextResponse.json(
      { error: 'Failed to publish course' },
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
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    if (course.instructorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Unpublish the course
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: { isPublished: false },
    })

    return NextResponse.json({
      success: true,
      course: updatedCourse,
    })
  } catch (error) {
    console.error('Error unpublishing course:', error)
    return NextResponse.json(
      { error: 'Failed to unpublish course' },
      { status: 500 }
    )
  }
}

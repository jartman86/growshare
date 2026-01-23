import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ toolId: string }> }
) {
  try {
    const { toolId } = await params

    const tool = await prisma.tool.findUnique({
      where: { id: toolId },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            isVerified: true,
            bio: true,
            location: true,
          },
        },
        rentals: {
          where: { status: 'ACTIVE' },
          select: {
            startDate: true,
            endDate: true,
          },
        },
      },
    })

    if (!tool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(tool)
  } catch (error) {
    console.error('Error fetching tool:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tool' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ toolId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { toolId } = await params

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const existingTool = await prisma.tool.findUnique({
      where: { id: toolId },
    })

    if (!existingTool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      )
    }

    if (existingTool.ownerId !== currentUser.id) {
      return NextResponse.json(
        { error: 'You can only edit your own tools' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const updateData: any = {}

    if (body.name !== undefined) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description
    if (body.category !== undefined) updateData.category = body.category
    if (body.condition !== undefined) updateData.condition = body.condition
    if (body.images !== undefined) updateData.images = body.images
    if (body.listingType !== undefined) updateData.listingType = body.listingType
    if (body.salePrice !== undefined) updateData.salePrice = body.salePrice
    if (body.dailyRate !== undefined) updateData.dailyRate = body.dailyRate
    if (body.weeklyRate !== undefined) updateData.weeklyRate = body.weeklyRate
    if (body.depositRequired !== undefined) updateData.depositRequired = body.depositRequired
    if (body.status !== undefined) updateData.status = body.status
    if (body.location !== undefined) updateData.location = body.location
    if (body.availableFrom !== undefined) updateData.availableFrom = body.availableFrom ? new Date(body.availableFrom) : null
    if (body.availableTo !== undefined) updateData.availableTo = body.availableTo ? new Date(body.availableTo) : null

    const tool = await prisma.tool.update({
      where: { id: toolId },
      data: updateData,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    })

    return NextResponse.json(tool)
  } catch (error) {
    console.error('Error updating tool:', error)
    return NextResponse.json(
      { error: 'Failed to update tool' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ toolId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { toolId } = await params

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const existingTool = await prisma.tool.findUnique({
      where: { id: toolId },
      include: {
        rentals: {
          where: { status: { in: ['PENDING', 'APPROVED', 'ACTIVE'] } },
        },
      },
    })

    if (!existingTool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      )
    }

    if (existingTool.ownerId !== currentUser.id) {
      return NextResponse.json(
        { error: 'You can only delete your own tools' },
        { status: 403 }
      )
    }

    if (existingTool.rentals.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete tool with active rentals' },
        { status: 400 }
      )
    }

    await prisma.tool.delete({
      where: { id: toolId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tool:', error)
    return NextResponse.json(
      { error: 'Failed to delete tool' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ensureUser } from '@/lib/ensure-user'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/community-tips/[id] - Get a specific tip
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const tip = await prisma.communityTip.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        votes: {
          select: {
            userId: true,
            value: true,
          },
        },
      },
    })

    if (!tip) {
      return NextResponse.json(
        { error: 'Tip not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(tip)
  } catch (error) {
    console.error('Error fetching tip:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tip' },
      { status: 500 }
    )
  }
}

// PATCH /api/community-tips/[id] - Update a tip (author only) or moderate (admin)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId: clerkId } = await auth()

    if (!clerkId) {
      return NextResponse.json(
        { error: 'You must be signed in' },
        { status: 401 }
      )
    }

    const user = await ensureUser()
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { id } = await params
    const body = await request.json()

    const tip = await prisma.communityTip.findUnique({
      where: { id },
    })

    if (!tip) {
      return NextResponse.json(
        { error: 'Tip not found' },
        { status: 404 }
      )
    }

    // Check if user is author or admin
    const isAuthor = tip.authorId === user.id
    const isAdmin = user.role.includes('ADMIN')

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: 'Not authorized to update this tip' },
        { status: 403 }
      )
    }

    // Build update data
    const updateData: Record<string, unknown> = {}

    // Authors can update content (only if still pending)
    if (isAuthor && tip.status === 'PENDING') {
      if (body.title) updateData.title = body.title
      if (body.content) updateData.content = body.content
      if (body.plantName !== undefined) updateData.plantName = body.plantName
      if (body.usdaZone !== undefined) updateData.usdaZone = body.usdaZone
      if (body.pestName !== undefined) updateData.pestName = body.pestName
      if (body.treatment !== undefined) updateData.treatment = body.treatment
      if (body.mainPlant !== undefined) updateData.mainPlant = body.mainPlant
      if (body.companions !== undefined) updateData.companions = body.companions
      if (body.avoid !== undefined) updateData.avoid = body.avoid
    }

    // Admins can moderate
    if (isAdmin && body.status) {
      const validStatuses = ['PENDING', 'APPROVED', 'REJECTED']
      if (validStatuses.includes(body.status.toUpperCase())) {
        updateData.status = body.status.toUpperCase()
        updateData.reviewedBy = user.id
        updateData.reviewedAt = new Date()
        if (body.reviewNotes) updateData.reviewNotes = body.reviewNotes

        // Award additional points when tip is approved
        if (body.status.toUpperCase() === 'APPROVED') {
          await prisma.userActivity.create({
            data: {
              userId: tip.authorId,
              type: 'TIP_APPROVED',
              title: 'Tip Approved',
              description: `Your tip "${tip.title}" was approved`,
              points: 15,
              metadata: { tipId: tip.id },
            },
          })

          await prisma.user.update({
            where: { id: tip.authorId },
            data: { totalPoints: { increment: 15 } },
          })
        }
      }
    }

    const updatedTip = await prisma.communityTip.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(updatedTip)
  } catch (error) {
    console.error('Error updating tip:', error)
    return NextResponse.json(
      { error: 'Failed to update tip' },
      { status: 500 }
    )
  }
}

// DELETE /api/community-tips/[id] - Delete a tip (author or admin)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId: clerkId } = await auth()

    if (!clerkId) {
      return NextResponse.json(
        { error: 'You must be signed in' },
        { status: 401 }
      )
    }

    const user = await ensureUser()
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { id } = await params

    const tip = await prisma.communityTip.findUnique({
      where: { id },
    })

    if (!tip) {
      return NextResponse.json(
        { error: 'Tip not found' },
        { status: 404 }
      )
    }

    // Check if user is author or admin
    const isAuthor = tip.authorId === user.id
    const isAdmin = user.role.includes('ADMIN')

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: 'Not authorized to delete this tip' },
        { status: 403 }
      )
    }

    await prisma.communityTip.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tip:', error)
    return NextResponse.json(
      { error: 'Failed to delete tip' },
      { status: 500 }
    )
  }
}

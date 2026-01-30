import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ journalId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { journalId } = await params

    const journal = await prisma.cropJournal.findUnique({
      where: { id: journalId },
      include: {
        harvests: {
          orderBy: { harvestDate: 'desc' },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    })

    if (!journal) {
      return NextResponse.json({ error: 'Journal not found' }, { status: 404 })
    }

    return NextResponse.json(journal)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch journal' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ journalId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { journalId } = await params
    const body = await request.json()

    // Get the current user from database
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user owns this journal
    const journal = await prisma.cropJournal.findUnique({
      where: { id: journalId },
    })

    if (!journal) {
      return NextResponse.json({ error: 'Journal not found' }, { status: 404 })
    }

    if (journal.userId !== currentUser.id) {
      return NextResponse.json(
        { error: 'You can only update your own journals' },
        { status: 403 }
      )
    }

    // Update the journal
    const updatedJournal = await prisma.cropJournal.update({
      where: { id: journalId },
      data: {
        cropName: body.cropName,
        variety: body.variety,
        plantedDate: body.plantedDate ? new Date(body.plantedDate) : undefined,
        expectedHarvest: body.expectedHarvest ? new Date(body.expectedHarvest) : undefined,
        stage: body.stage,
        title: body.title,
        content: body.content,
        images: body.images,
        plantCount: body.plantCount,
        areaUsed: body.areaUsed,
      },
      include: {
        harvests: true,
      },
    })

    return NextResponse.json(updatedJournal)
  } catch {
    return NextResponse.json(
      { error: 'Failed to update journal' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ journalId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { journalId } = await params

    // Get the current user from database
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user owns this journal
    const journal = await prisma.cropJournal.findUnique({
      where: { id: journalId },
    })

    if (!journal) {
      return NextResponse.json({ error: 'Journal not found' }, { status: 404 })
    }

    if (journal.userId !== currentUser.id) {
      return NextResponse.json(
        { error: 'You can only delete your own journals' },
        { status: 403 }
      )
    }

    // Delete the journal (cascade will handle harvests)
    await prisma.cropJournal.delete({
      where: { id: journalId },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete journal' },
      { status: 500 }
    )
  }
}

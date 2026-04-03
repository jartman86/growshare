import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ensureUser } from '@/lib/ensure-user'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ entryId: string }> }
) {
  try {
    const currentUser = await ensureUser()
    const { entryId } = await params

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const entry = await prisma.cropJournal.findUnique({
      where: { id: entryId },
    })

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
    }

    if (entry.userId !== currentUser.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { harvestDate, quantity, quality, notes } = body

    if (!harvestDate || !quantity) {
      return NextResponse.json(
        { error: 'Harvest date and quantity are required' },
        { status: 400 }
      )
    }

    const parsedQuantity = parseFloat(quantity)
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return NextResponse.json({ error: 'Quantity must be a positive number' }, { status: 400 })
    }

    const harvest = await prisma.harvest.create({
      data: {
        cropJournalId: entryId,
        harvestDate: new Date(harvestDate),
        quantity: parsedQuantity,
        quality: quality || null,
        notes: notes || null,
      },
    })

    // Award points for recording a harvest
    await prisma.userActivity.create({
      data: {
        userId: currentUser.id,
        type: 'FIRST_HARVEST',
        title: 'Recorded a harvest',
        description: `Harvested ${parsedQuantity} lbs of ${entry.cropName}`,
        points: 150,
      },
    })

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { totalPoints: { increment: 150 } },
    })

    return NextResponse.json(harvest, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to record harvest' }, { status: 500 })
  }
}

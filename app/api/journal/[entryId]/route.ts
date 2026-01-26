import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ensureUser } from '@/lib/ensure-user'

// Get specific journal entry
export async function GET(
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
      include: {
        harvests: true,
      },
    })

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
    }

    // Only allow users to view their own entries
    if (entry.userId !== currentUser.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Transform to match expected format
    const formattedEntry = {
      id: entry.id,
      cropName: entry.cropName,
      cropType: entry.variety || 'General',
      variety: entry.variety,
      status: entry.stage,
      plantingDate: entry.plantedDate?.toISOString() || new Date().toISOString(),
      expectedHarvestDate: entry.expectedHarvest?.toISOString() || null,
      plantCount: entry.plantCount,
      areaUsed: entry.areaUsed,
      notes: entry.content,
      images: entry.images,
      weatherData: entry.weatherData,
      weatherLocation: entry.weatherLocation,
      harvestAmount: entry.harvests.reduce((sum, h) => sum + (h.weight || 0), 0),
      harvests: entry.harvests.map(h => ({
        id: h.id,
        weight: h.weight,
        quantity: h.quantity,
        quality: h.quality,
        notes: h.notes,
        harvestedAt: h.harvestedAt?.toISOString(),
      })),
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
    }

    return NextResponse.json(formattedEntry)
  } catch (error) {
    console.error('Error fetching journal entry:', error)
    return NextResponse.json({ error: 'Failed to fetch entry' }, { status: 500 })
  }
}

// Update journal entry
export async function PATCH(
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
    const {
      cropName,
      variety,
      title,
      content,
      plantedDate,
      expectedHarvest,
      plantCount,
      areaUsed,
      images,
      stage,
    } = body

    const updatedEntry = await prisma.cropJournal.update({
      where: { id: entryId },
      data: {
        ...(cropName && { cropName }),
        ...(variety !== undefined && { variety }),
        ...(title && { title }),
        ...(content !== undefined && { content }),
        ...(plantedDate && { plantedDate: new Date(plantedDate) }),
        ...(expectedHarvest && { expectedHarvest: new Date(expectedHarvest) }),
        ...(plantCount !== undefined && { plantCount }),
        ...(areaUsed !== undefined && { areaUsed }),
        ...(images && { images }),
        ...(stage && { stage }),
      },
    })

    return NextResponse.json(updatedEntry)
  } catch (error) {
    console.error('Error updating journal entry:', error)
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 })
  }
}

// Delete journal entry
export async function DELETE(
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

    await prisma.cropJournal.delete({
      where: { id: entryId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting journal entry:', error)
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 })
  }
}

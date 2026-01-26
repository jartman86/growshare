import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ensureUser } from '@/lib/ensure-user'

// Get user's journal entries
export async function GET(request: NextRequest) {
  try {
    const currentUser = await ensureUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const entries = await prisma.cropJournal.findMany({
      where: {
        userId: currentUser.id,
        ...(status && status !== 'ALL' && { stage: status as any }),
        ...(search && {
          OR: [
            { cropName: { contains: search, mode: 'insensitive' } },
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
            { variety: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      include: {
        harvests: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // Transform to match the expected format
    const formattedEntries = entries.map((entry: any) => {
      const totalHarvest = entry.harvests.reduce((sum: number, h: { quantity: number }) => sum + (h.quantity || 0), 0)
      return {
        id: entry.id,
        cropName: entry.cropName,
        cropType: entry.variety || 'General',
        variety: entry.variety,
        status: entry.stage,
        plantedDate: entry.plantedDate?.toISOString() || null,
        expectedHarvestDate: entry.expectedHarvest?.toISOString() || null,
        plantCount: entry.plantCount,
        areaUsed: entry.areaUsed,
        notes: entry.content,
        images: entry.images,
        harvestAmount: totalHarvest,
        harvestCount: entry.harvests.length,
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString(),
      }
    })

    // Calculate stats
    const stats = {
      total: entries.length,
      growing: entries.filter((e: any) => e.stage === 'GROWING').length,
      harvested: entries.filter((e: any) => e.stage === 'HARVESTING' || e.stage === 'COMPLETED').length,
      totalHarvest: entries.reduce((sum: number, e: any) =>
        sum + e.harvests.reduce((h: number, harvest: { quantity: number }) => h + (harvest.quantity || 0), 0), 0
      ),
    }

    return NextResponse.json({ entries: formattedEntries, stats })
  } catch (error) {
    console.error('Error fetching journal entries:', error)
    return NextResponse.json({ error: 'Failed to fetch journal entries' }, { status: 500 })
  }
}

// Create new journal entry
export async function POST(request: NextRequest) {
  try {
    const currentUser = await ensureUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    if (!cropName || !title) {
      return NextResponse.json(
        { error: 'Crop name and title are required' },
        { status: 400 }
      )
    }

    const entry = await prisma.cropJournal.create({
      data: {
        userId: currentUser.id,
        cropName,
        variety,
        title,
        content: content || '',
        plantedDate: plantedDate ? new Date(plantedDate) : null,
        expectedHarvest: expectedHarvest ? new Date(expectedHarvest) : null,
        plantCount,
        areaUsed,
        images: images || [],
        stage: stage || 'PLANNING',
      },
    })

    // Log activity for gamification
    await prisma.userActivity.create({
      data: {
        userId: currentUser.id,
        type: 'JOURNAL_ENTRY',
        title: 'Created a journal entry',
        description: `Started tracking ${cropName}`,
        points: 25,
      },
    })

    // Update user points
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { totalPoints: { increment: 25 } },
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error('Error creating journal entry:', error)
    return NextResponse.json({ error: 'Failed to create journal entry' }, { status: 500 })
  }
}

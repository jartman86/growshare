import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the current user from database
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const searchParams = request.nextUrl.searchParams
    const stage = searchParams.get('stage')
    const cropName = searchParams.get('cropName')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      userId: currentUser.id,
    }

    if (stage) {
      where.stage = stage
    }

    if (cropName) {
      where.cropName = { contains: cropName, mode: 'insensitive' }
    }

    const journals = await prisma.cropJournal.findMany({
      where,
      include: {
        harvests: {
          orderBy: { harvestDate: 'desc' },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(journals)
  } catch (error) {
    console.error('Error fetching journals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch journals' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the current user from database
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()

    // Create the journal entry
    const journal = await prisma.cropJournal.create({
      data: {
        userId: currentUser.id,
        cropName: body.cropName,
        variety: body.variety,
        plantedDate: body.plantedDate ? new Date(body.plantedDate) : null,
        expectedHarvest: body.expectedHarvest ? new Date(body.expectedHarvest) : null,
        stage: body.stage || 'PLANNING',
        title: body.title,
        content: body.content,
        images: body.images || [],
        plantCount: body.plantCount,
        areaUsed: body.areaUsed,
        weatherData: body.weatherData || null,
        weatherLocation: body.weatherLocation || null,
      },
      include: {
        harvests: true,
      },
    })

    // Award badge for first journal entry
    const journalsCount = await prisma.cropJournal.count({
      where: { userId: currentUser.id },
    })

    if (journalsCount === 1) {
      const journalBadge = await prisma.badge.findFirst({
        where: { name: 'Garden Chronicler' },
      })

      if (journalBadge) {
        // Check if user already has this badge
        const existingBadge = await prisma.userBadge.findFirst({
          where: {
            userId: currentUser.id,
            badgeId: journalBadge.id,
          },
        })

        if (!existingBadge) {
          await prisma.userBadge.create({
            data: {
              userId: currentUser.id,
              badgeId: journalBadge.id,
            },
          })

          await prisma.user.update({
            where: { id: currentUser.id },
            data: { totalPoints: { increment: journalBadge.points } },
          })

          // Create activity
          await prisma.userActivity.create({
            data: {
              userId: currentUser.id,
              type: 'BADGE_EARNED',
              title: 'Earned Garden Chronicler badge',
              description: 'Created first journal entry',
              points: journalBadge.points,
            },
          })
        }
      }
    }

    // Create activity for journal entry
    await prisma.userActivity.create({
      data: {
        userId: currentUser.id,
        type: 'JOURNAL_ENTRY',
        title: 'New journal entry',
        description: journal.title,
        points: 10,
      },
    })

    // Add points for journal entry
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { totalPoints: { increment: 10 } },
    })

    return NextResponse.json(journal, { status: 201 })
  } catch (error) {
    console.error('Error creating journal:', error)
    return NextResponse.json(
      { error: 'Failed to create journal' },
      { status: 500 }
    )
  }
}

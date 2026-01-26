import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ensureUser } from '@/lib/ensure-user'

// GET /api/community-tips - List approved tips, optionally filtered by category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status') || 'APPROVED'
    const limit = parseInt(searchParams.get('limit') || '50')
    const plantName = searchParams.get('plantName')
    const pestName = searchParams.get('pestName')

    // Build where clause
    const where: Record<string, unknown> = {
      status: status.toUpperCase(),
    }

    if (category) {
      where.category = category.toUpperCase()
    }

    if (plantName) {
      where.plantName = {
        contains: plantName,
        mode: 'insensitive',
      }
    }

    if (pestName) {
      where.pestName = {
        contains: pestName,
        mode: 'insensitive',
      }
    }

    const tips = await prisma.communityTip.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        _count: {
          select: { votes: true },
        },
      },
      orderBy: [
        { upvotes: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    })

    return NextResponse.json(tips)
  } catch (error) {
    console.error('Error fetching community tips:', error)
    return NextResponse.json(
      { error: 'Failed to fetch community tips' },
      { status: 500 }
    )
  }
}

// POST /api/community-tips - Submit a new tip
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()

    if (!clerkId) {
      return NextResponse.json(
        { error: 'You must be signed in to submit a tip' },
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

    const body = await request.json()
    const {
      category,
      title,
      content,
      plantName,
      usdaZone,
      pestName,
      treatment,
      mainPlant,
      companions,
      avoid,
    } = body

    // Validate required fields
    if (!category || !title || !content) {
      return NextResponse.json(
        { error: 'Category, title, and content are required' },
        { status: 400 }
      )
    }

    // Validate category
    const validCategories = ['PLANTING_CALENDAR', 'PEST_DISEASE', 'COMPANION_PLANTING']
    if (!validCategories.includes(category.toUpperCase())) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Create the tip
    const tip = await prisma.communityTip.create({
      data: {
        authorId: user.id,
        category: category.toUpperCase(),
        title,
        content,
        plantName: plantName || null,
        usdaZone: usdaZone || null,
        pestName: pestName || null,
        treatment: treatment || null,
        mainPlant: mainPlant || null,
        companions: companions || [],
        avoid: avoid || [],
      },
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

    // Award points for submitting a tip
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        type: 'TIP_SUBMITTED',
        title: 'Submitted a Community Tip',
        description: `Submitted tip: "${title}"`,
        points: 5,
        metadata: { tipId: tip.id, category },
      },
    })

    // Update user's total points
    await prisma.user.update({
      where: { id: user.id },
      data: { totalPoints: { increment: 5 } },
    })

    return NextResponse.json(tip, { status: 201 })
  } catch (error) {
    console.error('Error creating community tip:', error)
    return NextResponse.json(
      { error: 'Failed to create tip' },
      { status: 500 }
    )
  }
}

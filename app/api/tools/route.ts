import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const listingType = searchParams.get('listingType')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const search = searchParams.get('search')
    const userId = searchParams.get('userId')

    const where: any = {}

    if (status) {
      where.status = status
    } else {
      where.status = 'AVAILABLE'
    }

    if (category) {
      where.category = category
    }

    if (listingType) {
      where.listingType = listingType
    }

    if (userId) {
      where.ownerId = userId
    }

    if (minPrice || maxPrice) {
      where.dailyRate = {}
      if (minPrice) where.dailyRate.gte = parseFloat(minPrice)
      if (maxPrice) where.dailyRate.lte = parseFloat(maxPrice)
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const tools = await prisma.tool.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            isVerified: true,
          },
        },
        _count: {
          select: { rentals: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(tools)
  } catch (error) {
    console.error('Error fetching tools:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
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

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Tool name is required' },
        { status: 400 }
      )
    }

    if (!body.description || body.description.trim().length === 0) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      )
    }

    if (!body.category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      )
    }

    if (!body.condition) {
      return NextResponse.json(
        { error: 'Condition is required' },
        { status: 400 }
      )
    }

    // Validate pricing based on listing type
    if (body.listingType === 'RENT' || body.listingType === 'BOTH') {
      if (!body.dailyRate || body.dailyRate <= 0) {
        return NextResponse.json(
          { error: 'Daily rate is required for rentals' },
          { status: 400 }
        )
      }
    }

    if (body.listingType === 'SALE' || body.listingType === 'BOTH') {
      if (!body.salePrice || body.salePrice <= 0) {
        return NextResponse.json(
          { error: 'Sale price is required for sales' },
          { status: 400 }
        )
      }
    }

    const tool = await prisma.tool.create({
      data: {
        ownerId: currentUser.id,
        name: body.name,
        description: body.description,
        category: body.category,
        condition: body.condition,
        images: body.images || [],
        listingType: body.listingType || 'RENT',
        salePrice: body.salePrice || null,
        dailyRate: body.dailyRate || null,
        weeklyRate: body.weeklyRate || null,
        depositRequired: body.depositRequired || null,
        status: 'AVAILABLE',
        location: body.location || null,
        availableFrom: body.availableFrom ? new Date(body.availableFrom) : null,
        availableTo: body.availableTo ? new Date(body.availableTo) : null,
      },
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

    return NextResponse.json(tool, { status: 201 })
  } catch (error) {
    console.error('Error creating tool:', error)
    return NextResponse.json(
      { error: 'Failed to create tool listing' },
      { status: 500 }
    )
  }
}

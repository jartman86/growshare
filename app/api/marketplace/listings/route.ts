import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { ensureUser, ensureVerifiedUser, EmailNotVerifiedError } from '@/lib/ensure-user'
import { rateLimit, getClientIdentifier, rateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const isOrganic = searchParams.get('isOrganic')
    const deliveryMethod = searchParams.get('deliveryMethod')
    const search = searchParams.get('search')
    const userId = searchParams.get('userId')
    const mine = searchParams.get('mine')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}

    // If requesting own listings, get current user
    if (mine === 'true') {
      const currentUser = await ensureUser()
      if (!currentUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      where.userId = currentUser.id
      // Show all statuses for own listings
    } else {
      // Default to available listings unless status is specified
      if (status) {
        where.status = status
      } else {
        where.status = 'AVAILABLE'
      }
    }

    if (category) {
      where.category = { equals: category, mode: 'insensitive' }
    }

    if (userId && mine !== 'true') {
      where.userId = userId
    }

    if (minPrice || maxPrice) {
      where.pricePerUnit = {}
      if (minPrice) where.pricePerUnit.gte = parseFloat(minPrice)
      if (maxPrice) where.pricePerUnit.lte = parseFloat(maxPrice)
    }

    if (isOrganic === 'true') {
      where.isOrganic = true
    }

    if (deliveryMethod) {
      where.deliveryMethods = { has: deliveryMethod }
    }

    if (search) {
      where.OR = [
        { productName: { contains: search, mode: 'insensitive' } },
        { variety: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const listings = await prisma.produceListing.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            isVerified: true,
          },
        },
        _count: {
          select: { orders: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(listings)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require verified email to create marketplace listings
    const currentUser = await ensureVerifiedUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limit: 30 listings per minute per user
    const rateLimitResult = rateLimit(
      getClientIdentifier(request, currentUser.clerkId),
      RATE_LIMITS.mutation
    )
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult)
    }

    const body = await request.json()

    // Validate required fields
    if (!body.productName || body.productName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      )
    }

    if (!body.description || body.description.trim().length === 0) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      )
    }

    if (!body.quantity || body.quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be greater than 0' },
        { status: 400 }
      )
    }

    if (!body.pricePerUnit || body.pricePerUnit <= 0) {
      return NextResponse.json(
        { error: 'Price per unit must be greater than 0' },
        { status: 400 }
      )
    }

    if (!body.category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      )
    }

    if (!body.availableDate) {
      return NextResponse.json(
        { error: 'Available date is required' },
        { status: 400 }
      )
    }

    if (!body.deliveryMethods || body.deliveryMethods.length === 0) {
      return NextResponse.json(
        { error: 'At least one delivery method is required' },
        { status: 400 }
      )
    }

    const listing = await prisma.produceListing.create({
      data: {
        userId: currentUser.id,
        productName: body.productName,
        variety: body.variety || null,
        description: body.description,
        category: body.category,
        quantity: body.quantity,
        unit: body.unit || 'lb',
        pricePerUnit: body.pricePerUnit,
        status: 'AVAILABLE',
        availableDate: new Date(body.availableDate),
        expiresDate: body.expiresDate ? new Date(body.expiresDate) : null,
        deliveryMethods: body.deliveryMethods,
        pickupLocation: body.pickupLocation || null,
        deliveryRadius: body.deliveryRadius || null,
        images: body.images || [],
        isOrganic: body.isOrganic || false,
        isCertified: body.isCertified || false,
        certifications: body.certifications || [],
      },
      include: {
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

    // Create activity
    await prisma.userActivity.create({
      data: {
        userId: currentUser.id,
        type: 'PRODUCE_SOLD',
        title: 'Listed produce for sale',
        description: listing.productName,
        points: 10,
      },
    })

    // Add points
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { totalPoints: { increment: 10 } },
    })

    return NextResponse.json(listing, { status: 201 })
  } catch (error) {
    if (error instanceof EmailNotVerifiedError) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    )
  }
}

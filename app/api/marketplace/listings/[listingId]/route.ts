import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ listingId: string }> }
) {
  try {
    const { listingId } = await params

    const listing = await prisma.produceListing.findUnique({
      where: { id: listingId },
      include: {
        user: {
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
        orders: {
          where: { status: { in: ['COMPLETED'] } },
          select: { id: true },
        },
      },
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...listing,
      soldCount: listing.orders.length,
      orders: undefined,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch listing' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ listingId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { listingId } = await params

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get existing listing
    const existingListing = await prisma.produceListing.findUnique({
      where: { id: listingId },
    })

    if (!existingListing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Check ownership
    if (existingListing.userId !== currentUser.id) {
      return NextResponse.json(
        { error: 'You can only edit your own listings' },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Build update data
    const updateData: any = {}

    if (body.productName !== undefined) updateData.productName = body.productName
    if (body.variety !== undefined) updateData.variety = body.variety
    if (body.description !== undefined) updateData.description = body.description
    if (body.category !== undefined) updateData.category = body.category
    if (body.quantity !== undefined) updateData.quantity = body.quantity
    if (body.unit !== undefined) updateData.unit = body.unit
    if (body.pricePerUnit !== undefined) updateData.pricePerUnit = body.pricePerUnit
    if (body.status !== undefined) updateData.status = body.status
    if (body.availableDate !== undefined) updateData.availableDate = new Date(body.availableDate)
    if (body.expiresDate !== undefined) updateData.expiresDate = body.expiresDate ? new Date(body.expiresDate) : null
    if (body.deliveryMethods !== undefined) updateData.deliveryMethods = body.deliveryMethods
    if (body.pickupLocation !== undefined) updateData.pickupLocation = body.pickupLocation
    if (body.deliveryRadius !== undefined) updateData.deliveryRadius = body.deliveryRadius
    if (body.images !== undefined) updateData.images = body.images
    if (body.isOrganic !== undefined) updateData.isOrganic = body.isOrganic
    if (body.isCertified !== undefined) updateData.isCertified = body.isCertified
    if (body.certifications !== undefined) updateData.certifications = body.certifications

    const listing = await prisma.produceListing.update({
      where: { id: listingId },
      data: updateData,
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

    return NextResponse.json(listing)
  } catch {
    return NextResponse.json(
      { error: 'Failed to update listing' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ listingId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { listingId } = await params

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get existing listing
    const existingListing = await prisma.produceListing.findUnique({
      where: { id: listingId },
      include: {
        orders: {
          where: { status: { in: ['PENDING', 'CONFIRMED', 'READY'] } },
        },
      },
    })

    if (!existingListing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Check ownership
    if (existingListing.userId !== currentUser.id) {
      return NextResponse.json(
        { error: 'You can only delete your own listings' },
        { status: 403 }
      )
    }

    // Check for active orders
    if (existingListing.orders.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete listing with active orders' },
        { status: 400 }
      )
    }

    await prisma.produceListing.delete({
      where: { id: listingId },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete listing' },
      { status: 500 }
    )
  }
}

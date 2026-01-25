import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { createNotification } from '@/lib/notifications'

export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams
    const role = searchParams.get('role') // 'buyer' or 'seller'
    const status = searchParams.get('status')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}

    if (role === 'seller') {
      // Get orders for user's listings
      where.listing = { userId: currentUser.id }
    } else {
      // Default to buyer view
      where.buyerId = currentUser.id
    }

    if (status) {
      where.status = status
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        listing: {
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
        },
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
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
    if (!body.listingId) {
      return NextResponse.json(
        { error: 'Listing ID is required' },
        { status: 400 }
      )
    }

    if (!body.quantity || body.quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be greater than 0' },
        { status: 400 }
      )
    }

    if (!body.deliveryMethod) {
      return NextResponse.json(
        { error: 'Delivery method is required' },
        { status: 400 }
      )
    }

    // Get listing
    const listing = await prisma.produceListing.findUnique({
      where: { id: body.listingId },
      include: {
        user: true,
      },
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Check availability
    if (listing.status !== 'AVAILABLE') {
      return NextResponse.json(
        { error: 'This listing is no longer available' },
        { status: 400 }
      )
    }

    // Check quantity
    if (body.quantity > listing.quantity) {
      return NextResponse.json(
        { error: `Only ${listing.quantity} ${listing.unit} available` },
        { status: 400 }
      )
    }

    // Validate delivery method
    if (!listing.deliveryMethods.includes(body.deliveryMethod)) {
      return NextResponse.json(
        { error: 'Invalid delivery method for this listing' },
        { status: 400 }
      )
    }

    // Can't buy your own listing
    if (listing.userId === currentUser.id) {
      return NextResponse.json(
        { error: 'You cannot purchase your own listing' },
        { status: 400 }
      )
    }

    // Calculate total price
    const totalPrice = listing.pricePerUnit * body.quantity

    // Create order
    const order = await prisma.order.create({
      data: {
        listingId: listing.id,
        buyerId: currentUser.id,
        quantity: body.quantity,
        totalPrice,
        status: 'PENDING',
        deliveryMethod: body.deliveryMethod,
        deliveryAddress: body.deliveryAddress || null,
        notes: body.notes || null,
      },
      include: {
        listing: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    // Update listing quantity
    const newQuantity = listing.quantity - body.quantity
    await prisma.produceListing.update({
      where: { id: listing.id },
      data: {
        quantity: newQuantity,
        status: newQuantity <= 0 ? 'SOLD' : 'AVAILABLE',
      },
    })

    // Notify seller
    await createNotification({
      userId: listing.userId,
      type: 'BOOKING_REQUEST', // Reusing existing type for order notifications
      title: 'New Order Received',
      content: `${currentUser.firstName} ${currentUser.lastName} ordered ${body.quantity} ${listing.unit} of ${listing.productName}`,
      link: '/dashboard/sell/orders',
      metadata: { orderId: order.id },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

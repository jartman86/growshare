import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId } = await params

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        listing: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                email: true,
                phoneNumber: true,
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
            email: true,
            phoneNumber: true,
          },
        },
        paymentIntent: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check if user is buyer or seller
    if (order.buyerId !== currentUser.id && order.listing.userId !== currentUser.id) {
      return NextResponse.json(
        { error: 'You do not have access to this order' },
        { status: 403 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId } = await params

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        listing: {
          include: { user: true },
        },
        buyer: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const isSeller = order.listing.userId === currentUser.id
    const isBuyer = order.buyerId === currentUser.id

    if (!isSeller && !isBuyer) {
      return NextResponse.json(
        { error: 'You do not have access to this order' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { status } = body

    // Validate status transitions
    const validTransitions: Record<string, { seller: string[]; buyer: string[] }> = {
      PENDING: { seller: ['CONFIRMED', 'CANCELLED'], buyer: ['CANCELLED'] },
      CONFIRMED: { seller: ['READY', 'CANCELLED'], buyer: [] },
      READY: { seller: ['COMPLETED'], buyer: ['COMPLETED'] },
      COMPLETED: { seller: [], buyer: [] },
      CANCELLED: { seller: [], buyer: [] },
    }

    const allowedStatuses = isSeller
      ? validTransitions[order.status]?.seller || []
      : validTransitions[order.status]?.buyer || []

    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Cannot change status from ${order.status} to ${status}` },
        { status: 400 }
      )
    }

    const updateData: any = {}

    if (status) {
      updateData.status = status

      if (status === 'READY') {
        updateData.readyAt = new Date()
      } else if (status === 'COMPLETED') {
        updateData.completedAt = new Date()
      } else if (status === 'CANCELLED') {
        updateData.cancelledAt = new Date()

        // Restore listing quantity
        await prisma.produceListing.update({
          where: { id: order.listingId },
          data: {
            quantity: { increment: order.quantity },
            status: 'AVAILABLE',
          },
        })
      }
    }

    if (body.notes !== undefined) {
      updateData.notes = body.notes
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        listing: true,
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    // Send notifications based on status change
    if (status === 'CONFIRMED') {
      await createNotification({
        userId: order.buyerId,
        type: 'BOOKING_APPROVED',
        title: 'Order Confirmed',
        content: `Your order for ${order.listing.productName} has been confirmed`,
        link: `/marketplace/orders/${orderId}`,
        metadata: { orderId },
      })
    } else if (status === 'READY') {
      await createNotification({
        userId: order.buyerId,
        type: 'BOOKING_APPROVED',
        title: 'Order Ready',
        content: `Your order for ${order.listing.productName} is ready for pickup/delivery`,
        link: `/marketplace/orders/${orderId}`,
        metadata: { orderId },
      })
    } else if (status === 'CANCELLED') {
      const notifyUserId = isSeller ? order.buyerId : order.listing.userId
      await createNotification({
        userId: notifyUserId,
        type: 'BOOKING_CANCELLED',
        title: 'Order Cancelled',
        content: `The order for ${order.listing.productName} has been cancelled`,
        link: `/marketplace/orders/${orderId}`,
        metadata: { orderId },
      })
    }

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

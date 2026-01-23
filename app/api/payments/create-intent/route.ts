import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import {
  createPaymentIntent,
  getOrCreateCustomer,
  dollarsToCents,
  calculatePlatformFee,
} from '@/lib/stripe'

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
    const { type, bookingId, orderId } = body

    // Validate request
    if (!type || (type !== 'booking' && type !== 'order')) {
      return NextResponse.json(
        { error: 'Invalid payment type' },
        { status: 400 }
      )
    }

    if (type === 'booking' && !bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    if (type === 'order' && !orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Get or create Stripe customer
    const customer = await getOrCreateCustomer(
      currentUser.email,
      `${currentUser.firstName} ${currentUser.lastName}`,
      currentUser.stripeCustomerId
    )

    // Update user's Stripe customer ID if needed
    if (currentUser.stripeCustomerId !== customer.id) {
      await prisma.user.update({
        where: { id: currentUser.id },
        data: { stripeCustomerId: customer.id },
      })
    }

    let amount: number
    let connectedAccountId: string | undefined
    let metadata: Record<string, string>

    if (type === 'booking') {
      // Get booking details
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          plot: {
            include: {
              owner: true,
            },
          },
        },
      })

      if (!booking) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        )
      }

      if (booking.renterId !== currentUser.id) {
        return NextResponse.json(
          { error: 'You can only pay for your own bookings' },
          { status: 403 }
        )
      }

      if (booking.status !== 'APPROVED') {
        return NextResponse.json(
          { error: 'Booking must be approved before payment' },
          { status: 400 }
        )
      }

      // Check for existing payment intent
      const existingPayment = await prisma.paymentIntent.findUnique({
        where: { bookingId },
      })

      if (existingPayment && existingPayment.status === 'SUCCEEDED') {
        return NextResponse.json(
          { error: 'This booking has already been paid' },
          { status: 400 }
        )
      }

      amount = dollarsToCents(booking.totalAmount)
      connectedAccountId = booking.plot.owner.stripeConnectId || undefined
      metadata = {
        type: 'booking',
        bookingId: booking.id,
        plotId: booking.plotId,
        renterId: booking.renterId,
      }
    } else {
      // Get order details
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          listing: {
            include: {
              user: true,
            },
          },
        },
      })

      if (!order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        )
      }

      if (order.buyerId !== currentUser.id) {
        return NextResponse.json(
          { error: 'You can only pay for your own orders' },
          { status: 403 }
        )
      }

      if (order.status !== 'PENDING') {
        return NextResponse.json(
          { error: 'Order is not in a payable state' },
          { status: 400 }
        )
      }

      // Check for existing payment intent
      const existingPayment = await prisma.paymentIntent.findUnique({
        where: { orderId },
      })

      if (existingPayment && existingPayment.status === 'SUCCEEDED') {
        return NextResponse.json(
          { error: 'This order has already been paid' },
          { status: 400 }
        )
      }

      amount = dollarsToCents(order.totalPrice)
      connectedAccountId = order.listing.user.stripeConnectId || undefined
      metadata = {
        type: 'order',
        orderId: order.id,
        listingId: order.listingId,
        buyerId: order.buyerId,
      }
    }

    // Calculate platform fee (10%)
    const applicationFeeAmount = connectedAccountId
      ? calculatePlatformFee(amount, 10)
      : undefined

    // Create payment intent
    const paymentIntent = await createPaymentIntent({
      amount,
      customerId: customer.id,
      metadata,
      connectedAccountId,
      applicationFeeAmount,
    })

    // Store payment intent in database
    await prisma.paymentIntent.upsert({
      where: type === 'booking'
        ? { bookingId }
        : { orderId },
      create: {
        stripePaymentIntentId: paymentIntent.id,
        amount,
        status: 'PENDING',
        bookingId: type === 'booking' ? bookingId : undefined,
        orderId: type === 'order' ? orderId : undefined,
        metadata,
      },
      update: {
        stripePaymentIntentId: paymentIntent.id,
        amount,
        status: 'PENDING',
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}

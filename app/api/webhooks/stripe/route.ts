import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyWebhookSignature } from '@/lib/stripe'
import { createNotification } from '@/lib/notifications'
import Stripe from 'stripe'

// Disable body parsing since we need the raw body for signature verification
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    let event: Stripe.Event

    try {
      event = verifyWebhookSignature(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object as Stripe.PaymentIntent)
        break

      case 'account.updated':
        await handleAccountUpdated(event.data.object as Stripe.Account)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const dbPayment = await prisma.paymentIntent.findUnique({
    where: { stripePaymentIntentId: paymentIntent.id },
    include: {
      booking: {
        include: {
          plot: { include: { owner: true } },
          renter: true,
        },
      },
      order: {
        include: {
          listing: { include: { user: true } },
          buyer: true,
        },
      },
    },
  })

  if (!dbPayment) {
    console.error(`Payment not found: ${paymentIntent.id}`)
    return
  }

  // Update payment status
  await prisma.paymentIntent.update({
    where: { id: dbPayment.id },
    data: {
      status: 'SUCCEEDED',
      completedAt: new Date(),
    },
  })

  if (dbPayment.booking) {
    // Update booking status
    await prisma.booking.update({
      where: { id: dbPayment.bookingId! },
      data: {
        stripePaymentId: paymentIntent.id,
        paidAt: new Date(),
        status: 'ACTIVE',
      },
    })

    // Notify plot owner
    await createNotification({
      userId: dbPayment.booking.plot.ownerId,
      type: 'PAYMENT_RECEIVED',
      title: 'Payment Received',
      content: `Payment of $${(paymentIntent.amount / 100).toFixed(2)} received for ${dbPayment.booking.plot.title}`,
      link: '/manage-bookings',
      metadata: { bookingId: dbPayment.bookingId },
    })
  }

  if (dbPayment.order) {
    // Update order status
    await prisma.order.update({
      where: { id: dbPayment.orderId! },
      data: {
        stripePaymentId: paymentIntent.id,
        paidAt: new Date(),
        status: 'CONFIRMED',
      },
    })

    // Notify seller
    await createNotification({
      userId: dbPayment.order.listing.userId,
      type: 'PAYMENT_RECEIVED',
      title: 'Order Payment Received',
      content: `Payment of $${(paymentIntent.amount / 100).toFixed(2)} received for ${dbPayment.order.listing.productName}`,
      link: '/dashboard/sell/orders',
      metadata: { orderId: dbPayment.orderId },
    })
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const dbPayment = await prisma.paymentIntent.findUnique({
    where: { stripePaymentIntentId: paymentIntent.id },
  })

  if (!dbPayment) {
    console.error(`Payment not found: ${paymentIntent.id}`)
    return
  }

  await prisma.paymentIntent.update({
    where: { id: dbPayment.id },
    data: {
      status: 'FAILED',
      failureMessage: paymentIntent.last_payment_error?.message || 'Payment failed',
    },
  })
}

async function handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
  const dbPayment = await prisma.paymentIntent.findUnique({
    where: { stripePaymentIntentId: paymentIntent.id },
  })

  if (!dbPayment) {
    console.error(`Payment not found: ${paymentIntent.id}`)
    return
  }

  await prisma.paymentIntent.update({
    where: { id: dbPayment.id },
    data: {
      status: 'CANCELLED',
    },
  })
}

async function handleAccountUpdated(account: Stripe.Account) {
  // Find user with this connect account
  const user = await prisma.user.findFirst({
    where: { stripeConnectId: account.id },
  })

  if (!user) {
    console.error(`User not found for connect account: ${account.id}`)
    return
  }

  // Update onboarding status
  const isOnboardingComplete = account.charges_enabled && account.payouts_enabled

  await prisma.user.update({
    where: { id: user.id },
    data: { stripeOnboardingComplete: isOnboardingComplete },
  })
}

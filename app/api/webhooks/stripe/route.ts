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

      // Subscription events
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode === 'subscription') {
          await handleSubscriptionCheckout(session)
        }
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
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

// Subscription handlers
async function handleSubscriptionCheckout(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  if (!userId) {
    console.error('No userId in subscription checkout metadata')
    return
  }

  const subscriptionId = session.subscription as string
  if (!subscriptionId) {
    console.error('No subscription ID in checkout session')
    return
  }

  // Subscription will be created by customer.subscription.created event
  console.log(`Subscription checkout completed for user ${userId}`)
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  // Find user by Stripe customer ID
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  })

  if (!user) {
    console.error(`User not found for customer: ${customerId}`)
    return
  }

  // Get period from subscription item (new Stripe API)
  const subscriptionItem = subscription.items.data[0]
  const periodStart = subscriptionItem?.current_period_start || subscription.start_date
  const periodEnd = subscriptionItem?.current_period_end || (subscription.cancel_at || subscription.start_date + 30 * 24 * 60 * 60)

  // Check if subscription already exists
  const existing = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  })

  if (existing) {
    // Update existing
    await prisma.subscription.update({
      where: { id: existing.id },
      data: {
        status: subscription.status,
        stripePriceId: subscriptionItem?.price.id || '',
        currentPeriodStart: new Date(periodStart * 1000),
        currentPeriodEnd: new Date(periodEnd * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    })
  } else {
    // Create new subscription record
    await prisma.subscription.create({
      data: {
        userId: user.id,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: customerId,
        stripePriceId: subscriptionItem?.price.id || '',
        status: subscription.status,
        currentPeriodStart: new Date(periodStart * 1000),
        currentPeriodEnd: new Date(periodEnd * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    })
  }

  // Notify user
  await createNotification({
    userId: user.id,
    type: 'SYSTEM',
    title: 'Welcome to GrowShare Pro!',
    content: 'Your subscription is now active. Enjoy unlimited access to all premium courses and events.',
    link: '/knowledge',
  })
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  })

  if (!dbSubscription) {
    console.error(`Subscription not found: ${subscription.id}`)
    // Try to create it
    await handleSubscriptionCreated(subscription)
    return
  }

  // Get period from subscription item (new Stripe API)
  const subscriptionItem = subscription.items.data[0]
  const periodStart = subscriptionItem?.current_period_start || subscription.start_date
  const periodEnd = subscriptionItem?.current_period_end || (subscription.cancel_at || subscription.start_date + 30 * 24 * 60 * 60)

  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: subscription.status,
      currentPeriodStart: new Date(periodStart * 1000),
      currentPeriodEnd: new Date(periodEnd * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
    include: { user: true },
  })

  if (!dbSubscription) {
    console.error(`Subscription not found: ${subscription.id}`)
    return
  }

  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: 'canceled',
    },
  })

  // Notify user
  await createNotification({
    userId: dbSubscription.userId,
    type: 'SYSTEM',
    title: 'Subscription Ended',
    content: 'Your GrowShare Pro subscription has ended. You can resubscribe anytime to regain access.',
    link: '/subscription',
  })
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  // Get subscription ID from the new parent structure
  const subscriptionDetails = invoice.parent?.subscription_details
  if (!subscriptionDetails) return

  const subscriptionId = typeof subscriptionDetails.subscription === 'string'
    ? subscriptionDetails.subscription
    : subscriptionDetails.subscription.id

  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  })

  if (!dbSubscription) {
    console.error(`Subscription not found: ${subscriptionId}`)
    return
  }

  // Mark as past due
  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: { status: 'past_due' },
  })

  // Notify user
  await createNotification({
    userId: dbSubscription.userId,
    type: 'SYSTEM',
    title: 'Payment Failed',
    content: 'Your subscription payment failed. Please update your payment method to continue your Pro access.',
    link: '/subscription',
  })
}

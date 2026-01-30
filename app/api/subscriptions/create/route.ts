import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ensureUser } from '@/lib/ensure-user'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ensureUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user already has an active subscription
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
    })

    if (existingSubscription && existingSubscription.status === 'active') {
      return NextResponse.json(
        { error: 'You already have an active subscription' },
        { status: 400 }
      )
    }

    // Get or create Stripe customer
    let stripeCustomerId = user.stripeCustomerId

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || undefined,
        metadata: {
          userId: user.id,
          clerkId: clerkId,
        },
      })
      stripeCustomerId = customer.id

      // Save customer ID to user
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customer.id },
      })
    }

    // Get subscription price ID from env
    const priceId = process.env.STRIPE_SUBSCRIPTION_PRICE_ID

    if (!priceId) {
      return NextResponse.json(
        { error: 'Subscription not available' },
        { status: 500 }
      )
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription`,
      metadata: {
        userId: user.id,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

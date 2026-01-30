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

    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      )
    }

    // Cancel at end of period (don't cancel immediately)
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    })

    // Update local record
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { cancelAtPeriodEnd: true },
    })

    return NextResponse.json({
      success: true,
      message: 'Subscription will be canceled at the end of the billing period',
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}

// Reactivate a subscription that was set to cancel
export async function DELETE(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ensureUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      )
    }

    if (!subscription.cancelAtPeriodEnd) {
      return NextResponse.json(
        { error: 'Subscription is not set to cancel' },
        { status: 400 }
      )
    }

    // Reactivate the subscription
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    })

    // Update local record
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { cancelAtPeriodEnd: false },
    })

    return NextResponse.json({
      success: true,
      message: 'Subscription reactivated',
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to reactivate subscription' },
      { status: 500 }
    )
  }
}

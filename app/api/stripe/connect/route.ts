import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import {
  createConnectAccount,
  createConnectAccountLink,
  retrieveConnectAccount,
  createConnectLoginLink,
} from '@/lib/stripe'
import { rateLimit, getClientIdentifier, rateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'
import { validateRequest, stripeConnectActionSchema } from '@/lib/validations'

// GET: Get connect account status or dashboard link
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

    // Check if user has a connect account
    if (!currentUser.stripeConnectId) {
      return NextResponse.json({
        hasConnectAccount: false,
        onboardingComplete: false,
      })
    }

    // Get account status
    const account = await retrieveConnectAccount(currentUser.stripeConnectId)

    // Update onboarding status if changed
    const isOnboardingComplete = account.charges_enabled && account.payouts_enabled
    if (isOnboardingComplete !== currentUser.stripeOnboardingComplete) {
      await prisma.user.update({
        where: { id: currentUser.id },
        data: { stripeOnboardingComplete: isOnboardingComplete },
      })
    }

    // If onboarding is complete, return dashboard link
    if (isOnboardingComplete) {
      const loginLink = await createConnectLoginLink(currentUser.stripeConnectId)
      return NextResponse.json({
        hasConnectAccount: true,
        onboardingComplete: true,
        dashboardUrl: loginLink.url,
      })
    }

    return NextResponse.json({
      hasConnectAccount: true,
      onboardingComplete: false,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to get connect account status' },
      { status: 500 }
    )
  }
}

// POST: Create connect account or get onboarding link
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limit: 10 connect account operations per minute
    const rateLimitResult = rateLimit(
      getClientIdentifier(request, userId),
      RATE_LIMITS.payment
    )
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult)
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()

    // Validate request body
    const validation = validateRequest(stripeConnectActionSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { action } = validation.data

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Create new connect account
    if (action === 'create' && !currentUser.stripeConnectId) {
      const account = await createConnectAccount(currentUser.email, {
        userId: currentUser.id,
      })

      // Save connect account ID
      await prisma.user.update({
        where: { id: currentUser.id },
        data: { stripeConnectId: account.id },
      })

      // Create onboarding link
      const accountLink = await createConnectAccountLink(
        account.id,
        `${baseUrl}/dashboard/payments/callback?refresh=true`,
        `${baseUrl}/dashboard/payments/callback?success=true`
      )

      return NextResponse.json({
        accountId: account.id,
        onboardingUrl: accountLink.url,
      })
    }

    // Get onboarding link for existing account
    if (action === 'onboard' && currentUser.stripeConnectId) {
      const accountLink = await createConnectAccountLink(
        currentUser.stripeConnectId,
        `${baseUrl}/dashboard/payments/callback?refresh=true`,
        `${baseUrl}/dashboard/payments/callback?success=true`
      )

      return NextResponse.json({
        onboardingUrl: accountLink.url,
      })
    }

    return NextResponse.json(
      { error: 'Invalid action or account state' },
      { status: 400 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Failed to process connect account request' },
      { status: 500 }
    )
  }
}

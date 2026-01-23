import Stripe from 'stripe'

// Lazy initialization to avoid build-time errors when env var is not set
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured')
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    })
  }
  return _stripe
}

// For backwards compatibility - use getStripe() for new code
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    })
  : (null as unknown as Stripe)

// Create a Stripe customer for a user
export async function createStripeCustomer(email: string, name: string, metadata?: Record<string, string>) {
  const customer = await stripe.customers.create({
    email,
    name,
    metadata,
  })
  return customer
}

// Get or create a Stripe customer
export async function getOrCreateCustomer(
  email: string,
  name: string,
  existingCustomerId?: string | null
): Promise<Stripe.Customer> {
  if (existingCustomerId) {
    try {
      const customer = await stripe.customers.retrieve(existingCustomerId)
      if (!customer.deleted) {
        return customer as Stripe.Customer
      }
    } catch {
      // Customer doesn't exist, create a new one
    }
  }

  return createStripeCustomer(email, name)
}

// Create a payment intent
export async function createPaymentIntent({
  amount,
  currency = 'usd',
  customerId,
  metadata,
  connectedAccountId,
  applicationFeeAmount,
}: {
  amount: number
  currency?: string
  customerId?: string
  metadata?: Record<string, string>
  connectedAccountId?: string
  applicationFeeAmount?: number
}) {
  const params: Stripe.PaymentIntentCreateParams = {
    amount,
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
    metadata,
  }

  if (customerId) {
    params.customer = customerId
  }

  // For marketplace payments (to connected accounts)
  if (connectedAccountId) {
    params.transfer_data = {
      destination: connectedAccountId,
    }
    if (applicationFeeAmount) {
      params.application_fee_amount = applicationFeeAmount
    }
  }

  const paymentIntent = await stripe.paymentIntents.create(params)
  return paymentIntent
}

// Retrieve a payment intent
export async function retrievePaymentIntent(paymentIntentId: string) {
  return stripe.paymentIntents.retrieve(paymentIntentId)
}

// Cancel a payment intent
export async function cancelPaymentIntent(paymentIntentId: string) {
  return stripe.paymentIntents.cancel(paymentIntentId)
}

// Create a refund
export async function createRefund(paymentIntentId: string, amount?: number) {
  return stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount, // Optional: partial refund amount in cents
  })
}

// Stripe Connect: Create an account link for onboarding
export async function createConnectAccountLink(
  accountId: string,
  refreshUrl: string,
  returnUrl: string
) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: 'account_onboarding',
  })
  return accountLink
}

// Stripe Connect: Create a connected account
export async function createConnectAccount(email: string, metadata?: Record<string, string>) {
  const account = await stripe.accounts.create({
    type: 'express',
    email,
    capabilities: {
      transfers: { requested: true },
    },
    metadata,
  })
  return account
}

// Stripe Connect: Retrieve account details
export async function retrieveConnectAccount(accountId: string) {
  return stripe.accounts.retrieve(accountId)
}

// Stripe Connect: Create a login link for the Express dashboard
export async function createConnectLoginLink(accountId: string) {
  return stripe.accounts.createLoginLink(accountId)
}

// Verify webhook signature
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}

// Convert dollars to cents
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100)
}

// Convert cents to dollars
export function centsToDollars(cents: number): number {
  return cents / 100
}

// Calculate platform fee (e.g., 10%)
export function calculatePlatformFee(amount: number, feePercent: number = 10): number {
  return Math.round(amount * (feePercent / 100))
}

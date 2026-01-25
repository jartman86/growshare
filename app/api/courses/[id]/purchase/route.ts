import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ensureUser } from '@/lib/ensure-user'
import {
  getStripe,
  dollarsToCents,
  calculatePlatformFee,
  getOrCreateCustomer,
} from '@/lib/stripe'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ensureUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { id } = await params

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            stripeConnectId: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    if (!course.isPublished) {
      return NextResponse.json(
        { error: 'Course is not available for purchase' },
        { status: 400 }
      )
    }

    // Check if already purchased
    const existingPurchase = await prisma.coursePurchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: id,
        },
      },
    })

    if (existingPurchase && existingPurchase.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'You have already purchased this course' },
        { status: 400 }
      )
    }

    // Check if course is purchasable
    if (course.accessType === 'FREE') {
      return NextResponse.json(
        { error: 'This course is free. Use the enroll endpoint instead.' },
        { status: 400 }
      )
    }

    if (course.accessType === 'SUBSCRIPTION') {
      return NextResponse.json(
        { error: 'This course is only available via subscription' },
        { status: 400 }
      )
    }

    if (!course.price || course.price <= 0) {
      return NextResponse.json(
        { error: 'Course price is not configured' },
        { status: 400 }
      )
    }

    // Check if instructor has Stripe Connect
    if (!course.instructor || !course.instructor.stripeConnectId) {
      return NextResponse.json(
        { error: 'Instructor payment setup is incomplete' },
        { status: 400 }
      )
    }

    const stripe = getStripe()
    const amountInCents = dollarsToCents(course.price)
    const platformFee = calculatePlatformFee(amountInCents, 10) // 10% platform fee
    const instructorEarnings = amountInCents - platformFee

    // Get or create Stripe customer
    const email = user.email || `${user.clerkId}@growshare.local`
    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'GrowShare User'
    const customer = await getOrCreateCustomer(email, name, user.stripeCustomerId)

    // Update user's Stripe customer ID if newly created
    if (!user.stripeCustomerId || user.stripeCustomerId !== customer.id) {
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customer.id },
      })
    }

    // Create payment intent with transfer to connected account
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      customer: customer.id,
      transfer_data: {
        destination: course.instructor.stripeConnectId,
      },
      application_fee_amount: platformFee,
      metadata: {
        type: 'course_purchase',
        courseId: course.id,
        courseTitle: course.title,
        userId: user.id,
        instructorId: course.instructor.id,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Create or update purchase record
    if (existingPurchase) {
      await prisma.coursePurchase.update({
        where: { id: existingPurchase.id },
        data: {
          amount: course.price,
          platformFee: platformFee / 100,
          instructorEarnings: instructorEarnings / 100,
          stripePaymentId: paymentIntent.id,
          status: 'PENDING',
        },
      })
    } else {
      await prisma.coursePurchase.create({
        data: {
          userId: user.id,
          courseId: course.id,
          amount: course.price,
          platformFee: platformFee / 100,
          instructorEarnings: instructorEarnings / 100,
          stripePaymentId: paymentIntent.id,
          status: 'PENDING',
        },
      })
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: course.price,
      courseTitle: course.title,
    })
  } catch (error) {
    console.error('Error creating course purchase:', error)
    return NextResponse.json(
      { error: 'Failed to create purchase' },
      { status: 500 }
    )
  }
}

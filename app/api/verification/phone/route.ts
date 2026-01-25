import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { rateLimit, getClientIdentifier, rateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'
import { validateRequest, phoneVerificationRequestSchema, phoneVerificationVerifySchema } from '@/lib/validations'

// Generate a 6-digit code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Hash the code for storage
function hashCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex')
}

// Send SMS via Twilio (or simulate in development)
async function sendSMS(phoneNumber: string, code: string): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_PHONE_NUMBER

  // If Twilio is not configured
  if (!accountSid || !authToken || !fromNumber) {
    // In production, fail if Twilio is not configured
    if (process.env.NODE_ENV === 'production') {
      console.error('Twilio is not configured - cannot send SMS in production')
      return false
    }
    // In development, log the code for testing
    console.log(`[DEV] Phone verification code for ${phoneNumber}: ${code}`)
    return true
  }

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: phoneNumber,
          From: fromNumber,
          Body: `Your GrowShare verification code is: ${code}. This code expires in 10 minutes.`,
        }),
      }
    )

    return response.ok
  } catch (error) {
    console.error('Error sending SMS:', error)
    return false
  }
}

// POST - Request phone verification (send code)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limit: 3 verification requests per minute
    const rateLimitResult = rateLimit(
      getClientIdentifier(request, userId),
      RATE_LIMITS.verification
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

    // Check if already verified
    if (currentUser.isPhoneVerified) {
      return NextResponse.json(
        { error: 'Phone already verified' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Validate request body
    const validation = validateRequest(phoneVerificationRequestSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { phoneNumber } = validation.data
    const cleanPhone = phoneNumber.replace(/\D/g, '')

    // Check for recent verification request (rate limiting)
    const recentRequest = await prisma.verificationRequest.findFirst({
      where: {
        userId: currentUser.id,
        type: 'PHONE',
        createdAt: { gte: new Date(Date.now() - 60 * 1000) }, // 1 minute
      },
    })

    if (recentRequest) {
      return NextResponse.json(
        { error: 'Please wait before requesting another code' },
        { status: 429 }
      )
    }

    // Generate and send code
    const code = generateCode()
    const hashedCode = hashCode(code)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Send SMS
    const sent = await sendSMS(phoneNumber, code)

    if (!sent) {
      return NextResponse.json(
        { error: 'Failed to send verification code' },
        { status: 500 }
      )
    }

    // Update user's phone number
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { phoneNumber },
    })

    // Create verification request
    await prisma.verificationRequest.create({
      data: {
        userId: currentUser.id,
        type: 'PHONE',
        status: 'PENDING',
        phoneCode: hashedCode,
        phoneCodeExpires: expiresAt,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Verification code sent',
      expiresAt: expiresAt.toISOString(),
    })
  } catch (error) {
    console.error('Error sending verification code:', error)
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    )
  }
}

// PUT - Verify phone code
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limit: 3 verification attempts per minute (prevent brute force)
    const rateLimitResult = rateLimit(
      getClientIdentifier(request, userId),
      RATE_LIMITS.verification
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
    const validation = validateRequest(phoneVerificationVerifySchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { code } = validation.data

    // Find pending verification request
    const verificationRequest = await prisma.verificationRequest.findFirst({
      where: {
        userId: currentUser.id,
        type: 'PHONE',
        status: 'PENDING',
        phoneCodeExpires: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!verificationRequest) {
      return NextResponse.json(
        { error: 'No pending verification or code expired' },
        { status: 400 }
      )
    }

    // Verify code
    const hashedInput = hashCode(code)
    if (hashedInput !== verificationRequest.phoneCode) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    // Mark as verified
    await prisma.$transaction([
      prisma.verificationRequest.update({
        where: { id: verificationRequest.id },
        data: {
          status: 'APPROVED',
          reviewedAt: new Date(),
        },
      }),
      prisma.user.update({
        where: { id: currentUser.id },
        data: {
          isPhoneVerified: true,
          phoneVerifiedAt: new Date(),
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      message: 'Phone number verified',
    })
  } catch (error) {
    console.error('Error verifying phone:', error)
    return NextResponse.json(
      { error: 'Failed to verify phone' },
      { status: 500 }
    )
  }
}

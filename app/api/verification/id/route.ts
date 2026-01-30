import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { rateLimit, getClientIdentifier, rateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'
import { validateRequest, idVerificationRequestSchema } from '@/lib/validations'

// POST - Submit ID for verification
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limit: 3 verification submissions per minute
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
    if (currentUser.isIdVerified) {
      return NextResponse.json(
        { error: 'ID already verified' },
        { status: 400 }
      )
    }

    // Check for pending request
    const pendingRequest = await prisma.verificationRequest.findFirst({
      where: {
        userId: currentUser.id,
        type: 'ID',
        status: 'PENDING',
      },
    })

    if (pendingRequest) {
      return NextResponse.json(
        { error: 'You already have a pending ID verification request' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Validate request body
    const validation = validateRequest(idVerificationRequestSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { documentUrl } = validation.data

    // Create verification request
    const verificationRequest = await prisma.verificationRequest.create({
      data: {
        userId: currentUser.id,
        type: 'ID',
        status: 'PENDING',
        documentUrl,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'ID verification submitted for review',
      requestId: verificationRequest.id,
    }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to submit ID verification' },
      { status: 500 }
    )
  }
}

// GET - Get user's verification status
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        isVerified: true,
        isPhoneVerified: true,
        phoneVerifiedAt: true,
        isIdVerified: true,
        idVerifiedAt: true,
        phoneNumber: true,
      },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get pending requests
    const pendingRequests = await prisma.verificationRequest.findMany({
      where: {
        user: { clerkId: userId },
        status: 'PENDING',
      },
      select: {
        id: true,
        type: true,
        status: true,
        createdAt: true,
      },
    })

    // Get recent rejected requests
    const recentRejected = await prisma.verificationRequest.findMany({
      where: {
        user: { clerkId: userId },
        status: 'REJECTED',
        reviewedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // 30 days
      },
      select: {
        id: true,
        type: true,
        status: true,
        notes: true,
        reviewedAt: true,
      },
      orderBy: { reviewedAt: 'desc' },
    })

    return NextResponse.json({
      email: {
        verified: currentUser.isVerified,
      },
      phone: {
        verified: currentUser.isPhoneVerified,
        verifiedAt: currentUser.phoneVerifiedAt,
        number: currentUser.phoneNumber,
        pending: pendingRequests.some((r) => r.type === 'PHONE'),
      },
      id: {
        verified: currentUser.isIdVerified,
        verifiedAt: currentUser.idVerifiedAt,
        pending: pendingRequests.some((r) => r.type === 'ID'),
      },
      pendingRequests,
      recentRejected,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch verification status' },
      { status: 500 }
    )
  }
}

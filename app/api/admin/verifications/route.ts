import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

// GET - List verification requests (admin only)
export async function GET(request: NextRequest) {
  try {
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'PENDING'
    const type = searchParams.get('type') // PHONE, ID, ADDRESS
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: Record<string, unknown> = {}

    if (status && status !== 'ALL') {
      where.status = status
    }

    if (type) {
      where.type = type
    }

    const [requests, total] = await Promise.all([
      prisma.verificationRequest.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
              createdAt: true,
              isPhoneVerified: true,
              isIdVerified: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.verificationRequest.count({ where }),
    ])

    return NextResponse.json({
      requests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch verification requests' },
      { status: 500 }
    )
  }
}

// PATCH - Approve or reject a verification request (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { requestId, action, notes } = body

    if (!requestId || !['APPROVE', 'REJECT'].includes(action)) {
      return NextResponse.json(
        { error: 'Request ID and valid action required' },
        { status: 400 }
      )
    }

    const verificationRequest = await prisma.verificationRequest.findUnique({
      where: { id: requestId },
      include: { user: true },
    })

    if (!verificationRequest) {
      return NextResponse.json(
        { error: 'Verification request not found' },
        { status: 404 }
      )
    }

    if (verificationRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Request has already been processed' },
        { status: 400 }
      )
    }

    const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED'

    // Update request and user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const updatedRequest = await tx.verificationRequest.update({
        where: { id: requestId },
        data: {
          status: newStatus,
          notes: notes || null,
          reviewedAt: new Date(),
          reviewedBy: admin.id,
        },
      })

      // If approved, update user verification status
      if (action === 'APPROVE') {
        const updateData: Record<string, unknown> = {}

        if (verificationRequest.type === 'PHONE') {
          updateData.isPhoneVerified = true
          updateData.phoneVerifiedAt = new Date()
        } else if (verificationRequest.type === 'ID') {
          updateData.isIdVerified = true
          updateData.idVerifiedAt = new Date()
        }

        if (Object.keys(updateData).length > 0) {
          await tx.user.update({
            where: { id: verificationRequest.userId },
            data: updateData,
          })
        }
      }

      return updatedRequest
    })

    return NextResponse.json({
      success: true,
      request: result,
      message: `Verification ${action.toLowerCase()}d successfully`,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to process verification request' },
      { status: 500 }
    )
  }
}

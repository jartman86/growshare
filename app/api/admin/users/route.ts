import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/admin-auth'
import { rateLimit, rateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'
import { validateRequest, adminUserActionSchema } from '@/lib/validations'

// Get all users with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const admin = await isAdmin()

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const role = searchParams.get('role') || ''
    const verified = searchParams.get('verified')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (role) {
      where.role = { has: role }
    }

    if (verified === 'true') {
      where.isVerified = true
    } else if (verified === 'false') {
      where.isVerified = false
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          clerkId: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
          role: true,
          status: true,
          isVerified: true,
          verifiedAt: true,
          totalPoints: true,
          level: true,
          createdAt: true,
          lastLoginAt: true,
          _count: {
            select: {
              ownedPlots: true,
              rentedPlots: true,
              reviews: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// Update user (suspend, activate, verify, change role)
export async function PATCH(request: NextRequest) {
  try {
    const admin = await isAdmin()

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limit: 30 admin actions per minute
    const rateLimitResult = rateLimit(
      `admin:${admin.id}`,
      RATE_LIMITS.mutation
    )
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult)
    }

    const body = await request.json()

    // Validate request body
    const validation = validateRequest(adminUserActionSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { userId, action, role } = validation.data

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Prevent modifying other admins (unless you're modifying yourself)
    if (user.role.includes('ADMIN') && user.id !== admin.id) {
      return NextResponse.json(
        { error: 'Cannot modify other admin users' },
        { status: 403 }
      )
    }

    let updateData: any = {}

    switch (action) {
      case 'suspend':
        updateData.status = 'SUSPENDED'
        break

      case 'activate':
        updateData.status = 'ACTIVE'
        break

      case 'verify':
        updateData.isVerified = true
        updateData.verifiedAt = new Date()
        break

      case 'unverify':
        updateData.isVerified = false
        updateData.verifiedAt = null
        break

      case 'addRole':
        if (!role) {
          return NextResponse.json({ error: 'Role required' }, { status: 400 })
        }
        if (!user.role.includes(role)) {
          updateData.role = [...user.role, role]
        }
        break

      case 'removeRole':
        if (!role) {
          return NextResponse.json({ error: 'Role required' }, { status: 400 })
        }
        // Can't remove the last role
        if (user.role.length <= 1) {
          return NextResponse.json(
            { error: 'User must have at least one role' },
            { status: 400 }
          )
        }
        updateData.role = user.role.filter((r: string) => r !== role)
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        isVerified: true,
        verifiedAt: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

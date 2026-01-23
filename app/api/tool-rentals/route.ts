import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

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

    const searchParams = request.nextUrl.searchParams
    const role = searchParams.get('role') // 'renter' or 'owner'
    const status = searchParams.get('status')

    const where: any = {}

    if (role === 'owner') {
      where.tool = { ownerId: currentUser.id }
    } else {
      where.renterId = currentUser.id
    }

    if (status) {
      where.status = status
    }

    const rentals = await prisma.toolRental.findMany({
      where,
      include: {
        tool: {
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                email: true,
              },
            },
          },
        },
        renter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(rentals)
  } catch (error) {
    console.error('Error fetching tool rentals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rentals' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json()

    // Validate required fields
    if (!body.toolId) {
      return NextResponse.json(
        { error: 'Tool ID is required' },
        { status: 400 }
      )
    }

    if (!body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: 'Start and end dates are required' },
        { status: 400 }
      )
    }

    const startDate = new Date(body.startDate)
    const endDate = new Date(body.endDate)

    if (endDate <= startDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    // Get tool
    const tool = await prisma.tool.findUnique({
      where: { id: body.toolId },
      include: { owner: true },
    })

    if (!tool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      )
    }

    if (tool.status !== 'AVAILABLE') {
      return NextResponse.json(
        { error: 'Tool is not available for rent' },
        { status: 400 }
      )
    }

    if (tool.listingType === 'SALE') {
      return NextResponse.json(
        { error: 'This tool is for sale only, not available for rent' },
        { status: 400 }
      )
    }

    if (tool.ownerId === currentUser.id) {
      return NextResponse.json(
        { error: 'You cannot rent your own tool' },
        { status: 400 }
      )
    }

    // Check for conflicting rentals
    const conflictingRental = await prisma.toolRental.findFirst({
      where: {
        toolId: tool.id,
        status: { in: ['APPROVED', 'ACTIVE'] },
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
    })

    if (conflictingRental) {
      return NextResponse.json(
        { error: 'Tool is already booked for those dates' },
        { status: 400 }
      )
    }

    // Calculate rental cost
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const dailyRate = tool.dailyRate || 0

    // Apply weekly rate if applicable
    let totalCost: number
    if (days >= 7 && tool.weeklyRate) {
      const weeks = Math.floor(days / 7)
      const remainingDays = days % 7
      totalCost = (weeks * tool.weeklyRate) + (remainingDays * dailyRate)
    } else {
      totalCost = days * dailyRate
    }

    const rental = await prisma.toolRental.create({
      data: {
        toolId: tool.id,
        renterId: currentUser.id,
        startDate,
        endDate,
        dailyRate,
        totalCost,
        depositAmount: tool.depositRequired || null,
        status: 'PENDING',
        renterNotes: body.notes || null,
      },
      include: {
        tool: {
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        renter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    // Notify tool owner
    await createNotification({
      userId: tool.ownerId,
      type: 'BOOKING_REQUEST',
      title: 'New Tool Rental Request',
      content: `${currentUser.firstName} ${currentUser.lastName} requested to rent your ${tool.name}`,
      link: '/tools/my-rentals?role=owner',
      metadata: { rentalId: rental.id },
    })

    return NextResponse.json(rental, { status: 201 })
  } catch (error) {
    console.error('Error creating tool rental:', error)
    return NextResponse.json(
      { error: 'Failed to create rental request' },
      { status: 500 }
    )
  }
}

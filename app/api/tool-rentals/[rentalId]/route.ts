import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ rentalId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { rentalId } = await params

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const rental = await prisma.toolRental.findUnique({
      where: { id: rentalId },
      include: {
        tool: {
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
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
          },
        },
      },
    })

    if (!rental) {
      return NextResponse.json(
        { error: 'Rental not found' },
        { status: 404 }
      )
    }

    // Check access
    if (rental.renterId !== currentUser.id && rental.tool.ownerId !== currentUser.id) {
      return NextResponse.json(
        { error: 'You do not have access to this rental' },
        { status: 403 }
      )
    }

    return NextResponse.json(rental)
  } catch (error) {
    console.error('Error fetching rental:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rental' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ rentalId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { rentalId } = await params

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const rental = await prisma.toolRental.findUnique({
      where: { id: rentalId },
      include: {
        tool: {
          include: { owner: true },
        },
        renter: true,
      },
    })

    if (!rental) {
      return NextResponse.json(
        { error: 'Rental not found' },
        { status: 404 }
      )
    }

    const isOwner = rental.tool.ownerId === currentUser.id
    const isRenter = rental.renterId === currentUser.id

    if (!isOwner && !isRenter) {
      return NextResponse.json(
        { error: 'You do not have access to this rental' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { status, ownerNotes, renterNotes } = body

    // Validate status transitions
    const validTransitions: Record<string, { owner: string[]; renter: string[] }> = {
      PENDING: { owner: ['APPROVED', 'CANCELLED'], renter: ['CANCELLED'] },
      APPROVED: { owner: ['ACTIVE', 'CANCELLED'], renter: ['CANCELLED'] },
      ACTIVE: { owner: ['COMPLETED'], renter: ['COMPLETED'] },
      COMPLETED: { owner: [], renter: [] },
      CANCELLED: { owner: [], renter: [] },
    }

    const allowedStatuses = isOwner
      ? validTransitions[rental.status]?.owner || []
      : validTransitions[rental.status]?.renter || []

    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Cannot change status from ${rental.status} to ${status}` },
        { status: 400 }
      )
    }

    const updateData: any = {}

    if (status) {
      updateData.status = status

      if (status === 'APPROVED') {
        updateData.approvedAt = new Date()
        // Update tool status
        await prisma.tool.update({
          where: { id: rental.toolId },
          data: { status: 'RENTED' },
        })
      } else if (status === 'ACTIVE') {
        updateData.pickedUpAt = new Date()
      } else if (status === 'COMPLETED') {
        updateData.returnedAt = new Date()
        // Update tool status back to available
        await prisma.tool.update({
          where: { id: rental.toolId },
          data: { status: 'AVAILABLE' },
        })
      } else if (status === 'CANCELLED') {
        updateData.cancelledAt = new Date()
        // If was approved, update tool status
        if (rental.status === 'APPROVED' || rental.status === 'ACTIVE') {
          await prisma.tool.update({
            where: { id: rental.toolId },
            data: { status: 'AVAILABLE' },
          })
        }
      }
    }

    if (ownerNotes !== undefined && isOwner) {
      updateData.ownerNotes = ownerNotes
    }

    if (renterNotes !== undefined && isRenter) {
      updateData.renterNotes = renterNotes
    }

    const updatedRental = await prisma.toolRental.update({
      where: { id: rentalId },
      data: updateData,
      include: {
        tool: true,
        renter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    // Send notifications based on status change
    if (status === 'APPROVED') {
      await createNotification({
        userId: rental.renterId,
        type: 'BOOKING_APPROVED',
        title: 'Tool Rental Approved',
        content: `Your rental request for ${rental.tool.name} has been approved`,
        link: '/tools/my-rentals',
        metadata: { rentalId },
      })
    } else if (status === 'CANCELLED') {
      const notifyUserId = isOwner ? rental.renterId : rental.tool.ownerId
      await createNotification({
        userId: notifyUserId,
        type: 'BOOKING_CANCELLED',
        title: 'Tool Rental Cancelled',
        content: `The rental for ${rental.tool.name} has been cancelled`,
        link: '/tools/my-rentals',
        metadata: { rentalId },
      })
    }

    return NextResponse.json(updatedRental)
  } catch (error) {
    console.error('Error updating rental:', error)
    return NextResponse.json(
      { error: 'Failed to update rental' },
      { status: 500 }
    )
  }
}

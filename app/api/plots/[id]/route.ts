import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const plot = await prisma.plot.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            isVerified: true,
            username: true,
          },
        },
        amenities: true,
        reviews: {
          include: {
            renter: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        bookings: {
          where: {
            status: {
              in: ['CONFIRMED', 'ACTIVE'],
            },
          },
          orderBy: {
            startDate: 'asc',
          },
        },
      },
    })

    if (!plot) {
      return NextResponse.json({ error: 'Plot not found' }, { status: 404 })
    }

    return NextResponse.json(plot)
  } catch (error) {
    console.error('Error fetching plot:', error)
    return NextResponse.json(
      { error: 'Failed to fetch plot' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Get the current user from database
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if plot exists and belongs to user
    const existingPlot = await prisma.plot.findUnique({
      where: { id },
    })

    if (!existingPlot) {
      return NextResponse.json({ error: 'Plot not found' }, { status: 404 })
    }

    if (existingPlot.ownerId !== currentUser.id) {
      return NextResponse.json(
        { error: 'You do not have permission to edit this plot' },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Convert form values to uppercase enum values if provided
    const updateData: any = {}

    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.status !== undefined) updateData.status = body.status
    if (body.address !== undefined) updateData.address = body.address
    if (body.city !== undefined) updateData.city = body.city
    if (body.state !== undefined) updateData.state = body.state
    if (body.zipCode !== undefined) updateData.zipCode = body.zipCode
    if (body.county !== undefined) updateData.county = body.county
    if (body.latitude !== undefined) updateData.latitude = body.latitude
    if (body.longitude !== undefined) updateData.longitude = body.longitude
    if (body.acreage !== undefined) updateData.acreage = body.acreage
    if (body.soilPH !== undefined) updateData.soilPH = body.soilPH
    if (body.usdaZone !== undefined) updateData.usdaZone = body.usdaZone
    if (body.sunExposure !== undefined) updateData.sunExposure = body.sunExposure
    if (body.hasFencing !== undefined) updateData.hasFencing = body.hasFencing
    if (body.hasGreenhouse !== undefined) updateData.hasGreenhouse = body.hasGreenhouse
    if (body.hasToolStorage !== undefined) updateData.hasToolStorage = body.hasToolStorage
    if (body.hasElectricity !== undefined) updateData.hasElectricity = body.hasElectricity
    if (body.hasRoadAccess !== undefined) updateData.hasRoadAccess = body.hasRoadAccess
    if (body.hasIrrigation !== undefined) updateData.hasIrrigation = body.hasIrrigation
    if (body.isADAAccessible !== undefined) updateData.isADAAccessible = body.isADAAccessible
    if (body.allowsLivestock !== undefined) updateData.allowsLivestock = body.allowsLivestock
    if (body.allowsStructures !== undefined) updateData.allowsStructures = body.allowsStructures
    if (body.restrictions !== undefined) updateData.restrictions = body.restrictions
    if (body.pricePerMonth !== undefined) updateData.pricePerMonth = body.pricePerMonth
    if (body.pricePerSeason !== undefined) updateData.pricePerSeason = body.pricePerSeason
    if (body.pricePerYear !== undefined) updateData.pricePerYear = body.pricePerYear
    if (body.securityDeposit !== undefined) updateData.securityDeposit = body.securityDeposit
    if (body.instantBook !== undefined) updateData.instantBook = body.instantBook
    if (body.minimumLease !== undefined) updateData.minimumLease = body.minimumLease
    if (body.images !== undefined) updateData.images = body.images
    if (body.droneFootageUrl !== undefined) updateData.droneFootageUrl = body.droneFootageUrl
    if (body.virtualTourUrl !== undefined) updateData.virtualTourUrl = body.virtualTourUrl

    if (body.soilType !== undefined) {
      updateData.soilType = body.soilType.map((type: string) => type.toUpperCase())
    }

    if (body.waterAccess !== undefined) {
      updateData.waterAccess = body.waterAccess.map((access: string) => {
        if (access === 'Stream/Creek') return 'STREAM'
        if (access === 'Pond/Lake') return 'POND'
        if (access === 'Rainwater Collection') return 'IRRIGATION'
        return access.toUpperCase()
      })
    }

    // Update the plot
    const plot = await prisma.plot.update({
      where: { id },
      data: updateData,
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
    })

    return NextResponse.json(plot)
  } catch (error) {
    console.error('Error updating plot:', error)
    return NextResponse.json(
      { error: 'Failed to update plot' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Get the current user from database
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if plot exists and belongs to user
    const existingPlot = await prisma.plot.findUnique({
      where: { id },
      include: {
        bookings: {
          where: {
            status: {
              in: ['CONFIRMED', 'ACTIVE'],
            },
          },
        },
      },
    })

    if (!existingPlot) {
      return NextResponse.json({ error: 'Plot not found' }, { status: 404 })
    }

    if (existingPlot.ownerId !== currentUser.id) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this plot' },
        { status: 403 }
      )
    }

    // Check if plot has active bookings
    if (existingPlot.bookings.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete plot with active bookings' },
        { status: 400 }
      )
    }

    // Delete the plot
    await prisma.plot.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Plot deleted successfully' })
  } catch (error) {
    console.error('Error deleting plot:', error)
    return NextResponse.json(
      { error: 'Failed to delete plot' },
      { status: 500 }
    )
  }
}

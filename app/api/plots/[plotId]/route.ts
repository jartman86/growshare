import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ plotId: string }> }
) {
  try {
    const { plotId } = await params

    const plot = await prisma.plot.findUnique({
      where: { id: plotId },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
            isVerified: true,
            createdAt: true,
          },
        },
        amenities: true,
        soilTests: {
          orderBy: { testDate: 'desc' },
          take: 1,
        },
        reviews: {
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        bookings: {
          where: { status: 'ACTIVE' },
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
        },
      },
    })

    if (!plot) {
      return NextResponse.json({ error: 'Plot not found' }, { status: 404 })
    }

    // Increment view count
    await prisma.plot.update({
      where: { id: plotId },
      data: { viewCount: { increment: 1 } },
    })

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
  { params }: { params: Promise<{ plotId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plotId } = await params
    const body = await request.json()

    // Get the current user from database
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user owns this plot
    const plot = await prisma.plot.findUnique({
      where: { id: plotId },
    })

    if (!plot) {
      return NextResponse.json({ error: 'Plot not found' }, { status: 404 })
    }

    if (plot.ownerId !== currentUser.id) {
      return NextResponse.json(
        { error: 'You can only update your own plots' },
        { status: 403 }
      )
    }

    // Update the plot
    const updatedPlot = await prisma.plot.update({
      where: { id: plotId },
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        address: body.address,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode,
        county: body.county,
        latitude: body.latitude,
        longitude: body.longitude,
        acreage: body.acreage,
        soilType: body.soilType,
        soilPH: body.soilPH,
        waterAccess: body.waterAccess,
        usdaZone: body.usdaZone,
        sunExposure: body.sunExposure,
        hasFencing: body.hasFencing,
        hasGreenhouse: body.hasGreenhouse,
        hasToolStorage: body.hasToolStorage,
        hasElectricity: body.hasElectricity,
        hasRoadAccess: body.hasRoadAccess,
        hasIrrigation: body.hasIrrigation,
        isADAAccessible: body.isADAAccessible,
        allowsLivestock: body.allowsLivestock,
        allowsStructures: body.allowsStructures,
        restrictions: body.restrictions,
        pricePerMonth: body.pricePerMonth,
        pricePerSeason: body.pricePerSeason,
        pricePerYear: body.pricePerYear,
        securityDeposit: body.securityDeposit,
        instantBook: body.instantBook,
        minimumLease: body.minimumLease,
        images: body.images,
        droneFootageUrl: body.droneFootageUrl,
        virtualTourUrl: body.virtualTourUrl,
        publishedAt: body.status === 'ACTIVE' && !plot.publishedAt ? new Date() : plot.publishedAt,
      },
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

    return NextResponse.json(updatedPlot)
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
  { params }: { params: Promise<{ plotId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plotId } = await params

    // Get the current user from database
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user owns this plot
    const plot = await prisma.plot.findUnique({
      where: { id: plotId },
    })

    if (!plot) {
      return NextResponse.json({ error: 'Plot not found' }, { status: 404 })
    }

    if (plot.ownerId !== currentUser.id) {
      return NextResponse.json(
        { error: 'You can only delete your own plots' },
        { status: 403 }
      )
    }

    // Check if there are active bookings
    const activeBookings = await prisma.booking.count({
      where: {
        plotId,
        status: { in: ['ACTIVE', 'APPROVED'] },
      },
    })

    if (activeBookings > 0) {
      return NextResponse.json(
        { error: 'Cannot delete plot with active bookings' },
        { status: 400 }
      )
    }

    // Delete the plot (cascade will handle related records)
    await prisma.plot.delete({
      where: { id: plotId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting plot:', error)
    return NextResponse.json(
      { error: 'Failed to delete plot' },
      { status: 500 }
    )
  }
}

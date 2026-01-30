import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// Helper function to geocode an address
async function geocodeAddress(address: string, city: string, state: string, zipCode: string): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const fullAddress = `${address}, ${city}, ${state} ${zipCode}, USA`
    const encodedAddress = encodeURIComponent(fullAddress)

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`,
      {
        headers: {
          'User-Agent': 'GrowShare/1.0',
        },
      }
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      }
    }

    return null
  } catch {
    return null
  }
}

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
  } catch {
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

    // Convert form values to uppercase enum values
    const soilTypeEnum = body.soilType
      ? body.soilType.map((type: string) => type.toUpperCase())
      : undefined

    const waterAccessEnum = body.waterAccess
      ? body.waterAccess.map((access: string) => {
          // Handle special cases
          if (access === 'Stream/Creek') return 'STREAM'
          if (access === 'Pond/Lake') return 'POND'
          if (access === 'Rainwater Collection') return 'IRRIGATION'
          return access.toUpperCase()
        })
      : undefined

    // Geocode address if coordinates not provided or invalid
    let latitude = body.latitude
    let longitude = body.longitude

    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
      const coords = await geocodeAddress(body.address, body.city, body.state, body.zipCode)
      if (coords) {
        latitude = coords.latitude
        longitude = coords.longitude
      } else {
        // Keep existing coordinates if geocoding fails
        latitude = plot.latitude
        longitude = plot.longitude
      }
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
        latitude: latitude,
        longitude: longitude,
        acreage: body.acreage,
        soilType: soilTypeEnum,
        soilPH: body.soilPH,
        waterAccess: waterAccessEnum,
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
  } catch {
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
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete plot' },
      { status: 500 }
    )
  }
}

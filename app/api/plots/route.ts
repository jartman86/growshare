import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const minAcreage = searchParams.get('minAcreage')
    const maxAcreage = searchParams.get('maxAcreage')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const status = searchParams.get('status')
    const soilTypes = searchParams.get('soilTypes')
    const waterAccess = searchParams.get('waterAccess')
    const hasIrrigation = searchParams.get('hasIrrigation')
    const hasFencing = searchParams.get('hasFencing')
    const hasGreenhouse = searchParams.get('hasGreenhouse')
    const hasElectricity = searchParams.get('hasElectricity')

    const where: any = {}

    // Status filter - support multiple statuses or default to ACTIVE and RENTED
    if (status) {
      const statuses = status.split(',')
      where.status = { in: statuses }
    } else {
      where.status = { in: ['ACTIVE', 'RENTED'] }
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' }
    }

    if (state) {
      where.state = { contains: state, mode: 'insensitive' }
    }

    if (minAcreage || maxAcreage) {
      where.acreage = {}
      if (minAcreage) where.acreage.gte = parseFloat(minAcreage)
      if (maxAcreage) where.acreage.lte = parseFloat(maxAcreage)
    }

    if (minPrice || maxPrice) {
      where.pricePerMonth = {}
      if (minPrice) where.pricePerMonth.gte = parseFloat(minPrice)
      if (maxPrice) where.pricePerMonth.lte = parseFloat(maxPrice)
    }

    // Soil types filter
    if (soilTypes) {
      const types = soilTypes.split(',')
      where.soilType = { hasSome: types }
    }

    // Water access filter
    if (waterAccess) {
      const access = waterAccess.split(',')
      where.waterAccess = { hasSome: access }
    }

    // Feature filters
    if (hasIrrigation === 'true') where.hasIrrigation = true
    if (hasFencing === 'true') where.hasFencing = true
    if (hasGreenhouse === 'true') where.hasGreenhouse = true
    if (hasElectricity === 'true') where.hasElectricity = true

    const plots = await prisma.plot.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            isVerified: true,
          },
        },
        amenities: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Transform to PlotMarker format with calculated average ratings
    const plotMarkers = plots.map(plot => {
      const ratings = plot.reviews.map(r => r.rating)
      const averageRating = ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : undefined

      return {
        id: plot.id,
        title: plot.title,
        latitude: plot.latitude,
        longitude: plot.longitude,
        acreage: plot.acreage,
        pricePerMonth: plot.pricePerMonth,
        status: plot.status,
        images: plot.images,
        city: plot.city,
        state: plot.state,
        soilType: plot.soilType,
        waterAccess: plot.waterAccess,
        hasIrrigation: plot.hasIrrigation,
        hasFencing: plot.hasFencing,
        hasGreenhouse: plot.hasGreenhouse,
        averageRating,
        ownerName: `${plot.owner.firstName} ${plot.owner.lastName}`,
        ownerAvatar: plot.owner.avatar || undefined,
      }
    })

    return NextResponse.json(plotMarkers)
  } catch (error) {
    console.error('Error fetching plots:', error)
    return NextResponse.json(
      { error: 'Failed to fetch plots' },
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

    // Get the current user from database
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()

    // Convert form values to uppercase enum values
    const soilTypeEnum = (body.soilType || []).map((type: string) => type.toUpperCase())
    const waterAccessEnum = (body.waterAccess || []).map((access: string) => {
      // Handle special cases
      if (access === 'Stream/Creek') return 'STREAM'
      if (access === 'Pond/Lake') return 'POND'
      if (access === 'Rainwater Collection') return 'IRRIGATION'
      return access.toUpperCase()
    })

    // Create the plot
    const plot = await prisma.plot.create({
      data: {
        ownerId: currentUser.id,
        title: body.title,
        description: body.description,
        status: 'DRAFT',
        address: body.address,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode,
        county: body.county,
        latitude: body.latitude,
        longitude: body.longitude,
        acreage: body.acreage,
        soilType: soilTypeEnum,
        soilPH: body.soilPH,
        waterAccess: waterAccessEnum,
        usdaZone: body.usdaZone,
        sunExposure: body.sunExposure,
        hasFencing: body.hasFencing || false,
        hasGreenhouse: body.hasGreenhouse || false,
        hasToolStorage: body.hasToolStorage || false,
        hasElectricity: body.hasElectricity || false,
        hasRoadAccess: body.hasRoadAccess || false,
        hasIrrigation: body.hasIrrigation || false,
        isADAAccessible: body.isADAAccessible || false,
        allowsLivestock: body.allowsLivestock || false,
        allowsStructures: body.allowsStructures || false,
        restrictions: body.restrictions,
        pricePerMonth: body.pricePerMonth,
        pricePerSeason: body.pricePerSeason,
        pricePerYear: body.pricePerYear,
        securityDeposit: body.securityDeposit,
        instantBook: body.instantBook || false,
        minimumLease: body.minimumLease || 3,
        images: body.images || [],
        droneFootageUrl: body.droneFootageUrl,
        virtualTourUrl: body.virtualTourUrl,
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

    // Award badge for first plot listing
    const plotsCount = await prisma.plot.count({
      where: { ownerId: currentUser.id },
    })

    if (plotsCount === 1) {
      const landSharerBadge = await prisma.badge.findFirst({
        where: { name: 'Land Sharer' },
      })

      if (landSharerBadge) {
        await prisma.userBadge.create({
          data: {
            userId: currentUser.id,
            badgeId: landSharerBadge.id,
          },
        })

        await prisma.user.update({
          where: { id: currentUser.id },
          data: { totalPoints: { increment: landSharerBadge.points } },
        })
      }
    }

    // Create activity
    await prisma.userActivity.create({
      data: {
        userId: currentUser.id,
        type: 'PLOT_LISTED',
        title: 'Listed new plot',
        description: plot.title,
        points: 50,
      },
    })

    // Add points for listing
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { totalPoints: { increment: 50 } },
    })

    return NextResponse.json(plot, { status: 201 })
  } catch (error) {
    console.error('Error creating plot:', error)
    return NextResponse.json(
      { error: 'Failed to create plot' },
      { status: 500 }
    )
  }
}

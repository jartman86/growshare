import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { ensureUser, ensureVerifiedUser, EmailNotVerifiedError } from '@/lib/ensure-user'

// Helper function to geocode an address
async function geocodeAddress(address: string, city: string, state: string, zipCode: string): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const fullAddress = `${address}, ${city}, ${state} ${zipCode}, USA`
    const encodedAddress = encodeURIComponent(fullAddress)

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`,
      {
        headers: {
          'User-Agent': 'GrowShare/1.0', // Nominatim requires a User-Agent
        },
      }
    )

    if (!response.ok) {
      console.error('Geocoding API error:', response.statusText)
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
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

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
    const sortBy = searchParams.get('sortBy') || 'newest'
    const availableFrom = searchParams.get('availableFrom')
    const availableTo = searchParams.get('availableTo')
    const instantBookOnly = searchParams.get('instantBookOnly')
    const minRating = searchParams.get('minRating')

    // Dynamic where clause for flexible filtering from request params
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    if (instantBookOnly === 'true') where.instantBook = true

    // Determine sort order
    let orderBy: Prisma.PlotOrderByWithRelationInput = { createdAt: 'desc' }
    switch (sortBy) {
      case 'price-low':
        orderBy = { pricePerMonth: 'asc' }
        break
      case 'price-high':
        orderBy = { pricePerMonth: 'desc' }
        break
      case 'acreage-low':
        orderBy = { acreage: 'asc' }
        break
      case 'acreage-high':
        orderBy = { acreage: 'desc' }
        break
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' }
    }

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
            isPhoneVerified: true,
            isIdVerified: true,
          },
        },
        amenities: true,
        reviews: {
          select: {
            rating: true,
          },
        },
        bookings: availableFrom || availableTo ? {
          where: {
            status: { in: ['APPROVED', 'ACTIVE'] },
          },
          select: {
            startDate: true,
            endDate: true,
          },
        } : false,
        blockedDates: availableFrom || availableTo ? {
          select: {
            startDate: true,
            endDate: true,
          },
        } : false,
      },
      orderBy,
    })

    // Filter plots by availability if date range specified
    let filteredPlots = plots

    if (availableFrom || availableTo) {
      const fromDate = availableFrom ? new Date(availableFrom) : null
      const toDate = availableTo ? new Date(availableTo) : null

      filteredPlots = plots.filter((plot: any) => {
        // Check if any booking conflicts with the requested dates
        const hasBookingConflict = (plot.bookings || []).some((booking: any) => {
          const bookingStart = new Date(booking.startDate)
          const bookingEnd = new Date(booking.endDate)

          if (fromDate && toDate) {
            return !(toDate < bookingStart || fromDate > bookingEnd)
          } else if (fromDate) {
            return fromDate >= bookingStart && fromDate <= bookingEnd
          } else if (toDate) {
            return toDate >= bookingStart && toDate <= bookingEnd
          }
          return false
        })

        // Check if any blocked date conflicts with the requested dates
        const hasBlockedConflict = (plot.blockedDates || []).some((blocked: any) => {
          const blockedStart = new Date(blocked.startDate)
          const blockedEnd = new Date(blocked.endDate)

          if (fromDate && toDate) {
            return !(toDate < blockedStart || fromDate > blockedEnd)
          } else if (fromDate) {
            return fromDate >= blockedStart && fromDate <= blockedEnd
          } else if (toDate) {
            return toDate >= blockedStart && toDate <= blockedEnd
          }
          return false
        })

        return !hasBookingConflict && !hasBlockedConflict
      })
    }

    // Transform to PlotMarker format with calculated average ratings
    let plotMarkers = filteredPlots.map((plot: any) => {
      const ratings = plot.reviews.map((r: any) => r.rating)
      const averageRating = ratings.length > 0
        ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
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
        instantBook: plot.instantBook,
        averageRating,
        reviewCount: plot.reviews.length,
        ownerName: `${plot.owner.firstName} ${plot.owner.lastName}`,
        ownerAvatar: plot.owner.avatar || undefined,
        ownerVerified: plot.owner.isVerified && (plot.owner.isPhoneVerified || plot.owner.isIdVerified),
      }
    })

    // Filter by minimum rating (post-query since it's calculated)
    if (minRating) {
      const minRatingNum = parseFloat(minRating)
      plotMarkers = plotMarkers.filter((plot: any) =>
        plot.averageRating !== undefined && plot.averageRating >= minRatingNum
      )
    }

    // Sort by rating if that's the selected sort (post-query since it's calculated)
    if (sortBy === 'rating') {
      plotMarkers = plotMarkers.sort((a: any, b: any) => {
        const ratingA = a.averageRating ?? 0
        const ratingB = b.averageRating ?? 0
        return ratingB - ratingA
      })
    }

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
    // Get or create user in database (auto-sync from Clerk) - require verified email
    const currentUser = await ensureVerifiedUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.title || body.title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Plot title is required' },
        { status: 400 }
      )
    }

    if (!body.description || body.description.trim().length === 0) {
      return NextResponse.json(
        { error: 'Plot description is required' },
        { status: 400 }
      )
    }

    // Validate price fields
    if (body.pricePerMonth !== undefined && body.pricePerMonth !== null) {
      const price = parseFloat(body.pricePerMonth)
      if (isNaN(price) || price < 0) {
        return NextResponse.json(
          { error: 'Price per month must be a positive number' },
          { status: 400 }
        )
      }
      if (price > 1000000) {
        return NextResponse.json(
          { error: 'Price per month cannot exceed $1,000,000' },
          { status: 400 }
        )
      }
    }

    if (body.pricePerSeason !== undefined && body.pricePerSeason !== null) {
      const price = parseFloat(body.pricePerSeason)
      if (isNaN(price) || price < 0) {
        return NextResponse.json(
          { error: 'Price per season must be a positive number' },
          { status: 400 }
        )
      }
    }

    if (body.pricePerYear !== undefined && body.pricePerYear !== null) {
      const price = parseFloat(body.pricePerYear)
      if (isNaN(price) || price < 0) {
        return NextResponse.json(
          { error: 'Price per year must be a positive number' },
          { status: 400 }
        )
      }
    }

    if (body.securityDeposit !== undefined && body.securityDeposit !== null) {
      const deposit = parseFloat(body.securityDeposit)
      if (isNaN(deposit) || deposit < 0) {
        return NextResponse.json(
          { error: 'Security deposit must be a positive number' },
          { status: 400 }
        )
      }
    }

    // Validate acreage
    if (body.acreage !== undefined && body.acreage !== null) {
      const acreage = parseFloat(body.acreage)
      if (isNaN(acreage) || acreage <= 0) {
        return NextResponse.json(
          { error: 'Acreage must be a positive number' },
          { status: 400 }
        )
      }
      if (acreage > 10000) {
        return NextResponse.json(
          { error: 'Acreage cannot exceed 10,000 acres' },
          { status: 400 }
        )
      }
    }

    // Convert form values to uppercase enum values
    const soilTypeEnum = (body.soilType || []).map((type: string) => type.toUpperCase())
    const waterAccessEnum = (body.waterAccess || []).map((access: string) => {
      // Handle special cases
      if (access === 'Stream/Creek') return 'STREAM'
      if (access === 'Pond/Lake') return 'POND'
      if (access === 'Rainwater Collection') return 'IRRIGATION'
      return access.toUpperCase()
    })

    // Geocode address if coordinates not provided
    let latitude = body.latitude
    let longitude = body.longitude

    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
      console.log('Geocoding address:', body.address, body.city, body.state, body.zipCode)
      const coords = await geocodeAddress(body.address, body.city, body.state, body.zipCode)
      if (coords) {
        latitude = coords.latitude
        longitude = coords.longitude
        console.log('Geocoded successfully:', latitude, longitude)
      } else {
        console.log('Geocoding failed, using default coordinates')
        // Use a default coordinate (center of US) if geocoding fails
        latitude = 39.8283
        longitude = -98.5795
      }
    }

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
        latitude: latitude,
        longitude: longitude,
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

    // Parallelize badge check and activity creation for better performance
    const [plotsCount, landSharerBadge] = await Promise.all([
      prisma.plot.count({ where: { ownerId: currentUser.id } }),
      prisma.badge.findFirst({ where: { name: 'Land Sharer' } }),
    ])

    // Calculate total points to award (base 50 + badge bonus if first plot)
    let totalPointsToAdd = 50
    const isFirstPlot = plotsCount === 1

    // Award badge for first plot listing
    if (isFirstPlot && landSharerBadge) {
      totalPointsToAdd += landSharerBadge.points
      // Create badge in parallel with other operations
      await prisma.userBadge.create({
        data: {
          userId: currentUser.id,
          badgeId: landSharerBadge.id,
        },
      })
    }

    // Parallelize activity creation and points update
    await Promise.all([
      prisma.userActivity.create({
        data: {
          userId: currentUser.id,
          type: 'PLOT_LISTED',
          title: 'Listed new plot',
          description: plot.title,
          points: 50,
        },
      }),
      prisma.user.update({
        where: { id: currentUser.id },
        data: { totalPoints: { increment: totalPointsToAdd } },
      }),
    ])

    return NextResponse.json(plot, { status: 201 })
  } catch (error) {
    if (error instanceof EmailNotVerifiedError) {
      return NextResponse.json(
        { error: error.message, requiresVerification: true },
        { status: 403 }
      )
    }
    console.error('Error creating plot:', error)
    return NextResponse.json(
      { error: 'Failed to create plot' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ zipCode: string }>
}

export interface FrostDateResponse {
  zipCode: string
  location: {
    city: string
    state: string
    latitude: number
    longitude: number
  }
  weatherStation: {
    stationId: string
    name: string
    distanceKm: number
  }
  frostDates: {
    lastSpringFrost: string | null // Date when frost risk ends (50% probability)
    firstFallFrost: string | null // Date when frost risk begins (50% probability)
    frostFreeWindow: number | null // Days between frosts
    springFrostRange: {
      early: string | null // 90% probability (earliest safe date)
      typical: string | null // 50% probability
      late: string | null // 10% probability (latest possible frost)
    }
    fallFrostRange: {
      early: string | null // 10% probability (earliest possible frost)
      typical: string | null // 50% probability
      late: string | null // 90% probability (latest safe date)
    }
  }
  dataSource: string
  noFrostZone: boolean
}

// Convert MM/DD to a readable date string
function formatFrostDate(dateStr: string | undefined): string | null {
  if (!dateStr || dateStr === '-9999.0' || dateStr === '-9999') {
    return null
  }

  const [month, day] = dateStr.split('/')
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December']
  const monthIndex = parseInt(month) - 1

  if (monthIndex < 0 || monthIndex > 11) {
    return null
  }

  return `${months[monthIndex]} ${parseInt(day)}`
}

// Calculate days between two MM/DD dates
function calculateFrostFreeWindow(lastSpring: string | undefined, firstFall: string | undefined): number | null {
  if (!lastSpring || !firstFall || lastSpring === '-9999.0' || firstFall === '-9999.0') {
    return null
  }

  const [springMonth, springDay] = lastSpring.split('/').map(Number)
  const [fallMonth, fallDay] = firstFall.split('/').map(Number)

  // Use a non-leap year for calculation
  const springDate = new Date(2024, springMonth - 1, springDay)
  const fallDate = new Date(2024, fallMonth - 1, fallDay)

  const diffTime = fallDate.getTime() - springDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays > 0 ? diffDays : null
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { zipCode } = await params

    // Validate zip code format (5 digits)
    if (!/^\d{5}$/.test(zipCode)) {
      return NextResponse.json(
        { error: 'Invalid zip code format. Please enter a 5-digit US zip code.' },
        { status: 400 }
      )
    }

    // Fetch from the frost date API
    const response = await fetch(`https://apis.joelgrant.dev/api/v1/frost/${zipCode}`, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 86400 } // Cache for 24 hours
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Zip code not found. Please enter a valid US zip code.' },
          { status: 404 }
        )
      }
      throw new Error(`API returned ${response.status}`)
    }

    const data = await response.json()

    // Check if this is a no-frost zone
    const lastSpring50 = data.data?.frost_dates?.last_frost_32f?.['50%']
    const firstFall50 = data.data?.frost_dates?.first_frost_32f?.['50%']
    const noFrostZone = (!lastSpring50 || lastSpring50 === '-9999.0') &&
                        (!firstFall50 || firstFall50 === '-9999.0')

    // Transform the response
    const result: FrostDateResponse = {
      zipCode,
      location: {
        city: data.data?.location?.city || 'Unknown',
        state: data.data?.location?.state || 'Unknown',
        latitude: data.data?.location?.latitude || 0,
        longitude: data.data?.location?.longitude || 0,
      },
      weatherStation: {
        stationId: data.data?.weather_station?.station_id || '',
        name: data.data?.weather_station?.name || 'Unknown Station',
        distanceKm: data.data?.weather_station?.distance_km || 0,
      },
      frostDates: {
        lastSpringFrost: formatFrostDate(lastSpring50),
        firstFallFrost: formatFrostDate(firstFall50),
        frostFreeWindow: calculateFrostFreeWindow(lastSpring50, firstFall50),
        springFrostRange: {
          early: formatFrostDate(data.data?.frost_dates?.last_frost_32f?.['90%']),
          typical: formatFrostDate(lastSpring50),
          late: formatFrostDate(data.data?.frost_dates?.last_frost_32f?.['10%']),
        },
        fallFrostRange: {
          early: formatFrostDate(data.data?.frost_dates?.first_frost_32f?.['10%']),
          typical: formatFrostDate(firstFall50),
          late: formatFrostDate(data.data?.frost_dates?.first_frost_32f?.['90%']),
        },
      },
      dataSource: data.meta?.data_source || 'NOAA Climate Normals',
      noFrostZone,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching frost dates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch frost dates. Please try again later.' },
      { status: 500 }
    )
  }
}

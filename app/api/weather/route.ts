import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { fetchWeatherByCoords, fetchWeatherByCity } from '@/lib/weather'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')
    const city = searchParams.get('city')
    const state = searchParams.get('state')

    // Validate we have either coordinates or city
    if ((!lat || !lon) && !city) {
      return NextResponse.json(
        { error: 'Either coordinates (lat, lon) or city is required' },
        { status: 400 }
      )
    }

    let weatherData

    if (lat && lon) {
      const latitude = parseFloat(lat)
      const longitude = parseFloat(lon)

      if (isNaN(latitude) || isNaN(longitude)) {
        return NextResponse.json(
          { error: 'Invalid coordinates' },
          { status: 400 }
        )
      }

      // Validate coordinate ranges
      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        return NextResponse.json(
          { error: 'Coordinates out of range' },
          { status: 400 }
        )
      }

      weatherData = await fetchWeatherByCoords(latitude, longitude)
    } else if (city) {
      weatherData = await fetchWeatherByCity(city, state || undefined)
    }

    if (!weatherData) {
      return NextResponse.json(
        { error: 'Failed to fetch weather data' },
        { status: 502 }
      )
    }

    return NextResponse.json(weatherData)
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

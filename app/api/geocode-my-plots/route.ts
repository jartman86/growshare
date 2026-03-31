import { NextResponse } from 'next/server'
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

    if (!response.ok) return null

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

export async function GET() {
  return geocodePlots()
}

export async function POST() {
  return geocodePlots()
}

async function geocodePlots() {
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

    // Find plots that need geocoding (using default fallback coordinates or 0,0)
    const plots = await prisma.plot.findMany({
      where: {
        ownerId: currentUser.id,
        OR: [
          // Default fallback coordinates (center of USA)
          { AND: [{ latitude: 39.8283 }, { longitude: -98.5795 }] },
          // Zero coordinates (unset)
          { AND: [{ latitude: 0 }, { longitude: 0 }] },
        ],
      },
      select: {
        id: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
      },
    })

    if (plots.length === 0) {
      return NextResponse.json({
        message: 'All plots already have coordinates',
        updated: 0,
        failed: 0,
        skipped: 0,
        total: 0,
      })
    }

    // Limit to 10 plots per request to avoid timeouts and respect Nominatim rate limits
    const plotsToGeocode = plots.slice(0, 10)
    let updated = 0
    let failed = 0

    // Process sequentially (Nominatim requires 1 req/sec)
    for (const plot of plotsToGeocode) {
      const coords = await geocodeAddress(plot.address, plot.city, plot.state, plot.zipCode)

      if (coords) {
        await prisma.plot.update({
          where: { id: plot.id },
          data: {
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
        })
        updated++
      } else {
        failed++
      }

      // Respect Nominatim rate limit (1 request per second)
      if (plotsToGeocode.indexOf(plot) < plotsToGeocode.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1100))
      }
    }

    return NextResponse.json({
      message: 'Geocoding complete',
      updated,
      failed,
      skipped: plots.length - plotsToGeocode.length,
      total: plots.length,
      remaining: Math.max(0, plots.length - plotsToGeocode.length),
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to geocode plots' },
      { status: 500 }
    )
  }
}

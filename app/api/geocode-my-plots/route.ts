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
  } catch (error) {
    console.error('Geocoding error:', error)
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

    // Find all plots for this user
    const plots = await prisma.plot.findMany({
      where: {
        ownerId: currentUser.id,
      },
    })

    console.log(`Found ${plots.length} plots to geocode`)

    let updated = 0
    let failed = 0
    let skipped = 0

    for (const plot of plots) {
      // Skip if plot already has valid coordinates (not default fallback)
      if (plot.latitude && plot.longitude &&
          !(plot.latitude === 39.8283 && plot.longitude === -98.5795)) {
        console.log(`Plot ${plot.id} already has coordinates, skipping`)
        skipped++
        continue
      }

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
        console.log(`Updated plot ${plot.id}: ${coords.latitude}, ${coords.longitude}`)
      } else {
        failed++
        console.log(`Failed to geocode plot ${plot.id}`)
      }

      // Add a small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    return NextResponse.json({
      message: 'Geocoding complete',
      updated,
      failed,
      skipped,
      total: plots.length,
    })
  } catch (error) {
    console.error('Error geocoding plots:', error)
    return NextResponse.json(
      { error: 'Failed to geocode plots' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import * as perenual from '@/lib/perenual'
import { SAMPLE_PLANT_GUIDES } from '@/lib/resources-data'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    // Check if it's a Perenual ID
    if (id.startsWith('perenual-')) {
      const perenualId = parseInt(id.replace('perenual-', ''))

      if (!perenual.isConfigured()) {
        return NextResponse.json(
          { error: 'Plant API not configured' },
          { status: 503 }
        )
      }

      const plantData = await perenual.getPlantDetails(perenualId)
      const guide = perenual.convertToPlantGuide(plantData)

      return NextResponse.json({
        plant: guide,
        source: 'perenual',
      })
    }

    // Check local sample data
    const localPlant = SAMPLE_PLANT_GUIDES.find((g) => g.id === id)

    if (localPlant) {
      return NextResponse.json({
        plant: localPlant,
        source: 'local',
      })
    }

    return NextResponse.json(
      { error: 'Plant not found' },
      { status: 404 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch plant details' },
      { status: 500 }
    )
  }
}

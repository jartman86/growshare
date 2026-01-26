import { NextRequest, NextResponse } from 'next/server'
import * as perenual from '@/lib/perenual'
import { SAMPLE_PLANT_GUIDES } from '@/lib/resources-data'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const source = searchParams.get('source') || 'all' // 'local', 'api', or 'all'

  try {
    const results: any[] = []

    // Search local sample data
    if (source === 'local' || source === 'all') {
      const localResults = SAMPLE_PLANT_GUIDES.filter((guide) => {
        if (!query) return true
        const searchLower = query.toLowerCase()
        return (
          guide.commonName.toLowerCase().includes(searchLower) ||
          guide.scientificName.toLowerCase().includes(searchLower) ||
          guide.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        )
      }).map((guide) => ({
        ...guide,
        source: 'local',
      }))

      results.push(...localResults)
    }

    // Search Perenual API if configured
    if ((source === 'api' || source === 'all') && perenual.isConfigured() && query) {
      try {
        const apiResults = await perenual.searchPlants(query, { page })

        const convertedResults = apiResults.data.map((plant) => ({
          id: `perenual-${plant.id}`,
          commonName: plant.common_name,
          scientificName: plant.scientific_name?.[0] || plant.common_name,
          image: plant.default_image?.regular_url || plant.default_image?.thumbnail || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
          category: plant.cycle || 'Other',
          difficulty: 'Moderate' as const,
          sunlight: Array.isArray(plant.sunlight) ? plant.sunlight.join(', ') : (plant.sunlight || 'Full Sun'),
          water: plant.watering || 'Average',
          source: 'perenual',
          perenualId: plant.id,
        }))

        results.push(...convertedResults)
      } catch (apiError) {
        console.error('Perenual API error:', apiError)
        // Continue with local results only
      }
    }

    // Remove duplicates (prefer local data)
    const seen = new Set<string>()
    const uniqueResults = results.filter((plant) => {
      const key = plant.commonName.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    return NextResponse.json({
      plants: uniqueResults,
      total: uniqueResults.length,
      page,
      hasApiAccess: perenual.isConfigured(),
    })
  } catch (error) {
    console.error('Error fetching plants:', error)
    return NextResponse.json(
      { error: 'Failed to fetch plants' },
      { status: 500 }
    )
  }
}

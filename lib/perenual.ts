/**
 * Perenual Plant API Client
 * https://perenual.com/docs/api
 */

const PERENUAL_BASE_URL = 'https://perenual.com/api'
const PERENUAL_API_KEY = process.env.PERENUAL_API_KEY

export interface PerenualPlant {
  id: number
  common_name: string
  scientific_name: string[]
  other_name: string[] | null
  family: string | null
  origin: string[] | null
  type: string | null
  dimension: string | null
  dimensions: {
    type: string | null
    min_value: number | null
    max_value: number | null
    unit: string | null
  } | null
  cycle: string | null
  attracts: string[] | null
  propagation: string[] | null
  hardiness: {
    min: string | null
    max: string | null
  } | null
  hardiness_location: {
    full_url: string | null
    full_iframe: string | null
  } | null
  watering: string | null
  watering_general_benchmark: {
    value: string | null
    unit: string | null
  } | null
  sunlight: string[] | null
  pruning_month: string[] | null
  pruning_count: {
    amount: number | null
    interval: string | null
  } | null
  seeds: number | null
  maintenance: string | null
  care_guides: string | null
  soil: string[] | null
  growth_rate: string | null
  drought_tolerant: boolean | null
  salt_tolerant: boolean | null
  thorny: boolean | null
  invasive: boolean | null
  tropical: boolean | null
  indoor: boolean | null
  care_level: string | null
  pest_susceptibility: string[] | null
  pest_susceptibility_api: string | null
  flowers: boolean | null
  flowering_season: string | null
  flower_color: string | null
  cones: boolean | null
  fruits: boolean | null
  edible_fruit: boolean | null
  edible_fruit_taste_profile: string | null
  fruit_nutritional_value: string | null
  fruit_color: string[] | null
  harvest_season: string | null
  leaf: boolean | null
  leaf_color: string[] | null
  edible_leaf: boolean | null
  cuisine: boolean | null
  medicinal: boolean | null
  poisonous_to_humans: number | null
  poisonous_to_pets: number | null
  description: string | null
  default_image: {
    license: number
    license_name: string
    license_url: string
    original_url: string
    regular_url: string
    medium_url: string
    small_url: string
    thumbnail: string
  } | null
}

export interface PerenualSearchResult {
  id: number
  common_name: string
  scientific_name: string[]
  other_name: string[] | null
  cycle: string | null
  watering: string | null
  sunlight: string[] | null
  default_image: {
    license: number
    license_name: string
    license_url: string
    original_url: string
    regular_url: string
    medium_url: string
    small_url: string
    thumbnail: string
  } | null
}

export interface PerenualPestDisease {
  id: number
  common_name: string
  scientific_name: string | null
  other_name: string[] | null
  family: string | null
  description: string | null
  solution: string | null
  host: string[] | null
  images: {
    license: number
    license_name: string
    license_url: string
    original_url: string
    regular_url: string
    medium_url: string
    small_url: string
    thumbnail: string
  }[] | null
}

interface ApiResponse<T> {
  data: T[]
  to: number
  per_page: number
  current_page: number
  from: number
  last_page: number
  total: number
}

/**
 * Check if API key is configured
 */
export function isConfigured(): boolean {
  return !!PERENUAL_API_KEY
}

/**
 * Search for plants by name
 */
export async function searchPlants(
  query: string,
  options: {
    page?: number
    indoor?: boolean
    edible?: boolean
    watering?: 'frequent' | 'average' | 'minimum' | 'none'
    sunlight?: 'full_shade' | 'part_shade' | 'sun-part_shade' | 'full_sun'
    cycle?: 'perennial' | 'annual' | 'biennial' | 'biannual'
  } = {}
): Promise<ApiResponse<PerenualSearchResult>> {
  if (!PERENUAL_API_KEY) {
    throw new Error('PERENUAL_API_KEY is not configured')
  }

  const params = new URLSearchParams({
    key: PERENUAL_API_KEY,
    q: query,
    page: String(options.page || 1),
  })

  if (options.indoor !== undefined) params.append('indoor', options.indoor ? '1' : '0')
  if (options.edible !== undefined) params.append('edible', options.edible ? '1' : '0')
  if (options.watering) params.append('watering', options.watering)
  if (options.sunlight) params.append('sunlight', options.sunlight)
  if (options.cycle) params.append('cycle', options.cycle)

  const response = await fetch(`${PERENUAL_BASE_URL}/species-list?${params}`)

  if (!response.ok) {
    throw new Error(`Perenual API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Get detailed plant information by ID
 */
export async function getPlantDetails(id: number): Promise<PerenualPlant> {
  if (!PERENUAL_API_KEY) {
    throw new Error('PERENUAL_API_KEY is not configured')
  }

  const response = await fetch(
    `${PERENUAL_BASE_URL}/species/details/${id}?key=${PERENUAL_API_KEY}`
  )

  if (!response.ok) {
    throw new Error(`Perenual API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Get list of pests and diseases
 */
export async function getPestsAndDiseases(
  options: {
    page?: number
    query?: string
  } = {}
): Promise<ApiResponse<PerenualPestDisease>> {
  if (!PERENUAL_API_KEY) {
    throw new Error('PERENUAL_API_KEY is not configured')
  }

  const params = new URLSearchParams({
    key: PERENUAL_API_KEY,
    page: String(options.page || 1),
  })

  if (options.query) params.append('q', options.query)

  const response = await fetch(`${PERENUAL_BASE_URL}/pest-disease-list?${params}`)

  if (!response.ok) {
    throw new Error(`Perenual API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Convert Perenual plant data to our internal PlantGuide format
 */
export function convertToPlantGuide(plant: PerenualPlant) {
  // Map watering to our format
  const waterMap: Record<string, string> = {
    'Frequent': 'Keep soil consistently moist, water when top inch is dry',
    'Average': 'Water when top 2 inches of soil are dry',
    'Minimum': 'Allow soil to dry out between waterings',
    'None': 'Drought tolerant, minimal watering needed',
  }

  // Map sunlight to our format
  const sunlightMap: Record<string, string> = {
    'full_sun': 'Full Sun (6+ hours)',
    'sun-part_shade': 'Full Sun to Partial Shade',
    'part_shade': 'Partial Shade (3-6 hours)',
    'full_shade': 'Full Shade (less than 3 hours)',
  }

  // Map care level to difficulty
  const difficultyMap: Record<string, 'Easy' | 'Moderate' | 'Challenging'> = {
    'Low': 'Easy',
    'Medium': 'Moderate',
    'High': 'Challenging',
  }

  const sunlightStr = plant.sunlight?.[0] || 'full_sun'

  return {
    id: `perenual-${plant.id}`,
    commonName: plant.common_name,
    scientificName: plant.scientific_name?.[0] || plant.common_name,
    description: plant.description || `${plant.common_name} is a ${plant.type || 'plant'} in the ${plant.family || 'unknown'} family.`,
    image: plant.default_image?.regular_url || plant.default_image?.original_url || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
    category: mapTypeToCategory(plant.type),
    difficulty: difficultyMap[plant.care_level || 'Medium'] || 'Moderate',
    sunlight: sunlightMap[sunlightStr] || plant.sunlight?.join(', ') || 'Full Sun',
    water: waterMap[plant.watering || 'Average'] || plant.watering || 'Regular watering',
    hardinessZones: formatHardinessZones(plant.hardiness),
    soilPH: '6.0-7.0', // Perenual doesn't provide pH in free tier
    soilType: plant.soil || ['Well-draining'],
    spacing: plant.dimension || 'Follow seed packet instructions',
    depth: 'Follow seed packet instructions',
    daysToMaturity: 'Varies by variety',
    daysToGermination: '7-14 days',
    plantingSeasons: getPlantingSeasons(plant),
    harvestSeasons: plant.harvest_season ? [plant.harvest_season] : ['Summer', 'Fall'],
    companionPlants: [], // Would need separate lookup
    avoidPlanting: [], // Would need separate lookup
    commonPests: plant.pest_susceptibility || [],
    commonDiseases: [], // Would need separate API call
    growingTips: generateGrowingTips(plant),
    troubleshooting: generateTroubleshooting(plant),
    harvestTips: plant.edible_fruit ? `Harvest when fruits are ripe. ${plant.edible_fruit_taste_profile || ''}` : 'Harvest as needed',
    storageInstructions: plant.edible_fruit ? 'Store in a cool, dry place or refrigerate' : undefined,
    fertilizer: plant.maintenance === 'High' ? 'Feed monthly during growing season' : 'Feed every 4-6 weeks during growing season',
    nativeTo: plant.origin?.join(', '),
    culinaryUses: plant.cuisine ? ['Cooking', 'Flavoring'] : undefined,
    nutritionalInfo: plant.fruit_nutritional_value || undefined,
    medicinal: plant.medicinal || false,
    varieties: plant.other_name || [],
    tags: generateTags(plant),
    popularityScore: 50, // Default score
  }
}

function mapTypeToCategory(type: string | null): string {
  const typeMap: Record<string, string> = {
    'Vegetable': 'Vegetables',
    'Fruit': 'Fruits',
    'Herb': 'Herbs',
    'Flower': 'Flowers',
    'Tree': 'Trees',
    'Shrub': 'Shrubs',
    'Grass': 'Grasses',
    'Fern': 'Ferns',
    'Succulent': 'Succulents',
    'Cactus': 'Cacti',
  }
  return typeMap[type || ''] || 'Other'
}

function formatHardinessZones(hardiness: PerenualPlant['hardiness']): string {
  if (!hardiness?.min || !hardiness?.max) return '3-10'
  return `${hardiness.min}-${hardiness.max}`
}

function getPlantingSeasons(plant: PerenualPlant): string[] {
  // Infer from cycle and growing characteristics
  if (plant.tropical) return ['Spring', 'Summer']
  if (plant.cycle === 'perennial') return ['Spring', 'Fall']
  if (plant.cycle === 'annual') return ['Spring']
  return ['Spring', 'Summer']
}

function generateGrowingTips(plant: PerenualPlant): string[] {
  const tips: string[] = []

  if (plant.watering === 'Frequent') {
    tips.push('Keep soil consistently moist but not waterlogged')
  } else if (plant.watering === 'Minimum') {
    tips.push('Allow soil to dry between waterings to prevent root rot')
  }

  if (plant.sunlight?.includes('full_sun')) {
    tips.push('Plant in a location with at least 6 hours of direct sunlight')
  } else if (plant.sunlight?.includes('part_shade')) {
    tips.push('Provide afternoon shade in hot climates')
  }

  if (plant.indoor) {
    tips.push('Can be grown indoors with adequate light')
  }

  if (plant.drought_tolerant) {
    tips.push('Once established, this plant is drought tolerant')
  }

  if (plant.pruning_month?.length) {
    tips.push(`Best time to prune: ${plant.pruning_month.join(', ')}`)
  }

  if (plant.propagation?.length) {
    tips.push(`Can be propagated by: ${plant.propagation.join(', ')}`)
  }

  // Add some generic tips if we don't have enough
  if (tips.length < 3) {
    tips.push('Mulch around the base to retain moisture')
    tips.push('Monitor for pests and diseases regularly')
  }

  return tips.slice(0, 6)
}

function generateTroubleshooting(plant: PerenualPlant): string[] {
  const issues: string[] = []

  if (plant.watering === 'Frequent') {
    issues.push('Yellowing leaves may indicate overwatering - ensure proper drainage')
    issues.push('Wilting despite wet soil can mean root rot - reduce watering')
  } else {
    issues.push('Brown leaf edges often indicate underwatering - increase frequency')
  }

  if (plant.sunlight?.includes('full_sun')) {
    issues.push('Leggy growth suggests insufficient light - move to sunnier location')
  }

  if (plant.pest_susceptibility?.length) {
    issues.push(`Watch for ${plant.pest_susceptibility.slice(0, 2).join(' and ')} - treat early`)
  }

  issues.push('Slow growth may indicate need for fertilizer or better soil')

  return issues.slice(0, 5)
}

function generateTags(plant: PerenualPlant): string[] {
  const tags: string[] = []

  if (plant.edible_fruit) tags.push('Edible')
  if (plant.indoor) tags.push('Indoor')
  if (plant.drought_tolerant) tags.push('Drought Tolerant')
  if (plant.flowers) tags.push('Flowering')
  if (plant.medicinal) tags.push('Medicinal')
  if (plant.poisonous_to_pets) tags.push('Toxic to Pets')
  if (plant.tropical) tags.push('Tropical')
  if (plant.cycle) tags.push(plant.cycle)

  return tags
}

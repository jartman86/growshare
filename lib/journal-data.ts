export type CropStage =
  | 'PLANNING'
  | 'PLANTED'
  | 'GERMINATED'
  | 'GROWING'
  | 'FLOWERING'
  | 'FRUITING'
  | 'HARVESTING'
  | 'COMPLETED'

export interface JournalEntry {
  id: string
  cropName: string
  cropType: string
  growthStage: CropStage
  status: string
  plantingDate: Date
  expectedHarvestDate?: Date | null
  actualHarvestDate?: Date | null
  notes: string
  images: string[]
  weatherConditions?: string | null
  soilCondition?: string | null
  wateringSchedule?: string | null
  fertilizer?: string | null
  pestIssues?: string | null
  harvestAmount?: number | null
  harvestUnit?: string | null
  plotId: string
  plotName: string
  createdAt: Date
  updatedAt: Date
}

export const CROP_TYPES = [
  'Tomatoes',
  'Peppers',
  'Lettuce',
  'Carrots',
  'Squash',
  'Cucumbers',
  'Beans',
  'Corn',
  'Potatoes',
  'Onions',
  'Garlic',
  'Herbs',
  'Flowers',
  'Other',
]

export const GROWTH_STAGES: Record<string, string[]> = {
  PLANNING: ['Planning', 'Seed selection', 'Plot preparation'],
  PLANTED: ['Germination', 'Seedling emergence', 'Early growth'],
  GROWING: [
    'Vegetative growth',
    'Flowering',
    'Fruiting',
    'Root development',
    'Leaf development',
  ],
  HARVESTED: ['Ready to harvest', 'Harvesting', 'Post-harvest'],
  COMPLETED: ['Season complete', 'Planning next crop'],
}

// Sample journal entry data for demonstration
export interface JournalEntry {
  id: string
  userId: string
  plotId: string
  plotName: string
  cropName: string
  cropType: string
  plantingDate: Date
  expectedHarvestDate?: Date
  actualHarvestDate?: Date
  status: 'PLANNING' | 'PLANTED' | 'GROWING' | 'HARVESTED' | 'COMPLETED'
  growthStage: string
  notes: string
  images: string[]
  weatherConditions?: string
  soilCondition?: string
  pestIssues?: string
  fertilizer?: string
  wateringSchedule?: string
  harvestAmount?: number
  harvestUnit?: string
  createdAt: Date
  updatedAt: Date
}

export const SAMPLE_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: '1',
    userId: 'user1',
    plotId: '1',
    plotName: 'Sunny 5-Acre Organic Farm Plot',
    cropName: 'Heritage Tomatoes',
    cropType: 'Tomato',
    plantingDate: new Date('2024-04-15'),
    expectedHarvestDate: new Date('2024-07-15'),
    actualHarvestDate: new Date('2024-07-10'),
    status: 'HARVESTED',
    growthStage: 'Fruiting - Ready to harvest',
    notes: 'Plants are thriving! First tomatoes are ripening beautifully. The Cherokee Purple variety is doing especially well.',
    images: [
      'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800',
      'https://images.unsplash.com/photo-1546470427-e26264be0b07?w=800',
    ],
    weatherConditions: 'Sunny, 75°F, low humidity',
    soilCondition: 'Moist, well-draining, pH 6.5',
    pestIssues: 'Minor aphid presence on lower leaves, managed with neem oil',
    fertilizer: 'Organic compost tea, weekly application',
    wateringSchedule: 'Deep watering every 3 days, early morning',
    harvestAmount: 45,
    harvestUnit: 'lbs',
    createdAt: new Date('2024-07-08'),
    updatedAt: new Date('2024-07-10'),
  },
  {
    id: '2',
    userId: 'user1',
    plotId: '1',
    plotName: 'Sunny 5-Acre Organic Farm Plot',
    cropName: 'Rainbow Carrots',
    cropType: 'Carrot',
    plantingDate: new Date('2024-05-01'),
    expectedHarvestDate: new Date('2024-08-01'),
    status: 'GROWING',
    growthStage: 'Root development - 8 weeks in',
    notes: 'Carrots are developing nicely. Thinned to 2 inches apart last week. Purple and yellow varieties showing strong color.',
    images: [
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800',
    ],
    weatherConditions: 'Partly cloudy, 72°F',
    soilCondition: 'Loose, sandy loam - perfect for carrots',
    pestIssues: 'None observed',
    fertilizer: 'Low nitrogen blend to encourage root growth',
    wateringSchedule: 'Light watering every 2 days',
    createdAt: new Date('2024-06-28'),
    updatedAt: new Date('2024-06-28'),
  },
  {
    id: '3',
    userId: 'user1',
    plotId: '1',
    plotName: 'Sunny 5-Acre Organic Farm Plot',
    cropName: 'Sweet Basil',
    cropType: 'Herb',
    plantingDate: new Date('2024-05-15'),
    status: 'GROWING',
    growthStage: 'Vegetative - ready for first harvest',
    notes: 'Basil is bushing out beautifully. Planning to start weekly harvests to encourage more growth. The aroma is incredible!',
    images: [
      'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=800',
    ],
    weatherConditions: 'Warm and sunny, perfect basil weather',
    soilCondition: 'Rich, well-draining',
    fertilizer: 'Balanced organic fertilizer bi-weekly',
    wateringSchedule: 'Daily light watering in morning',
    createdAt: new Date('2024-06-25'),
    updatedAt: new Date('2024-06-25'),
  },
  {
    id: '4',
    userId: 'user1',
    plotId: '1',
    plotName: 'Sunny 5-Acre Organic Farm Plot',
    cropName: 'Summer Squash',
    cropType: 'Squash',
    plantingDate: new Date('2024-05-20'),
    expectedHarvestDate: new Date('2024-07-20'),
    status: 'GROWING',
    growthStage: 'Flowering - first squash forming',
    notes: 'Plants are vigorous and healthy. First flowers appeared this week. Hand-pollinating to ensure good fruit set.',
    images: [
      'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800',
    ],
    weatherConditions: 'Hot and humid - ideal for squash',
    soilCondition: 'Amended with compost, well-draining',
    pestIssues: 'Watching for squash bugs, checking undersides of leaves daily',
    fertilizer: 'Compost side-dressing',
    wateringSchedule: 'Deep watering at base every other day',
    createdAt: new Date('2024-06-20'),
    updatedAt: new Date('2024-06-20'),
  },
  {
    id: '5',
    userId: 'user1',
    plotId: '1',
    plotName: 'Sunny 5-Acre Organic Farm Plot',
    cropName: 'Mesclun Mix',
    cropType: 'Lettuce',
    plantingDate: new Date('2024-06-01'),
    expectedHarvestDate: new Date('2024-07-01'),
    actualHarvestDate: new Date('2024-07-02'),
    status: 'HARVESTED',
    growthStage: 'Mature - harvested',
    notes: 'Beautiful mix of baby greens. Cut-and-come-again harvest worked perfectly. Already planning succession planting.',
    images: [
      'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=800',
    ],
    weatherConditions: 'Cool mornings, warm afternoons',
    soilCondition: 'Rich, nitrogen-rich soil',
    fertilizer: 'Fish emulsion every 2 weeks',
    wateringSchedule: 'Light daily watering to keep soil moist',
    harvestAmount: 12,
    harvestUnit: 'lbs',
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-07-02'),
  },
  {
    id: '6',
    userId: 'user1',
    plotId: '1',
    plotName: 'Sunny 5-Acre Organic Farm Plot',
    cropName: 'Bell Peppers',
    cropType: 'Pepper',
    plantingDate: new Date('2024-04-20'),
    expectedHarvestDate: new Date('2024-07-25'),
    status: 'GROWING',
    growthStage: 'Fruiting - peppers sizing up',
    notes: 'Multiple peppers per plant now. Some turning color already. Red and yellow varieties looking great.',
    images: [
      'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800',
    ],
    weatherConditions: 'Consistent warmth - peppers love it',
    soilCondition: 'Well-draining, pH balanced',
    pestIssues: 'Minor flea beetle damage early on, now under control',
    fertilizer: 'Calcium supplement to prevent blossom end rot',
    wateringSchedule: 'Consistent moisture, every 2-3 days',
    createdAt: new Date('2024-06-10'),
    updatedAt: new Date('2024-06-10'),
  },
]

export const CROP_TYPES = [
  'Tomato',
  'Pepper',
  'Lettuce',
  'Carrot',
  'Squash',
  'Cucumber',
  'Bean',
  'Pea',
  'Herb',
  'Brassica',
  'Root Vegetable',
  'Leafy Green',
  'Fruit',
  'Other',
]

export const GROWTH_STAGES = {
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

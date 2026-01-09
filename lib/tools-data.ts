/**
 * Tool & Equipment Library System
 *
 * Enables community members to share and rent tools/equipment
 */

export type ToolCategory =
  | 'Hand Tools'
  | 'Power Tools'
  | 'Irrigation'
  | 'Soil & Compost'
  | 'Harvesting'
  | 'Storage'
  | 'Other'

export type ToolCondition = 'Excellent' | 'Good' | 'Fair' | 'Needs Repair'

export type RentalStatus = 'available' | 'rented' | 'maintenance' | 'reserved'

export interface Tool {
  id: string
  name: string
  description: string
  category: ToolCategory
  condition: ToolCondition
  images: string[]

  // Owner Info
  ownerId: string
  ownerName: string
  ownerAvatar: string
  ownerLocation: string

  // Rental Terms
  dailyRate: number // 0 means free to borrow
  weeklyRate?: number
  depositRequired: number
  maxRentalDays: number

  // Availability
  status: RentalStatus
  availableFrom?: Date
  currentRenter?: string
  nextAvailable?: Date

  // Stats
  timesRented: number
  rating: number
  reviews: number
  listedAt: Date
  lastRentedAt?: Date

  // Additional Info
  brand?: string
  model?: string
  yearPurchased?: number
  specifications?: string[]
  instructions?: string
  pickupNotes?: string
}

export interface ToolRental {
  id: string
  toolId: string
  toolName: string
  renterId: string
  renterName: string
  ownerId: string
  ownerName: string

  // Rental Period
  startDate: Date
  endDate: Date
  actualReturnDate?: Date

  // Financial
  dailyRate: number
  totalDays: number
  totalCost: number
  depositAmount: number
  depositReturned: boolean

  // Status
  status: 'pending' | 'approved' | 'active' | 'completed' | 'cancelled'

  // Condition Tracking
  conditionAtPickup: ToolCondition
  conditionAtReturn?: ToolCondition
  damageNotes?: string

  // Communication
  pickupMethod: 'owner-delivery' | 'renter-pickup' | 'meet-halfway'
  pickupLocation?: string
  pickupTime?: Date
  returnTime?: Date

  createdAt: Date
  updatedAt: Date
}

export interface ToolReview {
  id: string
  toolId: string
  renterId: string
  renterName: string
  renterAvatar: string
  rating: number // 1-5
  comment: string
  wouldRecommend: boolean
  createdAt: Date
}

// Sample Tools Data
export const SAMPLE_TOOLS: Tool[] = [
  {
    id: 'tool-1',
    name: 'Gas-Powered Tiller',
    description: 'Heavy-duty 4-cycle gas tiller, perfect for breaking ground or preparing large garden beds. Easy to use with adjustable depth and width settings.',
    category: 'Power Tools',
    condition: 'Excellent',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
      'https://images.unsplash.com/photo-1592230442203-e1d0ac959f55?w=800',
    ],
    ownerId: 'user-1',
    ownerName: 'Sarah Chen',
    ownerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    ownerLocation: 'Portland, OR',
    dailyRate: 35,
    weeklyRate: 150,
    depositRequired: 100,
    maxRentalDays: 7,
    status: 'available',
    timesRented: 23,
    rating: 4.8,
    reviews: 18,
    listedAt: new Date('2024-03-15'),
    lastRentedAt: new Date('2024-07-10'),
    brand: 'Troy-Bilt',
    model: 'Pony ES',
    yearPurchased: 2022,
    specifications: [
      '196cc 4-cycle OHV engine',
      'Forward rotating tines',
      'Tilling width: 21 inches',
      'Tilling depth: up to 7 inches',
    ],
    instructions: 'Full tank of gas included. Mix oil is not required (4-cycle). Please return with a full tank.',
    pickupNotes: 'Available for pickup at my home or I can deliver within 5 miles for $10 fee.',
  },
  {
    id: 'tool-2',
    name: 'Wheelbarrow - Heavy Duty',
    description: 'Professional-grade steel wheelbarrow with pneumatic tire. Perfect for moving soil, compost, mulch, or harvests. Well-maintained and sturdy.',
    category: 'Hand Tools',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1617478755490-e21232a5eeaf?w=800',
    ],
    ownerId: 'user-2',
    ownerName: 'Michael Rodriguez',
    ownerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    ownerLocation: 'Eugene, OR',
    dailyRate: 0, // Free to borrow
    depositRequired: 25,
    maxRentalDays: 3,
    status: 'available',
    timesRented: 15,
    rating: 4.9,
    reviews: 12,
    listedAt: new Date('2024-02-20'),
    lastRentedAt: new Date('2024-07-15'),
    brand: 'Jackson',
    specifications: [
      '6 cubic foot capacity',
      'Steel tray with powder coat finish',
      '16-inch pneumatic tire',
      'Hardwood handles',
    ],
    pickupNotes: 'Free to borrow for community members. Pick up from my garden plot at Hawthorne Community Garden.',
  },
  {
    id: 'tool-3',
    name: 'Drip Irrigation Starter Kit',
    description: 'Complete drip irrigation system with timer, 100ft of tubing, emitters, and stakes. Perfect for water-efficient garden watering. Includes instructions.',
    category: 'Irrigation',
    condition: 'Excellent',
    images: [
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
    ],
    ownerId: 'user-1',
    ownerName: 'Sarah Chen',
    ownerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    ownerLocation: 'Portland, OR',
    dailyRate: 15,
    weeklyRate: 60,
    depositRequired: 50,
    maxRentalDays: 14,
    status: 'available',
    timesRented: 8,
    rating: 5.0,
    reviews: 7,
    listedAt: new Date('2024-04-01'),
    brand: 'Raindrip',
    specifications: [
      'Digital timer with battery backup',
      '100 feet of 1/4" tubing',
      '25 adjustable drip emitters',
      '25 ground stakes',
      'Pressure regulator included',
    ],
    instructions: 'System is easy to set up. I can help you with installation if needed (free).',
    pickupNotes: 'Pickup from my home. Flexible timing.',
  },
  {
    id: 'tool-4',
    name: 'Broadfork (Meadow Creature)',
    description: 'Premium broadfork for deep soil aeration without tilling. Great for no-till gardening and improving soil structure. Minimal effort, maximum results.',
    category: 'Hand Tools',
    condition: 'Excellent',
    images: [
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800',
    ],
    ownerId: 'user-3',
    ownerName: 'Emma Thompson',
    ownerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    ownerLocation: 'Salem, OR',
    dailyRate: 10,
    weeklyRate: 40,
    depositRequired: 75,
    maxRentalDays: 7,
    status: 'available',
    timesRented: 12,
    rating: 4.9,
    reviews: 10,
    listedAt: new Date('2024-03-10'),
    lastRentedAt: new Date('2024-07-05'),
    brand: 'Meadow Creature',
    specifications: [
      '5 steel tines, 10 inches long',
      'Hardwood handles',
      '22-inch working width',
      'Weight: 16 lbs',
    ],
    instructions: 'Works best in moist (not wet) soil. Step on crossbar and rock back to lift soil.',
    pickupNotes: 'Available at my home in Salem. Can meet at local gardens if convenient.',
  },
  {
    id: 'tool-5',
    name: 'Soil Test Kit - Professional',
    description: 'Complete soil testing kit with pH meter, NPK test strips, and organic matter test. Perfect for understanding your soil before planting. Includes 40 tests.',
    category: 'Soil & Compost',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1592230442203-e1d0ac959f55?w=800',
    ],
    ownerId: 'user-2',
    ownerName: 'Michael Rodriguez',
    ownerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    ownerLocation: 'Eugene, OR',
    dailyRate: 5,
    weeklyRate: 20,
    depositRequired: 30,
    maxRentalDays: 5,
    status: 'available',
    timesRented: 19,
    rating: 4.7,
    reviews: 15,
    listedAt: new Date('2024-02-15'),
    brand: 'MySoil',
    specifications: [
      'Digital pH meter with calibration solution',
      '40 NPK test strips',
      'Color comparison charts',
      'Soil sampling tools included',
    ],
    instructions: 'Please return unused test strips. I replace them periodically. Instructions included in kit.',
    pickupNotes: 'Pickup at my plot or I can drop off. Very flexible.',
  },
  {
    id: 'tool-6',
    name: 'Harvest Baskets (Set of 5)',
    description: 'Beautiful woven harvest baskets in various sizes. Perfect for collecting produce, flowers, and herbs. Durable and easy to clean.',
    category: 'Harvesting',
    condition: 'Excellent',
    images: [
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800',
    ],
    ownerId: 'user-3',
    ownerName: 'Emma Thompson',
    ownerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    ownerLocation: 'Salem, OR',
    dailyRate: 0, // Free to borrow
    depositRequired: 20,
    maxRentalDays: 3,
    status: 'available',
    timesRented: 31,
    rating: 5.0,
    reviews: 24,
    listedAt: new Date('2024-01-20'),
    lastRentedAt: new Date('2024-07-18'),
    specifications: [
      '1 large basket (16" diameter)',
      '2 medium baskets (12" diameter)',
      '2 small baskets (8" diameter)',
      'Natural woven construction',
      'Handles for easy carrying',
    ],
    instructions: 'Please rinse and dry before returning. Handle with care.',
    pickupNotes: 'Free to use for harvest days! Pick up from my home or I can bring to events.',
  },
  {
    id: 'tool-7',
    name: 'Electric Lawn Mower',
    description: 'Quiet electric mower perfect for maintaining grass paths between garden beds. Battery-powered, eco-friendly, and easy to maneuver.',
    category: 'Power Tools',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    ],
    ownerId: 'user-1',
    ownerName: 'Sarah Chen',
    ownerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    ownerLocation: 'Portland, OR',
    dailyRate: 20,
    weeklyRate: 80,
    depositRequired: 75,
    maxRentalDays: 3,
    status: 'rented',
    currentRenter: 'user-4',
    nextAvailable: new Date('2024-07-25'),
    timesRented: 14,
    rating: 4.6,
    reviews: 11,
    listedAt: new Date('2024-03-20'),
    lastRentedAt: new Date('2024-07-20'),
    brand: 'EGO Power+',
    model: 'LM2102SP',
    yearPurchased: 2023,
    specifications: [
      '21-inch cutting deck',
      '56V battery included (charged)',
      'Self-propelled',
      '60-minute runtime',
      'Mulch/bag/side discharge',
    ],
    instructions: 'Battery comes fully charged. Please return charged if possible (charger included).',
    pickupNotes: 'Currently rented until July 25. Can reserve for next available date.',
  },
  {
    id: 'tool-8',
    name: 'Compost Tumbler - 80 Gallon',
    description: 'Large dual-chamber compost tumbler. Makes composting easy with no heavy lifting. Perfect for creating nutrient-rich compost quickly.',
    category: 'Soil & Compost',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
    ],
    ownerId: 'user-2',
    ownerName: 'Michael Rodriguez',
    ownerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    ownerLocation: 'Eugene, OR',
    dailyRate: 15,
    weeklyRate: 50,
    depositRequired: 50,
    maxRentalDays: 30,
    status: 'available',
    timesRented: 6,
    rating: 4.8,
    reviews: 5,
    listedAt: new Date('2024-04-15'),
    brand: 'FCMP Outdoor',
    specifications: [
      '80-gallon capacity (2x 40-gallon chambers)',
      'UV-protected plastic',
      'Heavy-duty steel frame',
      'Easy tumbling action',
      'Large sliding doors',
    ],
    instructions: 'Great for continuous composting. Use one chamber while the other finishes. Instructions provided.',
    pickupNotes: 'This is heavy! You\'ll need a truck or SUV. I can help you load it.',
  },
]

// Helper function to filter tools by category
export function getToolsByCategory(category: ToolCategory): Tool[] {
  return SAMPLE_TOOLS.filter((tool) => tool.category === category)
}

// Helper function to get available tools only
export function getAvailableTools(): Tool[] {
  return SAMPLE_TOOLS.filter((tool) => tool.status === 'available')
}

// Helper function to get tools by owner
export function getToolsByOwner(ownerId: string): Tool[] {
  return SAMPLE_TOOLS.filter((tool) => tool.ownerId === ownerId)
}

// Helper function to calculate rental cost
export function calculateRentalCost(tool: Tool, days: number): number {
  if (tool.weeklyRate && days >= 7) {
    const weeks = Math.floor(days / 7)
    const remainingDays = days % 7
    return weeks * tool.weeklyRate + remainingDays * tool.dailyRate
  }
  return days * tool.dailyRate
}

export type EventCategory =
  | 'Workshop'
  | 'Seed Swap'
  | 'Farmers Market'
  | 'Volunteer Day'
  | 'Meetup'
  | 'Tour'
  | 'Class'
  | 'Harvest Festival'
  | 'Other'

export interface Event {
  id: string
  title: string
  description: string
  category: EventCategory
  organizerId: string
  organizerName: string
  organizerAvatar?: string
  date: Date
  endDate?: Date
  location: string
  address: string
  city: string
  state: string
  latitude?: number
  longitude?: number
  capacity?: number
  attendees: number
  price: number // 0 for free
  image?: string
  tags: string[]
  requirements?: string[]
  whatToBring?: string[]
  createdAt: Date
  updatedAt: Date
  isFeatured: boolean
  isVirtual: boolean
  virtualLink?: string
}

export const SAMPLE_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Community Seed Swap & Garden Social',
    description:
      "Join us for our monthly seed swap! Bring seeds from your garden to trade with fellow growers. We'll have tables set up for vegetable seeds, flower seeds, and herb seeds. Stay for coffee and snacks while we share growing tips and make new friends.\n\nNew gardeners welcome! If you don't have seeds to swap, we'll have plenty of extras to share.",
    category: 'Seed Swap',
    organizerId: 'user-1',
    organizerName: 'Emma Thompson',
    organizerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    date: new Date('2024-08-10T10:00:00'),
    endDate: new Date('2024-08-10T13:00:00'),
    location: 'Laurelhurst Park Pavilion',
    address: '3756 SE Oak St',
    city: 'Portland',
    state: 'OR',
    latitude: 45.5202,
    longitude: -122.6337,
    capacity: 50,
    attendees: 23,
    price: 0,
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
    tags: ['seed-swap', 'community', 'beginner-friendly', 'free'],
    whatToBring: ['Seeds to share', 'Small containers for collecting seeds', 'Labels or markers'],
    createdAt: new Date('2024-07-15T09:00:00'),
    updatedAt: new Date('2024-07-19T14:30:00'),
    isFeatured: true,
    isVirtual: false,
  },
  {
    id: '2',
    title: 'Organic Pest Management Workshop',
    description:
      'Learn effective organic methods for managing common garden pests! This hands-on workshop will cover:\n\n• Identifying common pests and beneficial insects\n• Making organic sprays and treatments\n• Companion planting strategies\n• Biological controls and integrated pest management\n\nLed by certified organic farmer Michael Rodriguez with 15 years of experience.',
    category: 'Workshop',
    organizerId: 'user-2',
    organizerName: 'Michael Rodriguez',
    organizerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    date: new Date('2024-08-15T14:00:00'),
    endDate: new Date('2024-08-15T17:00:00'),
    location: 'Green Acres Farm',
    address: '456 Green Acres Lane',
    city: 'Eugene',
    state: 'OR',
    capacity: 25,
    attendees: 18,
    price: 35,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
    tags: ['workshop', 'organic', 'pest-management', 'hands-on'],
    requirements: ['Wear closed-toe shoes', 'Bring notebook and pen'],
    whatToBring: ['Water bottle', 'Sun hat', 'Gardening gloves (optional)'],
    createdAt: new Date('2024-07-10T11:00:00'),
    updatedAt: new Date('2024-07-18T16:20:00'),
    isFeatured: true,
    isVirtual: false,
  },
  {
    id: '3',
    title: 'Saturday Farmers Market',
    description:
      'Weekly farmers market featuring local growers, artisan food makers, and craft vendors. Find fresh, seasonal produce, baked goods, honey, eggs, plants, and more!\n\nLive music, food trucks, and kids activities. Bring your reusable bags!',
    category: 'Farmers Market',
    organizerId: 'market-org',
    organizerName: 'Portland Farmers Market',
    organizerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Market',
    date: new Date('2024-08-03T08:00:00'),
    endDate: new Date('2024-08-03T14:00:00'),
    location: 'Downtown Portland',
    address: 'SW Park Avenue & SW Montgomery',
    city: 'Portland',
    state: 'OR',
    capacity: 5000,
    attendees: 1247,
    price: 0,
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800',
    tags: ['farmers-market', 'weekly', 'family-friendly', 'local'],
    whatToBring: ['Reusable shopping bags', 'Cash (some vendors)'],
    createdAt: new Date('2024-06-01T10:00:00'),
    updatedAt: new Date('2024-07-20T09:00:00'),
    isFeatured: false,
    isVirtual: false,
  },
  {
    id: '4',
    title: 'Community Garden Volunteer Day',
    description:
      "Help us prepare our community garden for fall planting! We'll be:\n\n• Building new raised beds\n• Clearing summer crops\n• Spreading compost\n• Planting cover crops\n• General garden maintenance\n\nAll skill levels welcome! Tools provided. Pizza lunch for all volunteers. Great way to learn and meet fellow gardeners!",
    category: 'Volunteer Day',
    organizerId: 'user-3',
    organizerName: 'Sarah Chen',
    organizerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    date: new Date('2024-08-17T09:00:00'),
    endDate: new Date('2024-08-17T15:00:00'),
    location: 'Sunnyside Community Garden',
    address: '3520 SE Yamhill St',
    city: 'Portland',
    state: 'OR',
    capacity: 30,
    attendees: 12,
    price: 0,
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800',
    tags: ['volunteer', 'community-garden', 'hands-on', 'free-lunch'],
    requirements: ['Must be 16+ or accompanied by adult'],
    whatToBring: ['Work gloves', 'Water bottle', 'Sun protection', 'Closed-toe shoes'],
    createdAt: new Date('2024-07-12T13:00:00'),
    updatedAt: new Date('2024-07-19T10:15:00'),
    isFeatured: false,
    isVirtual: false,
  },
  {
    id: '5',
    title: 'Composting 101: Online Workshop',
    description:
      'Learn the basics of home composting from the comfort of your own home! This virtual workshop covers:\n\n• Compost bin selection and setup\n• What to compost (and what NOT to compost)\n• Maintaining the right carbon-to-nitrogen ratio\n• Troubleshooting common problems\n• Using finished compost in your garden\n\nIncludes downloadable guides and Q&A session.',
    category: 'Class',
    organizerId: 'user-4',
    organizerName: 'Lisa Martinez',
    organizerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    date: new Date('2024-08-12T18:00:00'),
    endDate: new Date('2024-08-12T19:30:00'),
    location: 'Virtual Event',
    address: 'Online via Zoom',
    city: 'Virtual',
    state: 'OR',
    attendees: 45,
    price: 15,
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
    tags: ['virtual', 'composting', 'beginner-friendly', 'online'],
    requirements: ['Zoom account required'],
    whatToBring: ['Notebook for taking notes'],
    createdAt: new Date('2024-07-08T15:00:00'),
    updatedAt: new Date('2024-07-17T11:00:00'),
    isFeatured: false,
    isVirtual: true,
    virtualLink: 'https://zoom.us/j/example123',
  },
  {
    id: '6',
    title: 'Permaculture Garden Tour',
    description:
      "Tour our 2-acre permaculture homestead and see sustainable farming in action! You'll see:\n\n• Food forest with fruit and nut trees\n• Vegetable guilds and companion planting\n• Rainwater harvesting systems\n• Passive solar greenhouse\n• Chickens and integrated livestock\n• Composting and soil building techniques\n\nTour lasts about 2 hours with plenty of time for questions. Limited to 15 people for intimate experience.",
    category: 'Tour',
    organizerId: 'user-5',
    organizerName: 'David Park',
    organizerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    date: new Date('2024-08-24T10:00:00'),
    endDate: new Date('2024-08-24T12:00:00'),
    location: 'Meadow View Homestead',
    address: '321 Meadow View Road',
    city: 'Bend',
    state: 'OR',
    capacity: 15,
    attendees: 11,
    price: 25,
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
    tags: ['permaculture', 'tour', 'homestead', 'educational'],
    requirements: ['Comfortable walking shoes', 'Able to walk uneven terrain'],
    whatToBring: ['Water bottle', 'Sun hat', 'Camera (optional)'],
    createdAt: new Date('2024-07-05T14:00:00'),
    updatedAt: new Date('2024-07-16T09:30:00'),
    isFeatured: true,
    isVirtual: false,
  },
  {
    id: '7',
    title: 'Fall Harvest Festival',
    description:
      "Celebrate the fall harvest with our community! This family-friendly festival features:\n\n• Pumpkin patch and corn maze\n• Live music and entertainment\n• Food vendors with farm-fresh meals\n• Kids activities and games\n• Pie baking contest\n• Local artisan market\n• Tractor rides and farm tours\n\nFree admission! Individual activities may have small fees.",
    category: 'Harvest Festival',
    organizerId: 'user-6',
    organizerName: 'Rachel Green',
    organizerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel',
    date: new Date('2024-09-28T11:00:00'),
    endDate: new Date('2024-09-28T18:00:00'),
    location: 'Sunshine Farm',
    address: '888 Sunshine Farm Road',
    city: 'Corvallis',
    state: 'OR',
    capacity: 500,
    attendees: 87,
    price: 0,
    image: 'https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?w=800',
    tags: ['festival', 'family-friendly', 'harvest', 'free'],
    whatToBring: ['Appetite for fresh food!', 'Blanket for picnic area', 'Cash for vendors'],
    createdAt: new Date('2024-07-01T10:00:00'),
    updatedAt: new Date('2024-07-19T15:45:00'),
    isFeatured: true,
    isVirtual: false,
  },
  {
    id: '8',
    title: 'Small Farm Business Planning Workshop',
    description:
      'Turn your passion for farming into a viable business! This full-day workshop covers:\n\n• Market research and finding your niche\n• Creating a business plan\n• Financial projections and budgeting\n• Marketing strategies for small farms\n• Legal considerations and permits\n• Time management and scaling\n\nIncludes workbook, templates, and one-on-one consultation time. Lunch provided.',
    category: 'Workshop',
    organizerId: 'user-7',
    organizerName: 'Tom Baker',
    organizerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom',
    date: new Date('2024-08-21T09:00:00'),
    endDate: new Date('2024-08-21T16:00:00'),
    location: 'Oregon State Extension Office',
    address: '4077 SW Research Way',
    city: 'Corvallis',
    state: 'OR',
    capacity: 20,
    attendees: 14,
    price: 75,
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
    tags: ['workshop', 'business', 'farming', 'professional-development'],
    requirements: ['Bring laptop or tablet'],
    whatToBring: ['Lunch provided', 'Business ideas/questions'],
    createdAt: new Date('2024-06-20T11:00:00'),
    updatedAt: new Date('2024-07-18T13:20:00'),
    isFeatured: false,
    isVirtual: false,
  },
  {
    id: '9',
    title: 'Monthly Growers Meetup - Coffee & Conversation',
    description:
      "Casual monthly meetup for local growers to connect, share experiences, and learn from each other. No agenda, no presentations - just good conversation over coffee!\n\nDiscuss what's working in your garden, challenges you're facing, and swap tips and tricks. All experience levels welcome. Great for networking and making farming friends.",
    category: 'Meetup',
    organizerId: 'user-8',
    organizerName: 'Alex Rivera',
    organizerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    date: new Date('2024-08-07T08:00:00'),
    endDate: new Date('2024-08-07T10:00:00'),
    location: 'Daily Grind Coffee Shop',
    address: '1234 Main Street',
    city: 'Salem',
    state: 'OR',
    capacity: 25,
    attendees: 16,
    price: 0,
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800',
    tags: ['meetup', 'networking', 'casual', 'monthly'],
    whatToBring: ['Your growing questions and stories'],
    createdAt: new Date('2024-07-01T09:00:00'),
    updatedAt: new Date('2024-07-19T08:00:00'),
    isFeatured: false,
    isVirtual: false,
  },
  {
    id: '10',
    title: 'Canning & Food Preservation Workshop',
    description:
      'Preserve your harvest and enjoy it all year long! This hands-on workshop teaches safe canning techniques:\n\n• Water bath canning basics\n• Pressure canning for low-acid foods\n• Making jams, jellies, and pickles\n• Proper storage and safety\n• Recipe modifications and creativity\n\nEveryone will can at least 3 jars to take home. Recipes and resource guide included.',
    category: 'Workshop',
    organizerId: 'user-9',
    organizerName: 'James Wilson',
    organizerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    date: new Date('2024-08-29T13:00:00'),
    endDate: new Date('2024-08-29T17:00:00'),
    location: 'Community Kitchen',
    address: '567 Kitchen Lane',
    city: 'Eugene',
    state: 'OR',
    capacity: 12,
    attendees: 9,
    price: 45,
    image: 'https://images.unsplash.com/photo-1587048122117-e5d8e2e99c93?w=800',
    tags: ['workshop', 'canning', 'preservation', 'hands-on'],
    requirements: ['Hair tie for long hair', 'No open-toed shoes'],
    whatToBring: ['Apron', 'Containers for taking jars home'],
    createdAt: new Date('2024-07-10T14:00:00'),
    updatedAt: new Date('2024-07-19T16:00:00'),
    isFeatured: false,
    isVirtual: false,
  },
]

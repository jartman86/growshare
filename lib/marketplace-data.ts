export type ProductCategory =
  | 'Vegetables'
  | 'Fruits'
  | 'Herbs'
  | 'Flowers'
  | 'Seeds'
  | 'Seedlings'
  | 'Value-Added'
  | 'Other'

export type DeliveryMethod = 'pickup' | 'delivery' | 'shipping' | 'csa-box'

export type ProductStatus = 'available' | 'low-stock' | 'sold-out' | 'pre-order'

export interface Product {
  id: string
  sellerId: string
  sellerName: string
  sellerAvatar?: string
  sellerRating: number
  sellerLocation: string
  title: string
  description: string
  category: ProductCategory
  images: string[]
  price: number
  unit: string // e.g., "lb", "bunch", "dozen", "each"
  quantity: number
  minOrder?: number
  status: ProductStatus
  organic: boolean
  certifiedOrganic: boolean
  deliveryMethods: DeliveryMethod[]
  pickupLocation?: string
  availableFrom?: Date
  availableUntil?: Date
  tags: string[]
  harvestedDate?: Date
  varietyName?: string
  createdAt: Date
  updatedAt: Date
}

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    sellerId: 'grower-1',
    sellerName: 'Sarah Chen',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    sellerRating: 4.9,
    sellerLocation: 'Portland, OR',
    title: 'Heritage Tomatoes - Mixed Variety Pack',
    description:
      'Beautiful mix of heirloom tomatoes including Brandywine, Cherokee Purple, and Green Zebra. Organically grown on our certified farm. Perfect for salads, sauces, or eating fresh. Each variety offers unique flavors and colors.',
    category: 'Vegetables',
    images: [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800',
      'https://images.unsplash.com/photo-1546470427-227d0d7aec21?w=800',
    ],
    price: 6.5,
    unit: 'lb',
    quantity: 50,
    minOrder: 2,
    status: 'available',
    organic: true,
    certifiedOrganic: true,
    deliveryMethods: ['pickup', 'delivery', 'csa-box'],
    pickupLocation: '123 Farm Road, Portland, OR',
    availableFrom: new Date('2024-07-01'),
    availableUntil: new Date('2024-09-30'),
    tags: ['heirloom', 'organic', 'local', 'fresh'],
    harvestedDate: new Date('2024-07-15'),
    varietyName: 'Mixed Heirlooms',
    createdAt: new Date('2024-07-10'),
    updatedAt: new Date('2024-07-15'),
  },
  {
    id: '2',
    sellerId: 'grower-2',
    sellerName: 'Michael Rodriguez',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    sellerRating: 4.8,
    sellerLocation: 'Eugene, OR',
    title: 'Rainbow Carrots - Organic',
    description:
      'Stunning rainbow carrots in purple, yellow, orange, and white. Sweet and crunchy, perfect for roasting or eating raw. Grown without pesticides in rich organic soil.',
    category: 'Vegetables',
    images: [
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800',
      'https://images.unsplash.com/photo-1582515073490-39981397c445?w=800',
    ],
    price: 4.0,
    unit: 'lb',
    quantity: 100,
    status: 'available',
    organic: true,
    certifiedOrganic: true,
    deliveryMethods: ['pickup', 'shipping'],
    pickupLocation: '456 Green Acres, Eugene, OR',
    tags: ['rainbow', 'organic', 'pesticide-free'],
    varietyName: 'Rainbow Mix',
    createdAt: new Date('2024-07-05'),
    updatedAt: new Date('2024-07-12'),
  },
  {
    id: '3',
    sellerId: 'grower-3',
    sellerName: 'Emma Thompson',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    sellerRating: 5.0,
    sellerLocation: 'Salem, OR',
    title: 'Fresh Basil Bunches - Genovese',
    description:
      'Fragrant Genovese basil, perfect for pesto, caprese, or Italian cooking. Harvested this morning for maximum freshness. Each bunch is generous and full of flavor.',
    category: 'Herbs',
    images: [
      'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=800',
      'https://images.unsplash.com/photo-1593113646773-028c4a5da1a6?w=800',
    ],
    price: 3.5,
    unit: 'bunch',
    quantity: 30,
    status: 'available',
    organic: true,
    certifiedOrganic: false,
    deliveryMethods: ['pickup', 'delivery'],
    pickupLocation: '789 Herb Garden Lane, Salem, OR',
    tags: ['fresh', 'fragrant', 'italian', 'local'],
    varietyName: 'Genovese',
    harvestedDate: new Date('2024-07-20'),
    createdAt: new Date('2024-07-18'),
    updatedAt: new Date('2024-07-20'),
  },
  {
    id: '4',
    sellerId: 'grower-1',
    sellerName: 'Sarah Chen',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    sellerRating: 4.9,
    sellerLocation: 'Portland, OR',
    title: 'Heirloom Tomato Seedlings',
    description:
      'Healthy tomato seedlings ready for transplanting. Varieties include Brandywine, Cherokee Purple, and Roma. Grown from organic seeds in our greenhouse. 4-6 inches tall.',
    category: 'Seedlings',
    images: [
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800',
    ],
    price: 4.0,
    unit: 'each',
    quantity: 200,
    minOrder: 6,
    status: 'available',
    organic: true,
    certifiedOrganic: false,
    deliveryMethods: ['pickup'],
    pickupLocation: '123 Farm Road, Portland, OR',
    availableFrom: new Date('2024-04-01'),
    availableUntil: new Date('2024-05-31'),
    tags: ['seedlings', 'heirloom', 'organic-seed', 'starts'],
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-04-01'),
  },
  {
    id: '5',
    sellerId: 'grower-4',
    sellerName: 'David Park',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    sellerRating: 4.7,
    sellerLocation: 'Bend, OR',
    title: 'Raw Wildflower Honey - 16oz',
    description:
      'Pure raw wildflower honey from our backyard hives. Unfiltered and unprocessed, retaining all natural enzymes and pollen. Beautiful amber color with complex floral notes.',
    category: 'Value-Added',
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784f4?w=800',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800',
    ],
    price: 18.0,
    unit: 'jar',
    quantity: 40,
    status: 'available',
    organic: false,
    certifiedOrganic: false,
    deliveryMethods: ['pickup', 'shipping'],
    pickupLocation: '321 Meadow View, Bend, OR',
    tags: ['raw', 'local', 'honey', 'wildflower', 'unprocessed'],
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-15'),
  },
  {
    id: '6',
    sellerId: 'grower-5',
    sellerName: 'Lisa Martinez',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    sellerRating: 4.9,
    sellerLocation: 'Ashland, OR',
    title: 'Strawberries - Albion Variety',
    description:
      'Sweet, juicy Albion strawberries. Day-neutral variety means they produce fruit all summer long. Picked at peak ripeness for maximum sweetness. Perfect for eating fresh, making jam, or freezing.',
    category: 'Fruits',
    images: [
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800',
      'https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=800',
    ],
    price: 8.0,
    unit: 'lb',
    quantity: 25,
    status: 'low-stock',
    organic: true,
    certifiedOrganic: true,
    deliveryMethods: ['pickup', 'delivery'],
    pickupLocation: '555 Berry Lane, Ashland, OR',
    availableFrom: new Date('2024-06-01'),
    availableUntil: new Date('2024-09-30'),
    tags: ['strawberries', 'sweet', 'organic', 'day-neutral'],
    varietyName: 'Albion',
    harvestedDate: new Date('2024-07-18'),
    createdAt: new Date('2024-06-10'),
    updatedAt: new Date('2024-07-18'),
  },
  {
    id: '7',
    sellerId: 'grower-6',
    sellerName: 'James Wilson',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    sellerRating: 4.6,
    sellerLocation: 'Corvallis, OR',
    title: 'Sunflower Bouquets',
    description:
      'Bright, cheerful sunflower bouquets with 5-7 stems per bunch. Perfect for home decoration or gifts. Grown without chemicals in full Oregon sun. Long-lasting and gorgeous.',
    category: 'Flowers',
    images: [
      'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?w=800',
      'https://images.unsplash.com/photo-1597848212624-e530d5f5d8b1?w=800',
    ],
    price: 12.0,
    unit: 'bunch',
    quantity: 15,
    status: 'available',
    organic: true,
    certifiedOrganic: false,
    deliveryMethods: ['pickup', 'delivery'],
    pickupLocation: '888 Sunshine Farm, Corvallis, OR',
    availableFrom: new Date('2024-07-01'),
    availableUntil: new Date('2024-08-31'),
    tags: ['sunflowers', 'bouquet', 'cut-flowers', 'chemical-free'],
    createdAt: new Date('2024-06-25'),
    updatedAt: new Date('2024-07-10'),
  },
  {
    id: '8',
    sellerId: 'grower-2',
    sellerName: 'Michael Rodriguez',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    sellerRating: 4.8,
    sellerLocation: 'Eugene, OR',
    title: 'Kale - Lacinato (Dinosaur Kale)',
    description:
      'Nutrient-dense Lacinato kale with dark blue-green leaves. Tender and sweet, perfect for salads, smoothies, or sautéing. Grown organically in mineral-rich soil.',
    category: 'Vegetables',
    images: [
      'https://images.unsplash.com/photo-1560324889-5d5b4a0c4b84?w=800',
      'https://images.unsplash.com/photo-1574316071802-0d684ffe27a5?w=800',
    ],
    price: 3.0,
    unit: 'bunch',
    quantity: 60,
    status: 'available',
    organic: true,
    certifiedOrganic: true,
    deliveryMethods: ['pickup', 'shipping', 'csa-box'],
    pickupLocation: '456 Green Acres, Eugene, OR',
    tags: ['kale', 'superfood', 'organic', 'nutrient-dense'],
    varietyName: 'Lacinato',
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date('2024-07-15'),
  },
  {
    id: '9',
    sellerId: 'grower-7',
    sellerName: 'Rachel Green',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel',
    sellerRating: 5.0,
    sellerLocation: 'Hood River, OR',
    title: 'Garlic Bulbs - Music Variety',
    description:
      'Premium hardneck Music garlic. Large, easy-to-peel cloves with strong, rich flavor. Cured for 4 weeks for optimal storage. Perfect for cooking or planting next season.',
    category: 'Vegetables',
    images: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800',
      'https://images.unsplash.com/photo-1571493530816-e4a57e0eb942?w=800',
    ],
    price: 12.0,
    unit: 'lb',
    quantity: 80,
    minOrder: 0.5,
    status: 'available',
    organic: true,
    certifiedOrganic: false,
    deliveryMethods: ['pickup', 'shipping'],
    pickupLocation: '777 Garlic Grove, Hood River, OR',
    availableFrom: new Date('2024-08-01'),
    availableUntil: new Date('2025-03-31'),
    tags: ['garlic', 'hardneck', 'cured', 'music', 'storage'],
    varietyName: 'Music',
    harvestedDate: new Date('2024-07-01'),
    createdAt: new Date('2024-07-25'),
    updatedAt: new Date('2024-08-01'),
  },
  {
    id: '10',
    sellerId: 'grower-3',
    sellerName: 'Emma Thompson',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    sellerRating: 5.0,
    sellerLocation: 'Salem, OR',
    title: 'Fresh Salad Mix - Spring Blend',
    description:
      'Premium salad mix with baby lettuces, arugula, and edible flowers. Washed and ready to eat. Harvested daily for maximum freshness and crispness. A colorful, delicious blend.',
    category: 'Vegetables',
    images: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
      'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800',
    ],
    price: 7.0,
    unit: 'bag',
    quantity: 40,
    status: 'available',
    organic: true,
    certifiedOrganic: true,
    deliveryMethods: ['pickup', 'delivery', 'csa-box'],
    pickupLocation: '789 Herb Garden Lane, Salem, OR',
    tags: ['salad', 'mixed-greens', 'ready-to-eat', 'organic'],
    harvestedDate: new Date('2024-07-20'),
    createdAt: new Date('2024-07-15'),
    updatedAt: new Date('2024-07-20'),
  },
  {
    id: '11',
    sellerId: 'grower-8',
    sellerName: 'Tom Baker',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom',
    sellerRating: 4.8,
    sellerLocation: 'McMinnville, OR',
    title: 'Blueberries - Jersey Variety',
    description:
      'Sweet, plump blueberries from our certified organic farm. Jersey variety is known for excellent flavor and firm texture. Great for eating fresh, baking, or freezing.',
    category: 'Fruits',
    images: [
      'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=800',
      'https://images.unsplash.com/photo-1596956470007-2bf6095e7e16?w=800',
    ],
    price: 9.0,
    unit: 'pint',
    quantity: 50,
    status: 'available',
    organic: true,
    certifiedOrganic: true,
    deliveryMethods: ['pickup', 'shipping'],
    pickupLocation: '999 Berry Hill, McMinnville, OR',
    availableFrom: new Date('2024-07-01'),
    availableUntil: new Date('2024-08-31'),
    tags: ['blueberries', 'organic', 'sweet', 'firm'],
    varietyName: 'Jersey',
    harvestedDate: new Date('2024-07-19'),
    createdAt: new Date('2024-07-10'),
    updatedAt: new Date('2024-07-19'),
  },
  {
    id: '12',
    sellerId: 'grower-4',
    sellerName: 'David Park',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    sellerRating: 4.7,
    sellerLocation: 'Bend, OR',
    title: 'Farm-Fresh Eggs - Pasture-Raised',
    description:
      'Beautiful pasture-raised eggs from our free-roaming hens. Fed organic feed and forage on fresh grass daily. Rich, orange yolks and exceptional flavor. Available by the dozen.',
    category: 'Other',
    images: [
      'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800',
      'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=800',
    ],
    price: 8.0,
    unit: 'dozen',
    quantity: 30,
    status: 'available',
    organic: false,
    certifiedOrganic: false,
    deliveryMethods: ['pickup'],
    pickupLocation: '321 Meadow View, Bend, OR',
    tags: ['eggs', 'pasture-raised', 'free-range', 'fresh'],
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date('2024-07-20'),
  },
]

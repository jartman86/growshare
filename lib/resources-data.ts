/**
 * Growing Resources Library Data
 *
 * Data structure compatible with:
 * - USDA Plants Database (plants.usda.gov)
 * - OpenFarm API (openfarm.cc)
 * - USDA Hardiness Zones
 *
 * For production: Integrate with plant databases via API
 */

export type PlantCategory =
  | 'Vegetables'
  | 'Fruits'
  | 'Herbs'
  | 'Flowers'
  | 'Grains'
  | 'Legumes'
  | 'Root Vegetables'
  | 'Leafy Greens'

export type GrowingDifficulty = 'Easy' | 'Moderate' | 'Challenging'

export type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter'

export interface PlantGuide {
  id: string
  commonName: string
  scientificName: string
  category: PlantCategory
  difficulty: GrowingDifficulty
  image: string
  description: string

  // USDA Data
  hardinessZones: string // e.g., "3-9"
  nativeTo?: string

  // Growing Requirements
  sunlight: 'Full Sun' | 'Partial Shade' | 'Full Shade' | 'Part Sun/Part Shade'
  water: 'Low' | 'Moderate' | 'High'
  soilType: string[]
  soilPH: string // e.g., "6.0-7.0"
  spacing: string // e.g., "12-18 inches"
  depth: string // e.g., "1/4 inch"

  // Timing (by zone/season)
  daysToGermination: string
  daysToMaturity: string
  plantingSeasons: Season[]
  harvestSeasons: Season[]

  // Care Instructions
  fertilizer?: string
  commonPests: string[]
  commonDiseases: string[]
  companionPlants: string[]
  avoidPlanting: string[]

  // Harvesting
  harvestTips: string
  storageInstructions?: string

  // Additional Info
  culinaryUses?: string[]
  nutritionalInfo?: string
  varieties?: string[]

  // OpenFarm fields
  growingTips: string[]
  troubleshooting: string[]

  // Metadata
  popularityScore: number
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

// Sample data with real, accurate information
export const SAMPLE_PLANT_GUIDES: PlantGuide[] = [
  {
    id: '1',
    commonName: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    category: 'Vegetables',
    difficulty: 'Moderate',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800',
    description:
      'Tomatoes are warm-season crops that thrive in full sun. They are one of the most popular garden vegetables, producing abundant fruit throughout the summer. Available in determinate (bush) and indeterminate (vining) varieties.',
    hardinessZones: '3-11',
    nativeTo: 'South America',
    sunlight: 'Full Sun',
    water: 'Moderate',
    soilType: ['Well-drained', 'Loamy', 'Rich in organic matter'],
    soilPH: '6.0-6.8',
    spacing: '24-36 inches',
    depth: '1/4 inch',
    daysToGermination: '5-10 days',
    daysToMaturity: '60-85 days',
    plantingSeasons: ['Spring', 'Summer'],
    harvestSeasons: ['Summer', 'Fall'],
    fertilizer: 'Balanced 10-10-10, then switch to low-nitrogen once fruiting begins',
    commonPests: ['Aphids', 'Hornworms', 'Whiteflies', 'Cutworms'],
    commonDiseases: ['Early Blight', 'Late Blight', 'Septoria Leaf Spot', 'Fusarium Wilt'],
    companionPlants: ['Basil', 'Marigolds', 'Carrots', 'Onions', 'Nasturtiums'],
    avoidPlanting: ['Brassicas', 'Corn', 'Fennel', 'Dill', 'Potatoes'],
    harvestTips:
      'Harvest when fully colored but still firm. For best flavor, pick in the morning after dew has dried. Tomatoes will continue to ripen off the vine.',
    storageInstructions:
      'Store at room temperature away from direct sunlight. Never refrigerate - it destroys flavor and texture. Use within 1-2 weeks.',
    culinaryUses: ['Fresh eating', 'Salads', 'Sauces', 'Canning', 'Roasting'],
    nutritionalInfo: 'Rich in vitamins C and K, potassium, and lycopene (antioxidant)',
    varieties: [
      'Brandywine (heirloom)',
      'Cherokee Purple (heirloom)',
      'San Marzano (paste)',
      'Cherry/Grape (small)',
      'Beefsteak (large slicing)',
    ],
    growingTips: [
      'Stake or cage plants for support and better air circulation',
      'Remove suckers on indeterminate varieties for larger fruit',
      'Mulch to retain moisture and prevent soil-borne diseases',
      'Water deeply and consistently to prevent blossom end rot',
      'Rotate crops yearly to prevent disease buildup',
    ],
    troubleshooting: [
      'Yellow leaves: Check for nitrogen deficiency or overwatering',
      'Blossom end rot: Calcium deficiency - ensure consistent watering',
      'Cracking fruit: Irregular watering - maintain even moisture',
      'No fruit set: Temperatures too hot (>90°F) or too cold (<55°F at night)',
    ],
    popularityScore: 98,
    tags: ['warm-season', 'summer', 'vine', 'fruit-bearing', 'popular'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-07-15'),
  },
  {
    id: '2',
    commonName: 'Lettuce',
    scientificName: 'Lactuca sativa',
    category: 'Leafy Greens',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=800',
    description:
      'Lettuce is a fast-growing, cool-season crop perfect for beginners. It thrives in spring and fall, providing fresh salad greens in as little as 30 days. Many varieties can be grown as cut-and-come-again crops.',
    hardinessZones: '4-9',
    nativeTo: 'Mediterranean region',
    sunlight: 'Part Sun/Part Shade',
    water: 'Moderate',
    soilType: ['Well-drained', 'Loamy', 'Rich in nitrogen'],
    soilPH: '6.0-7.0',
    spacing: '6-12 inches (depending on variety)',
    depth: '1/4 inch',
    daysToGermination: '7-14 days',
    daysToMaturity: '30-70 days',
    plantingSeasons: ['Spring', 'Fall'],
    harvestSeasons: ['Spring', 'Fall', 'Winter'],
    fertilizer: 'High-nitrogen fertilizer every 2 weeks for leafy growth',
    commonPests: ['Aphids', 'Slugs', 'Snails', 'Leaf miners'],
    commonDiseases: ['Downy Mildew', 'Bottom Rot', 'Tipburn'],
    companionPlants: ['Radishes', 'Carrots', 'Beets', 'Strawberries', 'Cucumbers'],
    avoidPlanting: ['Parsley', 'Celery'],
    harvestTips:
      'Harvest outer leaves for continuous production, or cut entire head 1 inch above soil. Best picked in the morning when leaves are crisp.',
    storageInstructions:
      'Wash and dry thoroughly. Store in refrigerator in perforated plastic bag or container. Use within 3-5 days for best quality.',
    culinaryUses: ['Fresh salads', 'Sandwiches', 'Wraps', 'Garnish'],
    nutritionalInfo: 'Low calorie, good source of vitamins A, K, and folate',
    varieties: [
      'Butterhead (Boston, Bibb)',
      'Romaine/Cos',
      'Loose-leaf (Red/Green)',
      'Crisphead (Iceberg)',
      'Mixed mesclun',
    ],
    growingTips: [
      'Succession plant every 2 weeks for continuous harvest',
      'Provide afternoon shade in warm weather to prevent bolting',
      'Keep soil consistently moist but not waterlogged',
      'Mulch to keep roots cool and retain moisture',
      'Lettuce bolts (goes to seed) in heat - choose heat-tolerant varieties for summer',
    ],
    troubleshooting: [
      'Bolting: Plant too hot - provide shade or wait for cooler weather',
      'Bitter taste: Stress from heat or drought - harvest early morning',
      'Tipburn: Calcium deficiency or irregular watering - maintain even moisture',
      'Slow growth: Too much shade or low nitrogen - fertilize and ensure 4+ hours sun',
    ],
    popularityScore: 85,
    tags: ['cool-season', 'fast-growing', 'beginner-friendly', 'salad'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-07-15'),
  },
  {
    id: '3',
    commonName: 'Basil',
    scientificName: 'Ocimum basilicum',
    category: 'Herbs',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=800',
    description:
      'Basil is a fragrant annual herb essential for Italian cooking. It loves heat and sun, making it perfect for summer gardens. Regular harvesting encourages bushier growth and prevents flowering.',
    hardinessZones: '10-11 (grow as annual elsewhere)',
    nativeTo: 'Tropical regions of central Africa to Southeast Asia',
    sunlight: 'Full Sun',
    water: 'Moderate',
    soilType: ['Well-drained', 'Rich', 'Moist'],
    soilPH: '6.0-7.5',
    spacing: '12-18 inches',
    depth: '1/4 inch',
    daysToGermination: '5-10 days',
    daysToMaturity: '60-90 days',
    plantingSeasons: ['Spring', 'Summer'],
    harvestSeasons: ['Summer', 'Fall'],
    fertilizer: 'Balanced liquid fertilizer every 2-4 weeks',
    commonPests: ['Aphids', 'Japanese beetles', 'Slugs', 'Whiteflies'],
    commonDiseases: ['Fusarium Wilt', 'Downy Mildew', 'Gray Mold'],
    companionPlants: ['Tomatoes', 'Peppers', 'Oregano', 'Asparagus'],
    avoidPlanting: ['Rue', 'Sage'],
    harvestTips:
      'Pinch off top sets of leaves regularly to encourage bushiness. Harvest before flowering for best flavor. Cut stems just above a leaf node.',
    storageInstructions:
      'Use fresh within a few days. Store stems in water like flowers, or freeze in olive oil in ice cube trays. Drying reduces flavor significantly.',
    culinaryUses: ['Pesto', 'Caprese salad', 'Italian dishes', 'Thai cuisine', 'Infused oils'],
    nutritionalInfo: 'Contains vitamin K, manganese, and antioxidants',
    varieties: ['Sweet/Genovese', 'Thai', 'Purple', 'Lemon', 'Cinnamon'],
    growingTips: [
      'Pinch flowers immediately to keep leaves flavorful',
      'Water at base to prevent fungal diseases on leaves',
      'Grows well in containers on sunny patios',
      'Sensitive to cold - plant after all frost danger',
      'Companion plant with tomatoes for better flavor and pest control',
    ],
    troubleshooting: [
      'Black/brown leaves: Frost damage or fungal disease - ensure good drainage',
      'Yellowing leaves: Overwatering or nutrient deficiency - check soil moisture',
      'Leggy growth: Insufficient light - move to sunnier location',
      'Holes in leaves: Japanese beetles or slugs - hand pick or use organic controls',
    ],
    popularityScore: 92,
    tags: ['herb', 'culinary', 'aromatic', 'warm-season', 'beginner-friendly'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-07-15'),
  },
  {
    id: '4',
    commonName: 'Carrot',
    scientificName: 'Daucus carota',
    category: 'Root Vegetables',
    difficulty: 'Moderate',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800',
    description:
      'Carrots are cool-season root vegetables that require loose, deep soil for straight root development. They can be grown in rainbow colors and take 2-4 months to mature depending on variety.',
    hardinessZones: '3-10',
    nativeTo: 'Europe and Southwestern Asia',
    sunlight: 'Full Sun',
    water: 'Moderate',
    soilType: ['Loose', 'Sandy', 'Deep', 'Stone-free'],
    soilPH: '6.0-6.8',
    spacing: '2-3 inches after thinning',
    depth: '1/4-1/2 inch',
    daysToGermination: '14-21 days',
    daysToMaturity: '50-80 days',
    plantingSeasons: ['Spring', 'Fall'],
    harvestSeasons: ['Summer', 'Fall', 'Winter'],
    fertilizer: 'Low nitrogen, higher phosphorus and potassium. Avoid fresh manure.',
    commonPests: ['Carrot rust fly', 'Wireworms', 'Root-knot nematodes'],
    commonDiseases: ['Leaf blight', 'Root rot', 'Aster yellows'],
    companionPlants: ['Onions', 'Leeks', 'Rosemary', 'Sage', 'Tomatoes'],
    avoidPlanting: ['Dill', 'Parsnips'],
    harvestTips:
      'Harvest when shoulders are 1/2-3/4 inch diameter. Gently loosen soil before pulling. Carrots sweeten after light frost.',
    storageInstructions:
      'Remove tops immediately to prevent moisture loss. Store in refrigerator in perforated plastic bag for up to 2 months. Can be stored in sand in root cellar.',
    culinaryUses: ['Raw snacking', 'Roasting', 'Soups', 'Juicing', 'Baking (carrot cake)'],
    nutritionalInfo: 'Excellent source of beta-carotene (vitamin A), fiber, and antioxidants',
    varieties: [
      'Nantes (cylindrical)',
      'Danvers (tapered)',
      'Imperator (long, supermarket type)',
      'Chantenay (short, broad)',
      'Rainbow mix (purple, yellow, white)',
    ],
    growingTips: [
      'Sow directly - carrots do not transplant well',
      'Keep soil consistently moist during germination (2-3 weeks)',
      'Thin seedlings to proper spacing for best root development',
      'Soil must be loose and stone-free to at least 12 inches deep',
      'Mark rows with radishes (fast germinating) to see where carrots are',
    ],
    troubleshooting: [
      'Forked/twisted roots: Rocky soil or too much nitrogen - improve soil structure',
      'Hairy roots: Too much fertilizer - reduce nitrogen',
      'Green shoulders: Exposure to sun - mound soil over tops',
      'Poor germination: Soil crust or drying out - keep moist, cover with vermiculite',
    ],
    popularityScore: 88,
    tags: ['root-vegetable', 'cool-season', 'storage-crop', 'direct-sow'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-07-15'),
  },
  {
    id: '5',
    commonName: 'Strawberry',
    scientificName: 'Fragaria × ananassa',
    category: 'Fruits',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800',
    description:
      'Strawberries are perennial plants that produce sweet, juicy berries in late spring and early summer. June-bearing varieties produce one large crop, while everbearing and day-neutral types fruit throughout the season.',
    hardinessZones: '3-10',
    nativeTo: 'Temperate regions worldwide',
    sunlight: 'Full Sun',
    water: 'Moderate',
    soilType: ['Well-drained', 'Sandy loam', 'Rich in organic matter'],
    soilPH: '5.5-6.8',
    spacing: '12-18 inches',
    depth: 'Crown at soil level (not buried)',
    daysToGermination: 'N/A (typically grown from runners/transplants)',
    daysToMaturity: '4-6 weeks after flowering',
    plantingSeasons: ['Spring', 'Fall'],
    harvestSeasons: ['Spring', 'Summer'],
    fertilizer: 'Balanced fertilizer in spring, avoid high nitrogen which reduces fruiting',
    commonPests: ['Slugs', 'Birds', 'Spider mites', 'Aphids'],
    commonDiseases: ['Gray mold', 'Powdery mildew', 'Verticillium wilt', 'Red stele'],
    companionPlants: ['Borage', 'Thyme', 'Lettuce', 'Spinach', 'Bush beans'],
    avoidPlanting: ['Brassicas', 'Verticillium-susceptible plants (tomatoes, peppers, eggplant)'],
    harvestTips:
      'Pick when fully red with some white near the stem (they will ripen). Harvest every 2-3 days. Pick with stem attached.',
    storageInstructions:
      'Do not wash until ready to eat. Store in refrigerator in single layer. Use within 3-5 days. Freeze for long-term storage.',
    culinaryUses: ['Fresh eating', 'Jams/preserves', 'Desserts', 'Smoothies', 'Baking'],
    nutritionalInfo:
      'High in vitamin C, manganese, folate, and antioxidants. More vitamin C than oranges!',
    varieties: [
      'June-bearing (Earliglow, Jewel)',
      'Everbearing (Ozark Beauty, Quinault)',
      'Day-neutral (Seascape, Albion)',
      'Alpine (small, intensely flavored)',
    ],
    growingTips: [
      'Plant in early spring for summer harvest',
      'Remove flowers the first year to establish strong roots',
      'Renovate June-bearing plants after harvest by mowing and fertilizing',
      'Mulch with straw to keep berries clean and conserve moisture',
      'Replace plants every 3-5 years for best production',
    ],
    troubleshooting: [
      'Few or no berries: Too much nitrogen, insufficient sun, or stressed plants',
      'Seedy or small berries: Poor pollination or drought stress',
      'White/green berries not ripening: Temperature too hot (>85°F)',
      'Rotting fruit: Gray mold from poor air circulation or excessive moisture',
    ],
    popularityScore: 94,
    tags: ['perennial', 'fruit', 'berries', 'beginner-friendly', 'container-suitable'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-07-15'),
  },
  {
    id: '6',
    commonName: 'Zucchini',
    scientificName: 'Cucurbita pepo',
    category: 'Vegetables',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1579631542720-3a87824fff86?w=800',
    description:
      'Zucchini (summer squash) is one of the most productive garden vegetables. A single plant can produce 6-10 pounds of squash. They grow quickly in warm weather and are best harvested small and tender.',
    hardinessZones: '3-10',
    nativeTo: 'Central America and Mexico',
    sunlight: 'Full Sun',
    water: 'Moderate',
    soilType: ['Well-drained', 'Rich', 'Amended with compost'],
    soilPH: '6.0-7.5',
    spacing: '24-36 inches',
    depth: '1 inch',
    daysToGermination: '7-14 days',
    daysToMaturity: '45-55 days',
    plantingSeasons: ['Spring', 'Summer'],
    harvestSeasons: ['Summer', 'Fall'],
    fertilizer: 'Balanced fertilizer at planting, side-dress with compost during growing season',
    commonPests: ['Squash bugs', 'Cucumber beetles', 'Squash vine borers', 'Aphids'],
    commonDiseases: ['Powdery mildew', 'Downy mildew', 'Bacterial wilt', 'Blossom end rot'],
    companionPlants: ['Corn', 'Beans', 'Peas', 'Radishes', 'Nasturtiums'],
    avoidPlanting: ['Potatoes'],
    harvestTips:
      'Harvest when 6-8 inches long for best flavor and texture. Check daily as they grow fast. Cut stem with knife rather than pulling.',
    storageInstructions:
      'Store in refrigerator for up to 1 week. Do not wash until ready to use. Can be blanched and frozen.',
    culinaryUses: [
      'Grilled',
      'Sautéed',
      'Baked (zucchini bread)',
      'Spiralized (zoodles)',
      'Stuffed',
    ],
    nutritionalInfo: 'Low calorie, good source of vitamins C, A, and potassium',
    varieties: [
      'Black Beauty (dark green)',
      'Costata Romanesco (ribbed, Italian)',
      'Golden zucchini (yellow)',
      'Round/ball zucchini',
    ],
    growingTips: [
      'Plant after all danger of frost has passed and soil is warm',
      'Sow directly in garden - does not transplant well',
      'Harvest regularly to encourage continued production',
      'Hand-pollinate if few pollinators present (early morning)',
      'One plant produces abundantly - start with just 2-3 plants',
    ],
    troubleshooting: [
      'Blossom end rot: Calcium deficiency or irregular watering',
      'Fruits rotting: Poor pollination or excess moisture - ensure good drainage',
      'Yellow leaves: Normal aging of lower leaves, or powdery mildew',
      'Small fruit production slowing: Not harvesting often enough - pick daily',
    ],
    popularityScore: 91,
    tags: ['warm-season', 'summer-squash', 'productive', 'beginner-friendly', 'fast-growing'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-07-15'),
  },
]

// Pest & Disease Information
export interface PestDiseaseInfo {
  id: string
  name: string
  type: 'Pest' | 'Disease'
  image: string
  description: string
  affectedPlants: string[]
  symptoms: string[]
  prevention: string[]
  organicTreatments: string[]
  severity: 'Low' | 'Moderate' | 'High'
  season: Season[]
}

export const SAMPLE_PESTS_DISEASES: PestDiseaseInfo[] = [
  {
    id: 'pest-1',
    name: 'Aphids',
    type: 'Pest',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800',
    description:
      'Small, soft-bodied insects that cluster on new growth and undersides of leaves. They suck plant sap and excrete honeydew, which attracts ants and can lead to sooty mold.',
    affectedPlants: ['Tomatoes', 'Lettuce', 'Beans', 'Roses', 'Most vegetables'],
    symptoms: [
      'Clusters of small green, black, or white insects',
      'Curled or distorted leaves',
      'Sticky honeydew on leaves',
      'Presence of ants',
      'Stunted growth',
    ],
    prevention: [
      'Encourage beneficial insects (ladybugs, lacewings)',
      'Plant companion flowers like marigolds and nasturtiums',
      'Avoid over-fertilizing with nitrogen',
      'Monitor plants regularly',
    ],
    organicTreatments: [
      'Spray with strong water stream to dislodge',
      'Apply insecticidal soap',
      'Neem oil spray',
      'Introduce ladybugs or lacewings',
      'Garlic or hot pepper spray',
    ],
    severity: 'Moderate',
    season: ['Spring', 'Summer', 'Fall'],
  },
  {
    id: 'disease-1',
    name: 'Powdery Mildew',
    type: 'Disease',
    image: 'https://images.unsplash.com/photo-1592833159057-37f85f37975c?w=800',
    description:
      'Fungal disease that appears as white powdery coating on leaves. Thrives in warm days, cool nights, and high humidity. Reduces photosynthesis and weakens plants.',
    affectedPlants: ['Zucchini', 'Cucumbers', 'Pumpkins', 'Roses', 'Phlox'],
    symptoms: [
      'White powdery spots on leaves and stems',
      'Yellowing of leaves',
      'Leaf curling and distortion',
      'Reduced fruit production',
      'Premature leaf drop',
    ],
    prevention: [
      'Provide good air circulation',
      'Water at base of plants, not overhead',
      'Choose resistant varieties',
      'Remove infected leaves promptly',
      'Avoid overcrowding plants',
    ],
    organicTreatments: [
      'Spray with 1 part milk to 9 parts water',
      'Baking soda solution (1 tbsp per gallon water)',
      'Neem oil spray',
      'Sulfur-based fungicides',
      'Remove and destroy infected plant parts',
    ],
    severity: 'Moderate',
    season: ['Summer', 'Fall'],
  },
  {
    id: 'pest-2',
    name: 'Tomato Hornworm',
    type: 'Pest',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800',
    description:
      'Large green caterpillar (up to 4 inches) that can defoliate tomato plants rapidly. Has diagonal white stripes and a horn on rear end. Difficult to spot due to camouflage.',
    affectedPlants: ['Tomatoes', 'Peppers', 'Eggplant', 'Potatoes'],
    symptoms: [
      'Large sections of leaves eaten',
      'Dark green droppings on leaves',
      'Fruit damage',
      'Visible large green caterpillars',
      'Rapid defoliation',
    ],
    prevention: [
      'Till soil in fall to destroy pupae',
      'Encourage beneficial wasps',
      'Companion plant with borage, marigolds',
      'Regular inspection of plants',
    ],
    organicTreatments: [
      'Hand-pick and destroy (wear gloves)',
      'Bt (Bacillus thuringiensis) spray',
      'Do NOT kill hornworms with white eggs (parasitic wasps)',
      'Release trichogramma wasps',
      'Spray with spinosad',
    ],
    severity: 'High',
    season: ['Summer'],
  },
  {
    id: 'disease-2',
    name: 'Late Blight',
    type: 'Disease',
    image: 'https://images.unsplash.com/photo-1592491093312-ccc9e7f854e9?w=800',
    description:
      'Devastating fungal-like disease that destroyed Irish potato crops in 1840s. Spreads rapidly in cool, wet conditions. Can destroy entire tomato crop in days.',
    affectedPlants: ['Tomatoes', 'Potatoes'],
    symptoms: [
      'Dark brown/black lesions on leaves',
      'White fuzzy growth on leaf undersides',
      'Brown firm rot on fruit',
      'Stem lesions',
      'Rapid plant collapse',
    ],
    prevention: [
      'Plant certified disease-free seed potatoes',
      'Choose resistant varieties when possible',
      'Ensure good air circulation',
      'Avoid overhead watering',
      'Remove all volunteer plants',
    ],
    organicTreatments: [
      'Remove and destroy infected plants immediately',
      'Copper-based fungicides (preventative only)',
      'Do not compost infected material',
      'Rotate crops for 3-4 years',
      'No cure once established - focus on prevention',
    ],
    severity: 'High',
    season: ['Summer', 'Fall'],
  },
]

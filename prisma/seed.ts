import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Create sample users
  console.log('Creating users...')
  const user1 = await prisma.user.create({
    data: {
      clerkId: 'user_clerk_1',
      email: 'sarah@example.com',
      firstName: 'Sarah',
      lastName: 'Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      bio: 'Organic farmer passionate about heirloom tomatoes and sustainable agriculture.',
      role: ['LANDOWNER', 'RENTER'],
      totalPoints: 2847,
      level: 6,
    },
  })

  const user2 = await prisma.user.create({
    data: {
      clerkId: 'user_clerk_2',
      email: 'michael@example.com',
      firstName: 'Michael',
      lastName: 'Rodriguez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      bio: 'Market gardener specializing in organic pest management.',
      role: ['LANDOWNER'],
      totalPoints: 1892,
      level: 5,
    },
  })

  const user3 = await prisma.user.create({
    data: {
      clerkId: 'user_clerk_3',
      email: 'emma@example.com',
      firstName: 'Emma',
      lastName: 'Thompson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      bio: 'Herb enthusiast and seed saver.',
      role: ['RENTER'],
      totalPoints: 1456,
      level: 5,
    },
  })

  console.log(`Created ${await prisma.user.count()} users`)

  // Create sample plots
  console.log('Creating plots...')
  const plot1 = await prisma.plot.create({
    data: {
      ownerId: user1.id,
      title: 'Sunny 5-Acre Organic Farm Plot',
      description: 'Beautiful organic farmland with rich soil and full sun exposure. Perfect for vegetables, herbs, and small-scale farming.',
      status: 'ACTIVE',
      address: '15420 SW Pleasant Hill Rd',
      city: 'Sherwood',
      state: 'Oregon',
      zipCode: '97140',
      county: 'Washington',
      latitude: 45.3551,
      longitude: -122.8440,
      acreage: 5.0,
      soilType: ['LOAM'],
      soilPH: 6.8,
      waterAccess: ['WELL', 'IRRIGATION'],
      usdaZone: '8b',
      sunExposure: 'full',
      hasFencing: true,
      hasGreenhouse: false,
      hasToolStorage: true,
      hasElectricity: true,
      hasRoadAccess: true,
      hasIrrigation: true,
      isADAAccessible: false,
      allowsLivestock: false,
      allowsStructures: true,
      pricePerMonth: 450.00,
      pricePerSeason: 1200.00,
      pricePerYear: 4800.00,
      securityDeposit: 450.00,
      instantBook: false,
      minimumLease: 6,
      images: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
        'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800',
      ],
      viewCount: 127,
      bookingCount: 3,
      averageRating: 4.8,
      publishedAt: new Date('2024-01-15'),
    },
  })

  const plot2 = await prisma.plot.create({
    data: {
      ownerId: user2.id,
      title: 'Urban Garden Plot - Half Acre',
      description: 'Conveniently located urban garden plot with excellent soil. Great for community gardening.',
      status: 'ACTIVE',
      address: '2345 SE Division St',
      city: 'Portland',
      state: 'Oregon',
      zipCode: '97214',
      county: 'Multnomah',
      latitude: 45.5048,
      longitude: -122.6398,
      acreage: 0.5,
      soilType: ['LOAM', 'SANDY'],
      soilPH: 6.5,
      waterAccess: ['MUNICIPAL'],
      usdaZone: '9a',
      sunExposure: 'partial',
      hasFencing: true,
      hasGreenhouse: false,
      hasToolStorage: false,
      hasElectricity: false,
      hasRoadAccess: true,
      hasIrrigation: false,
      isADAAccessible: true,
      allowsLivestock: false,
      allowsStructures: false,
      pricePerMonth: 175.00,
      securityDeposit: 175.00,
      instantBook: true,
      minimumLease: 3,
      images: [
        'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
      ],
      viewCount: 89,
      bookingCount: 5,
      averageRating: 4.9,
      publishedAt: new Date('2024-02-01'),
    },
  })

  // Add more plots around Asheville, NC for map testing
  const user4 = await prisma.user.create({
    data: {
      clerkId: 'user_clerk_4',
      email: 'harold@example.com',
      firstName: 'Harold',
      lastName: 'Thompson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Harold',
      role: ['LANDOWNER'],
      totalPoints: 945,
      level: 4,
    },
  })

  const user5 = await prisma.user.create({
    data: {
      clerkId: 'user_clerk_5',
      email: 'devon@example.com',
      firstName: 'Devon',
      lastName: 'Martinez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Devon',
      role: ['LANDOWNER'],
      totalPoints: 1234,
      level: 5,
    },
  })

  await prisma.plot.create({
    data: {
      ownerId: user4.id,
      title: 'Sunny 5-Acre Organic Farm Plot',
      description: 'Beautiful organic farmland with rich soil and full sun exposure. Perfect for vegetables, herbs, and small-scale farming.',
      status: 'ACTIVE',
      address: '123 Farm Road',
      city: 'Asheville',
      state: 'NC',
      zipCode: '28801',
      county: 'Buncombe',
      latitude: 35.5951,
      longitude: -82.5515,
      acreage: 5.0,
      soilType: ['LOAM'],
      soilPH: 6.8,
      waterAccess: ['WELL', 'IRRIGATION'],
      usdaZone: '7a',
      sunExposure: 'full',
      hasFencing: true,
      hasGreenhouse: false,
      hasToolStorage: true,
      hasElectricity: true,
      hasRoadAccess: true,
      hasIrrigation: true,
      pricePerMonth: 400.00,
      images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800'],
      publishedAt: new Date(),
    },
  })

  await prisma.plot.create({
    data: {
      ownerId: user1.id,
      title: 'Creek-Side 2-Acre Garden Plot',
      description: 'Peaceful plot along a beautiful creek with excellent water access.',
      status: 'ACTIVE',
      address: '456 Creek Lane',
      city: 'Asheville',
      state: 'NC',
      zipCode: '28803',
      county: 'Buncombe',
      latitude: 35.6145,
      longitude: -82.5698,
      acreage: 2.0,
      soilType: ['LOAM', 'SILT'],
      waterAccess: ['STREAM', 'WELL'],
      usdaZone: '7a',
      sunExposure: 'full',
      hasFencing: true,
      hasGreenhouse: false,
      hasIrrigation: false,
      pricePerMonth: 250.00,
      images: ['https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800'],
      publishedAt: new Date(),
    },
  })

  await prisma.plot.create({
    data: {
      ownerId: user5.id,
      title: 'Premium 10-Acre Farmstead',
      description: 'Large farmstead with pond, irrigation, and greenhouse. Ideal for serious farming.',
      status: 'ACTIVE',
      address: '789 Farm Valley Road',
      city: 'Leicester',
      state: 'NC',
      zipCode: '28748',
      county: 'Buncombe',
      latitude: 35.5698,
      longitude: -82.6015,
      acreage: 10.0,
      soilType: ['LOAM'],
      waterAccess: ['WELL', 'POND', 'IRRIGATION'],
      usdaZone: '7a',
      sunExposure: 'full',
      hasFencing: true,
      hasGreenhouse: true,
      hasElectricity: true,
      hasIrrigation: true,
      pricePerMonth: 850.00,
      images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
      publishedAt: new Date(),
    },
  })

  await prisma.plot.create({
    data: {
      ownerId: user2.id,
      title: 'Mountain View 3-Acre Plot',
      description: 'Scenic mountain views with gentle slope, perfect for small farm.',
      status: 'RENTED',
      address: '321 Mountain Road',
      city: 'Weaverville',
      state: 'NC',
      zipCode: '28787',
      county: 'Buncombe',
      latitude: 35.6298,
      longitude: -82.5201,
      acreage: 3.0,
      soilType: ['CLAY', 'LOAM'],
      waterAccess: ['WELL'],
      usdaZone: '7a',
      sunExposure: 'full',
      hasFencing: false,
      hasGreenhouse: false,
      hasIrrigation: false,
      pricePerMonth: 350.00,
      images: ['https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800'],
      publishedAt: new Date(),
    },
  })

  await prisma.plot.create({
    data: {
      ownerId: user2.id,
      title: 'Valley Bottom 7-Acre Farm',
      description: 'Fertile valley bottom land with stream access and irrigation system.',
      status: 'ACTIVE',
      address: '654 Valley Road',
      city: 'Arden',
      state: 'NC',
      zipCode: '28704',
      county: 'Buncombe',
      latitude: 35.5423,
      longitude: -82.5287,
      acreage: 7.0,
      soilType: ['LOAM', 'SILT'],
      waterAccess: ['STREAM', 'WELL', 'IRRIGATION'],
      usdaZone: '7b',
      sunExposure: 'full',
      hasFencing: true,
      hasGreenhouse: true,
      hasElectricity: true,
      hasIrrigation: true,
      pricePerMonth: 600.00,
      images: ['https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800'],
      publishedAt: new Date(),
    },
  })

  await prisma.plot.create({
    data: {
      ownerId: user4.id,
      title: 'Riverside 6-Acre Permaculture Site',
      description: 'Established permaculture site with diverse plantings and stream access.',
      status: 'ACTIVE',
      address: '987 River Road',
      city: 'Black Mountain',
      state: 'NC',
      zipCode: '28711',
      county: 'Buncombe',
      latitude: 35.5789,
      longitude: -82.4698,
      acreage: 6.0,
      soilType: ['LOAM'],
      waterAccess: ['STREAM', 'IRRIGATION'],
      usdaZone: '7a',
      sunExposure: 'partial',
      hasFencing: false,
      hasGreenhouse: false,
      hasIrrigation: true,
      pricePerMonth: 500.00,
      images: ['https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800'],
      publishedAt: new Date(),
    },
  })

  console.log(`Created ${await prisma.plot.count()} plots`)

  // Create badges
  console.log('Creating badges...')
  const badge1 = await prisma.badge.create({
    data: {
      name: 'Welcome to GrowShare',
      description: 'Complete your profile and get started',
      category: 'MILESTONE',
      tier: 'BRONZE',
      icon: '👋',
      points: 10,
      criteria: { requirement: 'Complete profile setup' },
    },
  })

  const badge2 = await prisma.badge.create({
    data: {
      name: 'Plot Pioneer',
      description: 'Rent your first plot',
      category: 'MILESTONE',
      tier: 'BRONZE',
      icon: '🌱',
      points: 50,
      criteria: { requirement: 'Rent 1 plot' },
    },
  })

  const badge3 = await prisma.badge.create({
    data: {
      name: 'First Harvest',
      description: 'Record your first harvest',
      category: 'PRODUCTION',
      tier: 'SILVER',
      icon: '🌾',
      points: 150,
      criteria: { requirement: 'Record 1 harvest' },
    },
  })

  const badge4 = await prisma.badge.create({
    data: {
      name: 'Harvest Master',
      description: 'Record 10 successful harvests',
      category: 'PRODUCTION',
      tier: 'GOLD',
      icon: '🏆',
      points: 500,
      criteria: { requirement: 'Record 10 harvests' },
    },
  })

  console.log(`Created ${await prisma.badge.count()} badges`)

  // Award some badges to users
  await prisma.userBadge.createMany({
    data: [
      { userId: user1.id, badgeId: badge1.id },
      { userId: user1.id, badgeId: badge2.id },
      { userId: user1.id, badgeId: badge3.id },
      { userId: user1.id, badgeId: badge4.id },
      { userId: user2.id, badgeId: badge1.id },
      { userId: user2.id, badgeId: badge2.id },
      { userId: user3.id, badgeId: badge1.id },
    ],
  })

  console.log('Awarded badges to users')

  // Create sample courses
  console.log('Creating courses...')
  const course1 = await prisma.course.create({
    data: {
      title: 'Introduction to Organic Farming',
      description: 'Learn the fundamentals of organic farming practices and sustainable agriculture.',
      category: 'FARMING_METHODS',
      level: 'BEGINNER',
      duration: 120,
      pointsAwarded: 100,
      isPublished: true,
      modules: {
        create: [
          {
            title: 'What is Organic Farming?',
            description: 'Understanding the principles of organic agriculture',
            content: 'Organic farming is a method of crop and livestock production...',
            order: 1,
          },
          {
            title: 'Soil Health Basics',
            description: 'The foundation of organic farming',
            content: 'Healthy soil is the cornerstone of organic farming...',
            order: 2,
          },
        ],
      },
    },
  })

  const course2 = await prisma.course.create({
    data: {
      title: 'Soil Science Fundamentals',
      description: 'Deep dive into soil composition, testing, and improvement techniques.',
      category: 'SOIL_SCIENCE',
      level: 'INTERMEDIATE',
      duration: 180,
      pointsAwarded: 200,
      isCertification: true,
      certificateName: 'Certified Soil Specialist',
      isPublished: true,
      modules: {
        create: [
          {
            title: 'Soil Composition',
            description: 'Understanding soil particles and structure',
            content: 'Soil is composed of minerals, organic matter, water, and air...',
            order: 1,
          },
        ],
      },
    },
  })

  console.log(`Created ${await prisma.course.count()} courses`)

  // Create crop journals
  console.log('Creating crop journals...')
  await prisma.cropJournal.create({
    data: {
      userId: user1.id,
      cropName: 'Heritage Tomatoes',
      variety: 'Cherokee Purple',
      plantedDate: new Date('2024-04-15'),
      expectedHarvest: new Date('2024-07-15'),
      stage: 'HARVESTING',
      title: 'First Tomato Planting',
      content: 'Planted 6 Cherokee Purple tomato seedlings. Looking forward to a great harvest!',
      images: [
        'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800',
      ],
      plantCount: 6,
      areaUsed: 48.0,
      harvests: {
        create: [
          {
            harvestDate: new Date('2024-07-10'),
            quantity: 12.5,
            quality: 'excellent',
            notes: 'Beautiful ripe tomatoes, amazing flavor!',
          },
        ],
      },
    },
  })

  console.log(`Created ${await prisma.cropJournal.count()} crop journals`)

  // Create produce listings
  console.log('Creating produce listings...')
  await prisma.produceListing.create({
    data: {
      userId: user1.id,
      productName: 'Organic Cherry Tomatoes',
      variety: 'Sun Gold',
      description: 'Sweet, golden cherry tomatoes bursting with flavor. Freshly harvested.',
      category: 'vegetables',
      quantity: 10.0,
      unit: 'lb',
      pricePerUnit: 6.50,
      status: 'AVAILABLE',
      availableDate: new Date(),
      deliveryMethods: ['PICKUP', 'DELIVERY'],
      pickupLocation: 'Sherwood, OR',
      deliveryRadius: 15,
      images: [
        'https://images.unsplash.com/photo-1546470427-e26264be0b07?w=800',
      ],
      isOrganic: true,
      isCertified: false,
    },
  })

  console.log(`Created ${await prisma.produceListing.count()} produce listings`)

  // Create user activities
  console.log('Creating user activities...')
  await prisma.userActivity.createMany({
    data: [
      {
        userId: user1.id,
        type: 'PLOT_LISTED',
        title: 'Listed new plot',
        description: 'Sunny 5-Acre Organic Farm Plot',
        points: 50,
      },
      {
        userId: user1.id,
        type: 'FIRST_HARVEST',
        title: 'Recorded first harvest',
        description: 'Heritage Tomatoes - 12.5 lbs',
        points: 150,
      },
      {
        userId: user1.id,
        type: 'BADGE_EARNED',
        title: 'Earned Harvest Master badge',
        description: 'Achieved 10 successful harvests',
        points: 500,
      },
    ],
  })

  console.log(`Created ${await prisma.userActivity.count()} activities`)

  console.log('✅ Database seeding completed successfully!')
  console.log(`
Summary:
- Users: ${await prisma.user.count()}
- Plots: ${await prisma.plot.count()}
- Badges: ${await prisma.badge.count()}
- Courses: ${await prisma.course.count()}
- Crop Journals: ${await prisma.cropJournal.count()}
- Produce Listings: ${await prisma.produceListing.count()}
- User Activities: ${await prisma.userActivity.count()}
  `)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })

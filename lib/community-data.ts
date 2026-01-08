export type ForumCategory =
  | 'General Discussion'
  | 'Growing Tips'
  | 'Pest & Disease'
  | 'Equipment & Tools'
  | 'Soil & Composting'
  | 'Seeds & Seedlings'
  | 'Harvesting & Storage'
  | 'Selling & Marketing'
  | 'Off Topic'

export interface ForumTopic {
  id: string
  title: string
  category: ForumCategory
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  createdAt: Date
  updatedAt: Date
  views: number
  replyCount: number
  isPinned: boolean
  isSolved: boolean
  tags: string[]
  lastReplyBy?: string
  lastReplyAt?: Date
  upvotes: number
  hasImages?: boolean
}

export interface ForumReply {
  id: string
  topicId: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  createdAt: Date
  updatedAt: Date
  upvotes: number
  isAccepted: boolean
  images?: string[]
}

export const SAMPLE_TOPICS: ForumTopic[] = [
  {
    id: '1',
    title: 'Best organic methods for controlling aphids on tomatoes?',
    category: 'Pest & Disease',
    authorId: 'user-1',
    authorName: 'Sarah Chen',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    content:
      "My tomato plants are getting covered in aphids! I've tried spraying with water but they keep coming back. What are the best organic methods for controlling them? I don't want to use any harsh chemicals since I'm growing organically.",
    createdAt: new Date('2024-07-15T10:30:00'),
    updatedAt: new Date('2024-07-16T14:20:00'),
    views: 143,
    replyCount: 8,
    isPinned: false,
    isSolved: true,
    tags: ['aphids', 'tomatoes', 'organic', 'pest-control'],
    lastReplyBy: 'Michael Rodriguez',
    lastReplyAt: new Date('2024-07-16T14:20:00'),
    upvotes: 12,
  },
  {
    id: '2',
    title: 'Community Garden Meetup - Portland Area - Saturday July 20th',
    category: 'General Discussion',
    authorId: 'user-2',
    authorName: 'Emma Thompson',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    content:
      "Hey Portland area growers! 🌱 I'm organizing a casual meetup at Laurelhurst Park this Saturday at 10am. Bring seeds to swap, gardening questions, and your favorite harvest to share. Let's build our local growing community!\n\nWe'll meet near the main pavilion. Look for the GrowShare banner!",
    createdAt: new Date('2024-07-18T09:00:00'),
    updatedAt: new Date('2024-07-19T16:45:00'),
    views: 89,
    replyCount: 15,
    isPinned: true,
    isSolved: false,
    tags: ['meetup', 'portland', 'community', 'seed-swap'],
    lastReplyBy: 'David Park',
    lastReplyAt: new Date('2024-07-19T16:45:00'),
    upvotes: 24,
  },
  {
    id: '3',
    title: 'How do you test and improve soil pH naturally?',
    category: 'Soil & Composting',
    authorId: 'user-3',
    authorName: 'Michael Rodriguez',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    content:
      "I suspect my soil pH is too acidic for the vegetables I want to grow. What's the best way to test soil pH at home? And what natural amendments can I use to adjust it? I've heard wood ash can raise pH but want to make sure I do it safely.",
    createdAt: new Date('2024-07-17T14:15:00'),
    updatedAt: new Date('2024-07-19T11:30:00'),
    views: 67,
    replyCount: 6,
    isPinned: false,
    isSolved: true,
    tags: ['soil-ph', 'testing', 'amendments', 'soil-health'],
    lastReplyBy: 'Lisa Martinez',
    lastReplyAt: new Date('2024-07-19T11:30:00'),
    upvotes: 9,
  },
  {
    id: '4',
    title: 'Recommendations for a good broadfork under $150?',
    category: 'Equipment & Tools',
    authorId: 'user-4',
    authorName: 'David Park',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    content:
      "I'm looking to invest in a broadfork for my market garden but don't want to break the bank. What brands/models do you recommend for under $150? I've been looking at the Meadow Creature but wondering if there are other good options.",
    createdAt: new Date('2024-07-19T08:45:00'),
    updatedAt: new Date('2024-07-19T13:20:00'),
    views: 52,
    replyCount: 11,
    isPinned: false,
    isSolved: false,
    tags: ['broadfork', 'tools', 'recommendations', 'market-garden'],
    lastReplyBy: 'Tom Baker',
    lastReplyAt: new Date('2024-07-19T13:20:00'),
    upvotes: 7,
  },
  {
    id: '5',
    title: 'Starting seeds indoors - when to transplant outside?',
    category: 'Seeds & Seedlings',
    authorId: 'user-5',
    authorName: 'Lisa Martinez',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    content:
      "I started tomato and pepper seedlings indoors 4 weeks ago and they're about 6 inches tall now. When is the right time to transplant them outside? Should I wait until after the last frost? And how do I harden them off properly?",
    createdAt: new Date('2024-07-16T11:20:00'),
    updatedAt: new Date('2024-07-18T15:40:00'),
    views: 98,
    replyCount: 9,
    isPinned: false,
    isSolved: true,
    tags: ['seedlings', 'transplanting', 'hardening-off', 'frost'],
    lastReplyBy: 'Rachel Green',
    lastReplyAt: new Date('2024-07-18T15:40:00'),
    upvotes: 14,
  },
  {
    id: '6',
    title: 'Selling at farmers markets - tips for first-timers?',
    category: 'Selling & Marketing',
    authorId: 'user-6',
    authorName: 'James Wilson',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    content:
      "I'm planning to start selling my excess produce at the local farmers market this fall. Any tips for first-timers? What should I bring besides produce? How do you price things? Any display tips that help attract customers?",
    createdAt: new Date('2024-07-18T16:30:00'),
    updatedAt: new Date('2024-07-19T10:15:00'),
    views: 76,
    replyCount: 13,
    isPinned: false,
    isSolved: false,
    tags: ['farmers-market', 'selling', 'pricing', 'display'],
    lastReplyBy: 'Sarah Chen',
    lastReplyAt: new Date('2024-07-19T10:15:00'),
    upvotes: 18,
  },
  {
    id: '7',
    title: 'Welcome to GrowShare Community! (Please Read)',
    category: 'General Discussion',
    authorId: 'admin',
    authorName: 'GrowShare Team',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GrowShare',
    content:
      "Welcome to the GrowShare Community Forum! 🌱\n\nThis is a space for growers of all experience levels to connect, ask questions, share knowledge, and build our agricultural community.\n\n**Forum Guidelines:**\n- Be respectful and supportive\n- Search before posting to avoid duplicates\n- Use relevant tags and categories\n- Share your experiences and knowledge freely\n- Keep discussions on-topic\n\nHappy growing! Let's learn and grow together.",
    createdAt: new Date('2024-07-01T09:00:00'),
    updatedAt: new Date('2024-07-19T17:00:00'),
    views: 456,
    replyCount: 32,
    isPinned: true,
    isSolved: false,
    tags: ['welcome', 'guidelines', 'community'],
    lastReplyBy: 'Emma Thompson',
    lastReplyAt: new Date('2024-07-19T17:00:00'),
    upvotes: 67,
  },
  {
    id: '8',
    title: 'Best companion plants for cucumbers?',
    category: 'Growing Tips',
    authorId: 'user-7',
    authorName: 'Rachel Green',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel',
    content:
      "I'm planning my summer garden layout and want to use companion planting principles. What plants grow well alongside cucumbers? I've heard beans and radishes are good but want to hear your experiences.",
    createdAt: new Date('2024-07-17T13:45:00'),
    updatedAt: new Date('2024-07-19T09:20:00'),
    views: 81,
    replyCount: 7,
    isPinned: false,
    isSolved: true,
    tags: ['companion-planting', 'cucumbers', 'garden-planning'],
    lastReplyBy: 'Michael Rodriguez',
    lastReplyAt: new Date('2024-07-19T09:20:00'),
    upvotes: 11,
  },
  {
    id: '9',
    title: 'Dealing with late blight on tomatoes - need help!',
    category: 'Pest & Disease',
    authorId: 'user-8',
    authorName: 'Tom Baker',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom',
    content:
      "I think my tomatoes have late blight - dark brown lesions on leaves and stems, and it's spreading fast. Is there anything I can do to save them at this point? Should I remove affected plants to prevent spread? This is devastating after all the work I put in!",
    createdAt: new Date('2024-07-19T07:15:00'),
    updatedAt: new Date('2024-07-19T18:30:00'),
    views: 94,
    replyCount: 12,
    isPinned: false,
    isSolved: false,
    tags: ['late-blight', 'tomatoes', 'disease', 'urgent'],
    lastReplyBy: 'David Park',
    lastReplyAt: new Date('2024-07-19T18:30:00'),
    upvotes: 8,
    hasImages: true,
  },
  {
    id: '10',
    title: 'How long does homemade compost take to be ready?',
    category: 'Soil & Composting',
    authorId: 'user-9',
    authorName: 'Alex Rivera',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    content:
      "I started a compost pile 3 months ago with kitchen scraps, leaves, and grass clippings. I turn it weekly and keep it moist. How do I know when it's ready to use? What should I look for? And can I use partially finished compost or should I wait until it's completely done?",
    createdAt: new Date('2024-07-18T12:00:00'),
    updatedAt: new Date('2024-07-19T14:30:00'),
    views: 71,
    replyCount: 10,
    isPinned: false,
    isSolved: true,
    tags: ['compost', 'composting', 'timing', 'soil-amendment'],
    lastReplyBy: 'Lisa Martinez',
    lastReplyAt: new Date('2024-07-19T14:30:00'),
    upvotes: 13,
  },
]

export const SAMPLE_REPLIES: ForumReply[] = [
  // Replies for Topic 1 (Aphids)
  {
    id: 'r1',
    topicId: '1',
    authorId: 'user-2',
    authorName: 'Michael Rodriguez',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    content:
      "Neem oil spray works great! Mix 1 tablespoon neem oil with 1 quart water and a few drops of dish soap. Spray in the evening to avoid burning leaves. Usually clears them up in 2-3 applications.",
    createdAt: new Date('2024-07-15T11:45:00'),
    updatedAt: new Date('2024-07-15T11:45:00'),
    upvotes: 8,
    isAccepted: false,
  },
  {
    id: 'r2',
    topicId: '1',
    authorId: 'user-3',
    authorName: 'Emma Thompson',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    content:
      "I plant nasturtiums near my tomatoes as a trap crop - aphids love them even more than tomatoes! Also, ladybugs are your best friend. You can buy them online and release them in your garden.",
    createdAt: new Date('2024-07-15T14:20:00'),
    updatedAt: new Date('2024-07-15T14:20:00'),
    upvotes: 15,
    isAccepted: true,
  },
  {
    id: 'r3',
    topicId: '1',
    authorId: 'user-4',
    authorName: 'David Park',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    content:
      "Another option is insecticidal soap. Much gentler than neem but still effective. I make my own with 1 tablespoon pure castile soap per quart of water. Spray directly on the aphids.",
    createdAt: new Date('2024-07-16T14:20:00'),
    updatedAt: new Date('2024-07-16T14:20:00'),
    upvotes: 6,
    isAccepted: false,
  },

  // Replies for Topic 2 (Portland Meetup)
  {
    id: 'r4',
    topicId: '2',
    authorId: 'user-1',
    authorName: 'Sarah Chen',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    content: "I'll be there! Bringing some heirloom tomato seeds to swap and fresh basil from my garden. Can't wait to meet everyone! 🌿",
    createdAt: new Date('2024-07-18T10:30:00'),
    updatedAt: new Date('2024-07-18T10:30:00'),
    upvotes: 5,
    isAccepted: false,
  },
  {
    id: 'r5',
    topicId: '2',
    authorId: 'user-4',
    authorName: 'David Park',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    content:
      "Count me in! I have tons of rainbow carrot seeds and some fresh honey to share. Should I bring folding chairs or will there be seating?",
    createdAt: new Date('2024-07-19T16:45:00'),
    updatedAt: new Date('2024-07-19T16:45:00'),
    upvotes: 3,
    isAccepted: false,
  },

  // Replies for Topic 3 (Soil pH)
  {
    id: 'r6',
    topicId: '3',
    authorId: 'user-5',
    authorName: 'Lisa Martinez',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    content:
      "I use a simple pH test kit from the garden center - costs about $10. For raising pH naturally, crushed eggshells work great but take time. Lime is faster but use agricultural lime, not garden lime. Wood ash works but use sparingly - it's very potent!",
    createdAt: new Date('2024-07-19T11:30:00'),
    updatedAt: new Date('2024-07-19T11:30:00'),
    upvotes: 12,
    isAccepted: true,
  },

  // Replies for Topic 5 (Seedling transplanting)
  {
    id: 'r7',
    topicId: '5',
    authorId: 'user-7',
    authorName: 'Rachel Green',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel',
    content:
      "For hardening off, start by putting them outside for 1-2 hours in shade, then gradually increase time and sun exposure over 7-10 days. Don't transplant until nighttime temps are consistently above 50°F for tomatoes and 60°F for peppers. Check your local frost dates!",
    createdAt: new Date('2024-07-18T15:40:00'),
    updatedAt: new Date('2024-07-18T15:40:00'),
    upvotes: 10,
    isAccepted: true,
  },
]

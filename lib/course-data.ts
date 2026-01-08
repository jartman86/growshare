export interface Course {
  id: string
  title: string
  description: string
  category: CourseCategory
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string // e.g., "2 hours", "4 weeks"
  instructor: string
  instructorAvatar?: string
  image: string
  lessons: number
  enrolled: number
  rating: number
  reviews: number
  price: number // 0 for free
  certification: boolean
  points: number // Points earned upon completion
  tags: string[]
  skills: string[]
}

export type CourseCategory =
  | 'Soil Health'
  | 'Crop Management'
  | 'Pest & Disease'
  | 'Water Management'
  | 'Business & Marketing'
  | 'Regenerative Practices'
  | 'Tools & Equipment'
  | 'Season Extension'

export const SAMPLE_COURSES: Course[] = [
  {
    id: '1',
    title: 'Soil Health Fundamentals',
    description:
      'Learn the basics of soil biology, testing, and amendment. Understand how healthy soil is the foundation of successful farming.',
    category: 'Soil Health',
    difficulty: 'Beginner',
    duration: '3 hours',
    instructor: 'Dr. Sarah Chen',
    instructorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
    lessons: 12,
    enrolled: 1247,
    rating: 4.9,
    reviews: 342,
    price: 0,
    certification: true,
    points: 250,
    tags: ['Organic', 'Beginner-Friendly', 'Certification'],
    skills: ['Soil Testing', 'Composting', 'pH Management'],
  },
  {
    id: '2',
    title: 'Integrated Pest Management',
    description:
      'Master organic pest control strategies. Learn to identify common pests, understand beneficial insects, and implement IPM practices.',
    category: 'Pest & Disease',
    difficulty: 'Intermediate',
    duration: '4 weeks',
    instructor: 'Michael Torres',
    instructorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800',
    lessons: 24,
    enrolled: 892,
    rating: 4.8,
    reviews: 201,
    price: 49,
    certification: true,
    points: 400,
    tags: ['IPM', 'Organic', 'Advanced'],
    skills: ['Pest Identification', 'Beneficial Insects', 'Organic Controls'],
  },
  {
    id: '3',
    title: 'Drip Irrigation Design & Installation',
    description:
      'Design and install efficient drip irrigation systems. Calculate water needs, select components, and optimize water use.',
    category: 'Water Management',
    difficulty: 'Intermediate',
    duration: '2 hours',
    instructor: 'Jennifer Liu',
    instructorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
    lessons: 8,
    enrolled: 654,
    rating: 4.7,
    reviews: 128,
    price: 29,
    certification: false,
    points: 200,
    tags: ['Water Conservation', 'Practical'],
    skills: ['System Design', 'Installation', 'Maintenance'],
  },
  {
    id: '4',
    title: 'Regenerative Agriculture Principles',
    description:
      'Transform your farm with regenerative practices. Cover cropping, no-till methods, and holistic land management.',
    category: 'Regenerative Practices',
    difficulty: 'Advanced',
    duration: '6 weeks',
    instructor: 'Dr. James Anderson',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
    lessons: 32,
    enrolled: 423,
    rating: 5.0,
    reviews: 89,
    price: 99,
    certification: true,
    points: 600,
    tags: ['Regenerative', 'Carbon Sequestration', 'Certification'],
    skills: ['Cover Cropping', 'No-Till', 'Rotational Grazing'],
  },
  {
    id: '5',
    title: 'Small Farm Business Planning',
    description:
      'Build a profitable farm business. Financial planning, marketing strategies, and customer relationship management.',
    category: 'Business & Marketing',
    difficulty: 'Intermediate',
    duration: '5 weeks',
    instructor: 'Rachel Martinez',
    instructorAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    lessons: 20,
    enrolled: 1105,
    rating: 4.8,
    reviews: 267,
    price: 79,
    certification: true,
    points: 500,
    tags: ['Business', 'Marketing', 'Finance'],
    skills: ['Business Planning', 'Marketing', 'Financial Management'],
  },
  {
    id: '6',
    title: 'Season Extension Techniques',
    description:
      'Extend your growing season with low-tech and high-tech solutions. Row covers, cold frames, and greenhouse management.',
    category: 'Season Extension',
    difficulty: 'Beginner',
    duration: '90 minutes',
    instructor: 'Tom Richardson',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=800',
    lessons: 6,
    enrolled: 789,
    rating: 4.6,
    reviews: 156,
    price: 0,
    certification: false,
    points: 150,
    tags: ['Season Extension', 'Free', 'Quick Start'],
    skills: ['Row Covers', 'Cold Frames', 'Greenhouse Basics'],
  },
  {
    id: '7',
    title: 'Crop Rotation & Planning',
    description:
      'Maximize yields and soil health through strategic crop rotation. Learn companion planting and succession planting.',
    category: 'Crop Management',
    difficulty: 'Beginner',
    duration: '2 hours',
    instructor: 'Dr. Sarah Chen',
    instructorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
    lessons: 10,
    enrolled: 1432,
    rating: 4.9,
    reviews: 421,
    price: 0,
    certification: true,
    points: 250,
    tags: ['Crop Planning', 'Free', 'Certification'],
    skills: ['Crop Rotation', 'Companion Planting', 'Garden Planning'],
  },
  {
    id: '8',
    title: 'Hand Tool Mastery',
    description:
      'Master essential hand tools for small-scale farming. Proper use, maintenance, and safety of hand tools.',
    category: 'Tools & Equipment',
    difficulty: 'Beginner',
    duration: '1 hour',
    instructor: 'Michael Torres',
    instructorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
    lessons: 5,
    enrolled: 567,
    rating: 4.5,
    reviews: 92,
    price: 0,
    certification: false,
    points: 100,
    tags: ['Tools', 'Free', 'Quick'],
    skills: ['Tool Use', 'Maintenance', 'Safety'],
  },
]

export const COURSE_CATEGORIES: CourseCategory[] = [
  'Soil Health',
  'Crop Management',
  'Pest & Disease',
  'Water Management',
  'Business & Marketing',
  'Regenerative Practices',
  'Tools & Equipment',
  'Season Extension',
]

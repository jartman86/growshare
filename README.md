# GrowShare - Agricultural Engagement Ecosystem

> Transform land into opportunity. Connect landowners with growers, build community, and grow food together.

## Overview

GrowShare is not just a land rental platform—it's an **interactive agricultural operating system** where:
- 🗺️ Land becomes **playable territory**
- 🌱 Farming becomes **visible progress**
- 🤝 Community becomes **cooperative gameplay**
- 📚 Education becomes **unlockable content**

Think **FarmVille meets Airbnb meets MasterClass**—but for real food production.

## Core Features

### 🗺️ Interactive Map ("The World Map")
- Satellite/illustrated hybrid map showing available plots
- Color-coded status indicators (Available, Rented, Co-op Active)
- Terrain overlays (soil type, water access, sun exposure, USDA zone)
- Filter and search by location, acreage, amenities

### 🎮 Gamification System ("The Journey")
- **Badge System**: Earn achievements for milestones, skills, community contributions
- **Level Progression**: From "Seedling" to "Agricultural Legend"
- **Points System**: Track activity and engagement
- **Skill Certifications**: Build credibility through education

### 📖 Crop Journal ("The Farm Log")
- Document planting, growth, and harvest
- Photo timeline of crop progress
- Harvest tracking and yield comparison
- Weather integration for planning

### 🏪 Co-op Marketplace ("The Trading Post")
- Sell produce directly to consumers and restaurants
- Pre-order system for guaranteed sales
- Bundle deals for cooperative selling
- Delivery/pickup coordination

### 📚 Knowledge Hub ("The Library")
- Expert courses on soil health, crop management, regenerative practices
- Earn certifications that build trust
- AI-assisted pest and disease identification
- Business and legal resources

### 👥 Community Features ("The Guild")
- Regional forums for knowledge exchange
- Mentorship matching
- Tool library and resource sharing
- Events and work parties

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, TailwindCSS
- **Components**: Radix UI, Lucide Icons
- **Maps**: Mapbox GL
- **Forms**: React Hook Form + Zod

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL with PostGIS
- **ORM**: Prisma
- **Authentication**: Clerk
- **Payments**: Stripe Connect

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ with PostGIS extension
- Clerk account (free tier available)
- Mapbox account (free tier available)
- Stripe account (for payments)

### Installation

1. Clone and install:
   \`\`\`bash
   npm install
   \`\`\`

2. Set up environment variables in \`.env.local\`

3. Set up PostgreSQL with PostGIS and run migrations:
   \`\`\`bash
   npx prisma migrate dev
   \`\`\`

4. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Development Status

### ✅ Phase 0: Foundation (COMPLETED)
- [x] Next.js setup with TypeScript
- [x] Comprehensive Prisma schema with gamification
- [x] Clerk authentication
- [x] Landing page
- [x] Navigation system

### 🚧 Phase 1: MVP (IN PROGRESS)
- [ ] Interactive map
- [ ] Plot management
- [ ] Booking system
- [ ] Payments

---

**GrowShare**: Building the future of distributed food production 🌱

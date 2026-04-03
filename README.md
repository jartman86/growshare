# GrowShare - Agricultural Engagement Ecosystem

> Transform land into opportunity. Connect landowners with growers, build community, and grow food together.

## Overview

GrowShare is an agricultural engagement ecosystem combining land rental marketplace functionality with gamified community engagement. The platform enables landowners to list plots, renters to book growing space, and a community to engage through forums, marketplace, tool sharing, courses, and agricultural journaling.

### Core Features

- **Land Rental Marketplace** - Airbnb-style plot listings with map search, filters, and instant booking
- **Gamified Community** - Points, levels, badges, and achievements for engagement
- **Tool Sharing** - Equipment rental between community members
- **Produce Marketplace** - Sell surplus produce directly to consumers
- **Knowledge Hub** - Courses, certifications, and educational resources
- **Community Forums** - Discussion boards with voting and threading

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16.1, React 19, TypeScript, TailwindCSS v4 |
| Backend | Next.js API Routes (serverless) |
| Database | PostgreSQL with Prisma ORM |
| Auth | Clerk (fully integrated with user sync) |
| Payments | Stripe (checkout, Connect, refunds, webhooks) |
| Maps | Mapbox GL |
| File Storage | Cloudinary |
| Email | SendGrid (8 templates) |
| SMS | Twilio |
| Mobile | Capacitor 8 (iOS + Android) |
| Monitoring | Sentry |

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ database
- Clerk account (free tier available)
- Mapbox account (free tier available)
- Stripe account (for payments)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## Production Deployment

### Web App

Deploy to Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### iOS App

```bash
# Sync web assets to native project
npx cap sync ios

# Open in Xcode
npx cap open ios
```

Build via Xcode: **Product → Archive → Distribute**

### Android App

```bash
# Sync web assets to native project
npx cap sync android

# Open in Android Studio
npx cap open android
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=

# SendGrid
SENDGRID_API_KEY=
EMAIL_FROM=

# Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

## Project Structure

```
growshare/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── dashboard/         # User dashboard
│   ├── explore/           # Plot discovery
│   ├── marketplace/       # Produce marketplace
│   └── ...
├── components/             # React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── ...
├── lib/                   # Utilities and services
│   ├── prisma.ts         # Database client
│   ├── stripe.ts         # Stripe SDK wrapper
│   ├── email.ts          # SendGrid email service
│   └── ...
├── prisma/                # Database schema
│   └── schema.prisma     # Prisma schema (50+ models)
└── ios/                   # Native iOS project
android/                   # Native Android project
```

## API Routes

The app includes 90+ API endpoints covering:

- `/api/auth/*` - Authentication and user sync
- `/api/bookings/*` - Booking management with lease generation
- `/api/plots/*` - Plot CRUD and search
- `/api/payments/*` - Stripe payment intents and refunds
- `/api/stripe/*` - Stripe Connect onboarding
- `/api/marketplace/*` - Produce listings and orders
- `/api/tools/*` - Tool listings and rentals
- `/api/forum/*` - Forum topics and replies
- `/api/reviews/*` - Ratings and reviews
- `/api/messages/*` - Direct messaging
- `/api/notifications/*` - In-app notifications
- `/api/courses/*` - Course management
- `/api/challenges/*` - Gamification challenges
- `/api/groups/*` - Community groups
- `/api/community-tips/*` - User-submitted tips
- `/api/admin/*` - Admin dashboard APIs
- `/api/webhooks/*` - Clerk and Stripe webhooks

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

## Feature Status

### Complete - Production Ready

| Feature | Status |
|---------|--------|
| Authentication | ✅ Complete |
| User Profiles | ✅ Complete |
| Plot Management | ✅ Complete |
| Booking System | ✅ Complete |
| Stripe Payments | ✅ Complete |
| Photo Uploads | ✅ Complete |
| Reviews & Ratings | ✅ Complete |
| Messaging | ✅ Complete |
| Notifications | ✅ Complete |
| Crop Journal | ✅ Complete |
| Dark Mode | ✅ Complete |
| Forum System | ✅ Complete |
| Tool Listings | ✅ Complete |
| Tool Rentals | ✅ Complete |
| Marketplace | ✅ Complete |
| User Verification | ✅ Complete |
| Email Service | ✅ Complete |
| Saved Searches | ✅ Complete |
| Privacy Controls | ✅ Complete |
| Admin Dashboard | ✅ Complete |
| Community Tips | ✅ Complete |
| Gamification | ✅ Complete |
| Challenges | ✅ Complete |
| Community Groups | ✅ Complete |
| PWA Support | ✅ Complete |
| iOS App | ✅ Configured |
| Android App | ✅ Configured |

### Partially Implemented

| Feature | Status |
|---------|--------|
| Events Calendar | UI + API (needs visualization) |
| Course Video Viewer | UI + API (basic embed) |
| Leaderboards | UI only (needs live data) |

## License

Private - All rights reserved

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GrowShare is an agricultural engagement ecosystem: land rental marketplace, tool sharing, produce marketplace, gamified community, and knowledge hub. Built with Next.js 16.1, React 19, TypeScript (strict mode), TailwindCSS v4, PostgreSQL/Prisma, and Clerk auth.

## Commands

```bash
# Development
npm run dev              # Start dev server (webpack mode)
npm run build            # prisma generate && next build
npm run lint             # ESLint (flat config, v9)

# Testing (Vitest)
npm test                 # Run all tests once
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage with v8
npx vitest run tests/lib/stripe.test.ts  # Run single test file

# Database
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Run migrations in dev
npx prisma studio        # Visual database browser
npm run db:seed           # Seed with tsx prisma/seed.ts

# iOS (Capacitor)
npm run cap:sync          # Sync web assets to native
npm run cap:ios           # Open Xcode project
```

## Architecture

### App Structure (Next.js App Router)

- `app/api/` — 48+ REST API route directories (serverless functions)
- `app/admin/` — Admin dashboard (users, verifications, moderation, tips)
- `app/dashboard/` — User dashboard (stats, achievements, disputes, seller tools)
- `app/explore/` — Plot discovery with Mapbox map
- `app/marketplace/` — Produce listings and orders
- `app/tools/` — Equipment rental listings
- `app/knowledge/` — Courses and resources (static reference data)

### Core Libraries

- `lib/prisma.ts` — Singleton Prisma client (dev logging enabled)
- `lib/ensure-user.ts` — Auth helpers: `ensureUser()` (auto-syncs Clerk user to DB), `ensureVerifiedUser()` (throws `EmailNotVerifiedError` if unverified)
- `lib/stripe.ts` — Stripe SDK wrapper: customer creation, payment intents, Connect onboarding, refunds
- `lib/email.ts` — SendGrid with 8 HTML email templates
- `lib/cloudinary.ts` — Signed upload URLs and asset deletion
- `lib/theme-context.tsx` — Dark mode state (localStorage-persisted, class-based)

### Database

PostgreSQL with Prisma ORM. Schema is in `prisma/schema.prisma` (~2000 lines, 50+ models). Key models: User (6 roles), Plot, Booking, BookingDispute, Tool, ToolRental, ProduceListing, Order, Course, Challenge, CommunityGroup, Review, ForumTopic, Message, Notification, Badge.

User roles: `LANDOWNER`, `RENTER`, `BUYER`, `SELLER`, `ORGANIZATION`, `ADMIN`.

### Auth Flow

Clerk handles authentication. On first API call, `ensureUser()` auto-syncs the Clerk user to the local DB (upsert by clerkId). Always check for null return. Sensitive endpoints use `ensureVerifiedUser()` which requires email verification.

### Payment Flow

Stripe Checkout for payments. Stripe Connect for seller/landowner payouts (marketplace split). Webhooks at `/api/webhooks/stripe`. Rate limiting on payment endpoints (10/min per client).

## Coding Conventions

### API Route Pattern

```typescript
import { ensureUser } from '@/lib/ensure-user'
import { NextResponse } from 'next/server'

export async function GET() {
  const user = await ensureUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // ... query with prisma
  return NextResponse.json(data)
}
```

- Validate input with Zod schemas via `validateRequest()`
- Use `console.error()` for logging, never `console.log()`
- Use Next.js `Image` component, never `<img>`

### Dark Mode

Class-based toggle with hydration script in layout. All UI must include dark variants:

```
bg-white dark:bg-gray-800        bg-gray-50 dark:bg-gray-900
text-gray-900 dark:text-white    text-gray-600 dark:text-gray-300
border-gray-200 dark:border-gray-700
```

### Imports

Path alias `@/*` maps to project root. Use `@/lib/...`, `@/components/...`, etc.

### Static vs API Data

- `lib/resources-data.ts` and `lib/course-data.ts` contain static reference data (plant guides, course content) — this is intentional
- All other data files (`lib/*-data.ts`) have been migrated to use API endpoints; they now export only type aliases and helper functions (no sample data)

## External Services

| Service | Config | Webhook |
|---------|--------|---------|
| Clerk | `CLERK_SECRET_KEY` | `/api/webhooks/clerk` |
| Stripe | `STRIPE_SECRET_KEY` | `/api/webhooks/stripe` |
| Cloudinary | `CLOUDINARY_API_KEY` | — |
| SendGrid | `SENDGRID_API_KEY` | — |
| Twilio | `TWILIO_AUTH_TOKEN` | — |
| Mapbox | `NEXT_PUBLIC_MAPBOX_TOKEN` | — |
| Sentry | `SENTRY_DSN` | — |

See `.env.example` for the full list of required environment variables.

## Testing

Tests live in `tests/` using Vitest with jsdom environment. Test files: `tests/lib/` (api-error, rate-limit, sanitize, stripe, utils, validations). `tests/api/` and `tests/components/` directories exist but are empty. Testing libraries: `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`.

## Native App (Capacitor)

App ID: `co.growshare.app`. Web assets in `out/` directory. Production URL: `https://growshare.co`. iOS project in `ios/`. Run `npm run cap:sync` after any web build before opening Xcode.

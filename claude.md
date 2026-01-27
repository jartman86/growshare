# GrowShare - Claude Session Context

**Last Updated:** January 26, 2026
**Project Status:** Pre-Launch (Feature Complete)

---

## Project Overview

GrowShare is an agricultural engagement ecosystem combining:
- **Land Rental Marketplace** (Airbnb-style plot listings)
- **Gamified Community Engagement** (achievements, badges, levels)
- **Tool Sharing** (equipment rental between community members)
- **Produce Marketplace** (sell surplus produce)
- **Knowledge Hub** (courses, forums, resources)

### Tech Stack
- **Frontend:** Next.js 16.1, React 19, TypeScript, TailwindCSS v4
- **Backend:** Next.js API Routes (serverless)
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** Clerk (fully integrated with user sync)
- **Payments:** Stripe (checkout, Connect for payouts, refunds)
- **Maps:** Mapbox GL
- **File Storage:** Cloudinary (signed uploads)
- **Email:** SendGrid (8 templates)
- **SMS:** Twilio (phone verification)
- **Theme:** Dark mode with class-based toggle
- **PWA:** Manifest configured, icons generated, installable on mobile

---

## Feature Implementation Status

### COMPLETE - Production Ready
| Feature | API | UI | Notes |
|---------|-----|-----|-------|
| Authentication | ✅ | ✅ | Clerk + user sync |
| User Profiles | ✅ | ✅ | Edit, follow, verification badges |
| Plot Management | ✅ | ✅ | Full CRUD, map, filters, publish |
| Booking System | ✅ | ✅ | Request, approve, calendar, payments |
| Booking Disputes | ✅ | ✅ | File, view, message, resolve |
| Stripe Payments | ✅ | ✅ | Checkout, Connect, refunds, webhooks |
| Photo Uploads | ✅ | ✅ | Cloudinary drag-drop component |
| Reviews & Ratings | ✅ | ✅ | Plots, users, tools with voting |
| Messaging | ✅ | ✅ | Conversations, unread counts |
| Notifications | ✅ | ✅ | In-app + email templates |
| Crop Journal | ✅ | ✅ | Entries, harvests, growth stages |
| Dark Mode | ✅ | ✅ | Theme toggle, full coverage |
| Forum System | ✅ | ✅ | Topics, replies, voting, threading |
| Tool Listings | ✅ | ✅ | Rent/sale, pricing, categories |
| Tool Rentals | ✅ | ✅ | Booking, conflict detection, deposits |
| Tool Reviews | ✅ | ✅ | Verified rental reviews |
| Marketplace | ✅ | ✅ | Produce listings, orders, inventory |
| Marketplace Seller Dashboard | ✅ | ✅ | Listings, orders, fulfillment |
| User Verification | ✅ | ✅ | Email, phone (Twilio), ID upload |
| Email Service | ✅ | ✅ | 8 templates via SendGrid |
| Saved Searches | ✅ | ✅ | Save/load filter configurations |
| Privacy Controls | ✅ | ✅ | Block users, profile visibility |
| Admin Dashboard | ✅ | ✅ | Users, verifications, moderation, tips |
| Community Tips | ✅ | ✅ | User-submitted tips, integrated with resources |
| Resources Section | ✅ | ✅ | Planting calendar, pests, companion guide + community tips |
| PWA Support | ✅ | ✅ | Manifest, icons (192/512/apple-touch), mobile-optimized |
| Gamification | ✅ | ✅ | Points, levels, badges, achievements page |
| Challenges | ✅ | ✅ | Join, leave, task completion, progress tracking |
| Community Groups | ✅ | ✅ | Join/leave groups, membership display |
| Course View Tracking | ✅ | ✅ | View counts with daily deduplication |
| Certificate Verification | ✅ | ✅ | Public verification endpoint and page |
| Instructor Dashboard | ✅ | ✅ | Earnings, revenue charts, transactions |

### PARTIALLY IMPLEMENTED
| Feature | Status | Remaining Work |
|---------|--------|----------------|
| Events System | UI + API | Calendar visualization |
| Courses | UI + API | Video content viewer improvements |
| Leaderboards | UI only | Needs live data integration |

---

## Completed Audit Items (January 26, 2026)

### Phase 1: Critical Fixes ✅
- Fixed null checks for `emailAddresses[0]` in auth routes
- Fixed `ensureVerifiedUser()` to handle missing emails gracefully
- Added type guards to `.split()` operations in plots route

### Phase 2: Code Quality ✅
- Verified all files use `console.error` (not `console.log`)
- Fixed 50+ TypeScript `any` types with proper interfaces
- Replaced `alert()` with UI error states in enroll-button
- Consolidated duplicate `my-plots-v2` API into `my-plots`
- Replaced `<img>` with Next.js `Image` in header, chat, admin

### Phase 3: Mobile Optimization ✅
- PWA manifest updated with proper metadata
- PWA icons generated (192x192, 512x512, apple-touch-icon, favicons)
- Admin tables have `overflow-x-auto` for mobile scrolling
- Admin sidebar has mobile hamburger menu
- Image gallery uses responsive `grid-cols-2 md:grid-cols-4`
- Touch targets increased to 44px minimum

### Phase 4: Feature Completion ✅
- Tool reviews: Fixed to use real API instead of sample data
- Dispute filing UI: Created `/dashboard/disputes` page
- Course view tracking: Created `CourseView` model and tracking API
- Certificate verification: Verified endpoint exists
- Challenge participation: Full tracking with task completion
- Instructor earnings: Dashboard with charts and transactions
- Marketplace fulfillment: Enhanced seller order management
- Dashboard achievements: Full achievements page with badges/milestones
- Seller dashboard: Uses real API instead of sample data
- Community tips: Integrated with resources pages
- Join group: Implemented in group-card with API call

---

## Sample Data Status

Most sample data has been replaced with database queries:

| File | Status | Notes |
|------|--------|-------|
| `lib/sample-data.ts` | ✅ Replaced | Explore page uses API |
| `lib/marketplace-data.ts` | ✅ Replaced | All pages use API |
| `lib/tools-data.ts` | ✅ Replaced | Tools pages use API |
| `lib/challenges-data.ts` | ✅ Replaced | Challenges use API |
| `lib/events-data.ts` | ✅ Replaced | Events use API |
| `lib/groups-data.ts` | ✅ Replaced | Groups use API |
| `lib/resources-data.ts` | Uses static | Plant guides are static reference data |
| `lib/course-data.ts` | Uses static | Course content is reference data |

---

## Key Files & Architecture

### API Structure (All Implemented)
```
app/api/
├── auth/              # me, sync, update-username
├── bookings/          # CRUD + lease generation + disputes
├── certificates/      # verify endpoint
├── challenges/        # CRUD + join + progress
├── cloudinary/        # Upload signatures
├── community-tips/    # User-submitted tips CRUD + voting
├── courses/           # CRUD + view tracking
├── disputes/          # User disputes list
├── forum/             # Topics, replies, votes
├── frost-dates/       # ZIP code frost date lookup
├── groups/            # CRUD + membership
├── instructor/        # Courses + earnings dashboard
├── journals/          # Crop journal CRUD
├── marketplace/       # Listings + orders + seller-stats
├── messages/          # Conversations
├── my-plots/          # User's plots
├── notifications/     # User notifications
├── payments/          # Stripe intents + refunds
├── plots/             # CRUD + availability + blocked dates
├── reviews/           # CRUD + voting (plots, tools, users)
├── saved-searches/    # User saved searches
├── stripe/            # Connect onboarding
├── tool-rentals/      # Rental booking
├── tools/             # Tool listings
├── users/             # Profiles, follow, privacy, block, achievements
├── verification/      # Phone + ID verification
└── webhooks/          # Clerk + Stripe webhooks
```

### Admin Dashboard
```
app/admin/
├── page.tsx           # Dashboard overview
├── users/             # User management
├── verifications/     # ID/phone verification review
├── moderation/        # Content moderation queue
├── community-tips/    # Approve/reject user tips
└── settings/          # Admin settings
```

### Dashboard Pages
```
app/dashboard/
├── page.tsx           # Main dashboard with stats
├── achievements/      # Badges, milestones, streaks
├── disputes/          # User's filed/received disputes
├── orders/            # Buyer's marketplace orders
└── sell/              # Seller dashboard + orders
    ├── page.tsx       # Listings management
    ├── new/           # Create listing
    └── orders/        # Order fulfillment
```

### Core Libraries
- `lib/stripe.ts` - Stripe SDK wrapper (customers, payments, Connect, refunds)
- `lib/cloudinary.ts` - Upload signatures and deletion
- `lib/email.ts` - SendGrid with 8 templates
- `lib/prisma.ts` - Database client
- `lib/theme-context.tsx` - Dark mode state
- `lib/ensure-user.ts` - Auth helper with auto-sync + null checks

### Key Components
- `components/ui/image-upload.tsx` - Drag-drop photo upload
- `components/payments/checkout-form.tsx` - Stripe Elements form
- `components/map/map.tsx` - Mapbox plot display
- `components/layout/header.tsx` - Main nav with search
- `components/layout/footer.tsx` - Site footer
- `components/resources/community-tips-section.tsx` - Tips display with voting
- `components/resources/recent-community-tips.tsx` - Tips on resources page
- `components/resources/plant-community-tips.tsx` - Tips on plant detail
- `components/dashboard/badge-showcase.tsx` - Badge display
- `components/dashboard/level-progress.tsx` - Level/XP progress bar

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Stripe (CONFIGURED)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Cloudinary (CONFIGURED)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=

# SendGrid (CONFIGURED)
SENDGRID_API_KEY=
EMAIL_FROM=

# Twilio (CONFIGURED)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

---

## Coding Conventions

### Dark Mode Classes
```tsx
// Backgrounds
className="bg-white dark:bg-gray-800"
className="bg-gray-50 dark:bg-gray-900"

// Text
className="text-gray-900 dark:text-white"
className="text-gray-600 dark:text-gray-300"

// Borders
className="border-gray-200 dark:border-gray-700"

// Inputs
className="dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
```

### API Patterns
```typescript
// Auth check with auto-sync
const user = await ensureUser()
if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

// Verified user required
const user = await ensureVerifiedUser()

// Response
return NextResponse.json(data)
```

---

## Remaining Nice-to-Have Features

These are lower priority items that could be added later:

| Feature | Notes |
|---------|-------|
| Event calendar visualization | Currently list view only |
| Course video viewer improvements | Basic embed only |
| Leaderboard live data | Currently placeholder |
| Soil test tracking UI | Schema exists |
| Weather API integration | For journal entries |
| PlotBlockedDate UI | Date blocking calendar |
| SavedSearch button | On explore page |

---

## Git Info

- Main branch: `main`
- PR branch: `claude/gamification-growshare-o1vIf`

---

## Recent Work (January 2026)

### January 26, 2026 - Comprehensive Codebase Audit
- **Critical fixes:** Null checks for email arrays, type guards for string operations
- **Code quality:** Fixed 50+ `any` types, replaced alerts with UI states
- **Mobile:** PWA icons, touch targets, responsive tables
- **Features completed:**
  - Dispute filing UI
  - Course view tracking
  - Challenge participation
  - Instructor earnings dashboard
  - Marketplace order fulfillment
  - Dashboard achievements page
  - Tool reviews (real API)
  - Seller dashboard (real API)
  - Community tips integration
  - Join group functionality

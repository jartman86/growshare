# GrowShare - Claude Session Context

**Last Updated:** January 26, 2026
**Project Status:** Pre-Launch (Feature Complete, Needs Polish)

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
- **PWA:** Manifest configured, installable on mobile

---

## Feature Implementation Status

### COMPLETE - Production Ready
| Feature | API | UI | Notes |
|---------|-----|-----|-------|
| Authentication | ✅ | ✅ | Clerk + user sync |
| User Profiles | ✅ | ✅ | Edit, follow, verification badges |
| Plot Management | ✅ | ✅ | Full CRUD, map, filters, publish |
| Booking System | ✅ | ✅ | Request, approve, calendar, payments |
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
| Marketplace | ✅ | ✅ | Produce listings, orders, inventory |
| User Verification | ✅ | ✅ | Email, phone (Twilio), ID upload |
| Email Service | ✅ | ✅ | 8 templates via SendGrid |
| Saved Searches | ✅ | ✅ | Save/load filter configurations |
| Privacy Controls | ✅ | ✅ | Block users, profile visibility |
| Admin Dashboard | ✅ | ✅ | Users, verifications, moderation, tips |
| Community Tips | ✅ | ✅ | User-submitted tips for resources |
| Resources Section | ✅ | ✅ | Planting calendar, pests, companion guide |
| PWA Support | ✅ | ✅ | Manifest, mobile-optimized |

### PARTIALLY IMPLEMENTED
| Feature | Status | Remaining Work |
|---------|--------|----------------|
| Events System | UI only | Needs database integration |
| Courses | UI only | Video content viewer, progress tracking |
| Leaderboards | UI only | Needs live data integration |
| Challenges | UI only | Participation tracking |

---

## Punch List - Remaining Work

### HIGH PRIORITY - Sample Data to Replace with Database

These files contain `SAMPLE_*` exports that need to be replaced with database queries:

| File | Export | Database Model Exists |
|------|--------|----------------------|
| `lib/sample-data.ts` | SAMPLE_PLOTS | ✅ Plot |
| `lib/marketplace-data.ts` | SAMPLE_PRODUCTS | ✅ MarketplaceListing |
| `lib/tools-data.ts` | SAMPLE_TOOLS | ✅ Tool |
| `lib/reviews-data.ts` | SAMPLE_REVIEWS | ✅ Review |
| `lib/community-data.ts` | SAMPLE_TOPICS, SAMPLE_REPLIES | ✅ ForumTopic, ForumReply |
| `lib/resources-data.ts` | SAMPLE_PLANT_GUIDES, SAMPLE_PESTS_DISEASES | ❌ Need PlantGuide model |
| `lib/challenges-data.ts` | SAMPLE_CHALLENGES | ✅ Challenge |
| `lib/profile-data.ts` | SAMPLE_USERS | ✅ User |
| `lib/notifications-data.ts` | SAMPLE_NOTIFICATIONS | ✅ Notification |
| `lib/events-data.ts` | SAMPLE_EVENTS | ✅ Event |
| `lib/groups-data.ts` | SAMPLE_LOCAL_GROUPS | ✅ Group |
| `lib/messages-data.ts` | SAMPLE_MESSAGES | ✅ Message |
| `lib/journal-data.ts` | SAMPLE_JOURNAL_ENTRIES | ✅ JournalEntry |
| `lib/course-data.ts` | SAMPLE_COURSES | ✅ Course |

### MEDIUM PRIORITY - Missing Features

| Feature | File(s) | Notes |
|---------|---------|-------|
| Tool reviews not saving | `app/tools/[toolId]/page.tsx:68` | Submit review to backend |
| Course view tracking | `app/api/instructor/courses/route.ts:61` | Add view tracking |
| Dispute filing UI | - | End users can't file disputes |
| Certificate verification endpoint | - | No verification API |
| In-app notification settings | - | Only email preferences exist |
| Community groups full CRUD | `components/groups/group-card.tsx:117` | Handle join group |
| Challenge participation tracking | - | No tracking for user progress |
| Instructor earnings dashboard | - | No earnings view |
| Marketplace order fulfillment UI | - | Mark orders fulfilled |

### LOWER PRIORITY - Nice to Have

| Feature | Notes |
|---------|-------|
| Dashboard upcoming tasks | Currently shows sample data |
| Dashboard achievements display | Shows placeholder data |
| Dashboard streak tracking | Not implemented |
| Course content viewer improvements | Basic video embed only |
| Event calendar visualization | List view only |
| Soil test tracking UI | Schema exists, no UI |
| Weather API integration with journal | No weather data |

### Schema Models Without UI

These Prisma models exist but have no management UI:

| Model | Missing UI |
|-------|------------|
| PlotBlockedDate | No date blocking calendar |
| PlotAmenity | No amenity management |
| BlockedUser | No "My Blocked Users" page |
| SavedSearch | No save search button on explore |
| GroupPost | No group post creation |
| CourseEvent | Events not shown to students |

---

## Key Files & Architecture

### API Structure (All Implemented)
```
app/api/
├── auth/              # me, sync, update-username
├── bookings/          # CRUD + lease generation
├── cloudinary/        # Upload signatures
├── community-tips/    # User-submitted tips CRUD + voting
├── forum/             # Topics, replies, votes
├── frost-dates/       # ZIP code frost date lookup
├── journals/          # Crop journal CRUD
├── marketplace/       # Listings + orders
├── messages/          # Conversations
├── notifications/     # User notifications
├── payments/          # Stripe intents + refunds
├── plots/             # CRUD + availability + blocked dates
├── reviews/           # CRUD + voting
├── saved-searches/    # User saved searches
├── stripe/            # Connect onboarding
├── tool-rentals/      # Rental booking
├── tools/             # Tool listings
├── users/             # Profiles, follow, privacy, block
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

### Core Libraries
- `lib/stripe.ts` - Stripe SDK wrapper (customers, payments, Connect, refunds)
- `lib/cloudinary.ts` - Upload signatures and deletion
- `lib/email.ts` - SendGrid with 8 templates
- `lib/prisma.ts` - Database client
- `lib/theme-context.tsx` - Dark mode state
- `lib/ensure-user.ts` - Auth helper with auto-sync

### Key Components
- `components/ui/image-upload.tsx` - Drag-drop photo upload
- `components/payments/checkout-form.tsx` - Stripe Elements form
- `components/map/map.tsx` - Mapbox plot display
- `components/layout/header.tsx` - Main nav with search
- `components/layout/footer.tsx` - Site footer
- `components/resources/community-tips-section.tsx` - Tips display with voting
- `components/resources/tip-submission-form.tsx` - Submit new tips

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

## Recent Work (January 2026)

### January 26, 2026 - Codebase Audit & Optimization
- **Critical fixes:** Added null checks for email array access in auth routes
- **Code cleanup:** Removed 20+ debug console.log statements
- **Mobile optimization:** Added PWA manifest, responsive admin layout
- **Community tips:** Full feature with user submissions and admin moderation
- **Resources section:** Planting calendar, pest/disease guide, companion planting

### January 25, 2026
- Dark mode implementation (full coverage)
- Hero image replacements (solid colors → photos)
- Settings page theme toggle

---

## Git Info

- Main branch: `main`
- PR branch: `claude/gamification-growshare-o1vIf`

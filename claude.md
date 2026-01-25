# GrowShare - Claude Session Context

**Last Updated:** January 25, 2026
**Project Status:** Pre-Launch (Nearly Complete)

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

### NOT YET IMPLEMENTED
| Feature | Priority | Notes |
|---------|----------|-------|
| Admin Dashboard | P1 | User management, moderation |
| Events System | P2 | RSVP, calendar integration |
| Course Content | P2 | Video lessons, progress tracking |
| Leaderboards | P3 | Weekly/monthly rankings |
| Challenge System | P3 | Seasonal challenges |
| PWA Support | P3 | Offline, install prompt |
| Real-time Messaging | P3 | WebSocket (polling works now) |

---

## Key Files & Architecture

### API Structure (All Implemented)
```
app/api/
├── auth/              # me, sync, update-username
├── bookings/          # CRUD + lease generation
├── cloudinary/        # Upload signatures
├── forum/             # Topics, replies, votes
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

### Core Libraries
- `lib/stripe.ts` - Stripe SDK wrapper (customers, payments, Connect, refunds)
- `lib/cloudinary.ts` - Upload signatures and deletion
- `lib/email.ts` - SendGrid with 8 templates
- `lib/prisma.ts` - Database client
- `lib/theme-context.tsx` - Dark mode state

### Key Components
- `components/ui/image-upload.tsx` - Drag-drop photo upload
- `components/payments/checkout-form.tsx` - Stripe Elements form
- `components/map/map.tsx` - Mapbox plot display
- `components/layout/header.tsx` - Main nav with search
- `components/layout/footer.tsx` - Site footer

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
// Auth check
const { userId } = await auth()
if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

// Get/create user
const user = await ensureUser(userId)

// Response
return NextResponse.json(data)
```

---

## Recent Work (January 2026)

- Dark mode implementation (full coverage)
- Hero image replacements (solid colors → photos)
- Settings page theme toggle

---

## Git Info

- Main branch: `main`
- PR branch: `claude/gamification-growshare-o1vIf`

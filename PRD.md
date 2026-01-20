# GrowShare Product Requirements Document (PRD)
**Version:** 1.0
**Date:** 2026-01-16
**Status:** Pre-Launch Development

---

## Executive Summary

**GrowShare** is an agricultural engagement ecosystem that combines land rental marketplace functionality (Airbnb-style) with gamified community engagement (FarmVille-style). The platform enables landowners to list plots, renters to book growing space, and a community to engage through forums, marketplace, tool sharing, courses, and agricultural journaling.

### Core Value Propositions:
- **For Landowners:** Monetize unused land, connect with passionate growers, build community
- **For Renters:** Access affordable growing space, join a supportive community, learn and share
- **For Community:** Educational resources, peer support, marketplace for produce/tools, gamified engagement

### Revenue Model:
- Commission on plot bookings (primary)
- Marketplace transaction fees (produce sales)
- Tool rental commissions
- Premium course fees
- Future: Insurance products, premium subscriptions, advanced features

### Launch Strategy:
- Phase 1: Launch with free access, fully functional core features
- Phase 2: Introduce monetization after user base established
- Build complete payment infrastructure from start (Stripe integration)

---

## Technical Architecture

### Tech Stack:
- **Frontend:** Next.js 16.1, React 19, TypeScript, TailwindCSS, Radix UI
- **Backend:** Next.js API Routes (serverless)
- **Database:** PostgreSQL with PostGIS (geospatial)
- **ORM:** Prisma
- **Authentication:** Clerk
- **Payments:** Stripe
- **Maps:** Mapbox GL + Leaflet
- **File Storage:** Cloudinary
- **Email:** SMTP (configured)
- **Weather:** Weather API integration

### Infrastructure Requirements:
- Vercel/similar hosting with Edge runtime support
- PostgreSQL database with PostGIS extension
- Redis for caching (future)
- CDN for static assets
- Email service (SendGrid/AWS SES)

### Performance Targets:
- Page load: < 3 seconds (75th percentile)
- API response: < 500ms (95th percentile)
- Time to Interactive: < 5 seconds
- Lighthouse score: > 90

---

## User Personas

### Primary Users:

#### 1. **Lisa - The Landowner**
- Age: 45-65
- Has 2-10 acres of unused land
- Wants passive income and community connection
- Tech comfort: Moderate
- Goals: Easy listing, reliable renters, minimal management

#### 2. **Marcus - The Urban Grower**
- Age: 28-45
- Lives in city/suburbs, wants garden space
- Passionate about sustainable food
- Tech comfort: High
- Goals: Find affordable space, learn from community, sell surplus

#### 3. **Sarah - The Community Organizer**
- Age: 35-55
- Manages community garden or teaching farm
- Needs tools, resources, and volunteers
- Tech comfort: Moderate-High
- Goals: Coordinate activities, share knowledge, build network

---

## Feature Breakdown & Implementation Status

Legend:
- ✅ **Complete** - Fully implemented with database, API, and UI
- 🟡 **Partial** - Database/UI exists but missing critical functionality
- ❌ **Not Started** - UI only with mock data, needs full implementation
- 🔧 **Needs Polish** - Functional but needs refinement

---

## FEATURE 1: AUTHENTICATION & ONBOARDING

### Status: ✅ **Complete** (needs email verification polish)

### User Stories:
- As a new user, I want to sign up with email/social auth
- As a user, I want to choose my role (landowner/renter/both)
- As a user, I want to set up my profile during onboarding
- As a user, I want to reset my password securely

### Components:
- `/sign-up/[[...sign-up]]` - Clerk sign-up flow
- `/sign-in/[[...sign-in]]` - Clerk sign-in flow
- `/onboarding` - Initial profile setup
- `/sync-user` - Clerk-to-DB synchronization

### API Endpoints:
- `POST /api/webhooks/clerk` - Webhook for user sync ✅
- `POST /api/auth/sync` - Manual user sync ✅
- `GET /api/auth/me` - Get current user ✅
- `POST /api/auth/update-username` - Update username ✅

### Database Models:
- `User` (Clerk ID, role, profile, preferences) ✅

### Implementation Tasks:

#### Task 1.1: Email Verification Flow
**Status:** 🔧 Needs Implementation
**Priority:** P1 (Critical for Launch)
**Effort:** 2 days

**Requirements:**
- Send verification email on signup
- Display verification status in profile
- Block certain actions until verified (listings, bookings)
- Resend verification email option

**Acceptance Criteria:**
- [ ] Verification email sent within 30 seconds of signup
- [ ] Email contains working verification link
- [ ] Clicking link verifies account and redirects to dashboard
- [ ] Unverified badge shows on profile
- [ ] Users cannot create bookings until verified
- [ ] "Resend verification" button works
- [ ] Verified badge displays after completion

**Testing:**
1. Create new account → verify email sent
2. Click verification link → account marked verified
3. Try to book plot while unverified → blocked with message
4. Complete verification → can now book
5. Check profile shows verified badge

---

#### Task 1.2: Onboarding Flow Enhancement
**Status:** 🔧 Needs Polish
**Priority:** P2
**Effort:** 1 day

**Requirements:**
- Multi-step onboarding (Welcome → Role → Profile → Interests → Complete)
- Progress indicator
- Skip option with ability to complete later
- Welcome tour overlay on first dashboard visit

**Acceptance Criteria:**
- [ ] 5-step onboarding flow with progress bar
- [ ] Can skip and complete later
- [ ] "Complete your profile" banner shows if skipped
- [ ] Welcome tour highlights key features
- [ ] Tour can be dismissed and relaunched from help menu
- [ ] Completion awards 50 points and "Welcomer" badge

**Testing:**
1. Sign up → see onboarding wizard
2. Complete all steps → redirected to dashboard
3. Skip onboarding → see completion prompt
4. Complete later → tour launches
5. Dismiss tour → can relaunch from menu

---

## FEATURE 2: PLOT MANAGEMENT

### Status: ✅ **Complete** (needs photo upload)

### User Stories:
- As a landowner, I want to list my plot with details, photos, and pricing
- As a landowner, I want to edit my listings
- As a user, I want to browse plots on a map
- As a user, I want to filter plots by price, size, features, location
- As a user, I want to view detailed plot information

### Components:
- `/explore` - Map/grid view with filters ✅
- `/explore/[plotId]` - Plot detail page ✅
- `/list-plot` - Multi-step listing form ✅
- `/plots/[plotId]/edit` - Edit plot ✅
- `/my-plots` - Owner's plot management ✅

### API Endpoints:
- `GET/POST /api/plots` - List/create plots ✅
- `GET/PATCH/DELETE /api/plots/[plotId]` - Single plot ops ✅
- `GET /api/my-plots` - User's plots ✅
- `POST /api/geocode-my-plots` - Geocoding ✅

### Database Models:
- `Plot` - Full plot data ✅
- `PlotAmenity` - Additional amenities ✅
- `SoilTest` - Soil test results ✅

### Implementation Tasks:

#### Task 2.1: Photo Upload Integration (Cloudinary)
**Status:** ❌ Not Started
**Priority:** P0 (Critical)
**Effort:** 2 days

**Requirements:**
- Upload multiple photos during plot creation
- Drag-and-drop interface
- Image preview before upload
- Automatic resize/optimize for web
- Set primary photo
- Reorder photos
- Delete photos
- Max 10 photos per plot

**Acceptance Criteria:**
- [ ] Cloudinary API integrated and configured
- [ ] Upload component works in list-plot flow
- [ ] Can drag-drop or click to upload
- [ ] Shows upload progress bar
- [ ] Displays thumbnail previews
- [ ] Can set primary photo (first in order)
- [ ] Can reorder by drag-drop
- [ ] Can delete uploaded photos
- [ ] Images optimized to < 500KB each
- [ ] Uploads stored with plot ID reference

**Testing:**
1. Create plot → upload 5 photos → all display
2. Set photo 3 as primary → becomes cover image
3. Reorder photos by dragging → order persists
4. Delete photo 2 → removed from listing
5. Try to upload 11 photos → blocked with message
6. Upload 10MB photo → resized to < 500KB
7. Check Cloudinary dashboard → files present

---

#### Task 2.2: Advanced Plot Filtering
**Status:** 🔧 Needs Enhancement
**Priority:** P2
**Effort:** 1 day

**Requirements:**
- Saved searches
- Sort by: distance, price, rating, newest
- "View count" and "Popular" indicators
- Available dates filter
- Accessibility features filter (ADA compliant, wheelchair access)

**Acceptance Criteria:**
- [ ] Save search button stores filters
- [ ] Saved searches accessible from dashboard
- [ ] Can name saved searches
- [ ] Sort dropdown with 6 options
- [ ] "Available Now" quick filter
- [ ] Date range picker for availability
- [ ] Accessibility filters work
- [ ] Filter count badge shows active filters
- [ ] Clear all filters button

**Testing:**
1. Apply 3 filters → save search as "Urban Plots"
2. Clear filters → load saved search → filters reapply
3. Sort by price low-high → plots reorder correctly
4. Set availability dates → only matching plots show
5. Enable wheelchair access filter → filtered results
6. Click clear all → all filters reset

---

#### Task 2.3: Plot Analytics Dashboard
**Status:** ❌ Not Started
**Priority:** P3
**Effort:** 2 days

**Requirements:**
- Views per plot over time
- Booking conversion rate
- Earnings summary
- Most viewed features
- Comparison to similar plots
- Export analytics data

**Acceptance Criteria:**
- [ ] Plot views tracked on each visit
- [ ] Analytics page shows view graph (7/30/90 days)
- [ ] Shows booking requests vs. conversions
- [ ] Displays earnings by month
- [ ] Lists most viewed amenities
- [ ] Compare to area average
- [ ] Export to CSV button works
- [ ] Updates in real-time (no cache)

**Testing:**
1. View plot 5 times → view count increases
2. Create booking → conversion tracked
3. Navigate to analytics → see graphs
4. Toggle to 30-day view → data updates
5. Click export → CSV downloads
6. Compare to similar → benchmarks show

---

## FEATURE 3: BOOKING SYSTEM

### Status: 🟡 **Partial** (needs Stripe integration)

### User Stories:
- As a renter, I want to request bookings with dates
- As a landowner, I want to approve/reject booking requests
- As a landowner, I want to set instant booking for trusted renters
- As users, I want to track booking status
- As users, I want to cancel bookings with refund policy
- As a user, I want to pay securely via Stripe

### Components:
- `/my-bookings` - Renter's bookings ✅
- `/manage-bookings` - Landowner's management ✅
- Booking modal in plot pages ✅

### API Endpoints:
- `POST /api/bookings` - Create booking ✅
- `GET /api/bookings` - List bookings ✅
- `PATCH /api/bookings/[id]` - Update status ✅
- `DELETE /api/bookings/[id]` - Cancel ✅

### Database Models:
- `Booking` - Booking workflow ✅
- `Payment` - Payment records (exists, unused) ⚠️

### Implementation Tasks:

#### Task 3.1: Stripe Payment Integration
**Status:** ❌ Not Started
**Priority:** P0 (Critical - Revenue)
**Effort:** 5 days

**Requirements:**
- Stripe Checkout for booking payments
- Payment Intent creation
- 3D Secure (SCA) support
- Payment holds for security deposits
- Automatic payouts to landowners (Stripe Connect)
- Refund processing
- Payment status tracking
- Failed payment handling

**Acceptance Criteria:**
- [ ] Stripe API keys configured in env
- [ ] Create Stripe Customer on user signup
- [ ] Booking creates Payment Intent
- [ ] User redirected to Stripe Checkout
- [ ] Successful payment marks booking PAID
- [ ] Payment record created in database
- [ ] Security deposit held separately
- [ ] Landowner onboarded to Stripe Connect
- [ ] Funds transfer after booking starts
- [ ] Cancellation triggers appropriate refund
- [ ] Failed payments show clear error
- [ ] Retry payment option available
- [ ] Payment history visible in dashboard
- [ ] Stripe webhooks handle async events

**Testing:**
1. Create booking → redirected to Stripe
2. Complete payment with test card → booking paid
3. Check Payment record created
4. Cancel before start → full refund issued
5. Cancel after start → partial refund per policy
6. Test failed payment → error shown, retry available
7. Landowner completes Connect → can receive funds
8. Booking starts → payout initiated to landowner
9. Check Stripe dashboard → transactions recorded
10. Test webhook scenarios (success, failure, dispute)

---

#### Task 3.2: Booking Calendar & Availability
**Status:** 🔧 Needs Enhancement
**Priority:** P1
**Effort:** 3 days

**Requirements:**
- Visual calendar showing available/booked dates
- Block dates for maintenance
- Seasonal pricing rules
- Multi-plot booking for adjacent plots
- Recurring booking templates (weekly CSA box, etc.)
- iCal export/import

**Acceptance Criteria:**
- [ ] Calendar component shows month view
- [ ] Booked dates highlighted in red
- [ ] Available dates in green
- [ ] Blocked dates in gray
- [ ] Click date to start booking
- [ ] Date range selection with drag
- [ ] Price updates as dates selected
- [ ] Seasonal pricing rules apply automatically
- [ ] Landowner can block dates
- [ ] Block reason/notes field
- [ ] Export bookings to .ics file
- [ ] Import existing calendar blocks

**Testing:**
1. Open calendar → see current bookings
2. Landowner blocks March 15-20 → grayed out
3. Try to book blocked dates → prevented
4. Select dates in summer → higher seasonal price applies
5. Book adjacent plots together → both reserved
6. Export calendar → .ics file downloads
7. Import external calendar → blocks imported

---

#### Task 3.3: Lease Agreement Generation
**Status:** ❌ Not Started
**Priority:** P2
**Effort:** 3 days

**Requirements:**
- PDF lease agreement template
- Populate with booking details
- Electronic signature (DocuSign/HelloSign)
- Store signed agreements
- Custom clauses per plot
- Download option

**Acceptance Criteria:**
- [ ] Template created with legal review
- [ ] Booking approval triggers agreement generation
- [ ] Agreement pre-filled with all details
- [ ] Both parties receive signature request
- [ ] E-signature via integrated service
- [ ] Signed PDF stored in database
- [ ] Download link in booking details
- [ ] Landowner can add custom clauses
- [ ] Agreement history tracked

**Testing:**
1. Approve booking → agreement generated
2. Both users receive email with sign link
3. Sign agreement → marked complete
4. Download PDF → contains all details
5. Add custom clause → appears in agreement
6. Check database → PDF URL stored

---

## FEATURE 4: MESSAGING SYSTEM

### Status: 🟡 **Partial** (needs real-time updates)

### User Stories:
- As a user, I want to message other users about bookings/plots
- As a user, I want to see conversation history
- As a user, I want to know when I have unread messages
- As a user, I want to receive notifications for new messages

### Components:
- `/messages` - Messaging interface ✅
- `/components/messages/*` - Chat components ✅

### API Endpoints:
- `POST /api/messages` - Send message ✅
- `GET /api/messages` - Get conversations ✅
- `GET /api/messages/unread-count` - Unread count ✅

### Database Models:
- `Message` - Message records ✅

### Implementation Tasks:

#### Task 4.1: Real-Time Messaging
**Status:** ❌ Not Started
**Priority:** P1
**Effort:** 3 days

**Requirements:**
- WebSocket connection for live updates OR
- Polling every 5 seconds as fallback
- Typing indicators
- Read receipts
- Online/offline status
- "User is viewing" indicator

**Acceptance Criteria:**
- [ ] New messages appear without refresh
- [ ] Typing indicator shows when other user types
- [ ] "Seen" status updates in real-time
- [ ] Online status dot on user avatar
- [ ] Messages marked read when viewed
- [ ] Connection status indicator
- [ ] Fallback to polling if WebSocket fails
- [ ] Reconnects automatically if disconnected

**Testing:**
1. User A sends message → User B sees immediately
2. User B starts typing → "typing..." shows to User A
3. User B views message → "Seen" appears to User A
4. Check online status dot → accurate
5. Disconnect internet → reconnection message shows
6. Reconnect → messages sync automatically
7. Close WebSocket → polling takes over

---

#### Task 4.2: Message Attachments
**Status:** ❌ Not Started
**Priority:** P2
**Effort:** 2 days

**Requirements:**
- Attach images (plot photos, journal pics)
- Attach documents (lease PDFs, agreements)
- File preview in chat
- Download attachments
- Max 10MB per file

**Acceptance Criteria:**
- [ ] Attach button in message composer
- [ ] Can select files from device
- [ ] Image previews show inline
- [ ] Documents show with download icon
- [ ] Progress bar during upload
- [ ] Uploads stored in Cloudinary
- [ ] File size validation (max 10MB)
- [ ] Supported formats: jpg, png, pdf, doc, xls
- [ ] Virus scanning on uploads (ClamAV or similar)

**Testing:**
1. Click attach → file picker opens
2. Select image → uploads with progress
3. Image displays inline in chat
4. Send PDF document → shows as download link
5. Try 15MB file → rejected with error
6. Try .exe file → rejected (unsupported format)
7. Download attachment → file downloads correctly

---

#### Task 4.3: Message Search & Filtering
**Status:** ❌ Not Started
**Priority:** P3
**Effort:** 1 day

**Requirements:**
- Search messages by keyword
- Filter by user
- Filter by date range
- Filter by booking reference
- Archive conversations
- Pin important conversations

**Acceptance Criteria:**
- [ ] Search box in messages page
- [ ] Search returns matching messages
- [ ] Highlights search terms in results
- [ ] Filter dropdown for users
- [ ] Date range picker for filtering
- [ ] "Archived" folder separate from inbox
- [ ] Archive/unarchive buttons
- [ ] Pin/unpin conversations
- [ ] Pinned conversations at top
- [ ] Search indexes message content

**Testing:**
1. Search "tomatoes" → finds relevant messages
2. Filter by date range → old messages excluded
3. Archive conversation → moves to archived folder
4. Pin conversation → stays at top of list
5. Search in archived → includes archived messages

---

## FEATURE 5: REVIEWS & RATINGS

### Status: ✅ **Complete** (needs enhancement features)

### User Stories:
- As a renter, I want to review plots after my booking
- As a landowner, I want to review renters
- As a user, I want to see ratings and reviews before booking
- As a landowner, I want to respond to reviews
- As users, I want to review tools after rental

### Components:
- `/components/reviews/*` - Review components ✅
- Review modals in booking/plot pages ✅

### API Endpoints:
- `POST /api/reviews` - Submit review ✅
- `GET /api/reviews` - Get reviews ✅
- `PATCH /api/reviews/[id]` - Update review ✅
- `DELETE /api/reviews/[id]` - Delete review ✅

### Database Models:
- `Review` - Review records (PLOT, USER, TOOL) ✅

### Implementation Tasks:

#### Task 5.1: Review Photos
**Status:** ❌ Not Started
**Priority:** P2
**Effort:** 2 days

**Requirements:**
- Attach up to 5 photos to reviews
- Photo gallery in review display
- Lightbox for photo viewing
- Photo moderation (report inappropriate)

**Acceptance Criteria:**
- [ ] Upload photos in review form
- [ ] Max 5 photos per review
- [ ] Photos display as gallery in review card
- [ ] Click photo → opens lightbox
- [ ] Navigate between photos with arrows
- [ ] Photos stored in Cloudinary
- [ ] Report photo button
- [ ] Admin can remove flagged photos

**Testing:**
1. Write review → add 3 photos → submit
2. View review → photos display as gallery
3. Click photo → lightbox opens
4. Navigate with arrows → cycles through photos
5. Try 6 photos → blocked after 5
6. Report photo → flagged for review

---

#### Task 5.2: Review Helpful Voting
**Status:** ❌ Not Started
**Priority:** P2
**Effort:** 1 day

**Requirements:**
- Upvote/downvote reviews as helpful
- Vote count displayed
- Sort reviews by "Most Helpful"
- One vote per user per review

**Acceptance Criteria:**
- [ ] "Was this helpful?" buttons on reviews
- [ ] Click thumbs up → count increases
- [ ] Can't vote multiple times
- [ ] Can change vote (up to down or vice versa)
- [ ] Vote count shows "42 found this helpful"
- [ ] Sort by helpful works correctly
- [ ] Most helpful reviews at top

**Testing:**
1. Click "Helpful" → count increments
2. Click again → no change (already voted)
3. Switch to "Not helpful" → updates vote
4. Sort by helpful → top reviews have most votes
5. Log out and back in → vote persists

---

#### Task 5.3: Owner Review Responses
**Status:** ❌ Not Started
**Priority:** P2
**Effort:** 1 day

**Requirements:**
- Landowner can respond to plot reviews
- Tool owner can respond to tool reviews
- Response shows below review
- Edit/delete response
- Notification to reviewer when response posted

**Acceptance Criteria:**
- [ ] "Respond" button on reviews (owner only)
- [ ] Response form with character limit (500)
- [ ] Response displays below review
- [ ] Labeled "Owner's Response"
- [ ] Can edit response within 24 hours
- [ ] Can delete response anytime
- [ ] Reviewer gets notification of response
- [ ] Response timestamp shown

**Testing:**
1. View review on owned plot → see "Respond" button
2. Write response → submits successfully
3. Response displays below review
4. Edit within 24 hours → updates
5. Try to edit after 24 hours → blocked
6. Delete response → removed
7. Reviewer receives notification → contains response

---

## FEATURE 6: USER PROFILES

### Status: 🟡 **Partial** (needs photo uploads, verification)

### User Stories:
- As a user, I want a profile showcasing my activity
- As a user, I want to upload profile photo
- As a user, I want to follow other users
- As a user, I want to see my badges and achievements
- As a landowner, I want to display verification badge
- As a user, I want to control privacy settings

### Components:
- `/profile/[username]` - Profile page ✅
- `/profile/edit` - Edit profile ✅
- `/components/profile/*` - Profile components ✅

### API Endpoints:
- `GET /api/users/[userId]` - Get user ✅
- `PATCH /api/users/[userId]` - Update user ✅
- `POST /api/users/[userId]/follow` - Follow/unfollow ✅

### Database Models:
- `User` - User data ✅
- `Follow` - Follow relationships ✅

### Implementation Tasks:

#### Task 6.1: Profile Photo Upload
**Status:** ❌ Not Started
**Priority:** P1
**Effort:** 1 day

**Requirements:**
- Upload profile photo (avatar)
- Upload cover photo
- Crop/resize interface
- Default avatars (auto-generated from initials)
- Remove photo option

**Acceptance Criteria:**
- [ ] Click avatar → upload dialog opens
- [ ] Select photo → crop interface loads
- [ ] Crop to square for avatar
- [ ] Crop to 3:1 for cover photo
- [ ] Preview before saving
- [ ] Photos stored in Cloudinary
- [ ] Optimized to < 200KB (avatar), < 500KB (cover)
- [ ] Remove photo → reverts to default
- [ ] Default avatar shows initials in colored circle

**Testing:**
1. Upload avatar → crop interface appears
2. Crop and save → updates profile
3. Upload cover photo → updates
4. Remove avatar → shows initials default
5. Check Cloudinary → files present
6. View profile → photos display correctly

---

#### Task 6.2: Verification Badge System
**Status:** ❌ Not Started
**Priority:** P1
**Effort:** 2 days

**Requirements:**
- Email verification (already planned)
- Phone verification (SMS)
- ID verification (manual admin review)
- Address verification for landowners
- Verified badge display on profile
- Verification levels (Email → Phone → ID → Address)

**Acceptance Criteria:**
- [ ] Email verification already implemented (Task 1.1)
- [ ] Phone verification via SMS code
- [ ] Upload photo ID for manual review
- [ ] Landowner address verification (utility bill)
- [ ] Admin dashboard to review verifications
- [ ] Approve/reject verification requests
- [ ] Verified badge shows on profile
- [ ] Badge tooltip shows verification level
- [ ] Higher verification = higher trust score
- [ ] Filters can sort by verified users

**Testing:**
1. Verify phone → SMS sent, code works
2. Upload ID → pending review shows
3. Admin approves → badge appears
4. Verify address → utility bill uploaded
5. Admin approves address → full verification
6. Check trust score → increased
7. Search plots → can filter by verified owners

---

#### Task 6.3: Privacy Settings
**Status:** ❌ Not Started
**Priority:** P2
**Effort:** 2 days

**Requirements:**
- Control profile visibility (public/private/followers-only)
- Hide activity feed
- Hide follower/following lists
- Control who can message (everyone/followers/connections)
- Block users
- Report users

**Acceptance Criteria:**
- [ ] Privacy settings page
- [ ] Profile visibility dropdown
- [ ] Activity feed toggle (show/hide)
- [ ] Follower list visibility toggle
- [ ] Message permissions dropdown
- [ ] Block user button on profiles
- [ ] Blocked users can't message or view profile
- [ ] Report user button with reason dropdown
- [ ] Admin receives report notifications
- [ ] Privacy settings save and apply immediately

**Testing:**
1. Set profile to private → non-followers can't view
2. Hide activity feed → not shown on profile
3. Set messages to followers-only → strangers blocked
4. Block user → they can't message or view profile
5. Report user → admin receives notification
6. Unblock user → access restored

---

## FEATURE 7: CROP JOURNAL

### Status: ✅ **Complete** (needs weather & analytics)

### User Stories:
- As a grower, I want to log planting, growth, and harvest
- As a grower, I want to upload photos to journal entries
- As a grower, I want to see weather data for journal dates
- As a grower, I want to track harvest quantities and quality
- As a user, I want to view other users' public journals for learning

### Components:
- `/dashboard/journal` - Journal list ✅
- `/dashboard/journal/new` - New entry ✅
- `/dashboard/journal/[entryId]` - Entry detail ✅
- `/components/journal/*` - Journal components ✅

### API Endpoints:
- `GET/POST /api/journals` - List/create entries ✅
- `GET/PATCH/DELETE /api/journals/[journalId]` - Single entry ops ✅

### Database Models:
- `CropJournal` - Journal entries ✅
- `Harvest` - Harvest records ✅

### Implementation Tasks:

#### Task 7.1: Weather API Integration
**Status:** ❌ Not Started
**Priority:** P0 (Essential per requirements)
**Effort:** 2 days

**Requirements:**
- Fetch weather data for journal entry dates
- Display temperature, precipitation, conditions
- Historical weather for past entries
- Forecast for upcoming plantings
- Weather alerts (frost warnings, etc.)
- Auto-populate weather when creating entry

**Acceptance Criteria:**
- [ ] Weather API key configured
- [ ] Fetch weather data on entry creation
- [ ] Display weather card in journal entry
- [ ] Shows: temp (high/low), precipitation, conditions, humidity
- [ ] Historical data for entries > 1 day old
- [ ] Forecast for future dated entries
- [ ] Weather alerts badge if applicable
- [ ] Can manually override weather data
- [ ] Weather data cached for 24 hours

**Testing:**
1. Create journal entry → weather auto-populated
2. Check entry → weather card displays
3. View old entry → historical weather shows
4. Create future-dated entry → forecast shows
5. Frost warning active → alert badge appears
6. Override temperature → manual value saved
7. Check cache → duplicate API calls avoided

---

#### Task 7.2: Journal Photo Upload
**Status:** ❌ Not Started
**Priority:** P1
**Effort:** 1 day

**Requirements:**
- Upload photos to journal entries
- Multiple photos per entry
- Photo caption/description
- Photo date metadata preserved
- Photo gallery view

**Acceptance Criteria:**
- [ ] Upload button in journal form
- [ ] Drag-drop multiple photos
- [ ] Image preview before submit
- [ ] Add caption to each photo
- [ ] Photos stored in Cloudinary
- [ ] Max 10 photos per entry
- [ ] Gallery view in entry detail
- [ ] Photos display with captions
- [ ] Lightbox for full-size viewing

**Testing:**
1. Create entry → upload 5 photos → all save
2. Add captions → displays with photos
3. View entry → photos show as gallery
4. Click photo → lightbox opens
5. Try 11 photos → blocked after 10

---

#### Task 7.3: Growth Analytics & Charts
**Status:** ❌ Not Started
**Priority:** P3
**Effort:** 3 days

**Requirements:**
- Visualize growth over time (days to maturity)
- Harvest yield comparisons year-over-year
- Success rate by crop type
- Best performing varieties
- Days to harvest average
- Total yield by season

**Acceptance Criteria:**
- [ ] Analytics dashboard for journals
- [ ] Line chart showing growth stages over time
- [ ] Bar chart comparing harvest yields
- [ ] Success rate percentage by crop
- [ ] Best performers list with yield data
- [ ] Average days to harvest by variety
- [ ] Filter by season/year
- [ ] Export data to CSV

**Testing:**
1. Navigate to journal analytics → charts load
2. View growth chart → stages plotted correctly
3. Compare yields → accurate calculations
4. Check success rates → percentages correct
5. Filter by 2024 → only 2024 data shows
6. Export CSV → data downloads correctly

---

## FEATURE 8: MARKETPLACE (PRODUCE SALES)

### Status: ❌ **Not Started** (Database exists, no implementation)

### User Stories:
- As a grower, I want to list surplus produce for sale
- As a buyer, I want to browse available produce
- As a buyer, I want to purchase produce with secure payment
- As a seller, I want to manage orders and inventory
- As a user, I want to arrange pickup or delivery

### Components:
- `/marketplace` - Browse listings (UI only) ⚠️
- `/marketplace/[productId]` - Product detail (UI only) ⚠️
- `/dashboard/sell` - Seller dashboard (UI only) ⚠️
- `/dashboard/sell/new` - Create listing (UI only) ⚠️

### API Endpoints:
- **All need to be created** ❌

### Database Models:
- `ProduceListing` - Product listings ✅ (unused)
- `Order` - Order management ✅ (unused)

### Implementation Tasks:

#### Task 8.1: Create Produce Listing API
**Status:** ❌ Not Started
**Priority:** P1 (Core feature)
**Effort:** 3 days

**Requirements:**
- Create/edit/delete produce listings
- Upload product photos
- Set pricing and inventory
- Organic/certified badges
- Delivery/pickup options
- Listing expiration dates
- Categories and tags

**Sub-tasks:**
1. Create `/api/marketplace/listings` endpoint (GET/POST)
2. Create `/api/marketplace/listings/[id]` endpoint (GET/PATCH/DELETE)
3. Connect create listing form to API
4. Add photo upload to listing form
5. Implement inventory tracking
6. Add listing status workflow (DRAFT → ACTIVE → SOLD_OUT → EXPIRED)

**Acceptance Criteria:**
- [ ] POST /api/marketplace/listings creates listing
- [ ] Validation: required fields (title, price, quantity, category)
- [ ] Photo upload works (max 5 photos)
- [ ] Inventory decrements on purchase
- [ ] Status auto-updates when sold out
- [ ] Expired listings hidden from marketplace
- [ ] Edit listing updates database
- [ ] Delete listing soft-deletes (marks inactive)
- [ ] Listings linked to seller user ID

**Testing:**
1. Create listing with all fields → saves to database
2. Upload 3 photos → stored in Cloudinary
3. Check marketplace → listing appears
4. Edit listing → updates display
5. Set inventory to 5 → tracks correctly
6. Sell 5 items → marks SOLD_OUT
7. Set expiration tomorrow → expires automatically
8. Delete listing → no longer visible

---

#### Task 8.2: Order Processing System
**Status:** ❌ Not Started
**Priority:** P0 (Critical - Revenue)
**Effort:** 5 days

**Requirements:**
- Shopping cart functionality
- Stripe payment integration
- Order confirmation emails
- Order status workflow (PENDING → PAID → PREPARING → READY → COMPLETED)
- Seller notification of new orders
- Buyer notification of status changes
- Order history

**Sub-tasks:**
1. Create `/api/marketplace/cart` endpoints (add/remove/get)
2. Create `/api/marketplace/orders` endpoint (POST)
3. Integrate Stripe Checkout
4. Create order confirmation email template
5. Create order status update API
6. Add order management for sellers
7. Add order tracking for buyers

**Acceptance Criteria:**
- [ ] Add to cart stores items in session/DB
- [ ] Cart persists across sessions
- [ ] Checkout creates Stripe Payment Intent
- [ ] Successful payment creates Order record
- [ ] Order confirmation email sent to buyer
- [ ] New order notification sent to seller
- [ ] Seller can update order status
- [ ] Status update sends email to buyer
- [ ] Order history page shows all orders
- [ ] Can filter orders by status
- [ ] Commission calculated (5% platform fee)

**Testing:**
1. Add 3 items to cart → cart updates
2. Checkout → redirected to Stripe
3. Complete payment → order created
4. Check email → confirmation received
5. Seller sees order → updates to PREPARING
6. Buyer receives status update email
7. Seller marks READY → buyer notified
8. Complete order → marked COMPLETED
9. Check order history → order appears
10. Verify commission calculated correctly

---

#### Task 8.3: Delivery & Pickup Management
**Status:** ❌ Not Started
**Priority:** P2
**Effort:** 3 days

**Requirements:**
- Pickup location selection
- Pickup time scheduling
- Delivery zone setup (radius from seller)
- Delivery fee calculation
- Delivery scheduling
- Pickup/delivery instructions
- Notification when ready for pickup
- Route optimization for delivery (future)

**Acceptance Criteria:**
- [ ] Seller sets pickup location(s)
- [ ] Seller sets available pickup times
- [ ] Buyer selects pickup time at checkout
- [ ] Seller defines delivery zones (zip codes or radius)
- [ ] Delivery fee calculated based on distance
- [ ] Buyer chooses delivery date/time
- [ ] Special instructions field
- [ ] Pickup ready notification sent
- [ ] Delivery tracking (future integration)
- [ ] Pickup/delivery proof (photo upload)

**Testing:**
1. Seller sets pickup location → saves
2. Set pickup hours → buyer sees available times
3. Buyer selects pickup → time reserved
4. Calculate delivery fee → accurate based on distance
5. Choose delivery → date/time options show
6. Add special instructions → included in order
7. Mark ready for pickup → notification sent
8. Upload pickup photo → proof recorded

---

#### Task 8.4: Marketplace Search & Filters
**Status:** ❌ Not Started
**Priority:** P2
**Effort:** 2 days

**Requirements:**
- Search by product name, seller, category
- Filter by: organic, price range, delivery option, distance
- Sort by: price, rating, newest, popularity
- Save searches
- Location-based (show nearest sellers)

**Acceptance Criteria:**
- [ ] Search box returns matching products
- [ ] Category filter works (vegetables, fruits, herbs, etc.)
- [ ] Organic filter shows only certified products
- [ ] Price range slider filters results
- [ ] Delivery/pickup filter works
- [ ] Distance filter (5/10/25/50 miles)
- [ ] Sort dropdown with 5 options
- [ ] Results update without page reload
- [ ] Save search button stores preferences
- [ ] Saved searches accessible from dashboard

**Testing:**
1. Search "tomatoes" → relevant results
2. Filter organic → only organic products show
3. Set price range $5-$15 → filtered correctly
4. Filter pickup only → delivery items hidden
5. Sort by price low-high → reorders correctly
6. Set distance to 10 miles → distant items hidden
7. Save search → accessible from dashboard

---

## FEATURE 9: TOOLS/EQUIPMENT RENTAL

### Status: ❌ **Not Started** (Mock data only, needs full implementation)

### User Stories:
- As a tool owner, I want to list tools for rent/sale
- As a user, I want to browse available tools
- As a user, I want to rent tools with security deposits
- As a user, I want to track rental periods and returns
- As users, I want to review tools after rental

### Components:
- `/tools` - Browse tools (mock data) ⚠️
- `/tools/[toolId]` - Tool detail (mock data) ⚠️
- `/tools/list` - List tool (UI only) ⚠️
- `/tools/my-rentals` - Manage rentals (UI only) ⚠️

### API Endpoints:
- **All need to be created** ❌

### Database Models:
- **Tool model needs to be created** ❌
- **ToolRental model needs to be created** ❌

### Implementation Tasks:

#### Task 9.1: Create Tool Database Schema
**Status:** ❌ Not Started
**Priority:** P1
**Effort:** 1 day

**Requirements:**
- Tool model with all attributes from sample data
- ToolRental model for tracking rentals
- Link to User (owner)
- Categories, conditions, specifications
- Pricing (daily, weekly, sale price)
- Availability calendar
- Security deposit handling

**Schema Design:**
```prisma
model Tool {
  id               String        @id @default(cuid())
  ownerId          String
  owner            User          @relation(fields: [ownerId], references: [id])

  name             String
  description      String
  category         ToolCategory
  condition        ToolCondition

  // Pricing
  listingType      ListingType   // RENT, SALE, BOTH
  dailyRate        Float         @default(0)
  weeklyRate       Float?
  salePrice        Float?
  depositRequired  Float?

  // Details
  brand            String?
  model            String?
  yearPurchased    Int?
  specifications   String[]
  instructions     String?

  // Logistics
  pickupLocation   String
  pickupNotes      String?
  maxRentalDays    Int?

  // Media
  images           String[]

  // Status
  status           ToolStatus    @default(AVAILABLE)

  // Stats
  timesRented      Int           @default(0)
  rating           Float         @default(0)
  reviewCount      Int           @default(0)

  rentals          ToolRental[]
  reviews          Review[]

  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  @@index([ownerId])
  @@index([category])
  @@index([status])
}

model ToolRental {
  id              String         @id @default(cuid())
  toolId          String
  tool            Tool           @relation(fields: [toolId], references: [id])
  renterId        String
  renter          User           @relation(fields: [renterId], references: [id])

  startDate       DateTime
  endDate         DateTime
  returnDate      DateTime?

  dailyRate       Float
  totalCost       Float
  deposit         Float
  depositReturned Boolean        @default(false)

  status          RentalStatus   @default(PENDING)

  paymentId       String?
  payment         Payment?       @relation(fields: [paymentId], references: [id])

  notes           String?
  damageReport    String?

  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  @@index([toolId])
  @@index([renterId])
  @@index([status])
}

enum ToolCategory {
  HAND_TOOLS
  POWER_TOOLS
  IRRIGATION
  SOIL_COMPOST
  HARVESTING
  PROCESSING
  STORAGE
  TRANSPORT
  SAFETY
  OTHER
}

enum ToolCondition {
  NEW
  EXCELLENT
  GOOD
  FAIR
  POOR
}

enum ToolStatus {
  AVAILABLE
  RENTED
  MAINTENANCE
  SOLD
  INACTIVE
}

enum RentalStatus {
  PENDING
  APPROVED
  ACTIVE
  RETURNED
  OVERDUE
  CANCELLED
  DISPUTED
}
```

**Acceptance Criteria:**
- [ ] Schema added to schema.prisma
- [ ] Migration created
- [ ] Prisma client regenerated
- [ ] Models include all necessary fields
- [ ] Relationships properly defined
- [ ] Indexes on frequently queried fields

**Testing:**
1. Run migration → tables created
2. Create test Tool record → saves successfully
3. Create ToolRental → links to Tool and User
4. Query by category → index used efficiently

---

#### Task 9.2: Tool Listing API
**Status:** ❌ Not Started
**Priority:** P1
**Effort:** 3 days

**Requirements:**
- Create/edit/delete tool listings
- Upload tool photos
- Set rental rates and availability
- Manage tool status
- Search and filter tools

**Sub-tasks:**
1. Create `/api/tools` endpoint (GET/POST)
2. Create `/api/tools/[id]` endpoint (GET/PATCH/DELETE)
3. Connect list tool form to API
4. Migrate sample data to database
5. Update tool pages to fetch from API

**Acceptance Criteria:**
- [ ] POST /api/tools creates tool listing
- [ ] Validation: required fields (name, category, pricing, location)
- [ ] Photo upload works (max 8 photos)
- [ ] Tool specifications saved as array
- [ ] Status management works
- [ ] GET /api/tools returns filtered results
- [ ] Filter by category, condition, listing type
- [ ] Search by name/description
- [ ] Edit tool updates database
- [ ] Delete tool soft-deletes

**Testing:**
1. Create tool listing → saves to database
2. Upload 5 photos → stored
3. Browse tools → shows database listings
4. Filter by POWER_TOOLS → correct results
5. Search "lawn mower" → finds matching tools
6. Edit tool → updates successfully
7. Delete tool → marked inactive
8. Check /tools page → no sample data, real listings

---

#### Task 9.3: Tool Rental System
**Status:** ❌ Not Started
**Priority:** P1
**Effort:** 4 days

**Requirements:**
- Request tool rental
- Approve/reject rental requests
- Process rental payments (Stripe)
- Hold security deposits
- Track rental periods
- Handle returns and damages
- Return deposits

**Sub-tasks:**
1. Create `/api/tool-rentals` endpoint (POST/GET)
2. Create `/api/tool-rentals/[id]` endpoint (PATCH/DELETE)
3. Integrate Stripe for rental payments
4. Create rental request form
5. Create rental management interface for owners
6. Add rental calendar to tool pages
7. Implement return/damage report flow

**Acceptance Criteria:**
- [ ] POST /api/tool-rentals creates rental request
- [ ] Validation: dates, availability check
- [ ] Payment Intent created for total + deposit
- [ ] Owner receives rental request notification
- [ ] Owner can approve/reject
- [ ] Approved rental charges card
- [ ] Renter receives approval notification
- [ ] Active rentals tracked
- [ ] Return button marks returned
- [ ] Damage report option if applicable
- [ ] Deposit returned if no damage
- [ ] Overdue rentals flagged automatically
- [ ] Can't book same dates as existing rental

**Testing:**
1. Request rental for dates → request created
2. Owner approves → payment processed
3. Renter charged total + deposit → funds held
4. Rental starts → status ACTIVE
5. Return tool → mark returned
6. No damage → deposit released
7. Report damage → deposit partially retained
8. Try overlapping dates → blocked
9. Rental overdue → status OVERDUE, notification sent
10. Check payment history → rental and deposit shown

---

#### Task 9.4: Tool Reviews Integration
**Status:** ✅ Already Complete
**Priority:** N/A
**Effort:** N/A

**Note:** Tool reviews were implemented in the previous work session. The Review model already supports ReviewType.TOOL and toolId field. The API endpoints are functional.

**Validation Needed:**
- [ ] Verify tool reviews work once Tool model created
- [ ] Test review submission for tools
- [ ] Verify review display on tool pages
- [ ] Confirm average rating calculation

---

## FEATURE 10: COMMUNITY FORUMS

### Status: ❌ **Not Started** (UI only with mock data)

### User Stories:
- As a user, I want to create discussion topics
- As a user, I want to reply to topics and engage in discussions
- As a user, I want to search topics and filter by category
- As a user, I want to upvote helpful posts
- As a moderator, I want to pin important topics
- As a moderator, I want to mark topics as solved
- As a user, I want to follow topics for updates

### Components:
- `/community` - Forum list (mock data) ⚠️
- `/community/[topicId]` - Topic detail (mock data) ⚠️
- `/community/new` - Create topic (UI only) ⚠️

### API Endpoints:
- **All need to be created** ❌

### Database Models:
- **ForumTopic model needs to be created** ❌
- **ForumReply model needs to be created** ❌
- **ForumVote model needs to be created** ❌

### Implementation Tasks:

#### Task 10.1: Create Forum Database Schema
**Status:** ❌ Not Started
**Priority:** P0 (Critical for engagement)
**Effort:** 1 day

**Requirements:**
- ForumTopic model
- ForumReply model (with threading)
- ForumVote model
- Categories and tags
- Moderation features
- Solved/pinned flags

**Schema Design:**
```prisma
model ForumTopic {
  id          String        @id @default(cuid())
  authorId    String
  author      User          @relation("TopicAuthor", fields: [authorId], references: [id])

  title       String
  content     String
  category    ForumCategory
  tags        String[]

  isPinned    Boolean       @default(false)
  isSolved    Boolean       @default(false)
  isLocked    Boolean       @default(false)

  views       Int           @default(0)
  replyCount  Int           @default(0)
  upvotes     Int           @default(0)

  replies     ForumReply[]
  votes       ForumVote[]

  lastActivityAt DateTime   @default(now())
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@index([authorId])
  @@index([category])
  @@index([isPinned])
  @@index([lastActivityAt])
}

model ForumReply {
  id          String        @id @default(cuid())
  topicId     String
  topic       ForumTopic    @relation(fields: [topicId], references: [id], onDelete: Cascade)
  authorId    String
  author      User          @relation("ReplyAuthor", fields: [authorId], references: [id])

  content     String

  // Threading support
  parentId    String?
  parent      ForumReply?   @relation("ReplyThread", fields: [parentId], references: [id])
  replies     ForumReply[]  @relation("ReplyThread")

  upvotes     Int           @default(0)
  isAccepted  Boolean       @default(false) // For marking solution

  votes       ForumVote[]

  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@index([topicId])
  @@index([authorId])
  @@index([parentId])
}

model ForumVote {
  id        String       @id @default(cuid())
  userId    String
  user      User         @relation(fields: [userId], references: [id])

  topicId   String?
  topic     ForumTopic?  @relation(fields: [topicId], references: [id])
  replyId   String?
  reply     ForumReply?  @relation(fields: [replyId], references: [id])

  value     Int          // 1 for upvote, -1 for downvote

  createdAt DateTime     @default(now())

  @@unique([userId, topicId])
  @@unique([userId, replyId])
  @@index([userId])
  @@index([topicId])
  @@index([replyId])
}

enum ForumCategory {
  GENERAL
  GROWING_TIPS
  PEST_DISEASE
  EQUIPMENT_TOOLS
  SOIL_COMPOSTING
  SEEDS_SEEDLINGS
  HARVESTING_STORAGE
  SELLING_MARKETING
  LAND_RENTAL
  OFF_TOPIC
}
```

**Acceptance Criteria:**
- [ ] Schema added to schema.prisma
- [ ] Migration created
- [ ] All relationships properly defined
- [ ] Threading support (replies to replies)
- [ ] Vote tracking per user

**Testing:**
1. Run migration → tables created
2. Create test topic → saves
3. Add reply → links correctly
4. Add nested reply → threading works
5. Vote on topic → vote recorded

---

#### Task 10.2: Forum Topic API
**Status:** ❌ Not Started
**Priority:** P0
**Effort:** 3 days

**Requirements:**
- Create/edit/delete topics
- List topics with filtering
- Pagination
- View count tracking
- Pin/unpin topics (admin)
- Lock/unlock topics (admin)
- Mark solved
- Tag system

**Sub-tasks:**
1. Create `/api/forum/topics` endpoint (GET/POST)
2. Create `/api/forum/topics/[id]` endpoint (GET/PATCH/DELETE)
3. Add topic creation form
4. Add topic list with filters
5. Add admin moderation controls
6. Implement view tracking

**Acceptance Criteria:**
- [ ] POST /api/forum/topics creates topic
- [ ] Validation: title (5-200 chars), content (min 20 chars)
- [ ] GET returns paginated topics (20 per page)
- [ ] Filter by category works
- [ ] Search by keyword works
- [ ] Filter by tag works
- [ ] Sort by: newest, popular, most replies, unsolved
- [ ] View count increments on page view (once per user per day)
- [ ] Pin topic (admin only)
- [ ] Lock topic (admin only) prevents new replies
- [ ] Mark solved updates flag
- [ ] Edit topic updates content
- [ ] Delete topic soft-deletes

**Testing:**
1. Create topic → saves to database
2. List topics → returns paginated results
3. Filter by GROWING_TIPS → correct category
4. Search "tomatoes" → matching topics
5. Filter by tag "organic" → tagged topics only
6. Sort by most replies → ordered correctly
7. View topic → view count increments
8. View again same day → count doesn't change
9. Admin pins topic → appears at top
10. Admin locks topic → reply button disabled
11. Mark as solved → solved badge shows
12. Edit topic → updates display
13. Delete topic → no longer visible

---

#### Task 10.3: Forum Reply API
**Status:** ❌ Not Started
**Priority:** P0
**Effort:** 2 days

**Requirements:**
- Post replies to topics
- Nested replies (threading)
- Edit/delete replies
- Accept answer (mark as solution)
- Quote previous replies
- Mention users (@username)

**Sub-tasks:**
1. Create `/api/forum/replies` endpoint (POST)
2. Create `/api/forum/replies/[id]` endpoint (PATCH/DELETE)
3. Add reply form to topic pages
4. Add nested reply UI
5. Add accept answer button (topic author only)
6. Implement mentions with notifications

**Acceptance Criteria:**
- [ ] POST /api/forum/replies creates reply
- [ ] Validation: content min 10 chars
- [ ] Reply links to topic and author
- [ ] Can reply to another reply (parentId)
- [ ] Nested replies indented in UI
- [ ] Max nesting depth of 5
- [ ] Edit reply updates content (within 24 hours)
- [ ] Delete reply soft-deletes
- [ ] Topic author can accept answer
- [ ] Accepted answer highlighted with badge
- [ ] Quote button copies previous reply
- [ ] @username creates mention
- [ ] Mentioned user receives notification
- [ ] Reply count updates on topic

**Testing:**
1. Post reply → saves and displays
2. Reply to reply → nested correctly
3. Check nesting depth → limited to 5
4. Author accepts answer → marked as solution
5. Edit reply → updates within time limit
6. Try edit after 24h → blocked
7. Delete reply → marked deleted
8. Quote reply → text copied
9. Mention @user → notification sent
10. Check topic → reply count updated

---

#### Task 10.4: Forum Voting System
**Status:** ❌ Not Started
**Priority:** P1
**Effort:** 1 day

**Requirements:**
- Upvote/downvote topics and replies
- One vote per user per item
- Vote count displayed
- Can change vote
- Sort by most upvoted
- Reputation points from upvotes

**Sub-tasks:**
1. Create `/api/forum/votes` endpoint (POST)
2. Add vote buttons to topics and replies
3. Update vote counts in real-time
4. Award reputation points
5. Add "Most Helpful" sort

**Acceptance Criteria:**
- [ ] POST /api/forum/votes creates/updates vote
- [ ] Can upvote topics
- [ ] Can upvote replies
- [ ] Can't vote on own content
- [ ] Can change vote (up to down or vice versa)
- [ ] Can remove vote
- [ ] Vote count updates immediately
- [ ] Sort by upvotes works
- [ ] Author gains 10 points per upvote
- [ ] Author loses 5 points per downvote
- [ ] Voting requires verified account

**Testing:**
1. Upvote topic → count increases
2. Downvote → count decreases
3. Change vote → updates correctly
4. Remove vote → count adjusts
5. Try to vote on own post → blocked
6. Sort by upvotes → ordered correctly
7. Check author points → updated
8. Unverified user tries to vote → blocked

---

## FEATURE 11: EVENTS & MEETUPS

### Status: ❌ **Not Started** (UI only with mock data)

### User Stories:
- As an organizer, I want to create events
- As a user, I want to browse and search events
- As a user, I want to RSVP to events
- As a user, I want to receive event reminders
- As an organizer, I want to manage attendees
- As a user, I want to add events to my calendar

### Components:
- `/events` - Event list (mock data) ⚠️
- `/events/[eventId]` - Event detail (mock data) ⚠️
- `/events/new` - Create event (UI only) ⚠️

### API Endpoints:
- **All need to be created** ❌

### Database Models:
- **Event model needs to be created** ❌
- **EventRSVP model needs to be created** ❌

### Implementation Tasks:

#### Task 11.1: Create Event Database Schema
**Status:** ❌ Not Started
**Priority:** P2
**Effort:** 1 day

**Schema Design:**
```prisma
model Event {
  id              String        @id @default(cuid())
  organizerId     String
  organizer       User          @relation(fields: [organizerId], references: [id])

  title           String
  description     String
  category        EventCategory

  startDate       DateTime
  endDate         DateTime

  location        String?       // Physical address
  latitude        Float?
  longitude       Float?
  isVirtual       Boolean       @default(false)
  virtualLink     String?

  capacity        Int?
  isFree          Boolean       @default(true)
  price           Float?

  coverImage      String?
  images          String[]

  tags            String[]
  isFeatured      Boolean       @default(false)

  rsvps           EventRSVP[]
  attendeeCount   Int           @default(0)

  status          EventStatus   @default(UPCOMING)

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@index([organizerId])
  @@index([category])
  @@index([startDate])
  @@index([isFeatured])
}

model EventRSVP {
  id          String       @id @default(cuid())
  eventId     String
  event       Event        @relation(fields: [eventId], references: [id], onDelete: Cascade)
  userId      String
  user        User         @relation(fields: [userId], references: [id])

  status      RSVPStatus   @default(GOING)
  guests      Int          @default(0)

  paidAt      DateTime?
  paymentId   String?

  createdAt   DateTime     @default(now())

  @@unique([eventId, userId])
  @@index([eventId])
  @@index([userId])
}

enum EventCategory {
  WORKSHOP
  SEED_SWAP
  FARMERS_MARKET
  VOLUNTEER_DAY
  MEETUP
  FARM_TOUR
  CLASS
  FESTIVAL
  NETWORKING
  OTHER
}

enum EventStatus {
  DRAFT
  UPCOMING
  ONGOING
  COMPLETED
  CANCELLED
}

enum RSVPStatus {
  GOING
  MAYBE
  NOT_GOING
  WAITLIST
}
```

**Acceptance Criteria:**
- [ ] Schema added and migration created
- [ ] Virtual and physical event support
- [ ] RSVP tracking per user
- [ ] Capacity management
- [ ] Payment integration ready

---

#### Task 11.2: Event Management API
**Status:** ❌ Not Started
**Priority:** P2
**Effort:** 3 days

**Requirements:**
- Create/edit/delete events
- Upload event cover photo
- Set capacity limits
- Manage pricing (free/paid)
- Virtual event link generation
- Event status management

**Sub-tasks:**
1. Create `/api/events` endpoint (GET/POST)
2. Create `/api/events/[id]` endpoint (GET/PATCH/DELETE)
3. Add event creation form
4. Add photo upload
5. Integrate with Stripe for paid events
6. Add calendar export (.ics)

**Acceptance Criteria:**
- [ ] POST /api/events creates event
- [ ] Validation: all required fields
- [ ] Photo upload works
- [ ] Can set as virtual or physical
- [ ] Virtual events require meeting link
- [ ] Physical events require address + geocoding
- [ ] Paid events create Stripe products
- [ ] Edit event updates database
- [ ] Cancel event notifies attendees
- [ ] Past events auto-mark COMPLETED
- [ ] Export event to .ics calendar file

**Testing:**
1. Create physical event → saves with location
2. Create virtual event → requires meeting link
3. Upload cover photo → displays
4. Set paid event → Stripe product created
5. Edit event → updates display
6. Cancel event → attendees notified
7. Event passes end date → marked COMPLETED
8. Export event → .ics file downloads

---

#### Task 11.3: RSVP System
**Status:** ❌ Not Started
**Priority:** P2
**Effort:** 2 days

**Requirements:**
- RSVP to events (Going/Maybe/Not Going)
- Guest count (+1, +2, etc.)
- Waitlist for full events
- RSVP notifications to organizer
- Attendee list for organizers
- Event reminders (24h before, 1h before)

**Sub-tasks:**
1. Create `/api/events/[id]/rsvp` endpoint (POST/PATCH)
2. Add RSVP button to event pages
3. Add attendee management for organizers
4. Implement waitlist system
5. Create reminder email job

**Acceptance Criteria:**
- [ ] POST /api/events/[id]/rsvp creates RSVP
- [ ] Can select Going/Maybe/Not Going
- [ ] Can add guest count
- [ ] Attendee count updates on event
- [ ] Full events show waitlist option
- [ ] Organizer sees attendee list
- [ ] Organizer can remove attendees
- [ ] Attendees receive confirmation email
- [ ] Reminder sent 24h before event
- [ ] Reminder sent 1h before event
- [ ] Can cancel RSVP

**Testing:**
1. RSVP to event → status saved
2. Add 2 guests → count updated
3. Event reaches capacity → waitlist button shows
4. Join waitlist → status WAITLIST
5. Someone cancels → waitlist user promoted
6. Organizer views attendees → full list shown
7. Cancel RSVP → removed from list
8. Check email 24h before → reminder received
9. Check email 1h before → reminder received

---

## FEATURE 12: COURSES & KNOWLEDGE HUB

### Status: 🟡 **Partial** (Database exists, needs content system)

### User Stories:
- As an admin, I want to create courses with modules and lessons
- As a user, I want to browse courses by topic
- As a user, I want to enroll in courses
- As a user, I want to track my course progress
- As a user, I want to earn certificates upon completion
- As an instructor, I want to upload course content
- As a user, I want to take quizzes and assessments

### Components:
- `/knowledge` - Course catalog (mock data) ⚠️
- `/knowledge/[courseId]` - Course detail (mock data) ⚠️

### API Endpoints:
- **Need to be created** ❌

### Database Models:
- `Course` - Course metadata ✅ (unused)
- `CourseModule` - Course modules ✅ (unused)
- `CourseProgress` - User progress ✅ (unused)

### Implementation Tasks:

#### Task 12.1: Course Content Management System
**Status:** ❌ Not Started
**Priority:** P2
**Effort:** 5 days

**Requirements:**
- Admin/instructor course creation
- Module and lesson structure
- Video upload (YouTube/Vimeo integration)
- Text content with rich text editor
- Downloadable resources (PDFs, docs)
- Quiz/assessment builder
- Preview mode before publishing
- Course categories and tags

**Sub-tasks:**
1. Create `/api/courses` endpoint (GET/POST)
2. Create `/api/courses/[id]` endpoint (GET/PATCH/DELETE)
3. Create `/api/courses/[id]/modules` endpoint (POST)
4. Create `/api/courses/[id]/modules/[moduleId]/lessons` endpoint (POST)
5. Build course creation wizard (multi-step)
6. Add rich text editor for lessons
7. Add video URL field (YouTube/Vimeo embed)
8. Add file upload for resources
9. Build quiz creator
10. Add course preview mode

**Acceptance Criteria:**
- [ ] POST /api/courses creates course
- [ ] Only ADMIN or INSTRUCTOR role can create
- [ ] Course creation wizard: Info → Modules → Lessons → Pricing → Publish
- [ ] Rich text editor for lesson content
- [ ] Can embed YouTube/Vimeo videos
- [ ] Upload PDFs/docs as resources
- [ ] Create quizzes with multiple question types
- [ ] Preview course before publishing
- [ ] Publish makes course visible
- [ ] Edit course updates content
- [ ] Unpublish hides from catalog

**Testing:**
1. Create course as admin → wizard opens
2. Complete all steps → course created
3. Add 3 modules with lessons → structure saved
4. Embed YouTube video → plays in lesson
5. Upload PDF resource → downloadable
6. Create quiz with 5 questions → saves
7. Preview course → shows as student view
8. Publish course → appears in catalog
9. Try to create as regular user → blocked
10. Edit course → updates successfully

---

#### Task 12.2: Course Enrollment & Progress Tracking
**Status:** ❌ Not Started
**Priority:** P2
**Effort:** 3 days

**Requirements:**
- Enroll in courses (free or paid)
- Track lesson completion
- Track quiz scores
- Calculate overall progress percentage
- Certificate generation on completion
- Resume where you left off
- Bookmark lessons

**Sub-tasks:**
1. Create `/api/courses/[id]/enroll` endpoint (POST)
2. Create `/api/courses/[id]/progress` endpoint (GET/POST)
3. Integrate Stripe for paid course enrollment
4. Add progress tracking UI
5. Build certificate generation (PDF)
6. Add lesson completion tracking
7. Add quiz submission and grading

**Acceptance Criteria:**
- [ ] Click enroll on free course → enrolled immediately
- [ ] Click enroll on paid course → Stripe checkout
- [ ] After payment → enrollment created
- [ ] CourseProgress record created with userId
- [ ] Mark lesson complete → progress updates
- [ ] Progress percentage calculated correctly
- [ ] Dashboard shows enrolled courses with progress
- [ ] Complete all lessons + pass quizzes → 100% progress
- [ ] 100% progress generates certificate
- [ ] Certificate downloadable as PDF
- [ ] Certificate includes: user name, course name, completion date, signature
- [ ] Resume course goes to last lesson viewed
- [ ] Bookmark lesson for later

**Testing:**
1. Enroll in free course → immediate access
2. Enroll in paid course → Stripe checkout, then access
3. Complete lesson → marked complete
4. Check progress → percentage updated
5. Complete all lessons → progress 100%
6. Certificate generated → PDF downloadable
7. Certificate contains correct info
8. Return to course → resumes at last lesson
9. Bookmark lesson → saved to bookmarks
10. Check dashboard → shows all enrolled courses

---

#### Task 12.3: Course Quiz & Assessment System
**Status:** ❌ Not Started
**Priority:** P3
**Effort:** 4 days

**Requirements:**
- Multiple question types (multiple choice, true/false, short answer)
- Auto-grading for objective questions
- Manual grading for subjective questions (instructor)
- Quiz timer option
- Passing score requirements
- Retry attempts
- Show correct answers after submission
- Quiz analytics for instructors

**Sub-tasks:**
1. Create `/api/quizzes` endpoint (POST for instructor)
2. Create `/api/quizzes/[id]/submit` endpoint (POST)
3. Create `/api/quizzes/[id]/grade` endpoint (PATCH for instructor)
4. Build quiz builder interface
5. Build quiz taking interface
6. Add auto-grading logic
7. Add manual grading interface for instructors
8. Add quiz analytics dashboard

**Acceptance Criteria:**
- [ ] Instructor creates quiz with multiple question types
- [ ] Set passing score (e.g., 70%)
- [ ] Set time limit (optional)
- [ ] Set retry attempts (unlimited, 1, 2, 3, etc.)
- [ ] Student takes quiz → timer counts down if set
- [ ] Submit quiz → auto-grade objective questions
- [ ] Subjective questions pending instructor review
- [ ] Instructor grades manually → score updated
- [ ] Pass quiz → unlock next module
- [ ] Fail quiz → can retry if attempts available
- [ ] After submission, show correct answers
- [ ] Highlight wrong answers
- [ ] Store all quiz attempts
- [ ] Instructor sees quiz analytics (avg score, completion rate, question difficulty)

**Testing:**
1. Create quiz with 10 questions → saves
2. Set 70% passing score → configured
3. Set 30-minute timer → timer runs
4. Student takes quiz → timer counts down
5. Submit quiz → auto-graded immediately
6. Score 90% → passed, next module unlocked
7. Fail with 60% → can retry
8. Retry quiz → new attempt recorded
9. Instructor grades short answer → score updated
10. View analytics → accurate statistics

---

## FEATURE 13: GAMIFICATION & ACHIEVEMENTS

### Status: 🟡 **Partial** (Database exists, needs automation)

### User Stories:
- As a user, I want to earn points for activities
- As a user, I want to level up and unlock features
- As a user, I want to earn badges for achievements
- As a user, I want to see my progress on challenges
- As a user, I want to see leaderboards
- As a user, I want to earn unique titles

### Components:
- `/dashboard` - Shows level, points, badges ✅
- `/challenges` - Challenge list (mock data) ⚠️

### API Endpoints:
- Points awarded manually in various endpoints ✅
- **Badge awarding needs automation** ❌

### Database Models:
- `Badge` - Badge definitions ✅
- `UserBadge` - User-earned badges ✅
- `UserActivity` - Activity feed ✅

### Implementation Tasks:

#### Task 13.1: Automated Badge Award System
**Status:** ❌ Not Started
**Priority:** P2
**Effort:** 3 days

**Requirements:**
- Badge criteria evaluation engine
- Automatic badge awards when criteria met
- Notification when badge earned
- Badge progression (Bronze → Silver → Gold → Platinum)
- Rare/legendary badges for special achievements
- Badge showcase on profile
- Badge requirements displayed

**Sub-tasks:**
1. Create badge evaluation service
2. Create `/api/badges/check` endpoint (called after activities)
3. Define badge criteria in database
4. Create badge award notification
5. Add badge showcase component
6. Add badge gallery page
7. Add badge progress indicators

**Badge Types to Implement:**
- **First Steps**: Create account, complete onboarding, upload avatar
- **Plot Master**: List 1/5/10/25 plots
- **Booking Pro**: Complete 1/5/10/25 bookings
- **Green Thumb**: 10/25/50/100 journal entries
- **Helpful Hand**: Receive 10/25/50/100 review upvotes
- **Social Butterfly**: Follow 10/25/50/100 users
- **Marketplace Maven**: Sell $100/$500/$1000/$5000 worth of produce
- **Tool Sharer**: Rent out tools 5/10/25/50 times
- **Community Champion**: Post 10/25/50/100 forum topics
- **Wise Owl**: Earn 5/10/25/50 accepted forum answers
- **Student**: Complete 1/3/5/10 courses
- **Instructor**: Create 1/3/5/10 courses
- **Event Organizer**: Host 1/5/10/25 events
- **Social Grower**: Attend 5/10/25/50 events
- **Streak Master**: Log journal entries 7/30/100/365 days in a row

**Acceptance Criteria:**
- [ ] Badge criteria defined in database
- [ ] Complete activity → check badge criteria
- [ ] Criteria met → badge awarded automatically
- [ ] Notification sent when badge earned
- [ ] Badge appears on profile immediately
- [ ] Badge progression works (earn higher tiers)
- [ ] Badge showcase shows earned + locked badges
- [ ] Locked badges show progress (e.g., "5/10 bookings")
- [ ] Badge gallery page shows all available badges
- [ ] Badge rarity indicated (common, uncommon, rare, epic, legendary)

**Testing:**
1. Create 1st plot → earn "First Plot" badge
2. Create 5th plot → earn Bronze Plot Master
3. Create 10th plot → earn Silver Plot Master
4. Check notification → badge earned message
5. View profile → badge displays
6. View badge gallery → shows progress on locked badges
7. Complete 7-day journal streak → earn Streak Starter
8. Miss a day → streak resets
9. Forum answer accepted → progress toward Wise Owl
10. Earn 50th badge → unlock special title

---

#### Task 13.2: Leaderboard System
**Status:** ❌ Not Started
**Priority:** P3
**Effort:** 2 days

**Requirements:**
- Global leaderboard (top users by points)
- Category leaderboards (plots, marketplace, journals, forum)
- Time-based leaderboards (daily, weekly, monthly, all-time)
- Friend leaderboards (compare with followers)
- Location-based leaderboards (state, city, zip)
- Leaderboard rewards (top 10 get badge)

**Sub-tasks:**
1. Create `/api/leaderboard` endpoint (GET with filters)
2. Create leaderboard page
3. Add leaderboard categories
4. Add time period filter
5. Add location filter
6. Add friend filter
7. Implement weekly/monthly reset
8. Award leaderboard badges

**Acceptance Criteria:**
- [ ] GET /api/leaderboard returns ranked users
- [ ] Default: all-time global leaderboard
- [ ] Filter by category (plots, marketplace, etc.)
- [ ] Filter by time (week, month, all-time)
- [ ] Filter by location (state, city)
- [ ] Filter to friends only
- [ ] Shows rank, username, avatar, points
- [ ] Shows user's current rank
- [ ] Pagination (50 per page)
- [ ] Real-time updates (cache 5 minutes)
- [ ] Top 10 weekly earn "Top Contributor" badge
- [ ] Top 3 monthly earn special titles

**Testing:**
1. View leaderboard → shows top users
2. Filter by "This Week" → only weekly points
3. Filter by marketplace → only marketplace activity
4. Filter to friends → only followed users
5. Find my rank → highlighted in list
6. Week ends → leaderboard resets
7. Check top 10 → badges awarded
8. Top 3 monthly → special titles awarded

---

#### Task 13.3: Challenge System
**Status:** ❌ Not Started
**Priority:** P3
**Effort:** 4 days

**Requirements:**
- Create challenges with tasks
- Join challenges (individual or team)
- Track challenge progress
- Complete challenges for rewards
- Seasonal/limited-time challenges
- Team challenges with combined progress
- Challenge leaderboards

**Sub-tasks:**
1. Create Challenge database schema
2. Create `/api/challenges` endpoint (GET/POST)
3. Create `/api/challenges/[id]/join` endpoint (POST)
4. Create `/api/challenges/[id]/progress` endpoint (GET/POST)
5. Build challenge creation interface (admin)
6. Build challenge browsing interface
7. Build challenge progress tracker
8. Add team challenge coordination
9. Award challenge completion rewards

**Schema Design:**
```prisma
model Challenge {
  id            String          @id @default(cuid())
  title         String
  description   String
  category      ChallengeCategory
  difficulty    ChallengeDifficulty
  type          ChallengeType   // INDIVIDUAL, TEAM, COMMUNITY

  tasks         ChallengeTask[]

  startDate     DateTime
  endDate       DateTime

  rewards       Json            // Points, badges, titles
  participantLimit Int?

  participants  ChallengeParticipant[]

  status        ChallengeStatus @default(ACTIVE)

  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
}

model ChallengeTask {
  id            String          @id @default(cuid())
  challengeId   String
  challenge     Challenge       @relation(fields: [challengeId], references: [id])

  title         String
  description   String
  targetCount   Int             // e.g., "Plant 10 seeds"

  sortOrder     Int

  @@index([challengeId])
}

model ChallengeParticipant {
  id            String          @id @default(cuid())
  challengeId   String
  challenge     Challenge       @relation(fields: [challengeId], references: [id])
  userId        String
  user          User            @relation(fields: [userId], references: [id])

  teamName      String?         // For team challenges

  progress      Json            // Task completion tracking
  completedAt   DateTime?

  createdAt     DateTime        @default(now())

  @@unique([challengeId, userId])
  @@index([challengeId])
  @@index([userId])
}
```

**Acceptance Criteria:**
- [ ] Admin creates challenge with tasks
- [ ] User joins challenge → participant created
- [ ] Task completion tracked automatically
- [ ] Progress displayed as percentage
- [ ] Complete all tasks → mark challenge complete
- [ ] Rewards awarded on completion
- [ ] Team challenges aggregate team progress
- [ ] Challenge leaderboard shows top participants
- [ ] Expired challenges marked COMPLETED
- [ ] Seasonal challenges recur annually

**Testing:**
1. Create challenge with 5 tasks → saves
2. Join challenge → participant record created
3. Complete task → progress updates
4. Check progress → percentage correct
5. Complete all tasks → challenge complete
6. Rewards awarded → points, badge received
7. Join team challenge → team formed
8. Team members contribute → team progress increases
9. Challenge expires → marked COMPLETED
10. View challenge history → shows completed challenges

---

## FEATURE 14: NOTIFICATIONS & EMAIL

### Status: 🟡 **Partial** (In-app complete, emails missing)

### User Stories:
- As a user, I want in-app notifications for all activities
- As a user, I want email notifications for important events
- As a user, I want to control notification preferences
- As a user, I want to mark notifications as read
- As a user, I want notification grouping (digest mode)

### Components:
- `/notifications` - Notification center ✅
- Notification dropdown in header ✅

### API Endpoints:
- `GET /api/notifications` - Get notifications ✅
- `PATCH /api/notifications` - Mark as read ✅
- `GET /api/notifications/unread-count` - Unread count ✅

### Database Models:
- `Notification` - Notification records ✅

### Implementation Tasks:

#### Task 14.1: Email Notification System
**Status:** ❌ Not Started
**Priority:** P0 (Critical)
**Effort:** 4 days

**Requirements:**
- SMTP service integration (SendGrid/AWS SES)
- Email templates for all notification types
- HTML email design (responsive)
- Plain text fallback
- Unsubscribe links
- Email delivery tracking
- Batch sending for digests
- Retry failed sends

**Email Templates Needed:**
- Welcome email
- Booking request (to owner)
- Booking approved/rejected (to renter)
- Booking reminder (24h before start)
- Message received
- Review received
- Payment received
- Forum reply notification
- Event reminder
- Challenge progress update
- Badge earned
- Weekly activity digest

**Sub-tasks:**
1. Configure SMTP service (SendGrid recommended)
2. Create email template system (React Email or MJML)
3. Create 12+ email templates
4. Create `/lib/email/send.ts` service
5. Integrate email sending into notification system
6. Add email preference settings
7. Create email queue system (Bull/Redis)
8. Add email delivery tracking
9. Create unsubscribe functionality
10. Create weekly digest job

**Acceptance Criteria:**
- [ ] SMTP service configured and tested
- [ ] All email templates created and branded
- [ ] HTML templates responsive on mobile
- [ ] Plain text fallback for all templates
- [ ] Email sent for each notification type
- [ ] Users can opt out of email types
- [ ] Unsubscribe link in all emails
- [ ] Unsubscribe saves preference
- [ ] Failed emails retried 3 times
- [ ] Email delivery status tracked
- [ ] Digest mode combines notifications
- [ ] Weekly digest sent on Sundays

**Testing:**
1. Trigger each notification type → email sent
2. Check email design → looks good on mobile
3. Disable email for notification type → no email sent
4. Click unsubscribe → preference saved
5. Trigger notification with email failure → retries
6. Enable digest mode → emails batched
7. Sunday arrives → weekly digest sent
8. Check email contains correct data and links
9. Click email link → navigates to correct page
10. Test with Gmail, Outlook, Yahoo, Apple Mail

---

#### Task 14.2: Push Notifications (Progressive Web App)
**Status:** ❌ Not Started
**Priority:** P3 (Future enhancement)
**Effort:** 3 days

**Requirements:**
- Service worker for push notifications
- Web push subscription
- Browser notification permission request
- Push notification delivery
- Icon and badge support
- Action buttons in notifications
- Notification click handling

**Note:** This is a future enhancement and not required for MVP launch.

---

#### Task 14.3: Notification Preferences
**Status:** ❌ Not Started
**Priority:** P2
**Effort:** 1 day

**Requirements:**
- Notification settings page
- Toggle each notification type on/off
- Separate in-app vs email preferences
- Digest mode toggle
- Quiet hours setting
- Notification frequency limits

**Sub-tasks:**
1. Create `/settings/notifications` page
2. Add notification preference fields to User model
3. Create `/api/settings/notifications` endpoint (PATCH)
4. Add preference checks before sending notifications
5. Add quiet hours logic
6. Add frequency limit logic (max N per hour)

**Acceptance Criteria:**
- [ ] Notification settings page accessible
- [ ] Each notification type has toggle
- [ ] Separate toggles for in-app and email
- [ ] Digest mode toggle (daily/weekly)
- [ ] Quiet hours setting (e.g., 10 PM - 8 AM)
- [ ] Frequency limit setting (e.g., max 5/hour)
- [ ] Preferences save immediately
- [ ] During quiet hours, notifications queued
- [ ] Frequency limit respected
- [ ] Can "Disable All" with one click

**Testing:**
1. Toggle off booking notifications → no notifications sent
2. Toggle off email only → in-app still works
3. Enable digest mode → emails batched
4. Set quiet hours 10 PM - 8 AM → no notifications during
5. Set frequency to 5/hour → 6th notification queued
6. Click "Disable All" → all toggles off
7. Save preferences → persists after logout

---

## FEATURE 15: SEARCH & DISCOVERY

### Status: 🟡 **Partial** (Basic search exists, needs enhancement)

### User Stories:
- As a user, I want to search across all content types
- As a user, I want advanced filters for each type
- As a user, I want to save searches
- As a user, I want search suggestions as I type
- As a user, I want to discover recommended content

### Implementation Tasks:

#### Task 15.1: Global Search
**Status:** ❌ Not Started
**Priority:** P2
**Effort:** 3 days

**Requirements:**
- Search bar in header
- Search across: plots, users, marketplace, tools, courses, events, forum
- Results grouped by type
- Type-ahead suggestions
- Recent searches
- Saved searches
- Search history

**Sub-tasks:**
1. Create `/api/search` endpoint (GET)
2. Implement full-text search on relevant tables
3. Add search bar to header
4. Create search results page
5. Add type-ahead with suggestions
6. Add saved searches functionality
7. Add search history tracking

**Acceptance Criteria:**
- [ ] Search bar in header always visible
- [ ] Type 3+ characters → suggestions appear
- [ ] Suggestions from all content types
- [ ] Press Enter → navigate to results page
- [ ] Results grouped by type (Plots, Users, etc.)
- [ ] Can filter results by type
- [ ] Click "Save Search" → saved to profile
- [ ] Recent searches show in dropdown
- [ ] Search history tracked (last 10)
- [ ] Clear history option
- [ ] Search analytics (popular searches)

**Testing:**
1. Type "tomato" → suggestions appear
2. Press Enter → results page loads
3. Results include plots, marketplace, forum posts
4. Filter to plots only → other types hidden
5. Save search → accessible from profile
6. Search again → appears in recent searches
7. Clear history → recent searches removed

---

#### Task 15.2: Recommendation Engine
**Status:** ❌ Not Started
**Priority:** P3
**Effort:** 4 days

**Requirements:**
- Recommended plots based on past bookings
- Recommended users to follow based on interests
- Recommended courses based on activity
- Recommended forum topics based on reading history
- "Users also viewed" on plot pages
- "Similar plots" suggestions
- Personalized homepage

**Sub-tasks:**
1. Create recommendation algorithm
2. Create `/api/recommendations` endpoint (GET)
3. Add "Recommended for You" sections
4. Add "Similar Items" sections
5. Track user behavior for recommendations
6. Implement collaborative filtering
7. Personalize homepage

**Acceptance Criteria:**
- [ ] Homepage shows personalized recommendations
- [ ] "Recommended Plots" based on past views/bookings
- [ ] "Users to Follow" based on similar interests
- [ ] "Courses You Might Like" based on activity
- [ ] Plot pages show "Similar Plots"
- [ ] Plot pages show "Users Also Viewed"
- [ ] Recommendations update as behavior changes
- [ ] Can dismiss recommendations
- [ ] "Why this recommendation?" tooltip

**Testing:**
1. Book urban garden plot → recommended similar plots
2. Follow users in category → suggested similar users
3. Take beginner course → suggested intermediate courses
4. View plot → similar plots appear below
5. Dismiss recommendation → no longer shows
6. Check homepage → personalized content
7. New user → generic popular content shown

---

## FEATURE 16: ADMIN DASHBOARD

### Status: ❌ **Not Started**

### User Stories:
- As an admin, I want to view platform statistics
- As an admin, I want to manage users (ban, verify)
- As an admin, I want to moderate content (remove inappropriate)
- As an admin, I want to review verification requests
- As an admin, I want to manage platform settings
- As an admin, I want to view revenue analytics

### Implementation Tasks:

#### Task 16.1: Admin Dashboard
**Status:** ❌ Not Started
**Priority:** P2
**Effort:** 5 days

**Requirements:**
- Admin-only route protection
- Dashboard with key metrics
- User management
- Content moderation queue
- Verification review queue
- Platform settings
- Revenue analytics
- Activity logs

**Sub-tasks:**
1. Create `/admin` route with auth check
2. Create admin dashboard layout
3. Add metrics widgets (users, plots, bookings, revenue)
4. Create user management page
5. Create content moderation queue
6. Create verification review page
7. Create platform settings page
8. Create activity logs page
9. Add admin role checks to all admin endpoints

**Metrics to Display:**
- Total users (new this week/month)
- Total plots (active, pending)
- Total bookings (pending, active, completed)
- Revenue (this month, all-time)
- Marketplace sales
- Course enrollments
- Forum activity
- Event attendance
- Top performing plots
- Top sellers
- Most active users

**Acceptance Criteria:**
- [ ] /admin route only accessible to ADMIN role
- [ ] Dashboard shows all key metrics
- [ ] Metrics update in real-time
- [ ] User management: search, filter, view, ban, verify
- [ ] Content moderation: review flagged items
- [ ] Verification queue: approve/reject requests
- [ ] Platform settings: site name, fees, features
- [ ] Revenue analytics: charts and tables
- [ ] Activity logs: all admin actions recorded
- [ ] Export data to CSV

**Testing:**
1. Login as admin → access /admin
2. Login as regular user → 403 forbidden
3. Dashboard loads → all metrics accurate
4. Search users → find and view
5. Ban user → account disabled
6. Review flagged content → approve/remove
7. Review verification → approve/reject
8. Change platform fee → updates globally
9. View activity logs → all actions logged
10. Export data → CSV downloads

---

## FEATURE 17: MOBILE RESPONSIVENESS & PWA

### Status: 🟡 **Partial** (Responsive design exists, PWA missing)

### Implementation Tasks:

#### Task 17.1: Progressive Web App Setup
**Status:** ❌ Not Started
**Priority:** P2
**Effort:** 2 days

**Requirements:**
- Service worker for offline support
- App manifest for install prompt
- Offline fallback pages
- Cache strategy for static assets
- Background sync for pending actions
- App icon and splash screens

**Sub-tasks:**
1. Create service worker
2. Create app manifest
3. Add offline fallback page
4. Configure cache strategy
5. Add install prompt
6. Create app icons (multiple sizes)
7. Test offline functionality

**Acceptance Criteria:**
- [ ] Service worker registered
- [ ] App manifest configured
- [ ] Install prompt shows on mobile
- [ ] Can install as app on home screen
- [ ] Offline mode shows fallback page
- [ ] Static assets cached
- [ ] Background sync for messages/posts
- [ ] App icons all sizes (192x192, 512x512, etc.)
- [ ] Splash screen configured
- [ ] Works on iOS and Android

**Testing:**
1. Visit site on mobile → install prompt appears
2. Install app → icon on home screen
3. Open app → launches like native app
4. Go offline → fallback page shows
5. Post message while offline → syncs when online
6. Check cache → static assets stored
7. Test on iPhone → works
8. Test on Android → works

---

#### Task 17.2: Mobile UI/UX Polish
**Status:** 🔧 Needs Review
**Priority:** P1
**Effort:** 3 days

**Requirements:**
- Review all pages on mobile (< 768px)
- Fix any layout issues
- Optimize touch targets (min 44x44px)
- Add mobile-specific navigation
- Optimize images for mobile
- Reduce mobile page weight

**Acceptance Criteria:**
- [ ] All pages reviewed on mobile
- [ ] No horizontal scroll
- [ ] All buttons/links tappable (min 44px)
- [ ] Forms usable on mobile
- [ ] Images load fast on mobile (< 2s)
- [ ] Mobile navigation optimized
- [ ] Bottom nav or hamburger menu
- [ ] Lighthouse mobile score > 90

**Testing:**
1. Test all pages on mobile devices
2. Check touch target sizes → all adequate
3. Test forms → easy to complete
4. Measure page load → under 2 seconds
5. Check Lighthouse mobile score → above 90

---

## FEATURE 18: ANALYTICS & INSIGHTS

### Status: ❌ **Not Started**

### User Stories:
- As a user, I want to see my activity statistics
- As a landowner, I want to see plot performance analytics
- As a seller, I want to see sales analytics
- As a user, I want to see my impact (produce grown, etc.)

### Implementation Tasks:

#### Task 18.1: User Analytics Dashboard
**Status:** ❌ Not Started
**Priority:** P3
**Effort:** 3 days

**Requirements:**
- Personal statistics page
- Activity over time (graphs)
- Earnings summary
- Impact metrics (food grown, land rented, etc.)
- Comparisons to community averages
- Export personal data (GDPR compliance)

**Acceptance Criteria:**
- [ ] Analytics page accessible from dashboard
- [ ] Shows activity graphs (7/30/90 days)
- [ ] Earnings by month (plots, marketplace, tools)
- [ ] Impact metrics with visualizations
- [ ] Compare to community averages
- [ ] Export all personal data as JSON/CSV
- [ ] Data downloadable for GDPR compliance

---

## FEATURE 19: HELP & SUPPORT

### Status: ❌ **Not Started**

### Implementation Tasks:

#### Task 19.1: Help Center
**Status:** ❌ Not Started
**Priority:** P2
**Effort:** 2 days

**Requirements:**
- FAQ page
- Knowledge base articles
- Contact support form
- Live chat (Intercom/Crisp integration)
- Video tutorials
- Onboarding tours

**Acceptance Criteria:**
- [ ] Help center accessible from footer/header
- [ ] FAQ with categorized questions
- [ ] Search knowledge base
- [ ] Contact form sends to support email
- [ ] Live chat integration (optional)
- [ ] Video tutorials embedded
- [ ] First-time users see onboarding tour

---

## FEATURE 20: LEGAL & COMPLIANCE

### Status: 🟡 **Partial** (Basic pages exist, need legal review)

### Implementation Tasks:

#### Task 20.1: Legal Pages & Compliance
**Status:** ❌ Not Started
**Priority:** P1 (Required for launch)
**Effort:** 2 days

**Requirements:**
- Terms of Service
- Privacy Policy
- Cookie Policy
- GDPR compliance
- CCPA compliance
- Cookie consent banner
- Data deletion requests

**Acceptance Criteria:**
- [ ] Terms of Service page (legal review required)
- [ ] Privacy Policy page (legal review required)
- [ ] Cookie Policy page
- [ ] Cookie consent banner on first visit
- [ ] Accept/reject cookies functionality
- [ ] GDPR data export functionality (Task 18.1)
- [ ] GDPR data deletion request form
- [ ] CCPA "Do Not Sell" link for California users
- [ ] Age verification (13+ or 18+ depending on jurisdiction)

---

## DEPLOYMENT & DEVOPS

### Implementation Tasks:

#### Task 21.1: Production Database Setup
**Status:** ❌ Not Started
**Priority:** P0 (Required for launch)
**Effort:** 1 day

**Requirements:**
- PostgreSQL database with PostGIS
- Connection pooling (PgBouncer)
- Database backups (daily)
- Database monitoring
- Read replicas (future)

**Acceptance Criteria:**
- [ ] Production database provisioned
- [ ] PostGIS extension enabled
- [ ] Connection pooling configured
- [ ] Automated daily backups
- [ ] Backup retention: 30 days
- [ ] Database monitoring alerts
- [ ] Connection pool size optimized
- [ ] SSL/TLS connections enforced

---

#### Task 21.2: CI/CD Pipeline
**Status:** ❌ Not Started
**Priority:** P1
**Effort:** 2 days

**Requirements:**
- GitHub Actions workflow
- Automated testing on PR
- Automated deployment to staging
- Manual promotion to production
- Database migrations in pipeline
- Environment variable management

**Acceptance Criteria:**
- [ ] GitHub Actions workflow configured
- [ ] Tests run on every PR
- [ ] PR merge triggers staging deploy
- [ ] Staging deployment automatic
- [ ] Production deployment manual approval
- [ ] Database migrations run automatically
- [ ] Environment variables secured
- [ ] Rollback capability

---

#### Task 21.3: Monitoring & Logging
**Status:** ❌ Not Started
**Priority:** P1
**Effort:** 2 days

**Requirements:**
- Error tracking (Sentry)
- Application logs (Logtail/Datadog)
- Performance monitoring (Vercel Analytics)
- Uptime monitoring (UptimeRobot)
- Database monitoring
- Alert configuration

**Acceptance Criteria:**
- [ ] Sentry integrated for error tracking
- [ ] Logging service configured
- [ ] Performance monitoring active
- [ ] Uptime monitoring configured
- [ ] Alerts sent to email/Slack
- [ ] Database slow query alerts
- [ ] Error rate alerts
- [ ] Disk space alerts

---

#### Task 21.4: Security Hardening
**Status:** ❌ Not Started
**Priority:** P0 (Critical)
**Effort:** 3 days

**Requirements:**
- Security headers (CSP, HSTS, etc.)
- Rate limiting
- SQL injection prevention
- XSS prevention
- CSRF protection
- Secrets management
- Security audit
- Penetration testing

**Acceptance Criteria:**
- [ ] Security headers configured
- [ ] Rate limiting on all API routes
- [ ] Prisma prevents SQL injection
- [ ] React/Next.js prevents XSS by default
- [ ] CSRF tokens on state-changing requests
- [ ] Secrets stored in environment variables
- [ ] No secrets in code/git
- [ ] Security audit completed
- [ ] Penetration test passed
- [ ] Vulnerability scanning automated

---

## PERFORMANCE OPTIMIZATION

#### Task 22.1: Performance Optimization
**Status:** ❌ Not Started
**Priority:** P1
**Effort:** 3 days

**Requirements:**
- Image optimization (WebP, lazy loading)
- Code splitting and lazy loading
- Database query optimization
- Caching strategy (Redis)
- CDN for static assets
- Bundle size reduction

**Acceptance Criteria:**
- [ ] All images converted to WebP with fallback
- [ ] Images lazy loaded below fold
- [ ] Code split by route
- [ ] Heavy components lazy loaded
- [ ] Database queries optimized (no N+1)
- [ ] Redis caching for frequent queries
- [ ] Static assets on CDN
- [ ] Bundle size < 200KB initial load
- [ ] Lighthouse performance > 90

---

## TESTING STANDARDS

### Unit Testing
- [ ] All utility functions have unit tests
- [ ] Test coverage > 80%
- [ ] Run: `npm test`

### Integration Testing
- [ ] All API endpoints have integration tests
- [ ] Database operations tested
- [ ] Run: `npm run test:integration`

### E2E Testing
- [ ] Critical user flows have E2E tests (Playwright/Cypress)
- [ ] Test: signup → create plot → make booking → payment
- [ ] Run: `npm run test:e2e`

### Manual Testing Checklist
See QUICK_TEST_GUIDE.md for detailed manual test scenarios.

---

## GO/NO-GO LAUNCH CRITERIA

### Must Have (P0 - Critical):
- [ ] Authentication working (Clerk integration)
- [ ] Plot management fully functional
- [ ] Booking system with payments (Stripe)
- [ ] Messaging system
- [ ] Reviews and ratings
- [ ] Email notifications
- [ ] Photo uploads (Cloudinary)
- [ ] Weather API integration (journals)
- [ ] Marketplace with orders (database-backed)
- [ ] Tools rental system (database-backed)
- [ ] Community forums (database-backed)
- [ ] Production database setup
- [ ] Security hardening complete
- [ ] Legal pages (ToS, Privacy) with legal review
- [ ] Performance targets met
- [ ] All P0 bugs fixed
- [ ] Manual test scenarios pass

### Should Have (P1 - Important):
- [ ] Events system
- [ ] Courses with content
- [ ] Badge automation
- [ ] Verification system
- [ ] Admin dashboard
- [ ] Mobile PWA
- [ ] CI/CD pipeline
- [ ] Monitoring & logging
- [ ] Help center
- [ ] Search functionality

### Nice to Have (P2-P3):
- [ ] Leaderboards
- [ ] Challenges
- [ ] Advanced analytics
- [ ] Recommendation engine
- [ ] Push notifications
- [ ] Video tutorials

---

## SUMMARY & NEXT STEPS

### Current Status:
- **Complete Features:** 10 (authentication, plots, bookings, messaging, reviews, profiles, journals, posts, notifications, gamification foundation)
- **Partial Features:** 6 (marketplace, tools, courses, admin, mobile, analytics)
- **Not Started:** 10+ (forums, events, search, recommendations, etc.)

### Estimated Remaining Effort:
- **P0 Critical Tasks:** ~40 days
- **P1 Important Tasks:** ~30 days
- **P2-P3 Nice-to-Have:** ~20 days
- **Total:** ~90 development days (3-4 months with 1 developer)

### Recommended Launch Phases:

**Phase 1 - MVP Launch (Target: 6-8 weeks)**
- Focus on P0 critical tasks
- Core features: plots, bookings, payments, messaging, reviews
- Basic marketplace and tools
- Essential infrastructure

**Phase 2 - Community & Engagement (Target: +4 weeks)**
- Forums, events, courses
- Enhanced gamification
- Social features

**Phase 3 - Optimization & Growth (Target: +4 weeks)**
- Advanced features
- Analytics and insights
- Recommendation engine
- Marketing tools

---

*End of Product Requirements Document*

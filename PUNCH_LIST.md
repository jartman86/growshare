# GrowShare Launch Punch List

**Target:** User Onboarding Ready
**Created:** January 25, 2026

---

## What's Already Complete

All core features are implemented and production-ready:
- ✅ Authentication (Clerk) with user sync
- ✅ Plot Management (CRUD, map, filters, publish)
- ✅ Booking System with Stripe payments
- ✅ Stripe Connect for landowner payouts
- ✅ Photo uploads via Cloudinary
- ✅ Marketplace (produce listings + orders)
- ✅ Tool rentals with booking
- ✅ Forum with topics, replies, voting
- ✅ Reviews & ratings
- ✅ Messaging system
- ✅ In-app notifications
- ✅ Email notifications (8 templates via SendGrid)
- ✅ Phone/ID verification
- ✅ Dark mode
- ✅ Privacy controls (block users, visibility)

---

## Pre-Launch Checklist

### Infrastructure
- [ ] Verify all environment variables set in production
- [ ] Test Stripe in live mode (switch from test keys)
- [ ] Verify SendGrid sender domain authenticated
- [ ] Verify Twilio phone number for SMS
- [ ] Database backups configured
- [ ] SSL certificate valid
- [ ] Error monitoring (Sentry) configured

### Testing
- [ ] Full user flow: Sign up → List plot → Get booking → Get paid
- [ ] Full user flow: Sign up → Browse → Book plot → Pay
- [ ] Marketplace: List produce → Receive order → Fulfill
- [ ] Tool rental: List tool → Rent out → Return
- [ ] Forum: Create topic → Get replies → Mark solved
- [ ] Email delivery test (all 8 templates)
- [ ] Mobile responsiveness check (all major pages)
- [ ] Cross-browser test (Chrome, Safari, Firefox)

### Content
- [ ] Remove any test/sample data from production DB
- [ ] Finalize Terms of Service (`/terms`)
- [ ] Finalize Privacy Policy (`/privacy`)
- [ ] Verify all placeholder text is replaced

### Quick Polish
- [ ] Add favicon and app icons
- [ ] Verify 404 page looks good
- [ ] Check loading states on buttons
- [ ] Verify empty states on all list pages

---

## Post-Launch Features (P1)

### Admin Dashboard
**Effort:** 3-5 days

- [ ] `/admin` route with role protection
- [ ] User list with search and ban capability
- [ ] View all plots, bookings, orders
- [ ] Moderation queue for flagged content
- [ ] Platform statistics (users, revenue)

### Events System
**Effort:** 3-4 days

- [ ] Event database schema + API
- [ ] Create/edit events
- [ ] RSVP functionality
- [ ] Event calendar view
- [ ] Event reminders

---

## Future Enhancements (P2/P3)

| Feature | Priority | Effort |
|---------|----------|--------|
| Course content management | P2 | 5 days |
| Real-time messaging (WebSocket) | P2 | 2-3 days |
| Leaderboards | P3 | 2 days |
| Challenge system | P3 | 4 days |
| PWA support | P3 | 2 days |
| Weather API integration | P3 | 1 day |
| Badge automation | P3 | 3 days |

---

## Launch Ready

The app is essentially **ready to launch**. The remaining items are:
1. Production environment setup (env vars, live Stripe keys)
2. Final testing of payment flows
3. Content review (terms, privacy, remove test data)
4. Quick polish items

**Estimated time to launch:** 1-2 days of prep work

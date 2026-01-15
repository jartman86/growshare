# Quick Testing Guide - Phase 1 MVP

## 🚀 Pre-Testing Setup

### 1. Apply Database Migration (REQUIRED)

The Notification table needs to be added to the database:

```bash
# Option A: Using Prisma (if engine downloads work)
npx prisma generate
npx prisma db push

# Option B: Manual SQL (if Prisma fails)
# Run the SQL file directly against your PostgreSQL database
psql $DATABASE_URL -f prisma/migrations/manual/add_notifications.sql
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Prepare Test Data

You'll need:
- **2 user accounts** (one owner, one renter)
- **At least 1 plot** listed by the owner
- **Complete at least 1 booking** (to test reviews)

---

## 🧪 Quick Test Scenarios

### Test 1: Complete Booking Flow (5 min)

**As Renter:**
1. Go to `/explore`
2. Click on a plot
3. Select dates and create booking
4. ✅ Check: "Booking created" message appears
5. ✅ Check: Points increased by 25

**As Owner:**
6. Go to `/manage-bookings`
7. See the pending booking
8. Click "Approve"
9. ✅ Check: Booking status changes to APPROVED
10. ✅ Check: Points increased by 15

**As Renter:**
11. Open notification dropdown (bell icon)
12. ✅ Check: "Booking Approved" notification appears
13. Click notification
14. ✅ Check: Navigates to bookings page

---

### Test 2: Messaging System (3 min)

**From Booking:**
1. Go to `/my-bookings`
2. Click "Contact Owner" on any booking
3. ✅ Check: Opens `/messages?userId=...`
4. Type and send a message
5. ✅ Check: Message appears in thread

**As Receiver:**
6. Check notification bell
7. ✅ Check: "New Message" notification appears
8. Click notification
9. ✅ Check: Opens messages page

---

### Test 3: Reviews & Ratings (4 min)

**Setup:**
1. Manually set a booking status to COMPLETED in database OR wait for booking period to end

**As Renter:**
2. Go to `/my-bookings`
3. Find completed booking
4. ✅ Check: "Leave a Review" button shows
5. Click button
6. Rate 5 stars and write review (min 20 chars)
7. Submit review
8. ✅ Check: Review submits successfully
9. ✅ Check: Points increased by 10

**Verification:**
10. Go to plot detail page
11. ✅ Check: Review appears in reviews section
12. ✅ Check: Average rating updated

**As Plot Owner:**
13. Check notifications
14. ✅ Check: "New Review" notification appears

---

### Test 4: Notification System (2 min)

**Check Notification Bell:**
1. Look at header bell icon
2. ✅ Check: Badge shows unread count
3. Click bell
4. ✅ Check: Dropdown opens with notifications
5. ✅ Check: Unread notifications highlighted (blue background)
6. ✅ Check: Timestamps show (e.g., "2 minutes ago")

**Test Actions:**
7. Click "Mark all as read"
8. ✅ Check: All notifications turn to read state
9. ✅ Check: Badge disappears
10. Click a notification with a link
11. ✅ Check: Navigates to correct page

---

### Test 5: Booking Cancellation (2 min)

**As Renter (or Owner):**
1. Go to bookings page
2. Find PENDING or APPROVED booking
3. Click "Cancel Booking"
4. ✅ Check: Status changes to CANCELLED

**As Other Party:**
5. Check notifications
6. ✅ Check: "Booking Cancelled" notification received

---

## 🐛 Common Issues & Fixes

### Issue: Notification table doesn't exist
**Symptom:** API errors mentioning "Notification"
**Fix:** Run the database migration (see step 1 above)

### Issue: Messages API returns 404
**Symptom:** POST /api/messages 404
**Fix:** Restart Next.js dev server to pick up new routes

### Issue: Points not updating
**Symptom:** User points don't increase
**Fix:** Check database directly: `SELECT totalPoints FROM "User" WHERE id = '...'`

### Issue: Notifications don't appear
**Symptom:** Bell icon shows 0 unread
**Fix:**
1. Check browser console for API errors
2. Verify `/api/notifications/unread-count` returns data
3. Check database: `SELECT * FROM "Notification" WHERE "isRead" = false`

---

## ✅ Success Criteria

Phase 1 MVP is ready when:
- [ ] All 5 test scenarios pass
- [ ] No console errors during testing
- [ ] Notifications appear for all actions
- [ ] Points system works correctly
- [ ] UI is responsive and polished

---

## 📊 Testing Checklist

Copy this to track your testing:

```
[ ] Database migration applied
[ ] Dev server running
[ ] Test data created (2 users, 1+ plots)

Critical Flows:
[ ] Booking creation works
[ ] Booking approval/rejection works
[ ] Messaging works (renter ↔ owner)
[ ] Reviews can be submitted
[ ] Reviews appear on plot pages
[ ] Notifications appear for all actions
[ ] Notification bell badge shows count
[ ] Mark as read works
[ ] Cancellation works

UI/UX:
[ ] Loading states show
[ ] Error messages are clear
[ ] Success feedback provided
[ ] Mobile responsive
[ ] No layout issues
```

---

## 🎯 Next Steps After Testing

1. **Document Bugs**: Note any issues found
2. **Fix Critical Bugs**: Address blocking issues
3. **Polish UI**: Improve based on testing feedback
4. **Create PR**: Once stable, create pull request
5. **Phase 2**: Plan next features

---

## 💡 Tips

- **Use Browser DevTools**: Check Network tab for API errors
- **Check Console**: Look for JavaScript errors
- **Database Queries**: Verify data is saving correctly
- **Multiple Browsers**: Test in different browsers
- **Clear Cache**: If changes don't appear, clear cache/hard refresh

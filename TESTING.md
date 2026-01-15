# Phase 1 MVP Testing Checklist

## 🎯 Critical User Flows

### Flow 1: Complete Booking Journey
- [ ] **Browse & Search**
  - [ ] User can view plots on /explore
  - [ ] Plot cards show key info (price, location, rating)
  - [ ] Click on plot navigates to detail page

- [ ] **Plot Detail Page**
  - [ ] Images load correctly
  - [ ] Price, amenities, and description display
  - [ ] Reviews section shows existing reviews
  - [ ] Booking card is functional

- [ ] **Create Booking**
  - [ ] Select start and end dates
  - [ ] Total price calculates correctly
  - [ ] Submit booking (status: PENDING or APPROVED)
  - [ ] User receives 25 points
  - [ ] ✅ Owner receives notification (if not instant book)

- [ ] **Booking Approval (Owner)**
  - [ ] Navigate to /manage-bookings
  - [ ] See pending booking requests
  - [ ] Click "Approve" button
  - [ ] Owner receives 15 points
  - [ ] ✅ Renter receives "Booking Approved" notification

- [ ] **Booking Rejection (Owner)**
  - [ ] Click "Reject" button on pending booking
  - [ ] Booking status updates to REJECTED
  - [ ] ✅ Renter receives "Booking Rejected" notification

### Flow 2: Reviews & Ratings
- [ ] **Leave Review**
  - [ ] Navigate to /my-bookings
  - [ ] Find COMPLETED booking
  - [ ] "Leave a Review" button appears
  - [ ] Click button, modal opens
  - [ ] Rate 1-5 stars
  - [ ] Write review (min 20 chars)
  - [ ] Submit review
  - [ ] User receives 10 points
  - [ ] ✅ Plot owner receives "New Review" notification

- [ ] **View Reviews**
  - [ ] Reviews appear on plot detail page
  - [ ] Star rating displays correctly
  - [ ] Average rating updates
  - [ ] Review content shows properly

- [ ] **Validation**
  - [ ] Cannot review without completed booking
  - [ ] Cannot review same plot twice
  - [ ] Cannot review own plot

### Flow 3: Direct Messaging
- [ ] **From Booking**
  - [ ] In /my-bookings, click "Contact Owner"
  - [ ] Navigates to /messages?userId=X
  - [ ] Conversation opens
  - [ ] Send message
  - [ ] ✅ Receiver gets "New Message" notification

- [ ] **From Manage Bookings**
  - [ ] In /manage-bookings, click "Contact Renter"
  - [ ] Opens conversation
  - [ ] Messages send successfully

- [ ] **Messages Page**
  - [ ] Conversation list shows all conversations
  - [ ] Unread count badge displays
  - [ ] Messages display in correct order
  - [ ] Timestamps show properly
  - [ ] Messages mark as read when opened

### Flow 4: Notifications
- [ ] **Notification Dropdown**
  - [ ] Bell icon in header
  - [ ] Unread count badge (1-9 or 9+)
  - [ ] Click bell opens dropdown
  - [ ] Notifications list loads
  - [ ] Unread notifications highlighted in blue
  - [ ] Timestamps show relative time

- [ ] **Notification Actions**
  - [ ] Click notification navigates to link
  - [ ] Notification marks as read
  - [ ] "Mark all as read" works
  - [ ] Unread count updates

- [ ] **Notification Types**
  - [ ] BOOKING_REQUEST (to owner)
  - [ ] BOOKING_APPROVED (to renter)
  - [ ] BOOKING_REJECTED (to renter)
  - [ ] BOOKING_CANCELLED (to other party)
  - [ ] NEW_MESSAGE (to receiver)
  - [ ] NEW_REVIEW (to plot owner)

### Flow 5: Booking Cancellation
- [ ] **Renter Cancels**
  - [ ] From /my-bookings
  - [ ] Click "Cancel Booking" on PENDING/APPROVED booking
  - [ ] Status updates to CANCELLED
  - [ ] ✅ Owner receives "Booking Cancelled" notification

- [ ] **Owner Cancels**
  - [ ] From /manage-bookings
  - [ ] Click "Cancel Booking" on APPROVED booking
  - [ ] Status updates to CANCELLED
  - [ ] ✅ Renter receives "Booking Cancelled" notification

## 🐛 Known Issues to Check

### Database
- [ ] Notification table exists (needs migration)
- [ ] All schema changes applied
- [ ] Field names match (content vs comment, etc.)

### API Endpoints
- [ ] /api/messages returns 404 → Check if route is registered
- [ ] /api/notifications works
- [ ] /api/reviews works
- [ ] /api/bookings works
- [ ] All CORS/auth issues resolved

### UI/UX
- [ ] Loading states show
- [ ] Error messages display
- [ ] Success feedback provided
- [ ] Mobile responsive
- [ ] Empty states handled

## 🎨 Polish Checklist

### User Feedback
- [ ] Success toasts/messages after actions
- [ ] Error messages are clear and helpful
- [ ] Loading spinners during API calls
- [ ] Disabled states during submission

### Validation
- [ ] Form validation messages
- [ ] Date validation for bookings
- [ ] Review length requirements
- [ ] Proper error handling

### Performance
- [ ] Images load quickly
- [ ] API responses are fast
- [ ] No unnecessary re-renders
- [ ] Polling doesn't cause issues

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Color contrast sufficient
- [ ] Focus states visible

## 📝 Testing Notes

### Test Data Needed
- [ ] 2+ user accounts (for owner/renter roles)
- [ ] Several plots listed
- [ ] At least one completed booking
- [ ] Mix of booking statuses

### Testing Steps
1. **Setup**: Create test users and plots
2. **Flow Testing**: Go through each critical flow
3. **Edge Cases**: Test validation and error scenarios
4. **Polish**: Check UI/UX for improvements
5. **Documentation**: Note any bugs found

---

## ✅ Test Results

### Issues Found
[ ] Issue 1: [Description]
[ ] Issue 2: [Description]

### Improvements Needed
[ ] Improvement 1: [Description]
[ ] Improvement 2: [Description]

### Status
- **Date**: [Date]
- **Tester**: [Name]
- **Overall Status**: [ ] Pass [ ] Fail [ ] Needs Work

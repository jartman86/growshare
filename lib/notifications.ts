import { prisma } from './prisma'
import {
  sendBookingRequestEmail,
  sendBookingApprovedEmail,
  sendBookingRejectedEmail,
  sendNewMessageEmail,
  sendNewReviewEmail,
  sendPaymentReceivedEmail,
} from './email'

type NotificationType =
  | 'BOOKING_REQUEST'
  | 'BOOKING_APPROVED'
  | 'BOOKING_REJECTED'
  | 'BOOKING_CANCELLED'
  | 'NEW_MESSAGE'
  | 'NEW_REVIEW'
  | 'PAYMENT_RECEIVED'
  | 'PLOT_VIEWED'
  | 'SYSTEM'
  | 'SUBSCRIPTION_UPDATED'

interface CreateNotificationParams {
  userId: string
  type: NotificationType
  title: string
  content: string
  link?: string
  metadata?: Record<string, any>
  skipPreferenceCheck?: boolean // For critical notifications that should always be sent
}

// Map notification types to preference keys
function getPreferenceKey(type: NotificationType): string | null {
  switch (type) {
    case 'BOOKING_REQUEST':
      return 'bookingRequests'
    case 'BOOKING_APPROVED':
    case 'BOOKING_REJECTED':
    case 'BOOKING_CANCELLED':
      return 'bookingUpdates'
    case 'NEW_MESSAGE':
      return 'newMessages'
    case 'NEW_REVIEW':
      return 'newReviews'
    case 'PAYMENT_RECEIVED':
      return 'marketplaceActivity'
    case 'SYSTEM':
      return 'systemAnnouncements'
    case 'PLOT_VIEWED':
    case 'SUBSCRIPTION_UPDATED':
      return null // Always send these
    default:
      return null
  }
}

// Check if user has enabled this type of notification
async function shouldSendNotification(userId: string, type: NotificationType): Promise<boolean> {
  const preferenceKey = getPreferenceKey(type)

  // If no preference key, always send
  if (!preferenceKey) return true

  try {
    const preferences = await prisma.notificationPreferences.findUnique({
      where: { userId },
    })

    // If no preferences set, default to enabled
    if (!preferences) return true

    // Check the specific preference
    return (preferences as Record<string, boolean>)[preferenceKey] ?? true
  } catch {
    // On error, default to sending
    return true
  }
}

export async function createNotification(params: CreateNotificationParams) {
  try {
    // Check user preferences unless explicitly skipped
    if (!params.skipPreferenceCheck) {
      const shouldSend = await shouldSendNotification(params.userId, params.type)
      if (!shouldSend) {
        return null // User has disabled this notification type
      }
    }

    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        content: params.content,
        link: params.link || null,
        metadata: params.metadata || undefined,
      },
    })
    return notification
  } catch (error) {
    console.error('Error creating notification:', error)
    throw error
  }
}

// Helper functions for common notifications

export async function notifyBookingRequest(
  ownerId: string,
  plotTitle: string,
  renterName: string,
  bookingId: string,
  startDate?: string,
  endDate?: string
) {
  // Create in-app notification
  const notification = await createNotification({
    userId: ownerId,
    type: 'BOOKING_REQUEST',
    title: 'New Booking Request',
    content: `${renterName} has requested to book your plot "${plotTitle}"`,
    link: `/manage-bookings`,
    metadata: { bookingId },
  })

  // Send email notification
  try {
    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
      select: { email: true },
    })
    if (owner?.email && startDate && endDate) {
      await sendBookingRequestEmail(ownerId, owner.email, {
        plotTitle,
        renterName,
        startDate,
        endDate,
      })
    }
  } catch (error) {
    console.error('Error sending booking request email:', error)
  }

  return notification
}

export async function notifyBookingApproved(
  renterId: string,
  plotTitle: string,
  bookingId: string,
  ownerName?: string,
  startDate?: string
) {
  // Create in-app notification
  const notification = await createNotification({
    userId: renterId,
    type: 'BOOKING_APPROVED',
    title: 'Booking Approved',
    content: `Your booking request for "${plotTitle}" has been approved!`,
    link: `/my-bookings`,
    metadata: { bookingId },
  })

  // Send email notification
  try {
    const renter = await prisma.user.findUnique({
      where: { id: renterId },
      select: { email: true },
    })
    if (renter?.email && ownerName && startDate) {
      await sendBookingApprovedEmail(renterId, renter.email, {
        plotTitle,
        ownerName,
        startDate,
      })
    }
  } catch (error) {
    console.error('Error sending booking approved email:', error)
  }

  return notification
}

export async function notifyBookingRejected(renterId: string, plotTitle: string, bookingId: string) {
  // Create in-app notification
  const notification = await createNotification({
    userId: renterId,
    type: 'BOOKING_REJECTED',
    title: 'Booking Rejected',
    content: `Your booking request for "${plotTitle}" has been rejected.`,
    link: `/my-bookings`,
    metadata: { bookingId },
  })

  // Send email notification
  try {
    const renter = await prisma.user.findUnique({
      where: { id: renterId },
      select: { email: true },
    })
    if (renter?.email) {
      await sendBookingRejectedEmail(renterId, renter.email, { plotTitle })
    }
  } catch (error) {
    console.error('Error sending booking rejected email:', error)
  }

  return notification
}

export async function notifyBookingCancelled(userId: string, plotTitle: string, bookingId: string, cancelledBy: string) {
  return createNotification({
    userId,
    type: 'BOOKING_CANCELLED',
    title: 'Booking Cancelled',
    content: `The booking for "${plotTitle}" has been cancelled by ${cancelledBy}.`,
    link: `/my-bookings`,
    metadata: { bookingId },
  })
}

export async function notifyNewMessage(receiverId: string, senderName: string) {
  // Create in-app notification
  const notification = await createNotification({
    userId: receiverId,
    type: 'NEW_MESSAGE',
    title: 'New Message',
    content: `${senderName} sent you a message`,
    link: `/messages`,
  })

  // Send email notification
  try {
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { email: true },
    })
    if (receiver?.email) {
      await sendNewMessageEmail(receiverId, receiver.email, { senderName })
    }
  } catch (error) {
    console.error('Error sending new message email:', error)
  }

  return notification
}

export async function notifyNewReview(plotOwnerId: string, plotTitle: string, reviewerName: string, rating: number, plotId: string) {
  // Create in-app notification
  const notification = await createNotification({
    userId: plotOwnerId,
    type: 'NEW_REVIEW',
    title: 'New Review',
    content: `${reviewerName} left a ${rating}-star review on "${plotTitle}"`,
    link: `/explore/${plotId}`,
    metadata: { rating },
  })

  // Send email notification
  try {
    const owner = await prisma.user.findUnique({
      where: { id: plotOwnerId },
      select: { email: true },
    })
    if (owner?.email) {
      await sendNewReviewEmail(plotOwnerId, owner.email, {
        plotTitle,
        reviewerName,
        rating,
      })
    }
  } catch (error) {
    console.error('Error sending new review email:', error)
  }

  return notification
}

export async function notifyPaymentReceived(userId: string, amount: string, description: string) {
  // Create in-app notification
  const notification = await createNotification({
    userId,
    type: 'PAYMENT_RECEIVED',
    title: 'Payment Received',
    content: `You received $${amount} for ${description}`,
    link: `/dashboard`,
    metadata: { amount },
  })

  // Send email notification
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    })
    if (user?.email) {
      await sendPaymentReceivedEmail(userId, user.email, { amount, description })
    }
  } catch (error) {
    console.error('Error sending payment received email:', error)
  }

  return notification
}

export async function notifyRefundProcessed(
  userId: string,
  amount: number,
  plotTitle: string,
  bookingId: string,
  refundPercentage: number
) {
  // Create in-app notification
  const notification = await createNotification({
    userId,
    type: 'PAYMENT_RECEIVED', // Reusing type since it's payment-related
    title: 'Refund Processed',
    content: `Your ${refundPercentage}% refund of $${amount.toFixed(2)} for "${plotTitle}" has been processed.`,
    link: `/my-bookings`,
    metadata: {
      bookingId,
      refundAmount: amount,
      refundPercentage,
      isRefund: true,
    },
  })

  return notification
}

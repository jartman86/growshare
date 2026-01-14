import { prisma } from './prisma'

type NotificationType =
  | 'BOOKING_REQUEST'
  | 'BOOKING_APPROVED'
  | 'BOOKING_REJECTED'
  | 'BOOKING_CANCELLED'
  | 'NEW_MESSAGE'
  | 'NEW_REVIEW'
  | 'PAYMENT_RECEIVED'
  | 'PLOT_VIEWED'

interface CreateNotificationParams {
  userId: string
  type: NotificationType
  title: string
  content: string
  link?: string
  metadata?: Record<string, any>
}

export async function createNotification(params: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        content: params.content,
        link: params.link || null,
        metadata: params.metadata || null,
      },
    })
    return notification
  } catch (error) {
    console.error('Error creating notification:', error)
    throw error
  }
}

// Helper functions for common notifications

export async function notifyBookingRequest(ownerId: string, plotTitle: string, renterName: string, bookingId: string) {
  return createNotification({
    userId: ownerId,
    type: 'BOOKING_REQUEST',
    title: 'New Booking Request',
    content: `${renterName} has requested to book your plot "${plotTitle}"`,
    link: `/manage-bookings`,
    metadata: { bookingId },
  })
}

export async function notifyBookingApproved(renterId: string, plotTitle: string, bookingId: string) {
  return createNotification({
    userId: renterId,
    type: 'BOOKING_APPROVED',
    title: 'Booking Approved',
    content: `Your booking request for "${plotTitle}" has been approved!`,
    link: `/my-bookings`,
    metadata: { bookingId },
  })
}

export async function notifyBookingRejected(renterId: string, plotTitle: string, bookingId: string) {
  return createNotification({
    userId: renterId,
    type: 'BOOKING_REJECTED',
    title: 'Booking Rejected',
    content: `Your booking request for "${plotTitle}" has been rejected.`,
    link: `/my-bookings`,
    metadata: { bookingId },
  })
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
  return createNotification({
    userId: receiverId,
    type: 'NEW_MESSAGE',
    title: 'New Message',
    content: `${senderName} sent you a message`,
    link: `/messages`,
  })
}

export async function notifyNewReview(plotOwnerId: string, plotTitle: string, reviewerName: string, rating: number, plotId: string) {
  return createNotification({
    userId: plotOwnerId,
    type: 'NEW_REVIEW',
    title: 'New Review',
    content: `${reviewerName} left a ${rating}-star review on "${plotTitle}"`,
    link: `/explore/${plotId}`,
    metadata: { rating },
  })
}

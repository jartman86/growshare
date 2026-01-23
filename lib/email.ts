import sgMail from '@sendgrid/mail'
import { prisma } from './prisma'

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@growshare.com'
const APP_NAME = 'GrowShare'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('SendGrid not configured, skipping email:', options.subject)
    return false
  }

  try {
    await sgMail.send({
      to: options.to,
      from: {
        email: FROM_EMAIL,
        name: APP_NAME,
      },
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''),
    })
    console.log(`Email sent to ${options.to}: ${options.subject}`)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

// Check if user wants to receive a specific type of email
export async function shouldSendEmail(userId: string, type: keyof Omit<EmailPreferences, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<boolean> {
  const prefs = await prisma.emailPreferences.findUnique({
    where: { userId },
  })

  // Default to true if no preferences set
  if (!prefs) return true

  return prefs[type]
}

interface EmailPreferences {
  id: string
  userId: string
  bookingRequests: boolean
  bookingUpdates: boolean
  newMessages: boolean
  newReviews: boolean
  marketplaceOrders: boolean
  forumReplies: boolean
  weeklyDigest: boolean
  createdAt: Date
  updatedAt: Date
}

// Email template wrapper
function emailWrapper(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${APP_NAME}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background-color: #16a34a; padding: 24px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">${APP_NAME}</h1>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 32px;">
                  ${content}
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">
                    You received this email because you have an account with ${APP_NAME}.
                  </p>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">
                    <a href="${APP_URL}/settings/notifications" style="color: #16a34a; text-decoration: none;">Manage email preferences</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

// Email templates
export const emailTemplates = {
  bookingRequest: (data: { plotTitle: string; renterName: string; startDate: string; endDate: string }) => ({
    subject: `New Booking Request for ${data.plotTitle}`,
    html: emailWrapper(`
      <h2 style="margin: 0 0 16px; color: #111827; font-size: 20px;">New Booking Request</h2>
      <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.5;">
        ${data.renterName} has requested to book your plot <strong>${data.plotTitle}</strong>.
      </p>
      <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">Requested dates:</p>
        <p style="margin: 0; color: #111827; font-size: 16px; font-weight: 500;">
          ${data.startDate} - ${data.endDate}
        </p>
      </div>
      <a href="${APP_URL}/manage-bookings" style="display: inline-block; padding: 12px 24px; background-color: #16a34a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">
        View Booking Request
      </a>
    `),
  }),

  bookingApproved: (data: { plotTitle: string; ownerName: string; startDate: string }) => ({
    subject: `Your Booking for ${data.plotTitle} is Approved!`,
    html: emailWrapper(`
      <h2 style="margin: 0 0 16px; color: #111827; font-size: 20px;">Booking Approved!</h2>
      <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.5;">
        Great news! ${data.ownerName} has approved your booking request for <strong>${data.plotTitle}</strong>.
      </p>
      <div style="background-color: #dcfce7; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px; color: #166534; font-size: 14px;">Your rental starts:</p>
        <p style="margin: 0; color: #166534; font-size: 18px; font-weight: 600;">
          ${data.startDate}
        </p>
      </div>
      <a href="${APP_URL}/my-bookings" style="display: inline-block; padding: 12px 24px; background-color: #16a34a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">
        View Your Booking
      </a>
    `),
  }),

  bookingRejected: (data: { plotTitle: string }) => ({
    subject: `Booking Update for ${data.plotTitle}`,
    html: emailWrapper(`
      <h2 style="margin: 0 0 16px; color: #111827; font-size: 20px;">Booking Not Approved</h2>
      <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.5;">
        Unfortunately, your booking request for <strong>${data.plotTitle}</strong> was not approved.
      </p>
      <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.5;">
        Don't worry - there are many other great plots available!
      </p>
      <a href="${APP_URL}/explore" style="display: inline-block; padding: 12px 24px; background-color: #16a34a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">
        Explore More Plots
      </a>
    `),
  }),

  newMessage: (data: { senderName: string }) => ({
    subject: `New Message from ${data.senderName}`,
    html: emailWrapper(`
      <h2 style="margin: 0 0 16px; color: #111827; font-size: 20px;">You Have a New Message</h2>
      <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.5;">
        ${data.senderName} sent you a message on ${APP_NAME}.
      </p>
      <a href="${APP_URL}/messages" style="display: inline-block; padding: 12px 24px; background-color: #16a34a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">
        Read Message
      </a>
    `),
  }),

  newReview: (data: { plotTitle: string; reviewerName: string; rating: number }) => ({
    subject: `New ${data.rating}-Star Review on ${data.plotTitle}`,
    html: emailWrapper(`
      <h2 style="margin: 0 0 16px; color: #111827; font-size: 20px;">New Review Received</h2>
      <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.5;">
        ${data.reviewerName} left a ${data.rating}-star review on <strong>${data.plotTitle}</strong>.
      </p>
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 32px;">${'★'.repeat(data.rating)}${'☆'.repeat(5 - data.rating)}</span>
      </div>
      <a href="${APP_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #16a34a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">
        View Review
      </a>
    `),
  }),

  orderReceived: (data: { productName: string; buyerName: string; quantity: number; unit: string }) => ({
    subject: `New Order for ${data.productName}`,
    html: emailWrapper(`
      <h2 style="margin: 0 0 16px; color: #111827; font-size: 20px;">New Order Received!</h2>
      <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.5;">
        ${data.buyerName} ordered ${data.quantity} ${data.unit} of <strong>${data.productName}</strong>.
      </p>
      <a href="${APP_URL}/dashboard/sell/orders" style="display: inline-block; padding: 12px 24px; background-color: #16a34a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">
        View Order
      </a>
    `),
  }),

  forumReply: (data: { topicTitle: string; replierName: string; topicId: string }) => ({
    subject: `New Reply to: ${data.topicTitle}`,
    html: emailWrapper(`
      <h2 style="margin: 0 0 16px; color: #111827; font-size: 20px;">New Reply to Your Topic</h2>
      <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.5;">
        ${data.replierName} replied to your topic <strong>"${data.topicTitle}"</strong>.
      </p>
      <a href="${APP_URL}/community/${data.topicId}" style="display: inline-block; padding: 12px 24px; background-color: #16a34a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">
        View Reply
      </a>
    `),
  }),

  paymentReceived: (data: { amount: string; description: string }) => ({
    subject: `Payment Received: $${data.amount}`,
    html: emailWrapper(`
      <h2 style="margin: 0 0 16px; color: #111827; font-size: 20px;">Payment Received!</h2>
      <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.5;">
        You've received a payment of <strong>$${data.amount}</strong> for ${data.description}.
      </p>
      <div style="background-color: #dcfce7; padding: 16px; border-radius: 8px; margin-bottom: 24px; text-align: center;">
        <p style="margin: 0; color: #166534; font-size: 24px; font-weight: bold;">$${data.amount}</p>
      </div>
      <a href="${APP_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #16a34a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">
        View Dashboard
      </a>
    `),
  }),
}

// Helper functions for sending specific email types
export async function sendBookingRequestEmail(userId: string, email: string, data: Parameters<typeof emailTemplates.bookingRequest>[0]) {
  if (await shouldSendEmail(userId, 'bookingRequests')) {
    const template = emailTemplates.bookingRequest(data)
    await sendEmail({ to: email, ...template })
  }
}

export async function sendBookingApprovedEmail(userId: string, email: string, data: Parameters<typeof emailTemplates.bookingApproved>[0]) {
  if (await shouldSendEmail(userId, 'bookingUpdates')) {
    const template = emailTemplates.bookingApproved(data)
    await sendEmail({ to: email, ...template })
  }
}

export async function sendBookingRejectedEmail(userId: string, email: string, data: Parameters<typeof emailTemplates.bookingRejected>[0]) {
  if (await shouldSendEmail(userId, 'bookingUpdates')) {
    const template = emailTemplates.bookingRejected(data)
    await sendEmail({ to: email, ...template })
  }
}

export async function sendNewMessageEmail(userId: string, email: string, data: Parameters<typeof emailTemplates.newMessage>[0]) {
  if (await shouldSendEmail(userId, 'newMessages')) {
    const template = emailTemplates.newMessage(data)
    await sendEmail({ to: email, ...template })
  }
}

export async function sendNewReviewEmail(userId: string, email: string, data: Parameters<typeof emailTemplates.newReview>[0]) {
  if (await shouldSendEmail(userId, 'newReviews')) {
    const template = emailTemplates.newReview(data)
    await sendEmail({ to: email, ...template })
  }
}

export async function sendOrderReceivedEmail(userId: string, email: string, data: Parameters<typeof emailTemplates.orderReceived>[0]) {
  if (await shouldSendEmail(userId, 'marketplaceOrders')) {
    const template = emailTemplates.orderReceived(data)
    await sendEmail({ to: email, ...template })
  }
}

export async function sendForumReplyEmail(userId: string, email: string, data: Parameters<typeof emailTemplates.forumReply>[0]) {
  if (await shouldSendEmail(userId, 'forumReplies')) {
    const template = emailTemplates.forumReply(data)
    await sendEmail({ to: email, ...template })
  }
}

export async function sendPaymentReceivedEmail(userId: string, email: string, data: Parameters<typeof emailTemplates.paymentReceived>[0]) {
  if (await shouldSendEmail(userId, 'bookingUpdates')) {
    const template = emailTemplates.paymentReceived(data)
    await sendEmail({ to: email, ...template })
  }
}

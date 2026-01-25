import { z } from 'zod'

// ============================================
// Common Schemas
// ============================================

export const phoneNumberSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number must be at most 15 digits')
  .regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number format')

export const verificationCodeSchema = z
  .string()
  .length(6, 'Verification code must be 6 digits')
  .regex(/^\d+$/, 'Verification code must contain only digits')

export const uuidSchema = z.string().cuid()

export const urlSchema = z.string().url('Invalid URL format')

export const emailSchema = z.string().email('Invalid email format')

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be at most 30 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')

// ============================================
// Verification Schemas
// ============================================

export const phoneVerificationRequestSchema = z.object({
  phoneNumber: phoneNumberSchema,
})

export const phoneVerificationVerifySchema = z.object({
  code: verificationCodeSchema,
})

export const idVerificationRequestSchema = z.object({
  documentUrl: urlSchema,
})

// ============================================
// Payment Schemas
// ============================================

export const createPaymentIntentSchema = z.object({
  type: z.enum(['booking', 'order'], 'Type must be either "booking" or "order"'),
  bookingId: z.string().cuid().optional(),
  orderId: z.string().cuid().optional(),
}).refine(
  (data) => {
    if (data.type === 'booking') return !!data.bookingId
    if (data.type === 'order') return !!data.orderId
    return true
  },
  {
    message: 'bookingId is required for booking type, orderId is required for order type',
  }
)

export const refundRequestSchema = z.object({
  bookingId: z.string().cuid('Invalid booking ID'),
})

export const stripeConnectActionSchema = z.object({
  action: z.enum(['create', 'onboard'], 'Action must be either "create" or "onboard"'),
})

// ============================================
// Booking Schemas
// ============================================

export const createBookingSchema = z.object({
  plotId: z.string().cuid('Invalid plot ID'),
  startDate: z.string().datetime('Invalid start date format'),
  endDate: z.string().datetime('Invalid end date format'),
  message: z.string().max(1000, 'Message must be at most 1000 characters').optional(),
}).refine(
  (data) => new Date(data.startDate) < new Date(data.endDate),
  { message: 'Start date must be before end date' }
).refine(
  (data) => new Date(data.startDate) >= new Date(),
  { message: 'Start date cannot be in the past' }
)

export const updateBookingSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'CANCELLED']).optional(),
  message: z.string().max(1000).optional(),
})

// ============================================
// Plot Schemas
// ============================================

export const createPlotSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be at most 100 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(5000, 'Description must be at most 5000 characters'),
  address: z.string().min(5, 'Address is required').max(200),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(100),
  zipCode: z.string().min(5, 'Zip code is required').max(10),
  size: z.number().positive('Size must be positive'),
  pricePerMonth: z.number().positive('Price must be positive').max(10000, 'Price cannot exceed $10,000'),
  amenities: z.array(z.string()).optional(),
  soilType: z.string().optional(),
  sunExposure: z.enum(['FULL_SUN', 'PARTIAL_SUN', 'SHADE']).optional(),
  waterAccess: z.boolean().optional(),
  photos: z.array(z.string().url()).max(10, 'Maximum 10 photos allowed').optional(),
})

export const updatePlotSchema = createPlotSchema.partial()

// ============================================
// Admin Schemas
// ============================================

export const adminUserActionSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  action: z.enum(['suspend', 'activate', 'verify', 'unverify', 'addRole', 'removeRole'], 'Invalid action'),
  role: z.enum(['LANDOWNER', 'RENTER', 'BUYER', 'ORGANIZATION', 'ADMIN']).optional(),
}).refine(
  (data) => {
    if (data.action === 'addRole' || data.action === 'removeRole') {
      return !!data.role
    }
    return true
  },
  { message: 'Role is required for addRole/removeRole actions' }
)

export const adminVerificationActionSchema = z.object({
  requestId: z.string().cuid('Invalid request ID'),
  action: z.enum(['approve', 'reject'], 'Action must be either "approve" or "reject"'),
  notes: z.string().max(500, 'Notes must be at most 500 characters').optional(),
})

// ============================================
// Review Schemas
// ============================================

export const createReviewSchema = z.object({
  bookingId: z.string().cuid('Invalid booking ID'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  content: z.string().min(10, 'Review must be at least 10 characters').max(2000, 'Review must be at most 2000 characters'),
})

export const reviewResponseSchema = z.object({
  response: z.string().min(10, 'Response must be at least 10 characters').max(1000, 'Response must be at most 1000 characters'),
})

// ============================================
// Message Schemas
// ============================================

export const sendMessageSchema = z.object({
  receiverId: z.string().cuid('Invalid receiver ID'),
  content: z.string().min(1, 'Message cannot be empty').max(5000, 'Message must be at most 5000 characters'),
  subject: z.string().max(200, 'Subject must be at most 200 characters').optional(),
  bookingId: z.string().cuid().optional(),
})

// ============================================
// Search Schemas
// ============================================

export const searchQuerySchema = z.object({
  q: z.string().min(1, 'Search query is required').max(200, 'Search query too long'),
  type: z.enum(['all', 'plots', 'users', 'marketplace', 'tools', 'forum']).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
})

// ============================================
// Privacy Settings Schema
// ============================================

export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(['PUBLIC', 'FOLLOWERS', 'PRIVATE']).optional(),
  allowMessages: z.enum(['EVERYONE', 'FOLLOWERS', 'NONE']).optional(),
  showEmail: z.boolean().optional(),
  showPhone: z.boolean().optional(),
  showLocation: z.boolean().optional(),
})

// ============================================
// Utility function for validation
// ============================================

export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data)

  if (!result.success) {
    const firstIssue = result.error.issues[0]
    return {
      success: false,
      error: firstIssue?.message || 'Validation failed',
    }
  }

  return {
    success: true,
    data: result.data,
  }
}

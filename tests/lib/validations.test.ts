import { describe, it, expect } from 'vitest'
import { 
  validateRequest,
  createBookingSchema,
  createReviewSchema,
  createPlotSchema,
  usernameSchema,
  emailSchema
} from '@/lib/validations'

describe('validateRequest', () => {
  it('should validate correct data', () => {
    const result = validateRequest(emailSchema, 'test@example.com')
    expect(result.success).toBe(true)
  })

  it('should reject invalid data', () => {
    const result = validateRequest(emailSchema, 'not-an-email')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeDefined()
    }
  })
})

describe('createBookingSchema', () => {
  it('should validate correct booking data', () => {
    const futureDate = new Date()
    futureDate.setMonth(futureDate.getMonth() + 1)
    const endDate = new Date(futureDate)
    endDate.setMonth(endDate.getMonth() + 3)

    const result = validateRequest(createBookingSchema, {
      plotId: 'cuid123456789012345678901234',
      startDate: futureDate.toISOString(),
      endDate: endDate.toISOString(),
    })
    expect(result.success).toBe(true)
  })

  it('should reject booking with past start date', () => {
    const pastDate = new Date()
    pastDate.setFullYear(2020)

    const result = validateRequest(createBookingSchema, {
      plotId: 'cuid123456789012345678901234',
      startDate: pastDate.toISOString(),
      endDate: new Date().toISOString(),
    })
    expect(result.success).toBe(false)
  })

  it('should reject booking with end date before start date', () => {
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() + 2)
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 1)

    const result = validateRequest(createBookingSchema, {
      plotId: 'cuid123456789012345678901234',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    })
    expect(result.success).toBe(false)
  })
})

describe('createReviewSchema', () => {
  it('should validate correct review data', () => {
    const result = validateRequest(createReviewSchema, {
      bookingId: 'cuid123456789012345678901234',
      rating: 5,
      content: 'This is a great plot with wonderful soil quality!',
    })
    expect(result.success).toBe(true)
  })

  it('should reject review with rating below 1', () => {
    const result = validateRequest(createReviewSchema, {
      bookingId: 'cuid123456789012345678901234',
      rating: 0,
      content: 'Review content',
    })
    expect(result.success).toBe(false)
  })

  it('should reject review with rating above 5', () => {
    const result = validateRequest(createReviewSchema, {
      bookingId: 'cuid123456789012345678901234',
      rating: 6,
      content: 'Review content',
    })
    expect(result.success).toBe(false)
  })

  it('should reject short review content', () => {
    const result = validateRequest(createReviewSchema, {
      bookingId: 'cuid123456789012345678901234',
      rating: 4,
      content: 'Short',
    })
    expect(result.success).toBe(false)
  })
})

describe('createPlotSchema', () => {
  it('should validate correct plot data', () => {
    const result = validateRequest(createPlotSchema, {
      title: 'Sunny 5-Acre Farm Plot',
      description: 'A beautiful organic farm plot perfect for growing vegetables and herbs.',
      address: '123 Farm Road',
      city: 'Portland',
      state: 'Oregon',
      zipCode: '97201',
      size: 5,
      pricePerMonth: 400,
    })
    expect(result.success).toBe(true)
  })

  it('should reject plot with title too short', () => {
    const result = validateRequest(createPlotSchema, {
      title: 'Plot',
      description: 'A beautiful organic farm plot perfect for growing vegetables and herbs.',
      address: '123 Farm Road',
      city: 'Portland',
      state: 'Oregon',
      zipCode: '97201',
      size: 5,
      pricePerMonth: 400,
    })
    expect(result.success).toBe(false)
  })

  it('should reject plot with negative price', () => {
    const result = validateRequest(createPlotSchema, {
      title: 'Sunny 5-Acre Farm Plot',
      description: 'A beautiful organic farm plot perfect for growing vegetables and herbs.',
      address: '123 Farm Road',
      city: 'Portland',
      state: 'Oregon',
      zipCode: '97201',
      size: 5,
      pricePerMonth: -100,
    })
    expect(result.success).toBe(false)
  })
})

describe('usernameSchema', () => {
  it('should validate correct usernames', () => {
    expect(validateRequest(usernameSchema, 'john_doe').success).toBe(true)
    expect(validateRequest(usernameSchema, 'Farmer123').success).toBe(true)
    expect(validateRequest(usernameSchema, 'abc').success).toBe(true)
  })

  it('should reject invalid usernames', () => {
    expect(validateRequest(usernameSchema, 'ab').success).toBe(false)
    expect(validateRequest(usernameSchema, 'john doe').success).toBe(false)
    expect(validateRequest(usernameSchema, 'john@doe').success).toBe(false)
  })
})

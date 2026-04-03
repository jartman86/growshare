import { describe, it, expect } from 'vitest'
import { 
  dollarsToCents, 
  centsToDollars, 
  calculatePlatformFee 
} from '@/lib/stripe'

describe('Stripe Utilities', () => {
  describe('dollarsToCents', () => {
    it('should convert dollars to cents', () => {
      expect(dollarsToCents(10)).toBe(1000)
      expect(dollarsToCents(99.99)).toBe(9999)
      expect(dollarsToCents(0)).toBe(0)
    })

    it('should round correctly', () => {
      expect(dollarsToCents(10.999)).toBe(1100)
      expect(dollarsToCents(10.001)).toBe(1000)
    })
  })

  describe('centsToDollars', () => {
    it('should convert cents to dollars', () => {
      expect(centsToDollars(1000)).toBe(10)
      expect(centsToDollars(9999)).toBe(99.99)
      expect(centsToDollars(0)).toBe(0)
    })
  })

  describe('calculatePlatformFee', () => {
    it('should calculate 10% fee by default', () => {
      expect(calculatePlatformFee(1000)).toBe(100)
      expect(calculatePlatformFee(100)).toBe(10)
      expect(calculatePlatformFee(50)).toBe(5)
    })

    it('should calculate custom fee percentage', () => {
      expect(calculatePlatformFee(1000, 5)).toBe(50)
      expect(calculatePlatformFee(1000, 15)).toBe(150)
    })

    it('should round to nearest cent', () => {
      expect(calculatePlatformFee(99, 10)).toBe(10)
      expect(calculatePlatformFee(101, 10)).toBe(10)
    })
  })
})

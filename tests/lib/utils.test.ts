import { describe, it, expect } from 'vitest'
import { 
  formatCurrency, 
  formatDate, 
  formatRelativeTime,
  calculateLevel,
  pointsForNextLevel,
  calculateDistance,
  cn 
} from '@/lib/utils'

describe('formatCurrency', () => {
  it('should format dollars correctly', () => {
    expect(formatCurrency(10)).toBe('$10.00')
    expect(formatCurrency(99.99)).toBe('$99.99')
    expect(formatCurrency(1000)).toBe('$1,000.00')
  })
})

describe('formatDate', () => {
  it('should format date correctly', () => {
    const result = formatDate(new Date(2024, 6, 15))
    expect(result).toContain('July')
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })

  it('should handle string dates', () => {
    const result = formatDate('2024-07-15')
    expect(result).toContain('2024')
  })
})

describe('formatRelativeTime', () => {
  it('should return "just now" for recent dates', () => {
    const now = new Date()
    expect(formatRelativeTime(now)).toBe('just now')
  })

  it('should return minutes ago', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    expect(formatRelativeTime(fiveMinutesAgo)).toBe('5m ago')
  })

  it('should return hours ago', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
    expect(formatRelativeTime(twoHoursAgo)).toBe('2h ago')
  })

  it('should return days ago', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    expect(formatRelativeTime(threeDaysAgo)).toBe('3d ago')
  })
})

describe('calculateLevel', () => {
  it('should calculate level from points correctly', () => {
    expect(calculateLevel(0)).toBe(1)
    expect(calculateLevel(99)).toBe(1)
    expect(calculateLevel(100)).toBe(2)
    expect(calculateLevel(399)).toBe(2)
    expect(calculateLevel(400)).toBe(3)
  })
})

describe('pointsForNextLevel', () => {
  it('should return correct points needed', () => {
    expect(pointsForNextLevel(1)).toBe(100)
    expect(pointsForNextLevel(2)).toBe(400)
    expect(pointsForNextLevel(3)).toBe(900)
  })
})

describe('calculateDistance', () => {
  it('should calculate distance between two points', () => {
    // Distance between NYC (40.7128, -74.0060) and LA (34.0522, -118.2437)
    const distance = calculateDistance(40.7128, -74.0060, 34.0522, -118.2437)
    // Should be approximately 2,451 miles
    expect(distance).toBeGreaterThan(2400)
    expect(distance).toBeLessThan(2500)
  })

  it('should return 0 for same location', () => {
    const distance = calculateDistance(40.7128, -74.0060, 40.7128, -74.0060)
    expect(distance).toBe(0)
  })
})

describe('cn (className utility)', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('should handle conditional classes', () => {
    const isActive = true
    expect(cn('base', isActive && 'active')).toBe('base active')
    expect(cn('base', !isActive && 'inactive')).toBe('base')
  })

  it('should handle undefined values', () => {
    expect(cn('foo', undefined, 'bar')).toBe('foo bar')
  })
})

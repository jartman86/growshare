import { describe, it, expect, beforeEach } from 'vitest'
import { rateLimit, RATE_LIMITS, getClientIdentifier } from '@/lib/rate-limit'

describe('Rate Limiter', () => {
  it('should allow requests within the limit', () => {
    const result = rateLimit('test-user-1', { interval: 60000, limit: 5 })
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(4)
  })

  it('should block requests exceeding the limit', () => {
    const identifier = 'test-user-block-' + Date.now()
    const config = { interval: 60000, limit: 3 }

    // Make 3 requests (within limit)
    rateLimit(identifier, config)
    rateLimit(identifier, config)
    rateLimit(identifier, config)

    // 4th request should fail
    const result = rateLimit(identifier, config)
    expect(result.success).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('should track remaining requests correctly', () => {
    const identifier = 'test-user-remaining-' + Date.now()
    const config = { interval: 60000, limit: 5 }

    const r1 = rateLimit(identifier, config)
    expect(r1.remaining).toBe(4)

    const r2 = rateLimit(identifier, config)
    expect(r2.remaining).toBe(3)

    const r3 = rateLimit(identifier, config)
    expect(r3.remaining).toBe(2)
  })

  it('should have correct default rate limit configs', () => {
    expect(RATE_LIMITS.auth.limit).toBe(5)
    expect(RATE_LIMITS.verification.limit).toBe(3)
    expect(RATE_LIMITS.mutation.limit).toBe(30)
    expect(RATE_LIMITS.read.limit).toBe(100)
    expect(RATE_LIMITS.payment.limit).toBe(10)
    expect(RATE_LIMITS.search.limit).toBe(60)
  })

  it('should generate user-based identifier when userId provided', () => {
    const request = new Request('http://localhost/api/test', {
      headers: { 'x-forwarded-for': '192.168.1.1' },
    })
    const identifier = getClientIdentifier(request, 'user-123')
    expect(identifier).toBe('user:user-123')
  })

  it('should fall back to IP when no userId', () => {
    const request = new Request('http://localhost/api/test', {
      headers: { 'x-forwarded-for': '10.0.0.1' },
    })
    const identifier = getClientIdentifier(request)
    expect(identifier).toBe('ip:10.0.0.1')
  })
})

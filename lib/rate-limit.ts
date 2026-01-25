// Simple in-memory rate limiter
// For production, use Upstash Redis: https://upstash.com/blog/nextjs-rate-limiting

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Clean every minute

export interface RateLimitConfig {
  interval: number // Time window in milliseconds
  limit: number // Max requests per interval
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number
}

// Default configs for different endpoint types
export const RATE_LIMITS = {
  // Strict limits for auth/verification
  auth: { interval: 60 * 1000, limit: 5 }, // 5 per minute
  verification: { interval: 60 * 1000, limit: 3 }, // 3 per minute

  // Moderate limits for mutations
  mutation: { interval: 60 * 1000, limit: 30 }, // 30 per minute

  // Relaxed limits for reads
  read: { interval: 60 * 1000, limit: 100 }, // 100 per minute

  // Very strict for sensitive operations
  payment: { interval: 60 * 1000, limit: 10 }, // 10 per minute

  // Search/typeahead
  search: { interval: 60 * 1000, limit: 60 }, // 60 per minute
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig = RATE_LIMITS.mutation
): RateLimitResult {
  const now = Date.now()
  const key = identifier

  const entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetTime) {
    // First request or window expired
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.interval,
    })
    return {
      success: true,
      remaining: config.limit - 1,
      reset: now + config.interval,
    }
  }

  if (entry.count >= config.limit) {
    // Rate limit exceeded
    return {
      success: false,
      remaining: 0,
      reset: entry.resetTime,
    }
  }

  // Increment count
  entry.count++
  rateLimitStore.set(key, entry)

  return {
    success: true,
    remaining: config.limit - entry.count,
    reset: entry.resetTime,
  }
}

// Helper to get client identifier from request
export function getClientIdentifier(request: Request, userId?: string): string {
  // Prefer user ID if authenticated
  if (userId) {
    return `user:${userId}`
  }

  // Fall back to IP address
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  return `ip:${ip}`
}

// Helper to create rate limit response
export function rateLimitResponse(result: RateLimitResult) {
  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': result.reset.toString(),
        'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
      },
    }
  )
}

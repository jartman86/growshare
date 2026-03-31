import { NextResponse } from 'next/server'

/**
 * Standardized API error response helper
 * Ensures consistent error format across all API routes
 */
export interface ApiError {
  error: string
  code?: string
  details?: Record<string, unknown>
}

export function apiError(
  message: string,
  status: number,
  options?: { code?: string; details?: Record<string, unknown> }
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      error: message,
      ...(options?.code && { code: options.code }),
      ...(options?.details && { details: options.details }),
    },
    { status }
  )
}

// Common error responses
export const unauthorized = () => apiError('Unauthorized', 401, { code: 'UNAUTHORIZED' })
export const forbidden = (message = 'Forbidden') => apiError(message, 403, { code: 'FORBIDDEN' })
export const notFound = (resource = 'Resource') => apiError(`${resource} not found`, 404, { code: 'NOT_FOUND' })
export const badRequest = (message: string) => apiError(message, 400, { code: 'BAD_REQUEST' })
export const serverError = (message = 'Internal server error') => apiError(message, 500, { code: 'INTERNAL_ERROR' })
export const rateLimited = () => apiError('Too many requests', 429, { code: 'RATE_LIMITED' })
export const requiresVerification = () =>
  apiError('Account verification required', 403, {
    code: 'VERIFICATION_REQUIRED',
    details: { requiresVerification: true },
  })

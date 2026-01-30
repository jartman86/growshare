import DOMPurify from 'isomorphic-dompurify'
import { randomBytes } from 'crypto'

/**
 * Sanitize HTML content to prevent XSS attacks
 * Allows basic formatting tags only
 */
export function sanitizeHtml(content: string, maxLength = 10000): string {
  const sanitized = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href'],
  })
  return sanitized.slice(0, maxLength)
}

/**
 * Sanitize plain text - strips all HTML
 */
export function sanitizeText(content: string, maxLength = 1000): string {
  const sanitized = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  })
  return sanitized.slice(0, maxLength)
}

/**
 * Generate a cryptographically secure random ID
 * Used for certificates, tokens, etc.
 */
export function generateSecureId(prefix = '', length = 12): string {
  const bytes = randomBytes(Math.ceil(length * 0.75))
  const id = bytes.toString('base64url').slice(0, length).toUpperCase()
  return prefix ? `${prefix}-${id}` : id
}

/**
 * Generate a certificate ID
 */
export function generateCertificateId(): string {
  return generateSecureId('GS-CERT', 12)
}

/**
 * Validate and sanitize enum value
 */
export function validateEnum<T extends string>(
  value: string | undefined | null,
  allowedValues: readonly T[],
  defaultValue?: T
): T | undefined {
  if (!value) return defaultValue
  const upperValue = value.toUpperCase() as T
  if (allowedValues.includes(upperValue)) {
    return upperValue
  }
  return defaultValue
}

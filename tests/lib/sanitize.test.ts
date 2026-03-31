import { describe, it, expect } from 'vitest'
import { sanitizeHtml, sanitizeText, generateSecureId, generateCertificateId, validateEnum } from '@/lib/sanitize'

describe('sanitizeHtml', () => {
  it('should allow safe HTML tags', () => {
    const input = '<p>Hello <b>world</b></p>'
    const result = sanitizeHtml(input)
    expect(result).toContain('<p>')
    expect(result).toContain('<b>')
  })

  it('should strip dangerous script tags', () => {
    const input = '<script>alert("xss")</script><p>Safe content</p>'
    const result = sanitizeHtml(input)
    expect(result).not.toContain('<script>')
    expect(result).toContain('<p>Safe content</p>')
  })

  it('should strip event handlers', () => {
    const input = '<p onclick="alert(1)">Click me</p>'
    const result = sanitizeHtml(input)
    expect(result).not.toContain('onclick')
  })

  it('should strip iframe tags', () => {
    const input = '<iframe src="evil.com"></iframe>'
    const result = sanitizeHtml(input)
    expect(result).not.toContain('<iframe>')
  })

  it('should respect maxLength', () => {
    const input = '<p>' + 'a'.repeat(200) + '</p>'
    const result = sanitizeHtml(input, 50)
    expect(result.length).toBeLessThanOrEqual(50)
  })

  it('should allow links with href', () => {
    const input = '<a href="https://example.com">Link</a>'
    const result = sanitizeHtml(input)
    expect(result).toContain('href="https://example.com"')
  })
})

describe('sanitizeText', () => {
  it('should strip all HTML tags', () => {
    const input = '<p>Hello <b>world</b></p>'
    const result = sanitizeText(input)
    expect(result).toBe('Hello world')
  })

  it('should strip dangerous content', () => {
    const input = '<script>alert("xss")</script>Safe text'
    const result = sanitizeText(input)
    expect(result).not.toContain('<script>')
    expect(result).toContain('Safe text')
  })
})

describe('generateSecureId', () => {
  it('should generate ID of correct length', () => {
    const id = generateSecureId('', 12)
    expect(id.length).toBe(12)
  })

  it('should include prefix when provided', () => {
    const id = generateSecureId('TEST', 8)
    expect(id).toMatch(/^TEST-/)
  })

  it('should generate unique IDs', () => {
    const id1 = generateSecureId()
    const id2 = generateSecureId()
    expect(id1).not.toBe(id2)
  })
})

describe('generateCertificateId', () => {
  it('should start with GS-CERT prefix', () => {
    const id = generateCertificateId()
    expect(id).toMatch(/^GS-CERT-/)
  })
})

describe('validateEnum', () => {
  const allowedValues = ['ACTIVE', 'INACTIVE', 'PENDING'] as const

  it('should return valid enum value', () => {
    const result = validateEnum('active', allowedValues)
    expect(result).toBe('ACTIVE')
  })

  it('should return default for invalid value', () => {
    const result = validateEnum('invalid', allowedValues, 'ACTIVE')
    expect(result).toBe('ACTIVE')
  })

  it('should return undefined for null input without default', () => {
    const result = validateEnum(null, allowedValues)
    expect(result).toBeUndefined()
  })
})

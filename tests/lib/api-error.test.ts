import { describe, it, expect } from 'vitest'
import { apiError, unauthorized, forbidden, notFound, badRequest, serverError, requiresVerification } from '@/lib/api-error'

describe('API Error Helpers', () => {
  it('should create error with correct status', async () => {
    const response = apiError('Test error', 400)
    expect(response.status).toBe(400)

    const body = await response.json()
    expect(body.error).toBe('Test error')
  })

  it('should include code when provided', async () => {
    const response = apiError('Test', 400, { code: 'TEST_CODE' })
    const body = await response.json()
    expect(body.code).toBe('TEST_CODE')
  })

  it('should include details when provided', async () => {
    const response = apiError('Test', 400, { details: { field: 'name' } })
    const body = await response.json()
    expect(body.details).toEqual({ field: 'name' })
  })

  it('unauthorized should return 401', () => {
    const response = unauthorized()
    expect(response.status).toBe(401)
  })

  it('forbidden should return 403', () => {
    const response = forbidden()
    expect(response.status).toBe(403)
  })

  it('notFound should return 404 with resource name', async () => {
    const response = notFound('User')
    expect(response.status).toBe(404)
    const body = await response.json()
    expect(body.error).toBe('User not found')
  })

  it('badRequest should return 400', async () => {
    const response = badRequest('Invalid input')
    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.error).toBe('Invalid input')
  })

  it('serverError should return 500', () => {
    const response = serverError()
    expect(response.status).toBe(500)
  })

  it('requiresVerification should include verification flag', async () => {
    const response = requiresVerification()
    expect(response.status).toBe(403)
    const body = await response.json()
    expect(body.details?.requiresVerification).toBe(true)
  })
})

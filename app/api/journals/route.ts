// DEPRECATED: This endpoint is consolidated into /api/journal
// Redirects to maintain backward compatibility
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const newUrl = new URL('/api/journal', url.origin)
  newUrl.search = url.search
  return NextResponse.redirect(newUrl, { status: 308 })
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url)
  const newUrl = new URL('/api/journal', url.origin)
  return NextResponse.redirect(newUrl, { status: 308 })
}

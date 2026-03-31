import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/sync-user(.*)',
  '/verify-email(.*)',
  '/api/webhooks(.*)',
  '/api/auth(.*)',
  '/api/marketplace/listings(.*)',
  '/api/plots(.*)',
  '/api/search(.*)',
  '/api/events(.*)',
  '/api/courses(.*)',
  '/api/tools(.*)',
  '/api/plants(.*)',
  '/api/frost-dates(.*)',
  '/api/community-tips(.*)',
  '/api/certificates/verify(.*)',
  '/explore(.*)',
  '/plots(.*)',
  '/marketplace(.*)',
  '/knowledge(.*)',
  '/community(.*)',
  '/events(.*)',
  '/resources(.*)',
  '/terms(.*)',
  '/privacy(.*)',
  '/challenges(.*)',
  '/leaderboard(.*)',
  '/subscription(.*)',
  '/tools',
  '/tools/((?!list|my-rentals).*)',
])

// Routes that require email verification
const requiresVerification = createRouteMatcher([
  '/list-plot(.*)',
  '/tools/list(.*)',
])

// Security headers for all responses
function addSecurityHeaders(response: NextResponse) {
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  )
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), payment=(self)'
  )
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://api.mapbox.com https://*.clerk.accounts.dev https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://api.mapbox.com https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://img.clerk.com https://*.clerk.com https://api.dicebear.com https://api.mapbox.com https://*.mapbox.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.stripe.com https://api.mapbox.com https://*.mapbox.com https://*.clerk.accounts.dev https://api.cloudinary.com https://*.sentry.io https://*.ingest.sentry.io",
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://challenges.cloudflare.com https://*.clerk.accounts.dev",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  )
  return response
}

export default clerkMiddleware(async (auth, request: NextRequest) => {
  if (!isPublicRoute(request)) {
    const { userId, sessionClaims } = await auth.protect()

    const isApiRoute = request.nextUrl.pathname.startsWith('/api/')

    // Check email verification for protected page routes that require it
    if (!isApiRoute && requiresVerification(request)) {
      const primaryEmailVerified = sessionClaims?.email_verified

      if (!primaryEmailVerified) {
        const verifyUrl = new URL('/verify-email', request.url)
        verifyUrl.searchParams.set('redirect', request.nextUrl.pathname)
        return NextResponse.redirect(verifyUrl)
      }
    }
  }

  const response = NextResponse.next()
  addSecurityHeaders(response)
  return response
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}

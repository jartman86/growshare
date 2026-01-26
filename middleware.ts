import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

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

// Routes that require email verification (checked via Clerk session claims)
// Note: Session claims may be stale after email verification until user re-signs in
// For this reason, we only block routes where unverified access is truly problematic
// Most routes rely on API-level verification which checks Clerk's live status
const requiresVerification = createRouteMatcher([
  '/list-plot(.*)',
  '/tools/list(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    const { userId, sessionClaims } = await auth.protect()

    // Skip email verification redirect for API routes - let them return JSON errors
    const isApiRoute = request.nextUrl.pathname.startsWith('/api/')

    // Check email verification for protected routes that require it (page routes only)
    if (!isApiRoute && requiresVerification(request)) {
      // Check if user's primary email is verified
      // sessionClaims contains the user's email verification status
      const primaryEmailVerified = sessionClaims?.email_verified

      if (!primaryEmailVerified) {
        // Redirect to verify email page
        const verifyUrl = new URL('/verify-email', request.url)
        verifyUrl.searchParams.set('redirect', request.nextUrl.pathname)
        return NextResponse.redirect(verifyUrl)
      }
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

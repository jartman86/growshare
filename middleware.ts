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
])

// Routes that require email verification
const requiresVerification = createRouteMatcher([
  '/dashboard(.*)',
  '/list-plot(.*)',
  '/settings(.*)',
  '/messages(.*)',
  '/bookings(.*)',
  '/instructor(.*)',
  '/admin(.*)',
  '/onboarding(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    const { userId, sessionClaims } = await auth.protect()

    // Check email verification for protected routes that require it
    if (requiresVerification(request)) {
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

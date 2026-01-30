import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Only enable in production
  enabled: process.env.NODE_ENV === 'production',

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // Adjust in production based on traffic volume.
  tracesSampleRate: 0.1,

  // Capture Replay for 10% of all sessions, plus 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Filter out noisy errors
  ignoreErrors: [
    // Browser extensions
    /extensions\//i,
    /^chrome-extension:\/\//,
    // Network errors that are expected
    'Network request failed',
    'Failed to fetch',
    'Load failed',
    // User aborted requests
    'AbortError',
    'The operation was aborted',
  ],

  integrations: [
    Sentry.replayIntegration({
      // Mask all text and block all media in replays for privacy
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
})

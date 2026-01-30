'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { AlertTriangle, Mail, X, CheckCircle, Loader2 } from 'lucide-react'

interface VerificationBannerProps {
  onClose?: () => void
  className?: string
}

export function VerificationBanner({ onClose, className = '' }: VerificationBannerProps) {
  const { user, isLoaded } = useUser()
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dismissed, setDismissed] = useState(false)

  // Don't show if not loaded, no user, or already verified
  if (!isLoaded || !user) {
    return null
  }

  // Check if primary email is verified
  const primaryEmail = user.primaryEmailAddress
  const isVerified = primaryEmail?.verification?.status === 'verified'

  if (isVerified || dismissed) {
    return null
  }

  const handleResendVerification = async () => {
    if (!primaryEmail) return

    setSending(true)
    setError(null)

    try {
      await primaryEmail.prepareVerification({ strategy: 'email_code' })
      setSent(true)
    } catch {
      setError('Failed to send verification email. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    onClose?.()
  }

  return (
    <div className={`bg-amber-50 border-b border-amber-200 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div className="text-sm text-amber-800">
              {sent ? (
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Verification email sent to <strong>{primaryEmail?.emailAddress}</strong>. Check your inbox.
                </span>
              ) : (
                <span>
                  Please verify your email address to create bookings and list plots.{' '}
                  <strong>{primaryEmail?.emailAddress}</strong>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!sent && (
              <button
                onClick={handleResendVerification}
                disabled={sending}
                className="inline-flex items-center gap-1.5 rounded-md bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Send Verification Email
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleDismiss}
              className="rounded-md p-1.5 text-amber-600 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  )
}

/**
 * Inline verification message for forms/pages
 */
export function VerificationRequired({ message }: { message?: string }) {
  const { user } = useUser()
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const primaryEmail = user?.primaryEmailAddress

  const handleResendVerification = async () => {
    if (!primaryEmail) return

    setSending(true)
    try {
      await primaryEmail.prepareVerification({ strategy: 'email_code' })
      setSent(true)
    } catch {
      // Failed to send verification email
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-amber-800">
            Email Verification Required
          </h3>
          <p className="mt-1 text-sm text-amber-700">
            {message || 'Please verify your email address before performing this action.'}
          </p>
          {sent ? (
            <p className="mt-3 text-sm text-green-700 flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4" />
              Verification email sent to {primaryEmail?.emailAddress}
            </p>
          ) : (
            <button
              onClick={handleResendVerification}
              disabled={sending}
              className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  Send Verification Email
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

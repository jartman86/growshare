'use client'

import { useUser } from '@clerk/nextjs'
import { AlertTriangle, Mail, CheckCircle, Loader2 } from 'lucide-react'
import { useState } from 'react'

interface VerificationBannerProps {
  className?: string
}

export function VerificationBanner({ className = '' }: VerificationBannerProps) {
  const { user, isLoaded } = useUser()
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resendError, setResendError] = useState<string | null>(null)

  // Don't show anything while loading or if no user
  if (!isLoaded || !user) {
    return null
  }

  // Check if primary email is verified
  const primaryEmail = user.primaryEmailAddress
  const isVerified = primaryEmail?.verification?.status === 'verified'

  // Don't show banner if verified
  if (isVerified) {
    return null
  }

  const handleResendVerification = async () => {
    if (!primaryEmail) return

    setIsResending(true)
    setResendError(null)
    setResendSuccess(false)

    try {
      await primaryEmail.prepareVerification({ strategy: 'email_code' })
      setResendSuccess(true)
    } catch (error) {
      console.error('Error resending verification:', error)
      setResendError('Failed to send verification email. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div
      className={`bg-amber-50 border-l-4 border-amber-400 p-4 ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-amber-800">
            Email verification required
          </h3>
          <div className="mt-2 text-sm text-amber-700">
            <p>
              Please verify your email address ({primaryEmail?.emailAddress}) to
              create bookings and list plots. Check your inbox for a verification
              link.
            </p>
          </div>

          {resendSuccess && (
            <div className="mt-3 flex items-center gap-2 text-sm text-green-700">
              <CheckCircle className="h-4 w-4" />
              Verification email sent! Check your inbox.
            </div>
          )}

          {resendError && (
            <div className="mt-3 text-sm text-red-700">{resendError}</div>
          )}

          <div className="mt-4">
            <button
              onClick={handleResendVerification}
              disabled={isResending}
              className="inline-flex items-center gap-2 rounded-md bg-amber-100 px-3 py-2 text-sm font-medium text-amber-800 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  Resend verification email
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

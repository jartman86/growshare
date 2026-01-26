'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser, useClerk } from '@clerk/nextjs'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Mail, CheckCircle, Loader2, RefreshCw, AlertCircle } from 'lucide-react'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check verification status periodically
  useEffect(() => {
    if (!isLoaded || !user) return

    const checkVerification = () => {
      // Check if email is verified now
      const primaryEmail = user.emailAddresses.find(
        (email) => email.id === user.primaryEmailAddressId
      )

      if (primaryEmail?.verification?.status === 'verified') {
        // Redirect to intended destination
        router.push(redirect)
      }
    }

    // Check immediately
    checkVerification()

    // Check every 5 seconds
    const interval = setInterval(async () => {
      await user.reload()
      checkVerification()
    }, 5000)

    return () => clearInterval(interval)
  }, [isLoaded, user, router, redirect])

  const handleResendVerification = async () => {
    if (!user) return

    setResending(true)
    setError(null)
    setResendSuccess(false)

    try {
      const primaryEmail = user.emailAddresses.find(
        (email) => email.id === user.primaryEmailAddressId
      )

      if (primaryEmail) {
        await primaryEmail.prepareVerification({
          strategy: 'email_link',
          redirectUrl: `${window.location.origin}/verify-email?redirect=${encodeURIComponent(redirect)}`,
        })
        setResendSuccess(true)
      }
    } catch (err) {
      setError('Failed to resend verification email. Please try again.')
    } finally {
      setResending(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (!isLoaded) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#5a7f3a]" />
        </main>
        <Footer />
      </>
    )
  }

  const primaryEmail = user?.emailAddresses.find(
    (email) => email.id === user?.primaryEmailAddressId
  )

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            {/* Icon */}
            <div className="mx-auto w-16 h-16 bg-[#5a7f3a]/10 rounded-full flex items-center justify-center mb-6">
              <Mail className="h-8 w-8 text-[#5a7f3a]" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600 mb-6">
              To continue, please verify your email address. We sent a verification
              link to:
            </p>

            {/* Email */}
            <div className="bg-gray-100 rounded-lg px-4 py-3 mb-6">
              <p className="font-medium text-gray-900">
                {primaryEmail?.emailAddress || user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>

            {/* Success Message */}
            {resendSuccess && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg mb-6">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-green-800">
                  Verification email sent! Check your inbox.
                </span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-6">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleResendVerification}
                disabled={resending}
                className="w-full px-4 py-3 bg-[#5a7f3a] text-white rounded-lg font-semibold hover:bg-[#4a6f2a] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {resending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <RefreshCw className="h-5 w-5" />
                )}
                {resending ? 'Sending...' : 'Resend Verification Email'}
              </button>

              <p className="text-sm text-gray-500">
                Already verified?{' '}
                <button
                  onClick={() => router.push(redirect)}
                  className="text-[#5a7f3a] hover:underline"
                >
                  Continue to dashboard
                </button>
              </p>

              <div className="pt-4 border-t">
                <button
                  onClick={handleSignOut}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Sign out and use a different account
                </button>
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-6 text-sm text-gray-500">
              <p>
                Didn't receive the email? Check your spam folder or{' '}
                <a
                  href="mailto:support@growshare.com"
                  className="text-[#5a7f3a] hover:underline"
                >
                  contact support
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

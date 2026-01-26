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
  const [verificationCode, setVerificationCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [codeSent, setCodeSent] = useState(false)

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

  const handleSendCode = async () => {
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
          strategy: 'email_code',
        })
        setCodeSent(true)
        setResendSuccess(true)
      }
    } catch (err: any) {
      console.error('Error sending verification code:', err)
      setError(err?.errors?.[0]?.message || 'Failed to send verification code. Please try again.')
    } finally {
      setResending(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!user || !verificationCode) return

    setVerifying(true)
    setError(null)

    try {
      const primaryEmail = user.emailAddresses.find(
        (email) => email.id === user.primaryEmailAddressId
      )

      if (primaryEmail) {
        await primaryEmail.attemptVerification({
          code: verificationCode,
        })
        // Reload user to get updated verification status
        await user.reload()
        router.push(redirect)
      }
    } catch (err: any) {
      console.error('Error verifying code:', err)
      setError(err?.errors?.[0]?.message || 'Invalid verification code. Please try again.')
    } finally {
      setVerifying(false)
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
      <main className="min-h-screen bg-gradient-to-br from-[#f4e4c1] via-white to-[#aed581]/30 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg border-2 border-[#8bc34a]/30 p-8 text-center">
            {/* Icon */}
            <div className="mx-auto w-16 h-16 bg-[#aed581]/30 rounded-full flex items-center justify-center mb-6">
              <Mail className="h-8 w-8 text-[#4a7c2c]" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-[#2d5016] mb-2">
              Verify Your Email
            </h1>
            <p className="text-[#4a3f35] mb-6">
              {codeSent
                ? 'Enter the verification code sent to:'
                : 'Click the button below to receive a verification code at:'}
            </p>

            {/* Email */}
            <div className="bg-[#f4e4c1]/50 border border-[#8bc34a]/30 rounded-lg px-4 py-3 mb-6">
              <p className="font-medium text-[#2d5016]">
                {primaryEmail?.emailAddress || user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>

            {/* Success Message */}
            {resendSuccess && (
              <div className="flex items-center gap-2 p-3 bg-[#aed581]/20 border border-[#8bc34a]/50 rounded-lg mb-6">
                <CheckCircle className="h-5 w-5 text-[#4a7c2c] flex-shrink-0" />
                <span className="text-sm text-[#2d5016]">
                  Verification code sent! Check your inbox.
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

            {/* Code Input (shown after code is sent) */}
            {codeSent && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#2d5016] mb-2 text-left">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 border-2 border-[#8bc34a]/30 rounded-lg focus:ring-2 focus:ring-[#4a7c2c] focus:border-[#4a7c2c] text-center text-lg tracking-widest font-mono"
                  maxLength={6}
                />
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {codeSent ? (
                <>
                  <button
                    onClick={handleVerifyCode}
                    disabled={verifying || verificationCode.length < 6}
                    className="w-full px-4 py-3 bg-[#4a7c2c] text-white rounded-lg font-semibold hover:bg-[#3d6924] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {verifying ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <CheckCircle className="h-5 w-5" />
                    )}
                    {verifying ? 'Verifying...' : 'Verify Email'}
                  </button>
                  <button
                    onClick={handleSendCode}
                    disabled={resending}
                    className="w-full px-4 py-3 border-2 border-[#8bc34a] text-[#4a7c2c] rounded-lg font-semibold hover:bg-[#aed581]/20 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {resending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <RefreshCw className="h-5 w-5" />
                    )}
                    {resending ? 'Sending...' : 'Resend Code'}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleSendCode}
                  disabled={resending}
                  className="w-full px-4 py-3 bg-[#4a7c2c] text-white rounded-lg font-semibold hover:bg-[#3d6924] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {resending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Mail className="h-5 w-5" />
                  )}
                  {resending ? 'Sending...' : 'Send Verification Code'}
                </button>
              )}

              <p className="text-sm text-[#4a3f35]">
                Already verified?{' '}
                <button
                  onClick={() => router.push(redirect)}
                  className="text-[#4a7c2c] hover:underline font-medium"
                >
                  Continue to dashboard
                </button>
              </p>

              <div className="pt-4 border-t border-[#8bc34a]/20">
                <button
                  onClick={handleSignOut}
                  className="text-sm text-[#4a3f35] hover:text-[#2d5016]"
                >
                  Sign out and use a different account
                </button>
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-6 text-sm text-[#4a3f35]">
              <p>
                Didn't receive the code? Check your spam folder or{' '}
                <a
                  href="mailto:support@growshare.com"
                  className="text-[#4a7c2c] hover:underline font-medium"
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

'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser, useClerk } from '@clerk/nextjs'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Mail, CheckCircle, Loader2, RefreshCw, AlertCircle } from 'lucide-react'

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams?.get('redirect') || '/dashboard'
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  const handleContinue = () => {
    router.push(redirect)
  }

  // Loading state
  if (!isLoaded) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f4e4c1] via-white to-[#aed581]/30">
        <Loader2 className="h-8 w-8 animate-spin text-[#4a7c2c]" />
      </main>
    )
  }

  // Not signed in
  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#f4e4c1] via-white to-[#aed581]/30 flex items-center justify-center py-12 px-4 pb-24 sm:pb-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg border-2 border-[#8bc34a]/30 p-8 text-center relative z-10">
            <div className="mx-auto w-16 h-16 bg-[#aed581]/30 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="h-8 w-8 text-[#4a7c2c]" />
            </div>
            <h1 className="text-2xl font-bold text-[#2d5016] mb-2">
              Not Signed In
            </h1>
            <p className="text-[#4a3f35] mb-6">
              Please sign in to verify your email address.
            </p>
            <button
              onClick={() => router.push('/sign-in')}
              className="w-full px-4 py-3 bg-[#4a7c2c] text-white rounded-lg font-semibold hover:bg-[#3d6924] transition-colors"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </main>
    )
  }

  const emailAddress = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || 'your email'

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f4e4c1] via-white to-[#aed581]/30 flex items-center justify-center py-12 px-4 pb-24 sm:pb-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg border-2 border-[#8bc34a]/30 p-8 text-center relative z-10">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-[#aed581]/30 rounded-full flex items-center justify-center mb-6">
            <Mail className="h-8 w-8 text-[#4a7c2c]" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-[#2d5016] mb-2">
            Verify Your Email
          </h1>
          <p className="text-[#4a3f35] mb-6">
            Please check your email inbox for a verification link from Clerk.
          </p>

          {/* Email */}
          <div className="bg-[#f4e4c1]/50 border border-[#8bc34a]/30 rounded-lg px-4 py-3 mb-6">
            <p className="font-medium text-[#2d5016]">
              {emailAddress}
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-[#aed581]/20 border border-[#8bc34a]/50 rounded-lg mb-6">
              <CheckCircle className="h-5 w-5 text-[#4a7c2c] flex-shrink-0" />
              <span className="text-sm text-[#2d5016]">
                Check your inbox for the verification email!
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

          {/* Instructions */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-[#2d5016] mb-2">To verify your email:</h3>
            <ol className="text-sm text-[#4a3f35] space-y-2 list-decimal list-inside">
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the verification link from Clerk</li>
              <li>Return here and click "Continue"</li>
            </ol>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleContinue}
              className="w-full px-4 py-3 bg-[#4a7c2c] text-white rounded-lg font-semibold hover:bg-[#3d6924] transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="h-5 w-5" />
              I've Verified - Continue
            </button>

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
              Didn't receive the email? Check your spam folder or{' '}
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
  )
}

export default function VerifyEmailPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f4e4c1] via-white to-[#aed581]/30">
          <Loader2 className="h-8 w-8 animate-spin text-[#4a7c2c]" />
        </main>
      }>
        <VerifyEmailContent />
      </Suspense>
      <Footer />
    </>
  )
}

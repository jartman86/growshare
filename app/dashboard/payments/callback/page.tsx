'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CheckCircle, RefreshCw, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function StripeConnectCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'checking' | 'success' | 'refresh' | 'error'>('checking')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const success = searchParams.get('success')
  const refresh = searchParams.get('refresh')

  useEffect(() => {
    if (refresh === 'true') {
      setStatus('refresh')
    } else if (success === 'true') {
      // Verify the account status
      verifyAccountStatus()
    } else {
      // No params, check status
      verifyAccountStatus()
    }
  }, [success, refresh])

  const verifyAccountStatus = async () => {
    try {
      const response = await fetch('/api/stripe/connect')
      if (response.ok) {
        const data = await response.json()
        if (data.onboardingComplete) {
          setStatus('success')
        } else if (data.hasConnectAccount) {
          setStatus('refresh')
        } else {
          setStatus('error')
        }
      } else {
        setStatus('error')
      }
    } catch (error) {
      console.error('Error verifying account status:', error)
      setStatus('error')
    }
  }

  const handleRefreshOnboarding = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch('/api/stripe/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'onboard' }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.onboardingUrl) {
          window.location.href = data.onboardingUrl
        }
      }
    } catch (error) {
      console.error('Error refreshing onboarding:', error)
      setIsRefreshing(false)
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          {status === 'checking' && (
            <div className="bg-white rounded-xl border-2 border-gray-200 p-8 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto" />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Verifying Your Account
              </h2>
              <p className="mt-2 text-gray-600">
                Please wait while we confirm your payout account setup...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="bg-white rounded-xl border-2 border-green-200 p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Payout Setup Complete!
              </h2>
              <p className="mt-2 text-gray-600">
                Your account is now ready to receive payments from plot rentals.
                Funds will be automatically deposited to your connected bank account.
              </p>
              <div className="mt-6 space-y-3">
                <Link
                  href="/dashboard/payments"
                  className="block w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Go to Payments Dashboard
                </Link>
                <Link
                  href="/manage-bookings"
                  className="block w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Manage Bookings
                </Link>
              </div>
            </div>
          )}

          {status === 'refresh' && (
            <div className="bg-white rounded-xl border-2 border-amber-200 p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
                <RefreshCw className="h-10 w-10 text-amber-600" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Complete Your Setup
              </h2>
              <p className="mt-2 text-gray-600">
                Your payout account setup isn't complete yet. Please continue
                where you left off to finish setting up your account.
              </p>
              <button
                onClick={handleRefreshOnboarding}
                disabled={isRefreshing}
                className="mt-6 w-full px-4 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isRefreshing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Continue Setup
                    <RefreshCw className="h-5 w-5" />
                  </>
                )}
              </button>
              <Link
                href="/dashboard/payments"
                className="block mt-3 text-gray-600 hover:text-gray-900 text-sm"
              >
                Go back to Payments Dashboard
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-white rounded-xl border-2 border-red-200 p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                <AlertCircle className="h-10 w-10 text-red-600" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Something Went Wrong
              </h2>
              <p className="mt-2 text-gray-600">
                We couldn't verify your payout account status. Please try again
                or contact support if the problem persists.
              </p>
              <div className="mt-6 space-y-3">
                <Link
                  href="/dashboard/payments"
                  className="block w-full px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Return to Payments Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

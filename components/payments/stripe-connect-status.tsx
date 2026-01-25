'use client'

import { useState, useEffect } from 'react'
import {
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Loader2,
  CreditCard,
  ArrowRight,
} from 'lucide-react'

interface ConnectStatus {
  hasConnectAccount: boolean
  onboardingComplete: boolean
  dashboardUrl?: string
  chargesEnabled?: boolean
  payoutsEnabled?: boolean
}

interface StripeConnectStatusProps {
  onStatusChange?: (status: ConnectStatus) => void
}

export function StripeConnectStatus({ onStatusChange }: StripeConnectStatusProps) {
  const [status, setStatus] = useState<ConnectStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStatus()
  }, [])

  const fetchStatus = async () => {
    try {
      setError(null)
      const response = await fetch('/api/stripe/connect')
      if (!response.ok) {
        throw new Error('Failed to fetch connect status')
      }
      const data = await response.json()
      setStatus(data)
      onStatusChange?.(data)
    } catch (err) {
      console.error('Error fetching connect status:', err)
      setError('Failed to load payout status')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetupOrContinue = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      const action = status?.hasConnectAccount ? 'onboard' : 'create'
      const response = await fetch('/api/stripe/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) {
        throw new Error('Failed to initiate onboarding')
      }

      const data = await response.json()

      // Redirect to Stripe onboarding
      if (data.onboardingUrl) {
        window.location.href = data.onboardingUrl
      }
    } catch (err) {
      console.error('Error starting onboarding:', err)
      setError('Failed to start payout setup. Please try again.')
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-green-600" />
          <span className="text-gray-600">Loading payout status...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-xl border-2 border-red-200 p-6">
        <div className="flex items-center gap-3 text-red-800">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
        <button
          onClick={fetchStatus}
          className="mt-4 text-sm text-red-700 hover:text-red-900 underline"
        >
          Try again
        </button>
      </div>
    )
  }

  // Onboarding complete - show success state
  if (status?.onboardingComplete) {
    return (
      <div className="bg-green-50 rounded-xl border-2 border-green-200 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-900">
              Payouts Enabled
            </h3>
            <p className="text-green-700 mt-1">
              Your account is set up to receive payments from plot rentals.
              Funds are automatically transferred to your connected bank account.
            </p>
            {status.dashboardUrl && (
              <a
                href={status.dashboardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                View Stripe Dashboard
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Has account but incomplete - show continue setup
  if (status?.hasConnectAccount && !status.onboardingComplete) {
    return (
      <div className="bg-amber-50 rounded-xl border-2 border-amber-200 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-amber-900">
              Complete Your Payout Setup
            </h3>
            <p className="text-amber-700 mt-1">
              You started setting up payouts but haven't finished. Complete the
              setup to start receiving payments from your plot rentals.
            </p>
            <div className="mt-3 text-sm text-amber-700">
              <p>
                {status.chargesEnabled ? '- Charges: Enabled' : '- Charges: Not yet enabled'}
              </p>
              <p>
                {status.payoutsEnabled ? '- Payouts: Enabled' : '- Payouts: Not yet enabled'}
              </p>
            </div>
            <button
              onClick={handleSetupOrContinue}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Continue Setup
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // No account - show setup prompt
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <CreditCard className="h-6 w-6 text-gray-600" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            Set Up Payouts
          </h3>
          <p className="text-gray-600 mt-1">
            Connect your bank account to receive payments when renters book your
            plots. We use Stripe for secure, reliable payouts.
          </p>
          <ul className="mt-3 space-y-1 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Secure bank-level encryption
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Automatic deposits to your account
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Track earnings and view reports
            </li>
          </ul>
          <button
            onClick={handleSetupOrContinue}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Set Up Payouts
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

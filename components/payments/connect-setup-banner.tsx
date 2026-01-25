'use client'

import { useEffect, useState } from 'react'
import { CreditCard, ArrowRight, X, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface ConnectStatus {
  hasConnectAccount: boolean
  onboardingComplete: boolean
}

interface UserInfo {
  hasPlots: boolean
  role: string[]
}

export function ConnectSetupBanner() {
  const [status, setStatus] = useState<ConnectStatus | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if banner was dismissed this session
    const dismissed = sessionStorage.getItem('connectBannerDismissed')
    if (dismissed) {
      setIsDismissed(true)
      setIsLoading(false)
      return
    }

    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch connect status and user plots in parallel
      const [connectRes, plotsRes] = await Promise.all([
        fetch('/api/stripe/connect'),
        fetch('/api/plots/mine'),
      ])

      if (connectRes.ok) {
        const connectData = await connectRes.json()
        setStatus(connectData)
      }

      if (plotsRes.ok) {
        const plotsData = await plotsRes.json()
        setUserInfo({
          hasPlots: Array.isArray(plotsData) && plotsData.length > 0,
          role: ['LANDOWNER'],
        })
      }
    } catch (error) {
      console.error('Error fetching banner data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    sessionStorage.setItem('connectBannerDismissed', 'true')
  }

  // Don't show if loading, dismissed, already connected, or no plots
  if (isLoading || isDismissed || status?.onboardingComplete || !userInfo?.hasPlots) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 relative">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-full transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-4 pr-8">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <CreditCard className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-400">
            {status?.hasConnectAccount
              ? 'Complete Your Payout Setup'
              : 'Set Up Payouts to Receive Earnings'}
          </h3>
          <p className="text-amber-700 dark:text-amber-300 mt-1 text-sm">
            {status?.hasConnectAccount
              ? 'You started setting up payouts but haven\'t finished. Complete the setup to receive payments from your plot rentals.'
              : 'Connect your bank account to receive payments when renters book your plots. It only takes a few minutes.'}
          </p>
          <Link
            href="/dashboard/payments"
            className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors text-sm"
          >
            {status?.hasConnectAccount ? 'Continue Setup' : 'Set Up Payouts'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

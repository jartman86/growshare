'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { StripeConnectStatus } from '@/components/payments/stripe-connect-status'
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Loader2,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

interface EarningsSummary {
  totalEarnings: number
  pendingPayouts: number
  completedBookings: number
  activeBookings: number
}

export default function PaymentsDashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [earnings, setEarnings] = useState<EarningsSummary>({
    totalEarnings: 0,
    pendingPayouts: 0,
    completedBookings: 0,
    activeBookings: 0,
  })

  useEffect(() => {
    fetchEarnings()
  }, [])

  const fetchEarnings = async () => {
    try {
      // Fetch bookings as owner to calculate earnings
      const response = await fetch('/api/bookings?type=owner')
      if (response.ok) {
        const bookings = await response.json()

        // Calculate earnings from paid bookings
        let totalEarnings = 0
        let completedBookings = 0
        let activeBookings = 0

        bookings.forEach((booking: { status: string; paidAt?: string; totalAmount: number }) => {
          if (booking.status === 'COMPLETED' && booking.paidAt) {
            totalEarnings += booking.totalAmount
            completedBookings++
          } else if (booking.status === 'ACTIVE' && booking.paidAt) {
            totalEarnings += booking.totalAmount
            activeBookings++
          }
        })

        setEarnings({
          totalEarnings,
          pendingPayouts: 0, // Would need Stripe API to calculate pending
          completedBookings,
          activeBookings,
        })
      }
    } catch (error) {
      console.error('Error fetching earnings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-screen topo-lines py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payments</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your payout settings and view your earnings
            </p>
          </div>

          {/* Stripe Connect Status */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Payout Account
            </h2>
            <StripeConnectStatus
              onStatusChange={(status) => setIsConnected(status.onboardingComplete)}
            />
          </section>

          {/* Earnings Summary */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Earnings Summary
            </h2>

            {isLoading ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-8">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-green-600 dark:text-green-400" />
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Loading earnings...</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Total Earnings */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Earnings
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(earnings.totalEarnings)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    From all paid bookings
                  </p>
                </div>

                {/* Active Bookings */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Active Rentals
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {earnings.activeBookings}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Currently in progress
                  </p>
                </div>

                {/* Completed Bookings */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Completed Rentals
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {earnings.completedBookings}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Successfully finished
                  </p>
                </div>

                {/* Platform Fee Info */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Platform Fee
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    GrowShare charges a 10% platform fee on each transaction.
                    This helps us maintain the platform and provide support.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Payout Schedule Info */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              How Payouts Work
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Renter Makes Payment
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      When a renter pays for their booking, the funds are held
                      securely by Stripe.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Automatic Transfer
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Funds are automatically transferred to your connected bank
                      account, minus the 10% platform fee.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Payout Schedule
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Payouts typically arrive in your bank account within 2-7
                      business days, depending on your bank.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Refund Policy */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Refund Policy
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                If a booking is cancelled, refunds are processed according to
                the following policy:
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-700 dark:text-gray-300">7+ days before start</span>
                  <span className="font-medium text-green-600 dark:text-green-400">100% refund</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-700 dark:text-gray-300">3-6 days before start</span>
                  <span className="font-medium text-amber-600 dark:text-amber-400">50% refund</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700 dark:text-gray-300">Less than 3 days before start</span>
                  <span className="font-medium text-red-600 dark:text-red-400">No refund</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}

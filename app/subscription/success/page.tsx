'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CheckCircle, Loader2, BookOpen, Calendar, Award, ArrowRight } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function SubscriptionSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [verified, setVerified] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4a7c2c', '#aed581', '#FFD700'],
    })

    // Verify the subscription was created
    const verifySubscription = async () => {
      try {
        const response = await fetch('/api/subscriptions/status')
        if (response.ok) {
          const data = await response.json()
          setVerified(data.hasSubscription)
        }
      } catch (error) {
        console.error('Error verifying subscription:', error)
      } finally {
        setLoading(false)
      }
    }

    // Give Stripe webhook time to process
    const timer = setTimeout(verifySubscription, 2000)
    return () => clearTimeout(timer)
  }, [sessionId])

  return (
    <>
      <Header />

      <main className="min-h-screen topo-lines flex items-center">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-16 w-16 animate-spin text-green-600" />
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Setting up your subscription...
              </p>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to GrowShare Pro!
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Your subscription is now active. You have unlimited access to all premium courses,
                live sessions, and certifications.
              </p>

              {/* Quick Links */}
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <Link
                  href="/knowledge"
                  className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
                >
                  <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Browse Courses
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Start learning now
                  </p>
                </Link>

                <Link
                  href="/knowledge?view=calendar"
                  className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
                >
                  <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Upcoming Events
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Join live sessions
                  </p>
                </Link>

                <Link
                  href="/dashboard/certificates"
                  className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
                >
                  <Award className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Certifications
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Earn credentials
                  </p>
                </Link>
              </div>

              <Link
                href="/knowledge"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Start Learning
                <ArrowRight className="h-5 w-5" />
              </Link>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  Check,
  X,
  Loader2,
  BookOpen,
  Award,
  Calendar,
  Video,
  Users,
  Star,
  Sparkles,
  Crown,
} from 'lucide-react'

interface SubscriptionStatus {
  hasSubscription: boolean
  subscription: {
    id: string
    status: string
    currentPeriodEnd: string
    cancelAtPeriodEnd: boolean
  } | null
}

const SUBSCRIPTION_FEATURES = [
  { name: 'Access all premium courses', included: true },
  { name: 'Exclusive live sessions', included: true },
  { name: 'Priority Q&A with instructors', included: true },
  { name: 'Downloadable course materials', included: true },
  { name: 'Certification exams included', included: true },
  { name: 'Monthly live workshops', included: true },
  { name: 'Community forum access', included: true },
  { name: 'Cancel anytime', included: true },
]

const FREE_FEATURES = [
  { name: 'Access free courses', included: true },
  { name: 'Basic community forum', included: true },
  { name: 'Public live session recordings', included: true },
  { name: 'Premium courses', included: false },
  { name: 'Live sessions access', included: false },
  { name: 'Certification exams', included: false },
  { name: 'Downloadable materials', included: false },
  { name: 'Priority support', included: false },
]

export default function SubscriptionPage() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useUser()
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(false)
  const [canceling, setCanceling] = useState(false)
  const [reactivating, setReactivating] = useState(false)
  const [openingPortal, setOpeningPortal] = useState(false)

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchSubscriptionStatus()
    } else if (isLoaded) {
      setLoading(false)
    }
  }, [isLoaded, isSignedIn])

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/subscriptions/status')
      if (response.ok) {
        const data = await response.json()
        setSubscriptionStatus(data)
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async () => {
    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }

    setSubscribing(true)
    try {
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
      })
      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Failed to start checkout')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred')
    } finally {
      setSubscribing(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel? You will retain access until the end of your billing period.')) {
      return
    }

    setCanceling(true)
    try {
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
      })
      const data = await response.json()

      if (response.ok) {
        fetchSubscriptionStatus()
      } else {
        alert(data.error || 'Failed to cancel')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred')
    } finally {
      setCanceling(false)
    }
  }

  const handleReactivate = async () => {
    setReactivating(true)
    try {
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'DELETE',
      })
      const data = await response.json()

      if (response.ok) {
        fetchSubscriptionStatus()
      } else {
        alert(data.error || 'Failed to reactivate')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred')
    } finally {
      setReactivating(false)
    }
  }

  const handlePortal = async () => {
    setOpeningPortal(true)
    try {
      const response = await fetch('/api/subscriptions/portal', {
        method: 'POST',
      })
      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Failed to open billing portal')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred')
    } finally {
      setOpeningPortal(false)
    }
  }

  const isSubscribed = subscriptionStatus?.hasSubscription

  return (
    <>
      <Header />

      <main className="min-h-screen topo-lines">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#2d5016] via-[#4a7c2c] to-[#6b8f47] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Crown className="h-10 w-10" />
              <h1 className="text-4xl font-bold">GrowShare Pro</h1>
            </div>
            <p className="text-xl text-[#f4e4c1] max-w-2xl mx-auto">
              Unlock unlimited access to all premium courses, live sessions, and certifications.
              Become a certified expert in sustainable agriculture.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : (
            <>
              {/* Current Subscription Status */}
              {isSubscribed && subscriptionStatus?.subscription && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-green-800 dark:text-green-300">
                        You're a GrowShare Pro Member
                      </h2>
                      <p className="text-green-600 dark:text-green-400">
                        {subscriptionStatus.subscription.cancelAtPeriodEnd
                          ? `Access until ${new Date(subscriptionStatus.subscription.currentPeriodEnd).toLocaleDateString()}`
                          : `Renews on ${new Date(subscriptionStatus.subscription.currentPeriodEnd).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handlePortal}
                      disabled={openingPortal}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                    >
                      {openingPortal ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        'Manage Billing'
                      )}
                    </button>

                    {subscriptionStatus.subscription.cancelAtPeriodEnd ? (
                      <button
                        onClick={handleReactivate}
                        disabled={reactivating}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                      >
                        {reactivating ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          'Reactivate Subscription'
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={handleCancel}
                        disabled={canceling}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
                      >
                        {canceling ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          'Cancel Subscription'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Pricing Cards */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Free Tier */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md overflow-hidden">
                  <div className="p-6 border-b dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Free
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">$0</span>
                      <span className="text-gray-500 dark:text-gray-400">/month</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Get started with free courses
                    </p>
                  </div>

                  <div className="p-6">
                    <ul className="space-y-3">
                      {FREE_FEATURES.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          )}
                          <span
                            className={
                              feature.included
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-400 dark:text-gray-500'
                            }
                          >
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => router.push('/knowledge')}
                      className="w-full mt-6 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors"
                    >
                      Browse Free Courses
                    </button>
                  </div>
                </div>

                {/* Pro Tier */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-500 shadow-xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 bg-green-600 text-white px-4 py-1 rounded-bl-lg text-sm font-medium flex items-center gap-1">
                    <Sparkles className="h-4 w-4" />
                    Most Popular
                  </div>

                  <div className="p-6 border-b border-green-200 dark:border-green-800">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <Crown className="h-5 w-5 text-yellow-500" />
                      Pro
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">$19.99</span>
                      <span className="text-gray-500 dark:text-gray-400">/month</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Unlimited access to everything
                    </p>
                  </div>

                  <div className="p-6">
                    <ul className="space-y-3">
                      {SUBSCRIPTION_FEATURES.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <span className="text-gray-900 dark:text-white">{feature.name}</span>
                        </li>
                      ))}
                    </ul>

                    {isSubscribed ? (
                      <div className="w-full mt-6 px-4 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg font-semibold text-center flex items-center justify-center gap-2">
                        <Check className="h-5 w-5" />
                        Current Plan
                      </div>
                    ) : (
                      <button
                        onClick={handleSubscribe}
                        disabled={subscribing}
                        className="w-full mt-6 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        {subscribing ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <>
                            <Crown className="h-5 w-5" />
                            Subscribe Now
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
                  What's Included with Pro
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Premium Courses
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Access all courses including advanced certifications and expert-led content
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 text-center">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Video className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Live Sessions
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Join exclusive live webinars, Q&As, and workshops with industry experts
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 text-center">
                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Certifications
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Earn recognized certifications that boost your profile and credibility
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Event Access
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Priority registration for all events with calendar integration
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 text-center">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Community
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Connect with fellow farmers and instructors in our premium community
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 text-center">
                    <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Star className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Priority Support
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get help faster with dedicated support for Pro members
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4 max-w-3xl mx-auto">
                  <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Can I cancel anytime?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Yes! You can cancel your subscription at any time. You'll retain access until the end of your current billing period.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      What payment methods do you accept?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      We accept all major credit cards including Visa, Mastercard, and American Express through our secure Stripe payment system.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Do I keep my certificates if I cancel?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Any certificates you earn are yours to keep forever, even if you cancel your subscription.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

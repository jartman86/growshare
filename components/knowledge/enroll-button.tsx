'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { CheckCircle, Loader2, Lock } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface EnrollButtonProps {
  course: {
    id: string
    title: string
    price?: number | null
    accessType?: string
  }
}

function PaymentForm({
  courseId,
  courseTitle,
  onSuccess,
  onCancel,
}: {
  courseId: string
  courseTitle: string
  onSuccess: () => void
  onCancel: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setIsProcessing(true)
    setError(null)

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/learn/${courseId}?success=true`,
      },
    })

    if (submitError) {
      setError(submitError.message || 'Payment failed')
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Complete Purchase
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Purchasing: {courseTitle}
        </p>
        <form onSubmit={handleSubmit}>
          <PaymentElement />
          {error && (
            <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={!stripe || isProcessing}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Pay Now'
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isProcessing}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function EnrollButton({ course }: EnrollButtonProps) {
  const router = useRouter()
  const { isSignedIn } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [accessStatus, setAccessStatus] = useState<{
    hasAccess: boolean
    reason?: string
  } | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  useEffect(() => {
    if (isSignedIn) {
      checkAccess()
    }
  }, [isSignedIn, course.id])

  const checkAccess = async () => {
    try {
      const response = await fetch(`/api/courses/${course.id}/access`)
      const data = await response.json()
      setAccessStatus(data)
    } catch (error) {
      console.error('Error checking access:', error)
    }
  }

  const handleEnrollFree = async () => {
    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/courses/${course.id}/enroll`, {
        method: 'POST',
      })

      if (response.ok) {
        await checkAccess()
        router.push(`/learn/${course.id}`)
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to enroll')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePurchase = async () => {
    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/courses/${course.id}/purchase`, {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok && data.clientSecret) {
        setClientSecret(data.clientSecret)
        setShowPaymentForm(true)
      } else {
        alert(data.error || 'Failed to initiate purchase')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false)
    setClientSecret(null)
    checkAccess()
    router.push(`/learn/${course.id}?success=true`)
  }

  // Determine the access type based on the course data
  const accessType = course.accessType || (course.price === 0 || !course.price ? 'FREE' : 'ONE_TIME')
  const isFree = accessType === 'FREE'
  const price = course.price || 0

  // If user has access, show "Go to Course" button
  if (accessStatus?.hasAccess) {
    return (
      <div className="space-y-3">
        <button
          className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
          disabled
        >
          <CheckCircle className="h-5 w-5 text-green-600" />
          {accessStatus.reason === 'instructor' ? 'Your Course' : 'Enrolled'}
        </button>
        <button
          onClick={() => router.push(`/learn/${course.id}`)}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-semibold transition-colors"
        >
          {accessStatus.reason === 'instructor' ? 'Preview Course' : 'Go to Course'}
        </button>
      </div>
    )
  }

  // Show sign-in prompt if not signed in
  if (!isSignedIn) {
    return (
      <button
        onClick={() => router.push('/sign-in')}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg font-semibold transition-colors"
      >
        Sign in to {isFree ? 'Enroll' : 'Purchase'}
      </button>
    )
  }

  // Subscription-only course
  if (accessType === 'SUBSCRIPTION' && accessStatus?.reason === 'needs_subscription') {
    return (
      <div className="space-y-3">
        <button
          onClick={() => router.push('/subscription')}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Lock className="h-5 w-5" />
          Subscribe to Access
        </button>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Available with GrowShare subscription
        </p>
      </div>
    )
  }

  // Free course - show enroll button
  if (isFree) {
    return (
      <button
        onClick={handleEnrollFree}
        disabled={isLoading}
        className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Enrolling...
          </>
        ) : (
          'Enroll for Free'
        )}
      </button>
    )
  }

  // Paid course - show purchase button
  return (
    <>
      <button
        onClick={handlePurchase}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          `Buy Now - $${price}`
        )}
      </button>

      {showPaymentForm && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm
            courseId={course.id}
            courseTitle={course.title}
            onSuccess={handlePaymentSuccess}
            onCancel={() => {
              setShowPaymentForm(false)
              setClientSecret(null)
            }}
          />
        </Elements>
      )}
    </>
  )
}

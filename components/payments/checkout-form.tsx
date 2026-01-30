'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { getStripe } from '@/lib/stripe-client'
import { Loader2, CreditCard, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'

interface CheckoutFormProps {
  type: 'booking' | 'order'
  entityId: string
  amount: number
  onSuccess?: () => void
  onError?: (error: string) => void
}

// Map Stripe error codes to user-friendly messages
function getErrorMessage(error: { code?: string; message?: string }): string {
  switch (error.code) {
    case 'card_declined':
      return 'Your card was declined. Please try a different payment method.'
    case 'expired_card':
      return 'Your card has expired. Please use a different card.'
    case 'incorrect_cvc':
      return 'The security code (CVC) is incorrect. Please check and try again.'
    case 'incorrect_number':
      return 'The card number is incorrect. Please check and try again.'
    case 'insufficient_funds':
      return 'Insufficient funds. Please try a different payment method.'
    case 'processing_error':
      return 'An error occurred while processing your card. Please try again.'
    case 'invalid_expiry_month':
    case 'invalid_expiry_year':
      return 'The expiration date is invalid. Please check and try again.'
    case 'rate_limit':
      return 'Too many requests. Please wait a moment and try again.'
    default:
      return error.message || 'An error occurred during payment. Please try again.'
  }
}

const MAX_RETRY_ATTEMPTS = 3

function PaymentForm({
  onSuccess,
  onError,
  onRetry,
  retryCount,
}: {
  onSuccess?: () => void
  onError?: (error: string) => void
  onRetry?: () => void
  retryCount: number
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setErrorMessage(null)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
      redirect: 'if_required',
    })

    if (error) {
      const friendlyMessage = getErrorMessage(error)
      setErrorMessage(friendlyMessage)
      onError?.(friendlyMessage)
      setIsProcessing(false)
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setIsSuccess(true)
      onSuccess?.()
    } else if (paymentIntent && paymentIntent.status === 'requires_action') {
      // Handle 3D Secure or other authentication
      setErrorMessage('Additional authentication required. Please complete the verification.')
      setIsProcessing(false)
    }
  }

  const canRetry = retryCount < MAX_RETRY_ATTEMPTS && errorMessage && !isSuccess

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />

      {isSuccess && (
        <div className="p-4 rounded-lg flex items-center gap-2 bg-green-50 text-green-800">
          <CheckCircle className="h-5 w-5" />
          <p className="text-sm">Payment successful!</p>
        </div>
      )}

      {errorMessage && !isSuccess && (
        <div className="p-4 rounded-lg bg-red-50 text-red-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{errorMessage}</p>
          </div>
          {canRetry && onRetry && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-red-600">
                Attempts: {retryCount}/{MAX_RETRY_ATTEMPTS}
              </span>
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1 text-sm text-red-700 hover:text-red-900 font-medium"
              >
                <RefreshCw className="h-4 w-4" />
                Create New Payment
              </button>
            </div>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing || isSuccess}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle className="h-5 w-5" />
            Payment Complete
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            Pay Now
          </>
        )}
      </button>
    </form>
  )
}

export function CheckoutForm({
  type,
  entityId,
  amount,
  onSuccess,
  onError,
}: CheckoutFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [intentKey, setIntentKey] = useState(0) // Used to force re-creation

  const createIntent = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setClientSecret(null)

    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          bookingId: type === 'booking' ? entityId : undefined,
          orderId: type === 'order' ? entityId : undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create payment intent')
      }

      const data = await response.json()
      setClientSecret(data.clientSecret)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize payment')
      onError?.(err instanceof Error ? err.message : 'Failed to initialize payment')
    } finally {
      setIsLoading(false)
    }
  }, [type, entityId, onError])

  useEffect(() => {
    createIntent()
  }, [createIntent, intentKey])

  const handleRetry = () => {
    if (retryCount < MAX_RETRY_ATTEMPTS) {
      setRetryCount((prev) => prev + 1)
      setIntentKey((prev) => prev + 1) // Force new payment intent
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
        <p className="mt-4 text-gray-600">Initializing payment...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 text-red-800">
          <AlertCircle className="h-5 w-5" />
          <p className="font-medium">Payment Error</p>
        </div>
        <p className="mt-2 text-sm text-red-700">{error}</p>
        {retryCount < MAX_RETRY_ATTEMPTS ? (
          <button
            onClick={handleRetry}
            className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again ({MAX_RETRY_ATTEMPTS - retryCount} attempts left)
          </button>
        ) : (
          <p className="mt-4 text-sm text-red-600">
            Maximum retry attempts reached. Please contact support or try again later.
          </p>
        )}
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Unable to initialize payment. Please try again.</p>
      </div>
    )
  }

  const stripePromise = getStripe()

  return (
    <div className="space-y-6">
      {/* Amount Summary */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Total Amount</span>
          <span className="text-2xl font-bold text-gray-900">
            ${amount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Stripe Elements */}
      <Elements
        key={intentKey} // Force re-mount on retry
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#16a34a',
              colorBackground: '#ffffff',
              colorText: '#1f2937',
              colorDanger: '#ef4444',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              borderRadius: '8px',
            },
          },
        }}
      >
        <PaymentForm
          onSuccess={onSuccess}
          onError={onError}
          onRetry={handleRetry}
          retryCount={retryCount}
        />
      </Elements>

      {/* Security Note */}
      <p className="text-xs text-center text-gray-500">
        Your payment information is securely processed by Stripe.
        GrowShare never stores your card details.
      </p>
    </div>
  )
}

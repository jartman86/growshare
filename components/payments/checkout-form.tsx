'use client'

import { useState, useEffect } from 'react'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { getStripe } from '@/lib/stripe-client'
import { Loader2, CreditCard, CheckCircle, AlertCircle } from 'lucide-react'

interface CheckoutFormProps {
  type: 'booking' | 'order'
  entityId: string
  amount: number
  onSuccess?: () => void
  onError?: (error: string) => void
}

function PaymentForm({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void
  onError?: (error: string) => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setMessage(null)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
      redirect: 'if_required',
    })

    if (error) {
      setMessage(error.message || 'An error occurred')
      onError?.(error.message || 'Payment failed')
      setIsProcessing(false)
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setMessage('Payment successful!')
      onSuccess?.()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />

      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-2 ${
            message.includes('successful')
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message.includes('successful') ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <p className="text-sm">{message}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
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

  useEffect(() => {
    const createIntent = async () => {
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
        console.error('Error creating payment intent:', err)
        setError(err instanceof Error ? err.message : 'Failed to initialize payment')
        onError?.(err instanceof Error ? err.message : 'Failed to initialize payment')
      } finally {
        setIsLoading(false)
      }
    }

    createIntent()
  }, [type, entityId, onError])

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
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
        >
          Try Again
        </button>
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
        <PaymentForm onSuccess={onSuccess} onError={onError} />
      </Elements>

      {/* Security Note */}
      <p className="text-xs text-center text-gray-500">
        Your payment information is securely processed by Stripe.
        GrowShare never stores your card details.
      </p>
    </div>
  )
}

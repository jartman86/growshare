'use client'

import { useState } from 'react'
import {
  Shield,
  Phone,
  IdCard,
  Mail,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Upload,
  Loader2,
  X
} from 'lucide-react'

interface VerificationStatusProps {
  isEmailVerified?: boolean
  isPhoneVerified?: boolean
  phoneVerifiedAt?: string | null
  isIdVerified?: boolean
  idVerifiedAt?: string | null
  phoneNumber?: string | null
  showActions?: boolean
  compact?: boolean
}

export function VerificationStatus({
  isEmailVerified = false,
  isPhoneVerified = false,
  phoneVerifiedAt,
  isIdVerified = false,
  idVerifiedAt,
  phoneNumber,
  showActions = false,
  compact = false,
}: VerificationStatusProps) {
  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [showIdModal, setShowIdModal] = useState(false)
  const [phoneInput, setPhoneInput] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [idPending, setIdPending] = useState(false)

  const verificationLevel = (isEmailVerified ? 1 : 0) + (isPhoneVerified ? 1 : 0) + (isIdVerified ? 1 : 0)
  const maxLevel = 3

  const handleSendCode = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/verification/phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phoneInput }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send code')
      }

      setCodeSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/verification/phone', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify code')
      }

      setShowPhoneModal(false)
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitId = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // In a real implementation, you would upload the document to Cloudinary first
      // and then submit the URL to the API
      const documentUrl = 'placeholder-url' // This would be the Cloudinary URL

      const response = await fetch('/api/verification/id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit ID')
      }

      setIdPending(true)
      setShowIdModal(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Shield className={`h-4 w-4 ${verificationLevel > 0 ? 'text-green-600' : 'text-gray-400'}`} />
          <span className="text-sm font-medium text-gray-700">
            Level {verificationLevel}/{maxLevel}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {isEmailVerified && (
            <span title="Email verified">
              <Mail className="h-4 w-4 text-green-600" />
            </span>
          )}
          {isPhoneVerified && (
            <span title="Phone verified">
              <Phone className="h-4 w-4 text-green-600" />
            </span>
          )}
          {isIdVerified && (
            <span title="ID verified">
              <IdCard className="h-4 w-4 text-green-600" />
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Verification Status
          </h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            verificationLevel === maxLevel
              ? 'bg-green-100 text-green-700'
              : verificationLevel > 0
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-600'
          }`}>
            Level {verificationLevel}/{maxLevel}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
            style={{ width: `${(verificationLevel / maxLevel) * 100}%` }}
          />
        </div>

        {/* Verification Items */}
        <div className="space-y-4">
          {/* Email */}
          <div className={`flex items-center justify-between p-3 rounded-lg ${
            isEmailVerified ? 'bg-green-50' : 'bg-gray-50'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                isEmailVerified ? 'bg-green-100' : 'bg-gray-200'
              }`}>
                <Mail className={`h-5 w-5 ${
                  isEmailVerified ? 'text-green-600' : 'text-gray-500'
                }`} />
              </div>
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-500">
                  {isEmailVerified ? 'Verified via Clerk' : 'Not verified'}
                </p>
              </div>
            </div>
            {isEmailVerified ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-gray-400" />
            )}
          </div>

          {/* Phone */}
          <div className={`flex items-center justify-between p-3 rounded-lg ${
            isPhoneVerified ? 'bg-green-50' : 'bg-gray-50'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                isPhoneVerified ? 'bg-green-100' : 'bg-gray-200'
              }`}>
                <Phone className={`h-5 w-5 ${
                  isPhoneVerified ? 'text-green-600' : 'text-gray-500'
                }`} />
              </div>
              <div>
                <p className="font-medium text-gray-900">Phone</p>
                <p className="text-sm text-gray-500">
                  {isPhoneVerified
                    ? `Verified ${phoneVerifiedAt ? new Date(phoneVerifiedAt).toLocaleDateString() : ''}`
                    : phoneNumber || 'Not verified'
                  }
                </p>
              </div>
            </div>
            {isPhoneVerified ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : showActions ? (
              <button
                onClick={() => setShowPhoneModal(true)}
                className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1"
              >
                Verify
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <AlertCircle className="h-5 w-5 text-gray-400" />
            )}
          </div>

          {/* ID */}
          <div className={`flex items-center justify-between p-3 rounded-lg ${
            isIdVerified ? 'bg-green-50' : idPending ? 'bg-yellow-50' : 'bg-gray-50'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                isIdVerified ? 'bg-green-100' : idPending ? 'bg-yellow-100' : 'bg-gray-200'
              }`}>
                <IdCard className={`h-5 w-5 ${
                  isIdVerified ? 'text-green-600' : idPending ? 'text-yellow-600' : 'text-gray-500'
                }`} />
              </div>
              <div>
                <p className="font-medium text-gray-900">Government ID</p>
                <p className="text-sm text-gray-500">
                  {isIdVerified
                    ? `Verified ${idVerifiedAt ? new Date(idVerifiedAt).toLocaleDateString() : ''}`
                    : idPending
                      ? 'Pending review'
                      : 'Not verified'
                  }
                </p>
              </div>
            </div>
            {isIdVerified ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : idPending ? (
              <Clock className="h-5 w-5 text-yellow-600" />
            ) : showActions ? (
              <button
                onClick={() => setShowIdModal(true)}
                className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1"
              >
                Verify
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <AlertCircle className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-6 pt-4 border-t">
          <p className="text-sm text-gray-600">
            <strong>Why verify?</strong> Verified users get priority in search results,
            higher trust from other users, and access to premium features.
          </p>
        </div>
      </div>

      {/* Phone Verification Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Verify Phone Number</h3>
              <button
                onClick={() => {
                  setShowPhoneModal(false)
                  setCodeSent(false)
                  setPhoneInput('')
                  setVerificationCode('')
                  setError(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {!codeSent ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <button
                  onClick={handleSendCode}
                  disabled={isLoading || !phoneInput}
                  className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Send Verification Code'
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  We sent a 6-digit code to <strong>{phoneInput}</strong>
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    maxLength={6}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-2xl tracking-widest"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <button
                  onClick={handleVerifyCode}
                  disabled={isLoading || verificationCode.length !== 6}
                  className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Verify Code'
                  )}
                </button>

                <button
                  onClick={() => {
                    setCodeSent(false)
                    setVerificationCode('')
                    setError(null)
                  }}
                  className="w-full text-gray-600 hover:text-gray-800 text-sm"
                >
                  Use a different number
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ID Verification Modal */}
      {showIdModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Verify Identity</h3>
              <button
                onClick={() => {
                  setShowIdModal(false)
                  setError(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Upload a clear photo of your government-issued ID (driver's license, passport, or national ID card).
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG or PDF up to 10MB
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  Your ID will be reviewed by our team within 24-48 hours.
                  Your document is encrypted and securely stored.
                </p>
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <button
                onClick={handleSubmitId}
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Submit for Review'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { Loader2, Check, User, MapPin, Sprout, Home } from 'lucide-react'

type UserRole = 'LANDOWNER' | 'RENTER' | 'BOTH'

interface OnboardingData {
  role: UserRole[]
  username: string
  location: string
  bio: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<OnboardingData>({
    role: [],
    username: '',
    location: '',
    bio: '',
  })

  // Check if user already completed onboarding
  useEffect(() => {
    const checkOnboarding = async () => {
      if (!isLoaded || !user) return

      try {
        const response = await fetch('/api/users/me')
        if (response.ok) {
          const userData = await response.json()
          if (userData.onboardingComplete) {
            // User already completed onboarding, redirect to dashboard
            router.push('/dashboard')
          } else if (userData.username) {
            // Pre-fill username if auto-generated
            setFormData(prev => ({
              ...prev,
              username: userData.username || '',
              location: userData.location || '',
              bio: userData.bio || '',
            }))
          }
        }
      } catch (err) {
        console.error('Error checking onboarding status:', err)
      }
    }

    checkOnboarding()
  }, [user, isLoaded, router])

  const handleRoleToggle = (role: 'LANDOWNER' | 'RENTER') => {
    setFormData(prev => {
      const roles = prev.role.includes(role)
        ? prev.role.filter(r => r !== role)
        : [...prev.role, role]
      return { ...prev, role: roles }
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      // Update user profile
      const response = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          location: formData.location,
          bio: formData.bio,
          role: formData.role,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update profile')
      }

      // Success! Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  const handleSkip = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/users/onboarding/skip', {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to skip onboarding')
      }

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  const canProceedStep1 = formData.role.length > 0
  const canProceedStep2 = formData.username.trim().length >= 3 && formData.location.trim().length > 0

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#5a7f3a]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {step} of 2</span>
            <span className="text-sm text-gray-500">{step === 1 ? 'Role Selection' : 'Profile Setup'}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#5a7f3a] transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  Welcome to GrowShare! 🌱
                </h1>
                <p className="text-lg text-gray-600">
                  Let's get you set up. First, tell us how you'll be using GrowShare.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Landowner Option */}
                <button
                  onClick={() => handleRoleToggle('LANDOWNER')}
                  className={`
                    relative p-6 rounded-xl border-2 transition-all text-left
                    ${formData.role.includes('LANDOWNER')
                      ? 'border-[#5a7f3a] bg-[#5a7f3a]/5 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  {formData.role.includes('LANDOWNER') && (
                    <div className="absolute top-4 right-4">
                      <Check className="h-6 w-6 text-[#5a7f3a]" />
                    </div>
                  )}
                  <Home className="h-12 w-12 text-[#5a7f3a] mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    I'm a Landowner
                  </h3>
                  <p className="text-gray-600">
                    I have land to share and want to earn passive income while supporting local agriculture.
                  </p>
                </button>

                {/* Grower Option */}
                <button
                  onClick={() => handleRoleToggle('RENTER')}
                  className={`
                    relative p-6 rounded-xl border-2 transition-all text-left
                    ${formData.role.includes('RENTER')
                      ? 'border-[#5a7f3a] bg-[#5a7f3a]/5 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  {formData.role.includes('RENTER') && (
                    <div className="absolute top-4 right-4">
                      <Check className="h-6 w-6 text-[#5a7f3a]" />
                    </div>
                  )}
                  <Sprout className="h-12 w-12 text-[#6b8e5a] mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    I'm a Grower
                  </h3>
                  <p className="text-gray-600">
                    I'm looking for land to grow food and build a sustainable farming business.
                  </p>
                </button>
              </div>

              <div className="text-center text-sm text-gray-500">
                <p>You can select both if you plan to list land and rent land.</p>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={handleSkip}
                  disabled={loading}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Skip for now
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                  className="px-8 py-3 bg-[#5a7f3a] text-white rounded-md font-semibold hover:bg-[#4a6f2a] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Profile Setup */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  Set Up Your Profile
                </h1>
                <p className="text-lg text-gray-600">
                  Help others in the community get to know you.
                </p>
              </div>

              <div className="space-y-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                      placeholder="e.g., johndoe"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5a7f3a] focus:border-transparent"
                      maxLength={30}
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Your unique username (letters, numbers, hyphens, underscores only)
                  </p>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Portland, Oregon"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5a7f3a] focus:border-transparent"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Your city or region (helps connect you with local growers/landowners)
                  </p>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio (Optional)
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us a bit about yourself and your growing interests..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5a7f3a] focus:border-transparent resize-none"
                    maxLength={500}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.bio.length}/500 characters
                  </p>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSkip}
                    disabled={loading}
                    className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Skip for now
                  </button>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!canProceedStep2 || loading}
                  className="px-8 py-3 bg-[#5a7f3a] text-white rounded-md font-semibold hover:bg-[#4a6f2a] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                  {loading ? 'Setting up...' : 'Complete Setup'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

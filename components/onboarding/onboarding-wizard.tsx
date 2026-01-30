'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Sprout,
  MapPin,
  UserCircle,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Camera,
  X
} from 'lucide-react'

interface OnboardingWizardProps {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    avatar?: string | null
  }
  onComplete: () => void
  onSkip: () => void
}

type Step = 'welcome' | 'role' | 'profile' | 'location' | 'complete'

const ROLES = [
  {
    id: 'RENTER',
    title: 'Renter',
    description: 'Looking to rent land for gardening or farming',
    icon: '🌱',
  },
  {
    id: 'LANDOWNER',
    title: 'Landowner',
    description: 'I have land available to share',
    icon: '🏡',
  },
  {
    id: 'BUYER',
    title: 'Buyer',
    description: 'Looking to buy local produce',
    icon: '🛒',
  },
]

export function OnboardingWizard({ user, onComplete, onSkip }: OnboardingWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>('welcome')
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['RENTER'])
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [avatar, setAvatar] = useState(user.avatar || '')
  const [isUploading, setIsUploading] = useState(false)

  const steps: Step[] = ['welcome', 'role', 'profile', 'location', 'complete']
  const currentIndex = steps.indexOf(currentStep)
  const progress = ((currentIndex) / (steps.length - 1)) * 100

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles(prev =>
      prev.includes(roleId)
        ? prev.filter(r => r !== roleId)
        : [...prev, roleId]
    )
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      // Get Cloudinary signature
      const signatureRes = await fetch('/api/cloudinary/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folder: 'growshare/avatars',
          transformation: 'c_fill,w_200,h_200,g_face',
        }),
      })

      if (!signatureRes.ok) {
        throw new Error('Failed to get upload signature')
      }

      const { signature, timestamp, cloudName, apiKey } = await signatureRes.json()

      // Upload to Cloudinary
      const formData = new FormData()
      formData.append('file', file)
      formData.append('signature', signature)
      formData.append('timestamp', timestamp.toString())
      formData.append('api_key', apiKey)
      formData.append('folder', 'growshare/avatars')
      formData.append('transformation', 'c_fill,w_200,h_200,g_face')

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      )

      if (!uploadRes.ok) {
        throw new Error('Upload failed')
      }

      const uploadData = await uploadRes.json()
      setAvatar(uploadData.secure_url)
    } catch {
      alert('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleNext = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: selectedRoles,
          bio,
          location,
          avatar,
          onboardingComplete: true,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save profile')
      }

      onComplete()
    } catch {
      alert('Failed to save your profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-50 to-yellow-50 z-50 overflow-y-auto">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-10">
        <div
          className="h-full bg-green-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Skip Button */}
      <button
        onClick={onSkip}
        className="fixed top-4 right-4 text-gray-500 hover:text-gray-700 text-sm font-medium z-10"
      >
        Skip for now
      </button>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Welcome Step */}
          {currentStep === 'welcome' && (
            <div className="text-center animate-fadeIn">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sprout className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to GrowShare, {user.firstName}!
              </h1>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Let's get you set up in just a few steps. This will help us personalize
                your experience and connect you with the right people.
              </p>
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Get Started
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Role Selection Step */}
          {currentStep === 'role' && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                What brings you to GrowShare?
              </h2>
              <p className="text-gray-600 mb-8 text-center">
                Select all that apply. You can change this later.
              </p>

              <div className="space-y-3 mb-8">
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleToggle(role.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                      selectedRoles.includes(role.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-3xl">{role.icon}</span>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-gray-900">{role.title}</p>
                      <p className="text-sm text-gray-500">{role.description}</p>
                    </div>
                    {selectedRoles.includes(role.id) && (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={selectedRoles.length === 0}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Profile Step */}
          {currentStep === 'profile' && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                Tell us about yourself
              </h2>
              <p className="text-gray-600 mb-8 text-center">
                Add a photo and bio to help others get to know you.
              </p>

              {/* Avatar Upload */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt="Profile"
                      width={120}
                      height={120}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-[120px] h-[120px] rounded-full bg-gray-200 flex items-center justify-center">
                      <UserCircle className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 p-2 bg-green-600 rounded-full text-white cursor-pointer hover:bg-green-700 transition-colors">
                    {isUploading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Camera className="h-5 w-5" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={isUploading}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio (optional)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a little about yourself, your gardening experience, or what you're looking for..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {bio.length}/500
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Continue
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Location Step */}
          {currentStep === 'location' && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                Where are you located?
              </h2>
              <p className="text-gray-600 mb-8 text-center">
                This helps us show you nearby plots and connect you with local growers.
              </p>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City, State
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Austin, TX"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Your exact address is never shared publicly.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Continue
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Complete Step */}
          {currentStep === 'complete' && (
            <div className="text-center animate-fadeIn">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                You're all set!
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Your profile is ready. Start exploring plots, connecting with landowners,
                or list your own land to share.
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Start Exploring
                      <ChevronRight className="h-5 w-5" />
                    </>
                  )}
                </button>
                <button
                  onClick={handleBack}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Go Back
                </button>
              </div>
            </div>
          )}

          {/* Step Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentIndex ? 'bg-green-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  GraduationCap,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  BookOpen,
  Users,
  DollarSign,
  Award
} from 'lucide-react'

const EXPERTISE_OPTIONS = [
  { value: 'SOIL_SCIENCE', label: 'Soil Science & Composition' },
  { value: 'CROP_MANAGEMENT', label: 'Crop Management & Planning' },
  { value: 'PEST_DISEASE', label: 'Pest & Disease Control' },
  { value: 'IRRIGATION', label: 'Irrigation & Water Management' },
  { value: 'ORGANIC_FARMING', label: 'Organic & Sustainable Farming' },
  { value: 'PERMACULTURE', label: 'Permaculture Design' },
  { value: 'ANIMAL_HUSBANDRY', label: 'Animal Husbandry' },
  { value: 'BUSINESS', label: 'Farm Business & Marketing' },
  { value: 'FOOD_PRESERVATION', label: 'Food Preservation & Processing' },
  { value: 'SEASON_EXTENSION', label: 'Season Extension Techniques' },
]

export default function InstructorApplyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [isInstructor, setIsInstructor] = useState(false)
  const [existingApplication, setExistingApplication] = useState<any>(null)

  const [formData, setFormData] = useState({
    expertise: [] as string[],
    experience: '',
    bio: '',
    portfolioUrl: '',
    socialLinks: {
      youtube: '',
      linkedin: '',
      website: '',
    },
  })

  useEffect(() => {
    checkApplicationStatus()
  }, [])

  const checkApplicationStatus = async () => {
    try {
      const response = await fetch('/api/instructors/application')
      if (response.ok) {
        const data = await response.json()
        setIsInstructor(data.isInstructor)
        setExistingApplication(data.application)
      }
    } catch (error) {
      console.error('Error checking application status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExpertiseToggle = (value: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(value)
        ? prev.expertise.filter(e => e !== value)
        : [...prev.expertise, value],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/instructors/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          socialLinks: Object.fromEntries(
            Object.entries(formData.socialLinks).filter(([_, v]) => v)
          ),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        setExistingApplication(data.application)
      } else {
        setMessage(data.error || 'Failed to submit application')
      }
    } catch (error) {
      setMessage('An error occurred while submitting your application')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </main>
        <Footer />
      </>
    )
  }

  // Already an instructor
  if (isInstructor) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    You&apos;re Already an Instructor!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    You have full access to create and manage courses.
                  </p>
                  <button
                    onClick={() => router.push('/instructor')}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Go to Instructor Dashboard
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Has existing application
  if (existingApplication) {
    const statusConfig = {
      PENDING: {
        icon: Clock,
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        title: 'Application Under Review',
        description: 'Your instructor application is currently being reviewed. We\'ll notify you once a decision has been made.',
      },
      APPROVED: {
        icon: CheckCircle,
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        title: 'Application Approved!',
        description: 'Congratulations! Your instructor application has been approved.',
      },
      REJECTED: {
        icon: XCircle,
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        title: 'Application Not Approved',
        description: existingApplication.reviewNotes || 'Unfortunately, your application was not approved at this time.',
      },
    }

    const status = statusConfig[existingApplication.status as keyof typeof statusConfig]
    const StatusIcon = status.icon

    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <div className={`inline-flex p-4 rounded-full ${status.bgColor} mb-4`}>
                    <StatusIcon className={`h-12 w-12 ${status.color}`} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {status.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    {status.description}
                  </p>
                  {existingApplication.status === 'APPROVED' && (
                    <button
                      onClick={() => router.push('/instructor')}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Go to Instructor Dashboard
                    </button>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
                    Submitted on {new Date(existingApplication.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex p-4 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <GraduationCap className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Become a GrowShare Instructor
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Share your agricultural knowledge with thousands of growers. Create courses,
              host live sessions, and earn money doing what you love.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700">
              <BookOpen className="h-10 w-10 text-green-600 dark:text-green-400 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Create Courses</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Build comprehensive courses with videos, quizzes, and certifications.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700">
              <Users className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Reach Thousands</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect with our growing community of gardeners and farmers.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700">
              <DollarSign className="h-10 w-10 text-emerald-600 dark:text-emerald-400 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Earn 90%</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Keep 90% of your course sales. We handle payments and hosting.
              </p>
            </div>
          </div>

          {/* Application Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Instructor Application
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Expertise */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Areas of Expertise *
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Select all areas where you have significant knowledge and experience.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {EXPERTISE_OPTIONS.map(option => (
                      <label
                        key={option.value}
                        className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.expertise.includes(option.value)
                            ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.expertise.includes(option.value)}
                          onChange={() => handleExpertiseToggle(option.value)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          formData.expertise.includes(option.value)
                            ? 'border-green-600 bg-green-600'
                            : 'border-gray-300 dark:border-gray-500'
                        }`}>
                          {formData.expertise.includes(option.value) && (
                            <CheckCircle className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Teaching & Farming Experience *
                  </label>
                  <textarea
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Describe your experience in farming, gardening, and/or teaching. Include years of experience, any certifications, and notable achievements..."
                    required
                    minLength={50}
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {formData.experience.length}/50 minimum characters
                  </p>
                </div>

                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Instructor Bio *
                  </label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Write a bio that will be displayed on your instructor profile. Tell students about yourself, your passion for growing, and what makes you a great teacher..."
                    required
                    minLength={50}
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {formData.bio.length}/50 minimum characters
                  </p>
                </div>

                {/* Portfolio URL */}
                <div>
                  <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Portfolio or Website (Optional)
                  </label>
                  <input
                    type="url"
                    id="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                {/* Social Links */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Social Links (Optional)
                  </label>
                  <div className="space-y-3">
                    <input
                      type="url"
                      value={formData.socialLinks.youtube}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, youtube: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="YouTube Channel URL"
                    />
                    <input
                      type="url"
                      value={formData.socialLinks.linkedin}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="LinkedIn Profile URL"
                    />
                  </div>
                </div>

                {/* Message */}
                {message && (
                  <div
                    className={`p-4 rounded-lg ${
                      message.includes('submitted') || message.includes('success')
                        ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                        : 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                    }`}
                  >
                    {message}
                  </div>
                )}

                {/* Submit */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={submitting || formData.expertise.length === 0}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  )
}

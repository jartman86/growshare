'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  Award,
  Search,
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
  User,
  BookOpen,
} from 'lucide-react'

interface CertificateData {
  id: string
  issuedAt: string
  completedAt: string
  recipient: {
    name: string
    avatar: string | null
  }
  course: {
    id: string
    title: string
    certificateName: string | null
    instructor: string | null
  }
}

export default function CertificateVerifyPage() {
  const searchParams = useSearchParams()
  const initialId = searchParams.get('id') || ''

  const [certificateId, setCertificateId] = useState(initialId)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    valid: boolean
    certificate?: CertificateData
    error?: string
  } | null>(null)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!certificateId.trim()) {
      setResult({ valid: false, error: 'Please enter a certificate ID' })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch(`/api/certificates/verify/${certificateId.trim()}`)
      const data = await response.json()

      if (response.ok && data.valid) {
        setResult({
          valid: true,
          certificate: data.certificate,
        })
      } else {
        setResult({
          valid: false,
          error: data.error || 'Certificate not found',
        })
      }
    } catch {
      setResult({
        valid: false,
        error: 'Failed to verify certificate. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <Award className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Verify Certificate
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter a certificate ID to verify its authenticity
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleVerify} className="mb-8">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value.toUpperCase())}
                  placeholder="Enter certificate ID (e.g., GS-CERT-XXXX)"
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify'
                )}
              </button>
            </div>
          </form>

          {/* Result */}
          {result && (
            <div className="space-y-6">
              {result.valid && result.certificate ? (
                <>
                  {/* Valid Certificate */}
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                      <div>
                        <h2 className="text-xl font-bold text-green-800 dark:text-green-300">
                          Valid Certificate
                        </h2>
                        <p className="text-green-600 dark:text-green-400">
                          This certificate is authentic and verified
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Certificate Details */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-800 to-green-900 p-6 text-white text-center">
                      <Award className="h-12 w-12 mx-auto mb-2" />
                      <h3 className="text-xl font-bold">Certificate Details</h3>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Certificate ID */}
                      <div className="text-center pb-6 border-b dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Certificate ID
                        </p>
                        <p className="text-lg font-mono font-bold text-gray-900 dark:text-white">
                          {result.certificate.id}
                        </p>
                      </div>

                      {/* Recipient */}
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Awarded to
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {result.certificate.recipient.name}
                          </p>
                        </div>
                      </div>

                      {/* Course */}
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Course Completed
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {result.certificate.course.title}
                          </p>
                          {result.certificate.course.certificateName && (
                            <p className="text-sm text-green-600 dark:text-green-400">
                              Certification: {result.certificate.course.certificateName}
                            </p>
                          )}
                          {result.certificate.course.instructor && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Instructor: {result.certificate.course.instructor}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                          <Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Issued on
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatDate(result.certificate.issuedAt)}
                          </p>
                        </div>
                      </div>

                      {/* View Course Link */}
                      <div className="pt-4 border-t dark:border-gray-700">
                        <Link
                          href={`/knowledge/${result.certificate.course.id}`}
                          className="text-green-600 dark:text-green-400 hover:underline font-medium"
                        >
                          View Course Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Invalid Certificate */
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                    <div>
                      <h2 className="text-xl font-bold text-red-800 dark:text-red-300">
                        Invalid Certificate
                      </h2>
                      <p className="text-red-600 dark:text-red-400">
                        {result.error || 'This certificate could not be verified'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Help Text */}
          {!result && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                Where to find the certificate ID?
              </h3>
              <p className="text-blue-700 dark:text-blue-400 text-sm">
                The certificate ID is located at the bottom of each certificate.
                It starts with &quot;GS-CERT-&quot; followed by a unique code.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

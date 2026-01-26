'use client'

import { useState, useEffect, use, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { useUser } from '@clerk/nextjs'
import {
  Award,
  Loader2,
  Download,
  Share2,
  ArrowLeft,
  Calendar,
  CheckCircle,
} from 'lucide-react'

interface CertificateData {
  course: {
    id: string
    title: string
    certificateName: string | null
    instructor: {
      firstName: string | null
      lastName: string | null
    } | null
  }
  completedAt: string
  certificateId: string
  certificateIssuedAt: string | null
  userName: string
}

export default function CertificatePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params)
  const router = useRouter()
  const { user: clerkUser } = useUser()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<CertificateData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const certificateRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchCertificate()
  }, [courseId])

  const fetchCertificate = async () => {
    try {
      const response = await fetch(`/api/learn/${courseId}`)
      if (response.ok) {
        const courseData = await response.json()

        if (!courseData.progress.isCompleted) {
          setError('You have not completed this course yet')
          setLoading(false)
          return
        }

        if (!courseData.course.isCertification) {
          setError('This course does not offer a certificate')
          setLoading(false)
          return
        }

        if (!courseData.progress.certificateId) {
          setError('Certificate not yet issued. Please try again.')
          setLoading(false)
          return
        }

        setData({
          course: courseData.course,
          completedAt: courseData.progress.completedAt,
          certificateId: courseData.progress.certificateId,
          certificateIssuedAt: courseData.progress.certificateIssuedAt,
          userName: clerkUser?.fullName || clerkUser?.firstName || 'Student',
        })
      } else {
        setError('Failed to load certificate')
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    // Simple print-to-PDF functionality
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Certificate - ${data?.course.title}`,
          text: `I completed the course "${data?.course.title}" on GrowShare!`,
          url: window.location.href,
        })
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
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

  if (error || !data) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <Award className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {error || 'Certificate not available'}
            </h1>
            <Link
              href={`/learn/${courseId}`}
              className="text-green-600 dark:text-green-400 hover:underline"
            >
              Back to course
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const completedDate = new Date(data.completedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const instructorName = data.course.instructor
    ? `${data.course.instructor.firstName || ''} ${data.course.instructor.lastName || ''}`.trim()
    : 'GrowShare Instructor'

  return (
    <>
      <div className="print:hidden">
        <Header />
      </div>

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="mx-auto max-w-4xl px-4">
          {/* Actions */}
          <div className="flex items-center justify-between mb-8 print:hidden">
            <button
              onClick={() => router.push(`/learn/${courseId}`)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Course
            </button>
            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </button>
            </div>
          </div>

          {/* Certificate */}
          <div
            id="certificate"
            ref={certificateRef}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden print:shadow-none print:rounded-none"
          >
            {/* Certificate Header */}
            <div className="bg-gradient-to-r from-green-800 to-green-900 p-8 text-center text-white">
              <div className="flex justify-center mb-4">
                <Image
                  src="/growshare-logo.png"
                  alt="GrowShare"
                  width={300}
                  height={120}
                  className="h-32 w-auto"
                />
              </div>
              <h1 className="text-3xl font-bold mb-2">Certificate of Completion</h1>
              <p className="text-green-100">GrowShare Knowledge Hub</p>
            </div>

            {/* Certificate Body */}
            <div className="p-8 lg:p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                This is to certify that
              </p>

              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 font-serif">
                {data.userName}
              </h2>

              <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                has successfully completed the course
              </p>

              <h3 className="text-2xl lg:text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {data.course.title}
              </h3>

              {data.course.certificateName && (
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                  and is hereby awarded the title of
                  <br />
                  <span className="font-semibold text-xl">
                    {data.course.certificateName}
                  </span>
                </p>
              )}

              <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 mb-8">
                <Calendar className="h-5 w-5" />
                <span>Completed on {completedDate}</span>
              </div>

              {/* Verification Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full text-green-700 dark:text-green-400 mb-8">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Verified Certificate</span>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 mt-8 pt-8 border-t dark:border-gray-700">
                <div>
                  <div className="border-t-2 border-gray-300 dark:border-gray-600 pt-2 mx-auto max-w-48">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {instructorName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Course Instructor
                    </p>
                  </div>
                </div>
                <div>
                  <div className="border-t-2 border-gray-300 dark:border-gray-600 pt-2 mx-auto max-w-48">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      GrowShare
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Platform
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate Footer */}
            <div className="bg-gray-50 dark:bg-gray-900 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>
                Certificate ID: <span className="font-mono font-semibold">{data.certificateId}</span>
              </p>
              <p className="mt-1">
                Verify at: <a href={`/certificates/verify?id=${data.certificateId}`} className="text-green-600 dark:text-green-400 hover:underline">growshare.com/certificates/verify</a>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          header, footer, .print\\:hidden {
            display: none !important;
          }
          main {
            padding: 0 !important;
            min-height: auto !important;
            background: white !important;
          }
          #certificate {
            box-shadow: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
          }
          #certificate * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      <div className="print:hidden">
        <Footer />
      </div>
    </>
  )
}

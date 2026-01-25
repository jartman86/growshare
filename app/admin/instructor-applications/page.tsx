'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

interface Application {
  id: string
  expertise: string[]
  experience: string
  bio: string
  portfolioUrl?: string
  socialLinks?: Record<string, string>
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  reviewNotes?: string
  createdAt: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    username?: string
    avatar?: string
    createdAt: string
  }
}

export default function AdminInstructorApplicationsPage() {
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<Application[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('PENDING')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [processing, setProcessing] = useState(false)
  const [reviewNotes, setReviewNotes] = useState('')

  useEffect(() => {
    fetchApplications()
  }, [statusFilter, pagination.page])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        status: statusFilter,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })

      const response = await fetch(`/api/admin/instructor-applications?${params}`)
      if (response.ok) {
        const data = await response.json()
        setApplications(data.applications)
        setPagination(prev => ({ ...prev, ...data.pagination }))
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (applicationId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      setProcessing(true)
      const response = await fetch(`/api/admin/instructor-applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reviewNotes }),
      })

      if (response.ok) {
        setSelectedApplication(null)
        setReviewNotes('')
        fetchApplications()
      }
    } catch (error) {
      console.error('Error reviewing application:', error)
    } finally {
      setProcessing(false)
    }
  }

  const statusCounts = {
    PENDING: applications.filter(a => a.status === 'PENDING').length,
    APPROVED: applications.filter(a => a.status === 'APPROVED').length,
    REJECTED: applications.filter(a => a.status === 'REJECTED').length,
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Instructor Applications
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Review and manage instructor applications
            </p>
          </div>

          {/* Status Filters */}
          <div className="flex gap-4 mb-6">
            {['PENDING', 'APPROVED', 'REJECTED'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status)
                  setPagination(prev => ({ ...prev, page: 1 }))
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === status
                    ? status === 'PENDING'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                      : status === 'APPROVED'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {status === 'PENDING' && <Clock className="h-4 w-4 inline mr-2" />}
                {status === 'APPROVED' && <CheckCircle className="h-4 w-4 inline mr-2" />}
                {status === 'REJECTED' && <XCircle className="h-4 w-4 inline mr-2" />}
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Applications List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Applications ({pagination.total})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No {statusFilter.toLowerCase()} applications
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div
                      key={application.id}
                      className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      {application.user.avatar ? (
                        <img
                          src={application.user.avatar}
                          alt={`${application.user.firstName} ${application.user.lastName}`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-gray-400" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {application.user.firstName} {application.user.lastName}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {application.user.email}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            application.status === 'PENDING'
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                              : application.status === 'APPROVED'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                          }`}>
                            {application.status}
                          </span>
                        </div>

                        <div className="mt-2">
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            <span className="font-medium">Expertise:</span>{' '}
                            {application.expertise.join(', ')}
                          </p>
                        </div>

                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {application.bio}
                        </p>

                        <div className="mt-3 flex items-center gap-4">
                          <button
                            onClick={() => setSelectedApplication(application)}
                            className="text-sm text-green-600 dark:text-green-400 hover:underline"
                          >
                            View Details
                          </button>
                          {application.portfolioUrl && (
                            <a
                              href={application.portfolioUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                            >
                              Portfolio <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          <span className="text-sm text-gray-400">
                            Applied {new Date(application.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {application.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedApplication(application)
                            }}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                          >
                            Review
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Page {pagination.page} of {pagination.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === pagination.totalPages}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Review Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  {selectedApplication.user.avatar ? (
                    <img
                      src={selectedApplication.user.avatar}
                      alt={`${selectedApplication.user.firstName} ${selectedApplication.user.lastName}`}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedApplication.user.firstName} {selectedApplication.user.lastName}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      {selectedApplication.user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedApplication(null)
                    setReviewNotes('')
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <XCircle className="h-6 w-6 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Areas of Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.expertise.map((exp) => (
                      <span
                        key={exp}
                        className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-sm"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Experience
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedApplication.experience}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Bio
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedApplication.bio}
                  </p>
                </div>

                {selectedApplication.portfolioUrl && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Portfolio
                    </h3>
                    <a
                      href={selectedApplication.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                    >
                      {selectedApplication.portfolioUrl}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}

                {selectedApplication.status === 'PENDING' && (
                  <>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Review Notes (Optional)
                      </h3>
                      <textarea
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        rows={3}
                        placeholder="Add notes about your decision..."
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => handleReview(selectedApplication.id, 'APPROVED')}
                        disabled={processing}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold disabled:opacity-50 transition-colors"
                      >
                        {processing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-5 w-5" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleReview(selectedApplication.id, 'REJECTED')}
                        disabled={processing}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold disabled:opacity-50 transition-colors"
                      >
                        {processing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="h-5 w-5" />
                        )}
                        Reject
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}

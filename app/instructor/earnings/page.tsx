'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  CreditCard,
  BookOpen,
  Loader2,
  ArrowLeft,
  Download,
  Calendar,
  Users,
  ChevronRight,
} from 'lucide-react'

interface EarningsSummary {
  totalEarnings: number
  totalSales: number
  totalGross: number
  totalPlatformFees: number
  pendingPayout: number
  thisMonthEarnings: number
  lastMonthEarnings: number
  earningsTrend: number
  salesTrend: number
  currentMonthSales: number
  lastMonthSales: number
  averagePerSale: number
}

interface CourseEarning {
  courseId: string
  title: string
  slug: string
  thumbnailUrl: string | null
  price: number | null
  accessType: string
  isPublished: boolean
  students: number
  totalSales: number
  totalEarnings: number
}

interface MonthlyEarning {
  month: string
  earnings: number
  sales: number
}

interface Transaction {
  id: string
  courseTitle: string
  courseSlug: string
  studentName: string
  studentAvatar: string | null
  amount: number
  platformFee: number
  earnings: number
  date: string
}

interface EarningsData {
  summary: EarningsSummary
  earningsByCourse: CourseEarning[]
  monthlyEarnings: MonthlyEarning[]
  recentTransactions: Transaction[]
  period: string
}

export default function InstructorEarningsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<EarningsData | null>(null)
  const [period, setPeriod] = useState('all')

  useEffect(() => {
    fetchEarnings()
  }, [period])

  const fetchEarnings = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/instructor/earnings?period=${period}`)
      if (response.status === 401) {
        router.push('/sign-in')
        return
      }
      if (response.status === 403) {
        router.push('/instructor/apply')
        return
      }
      if (!response.ok) {
        throw new Error('Failed to fetch earnings')
      }
      const earningsData = await response.json()
      setData(earningsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load earnings')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading earnings data...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchEarnings}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!data) return null

  const maxMonthlyEarning = Math.max(...data.monthlyEarnings.map(m => m.earnings), 1)

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link
                href="/instructor"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Earnings Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Track your course revenue and payouts
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Time</option>
                <option value="year">This Year</option>
                <option value="month">This Month</option>
              </select>
              <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Earnings */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Earnings</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(data.summary.totalEarnings)}
                    </p>
                    {data.summary.earningsTrend !== 0 && (
                      <div className={`flex items-center gap-1 mt-1 text-sm ${
                        data.summary.earningsTrend > 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {data.summary.earningsTrend > 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span>{Math.abs(data.summary.earningsTrend).toFixed(1)}% vs last month</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Sales */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Sales</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {data.summary.totalSales}
                    </p>
                    {data.summary.salesTrend !== 0 && (
                      <div className={`flex items-center gap-1 mt-1 text-sm ${
                        data.summary.salesTrend > 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {data.summary.salesTrend > 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span>{Math.abs(data.summary.salesTrend).toFixed(1)}% vs last month</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Average Per Sale */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Per Sale</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(data.summary.averagePerSale)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      After platform fee
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Payout */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">This Month</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(data.summary.thisMonthEarnings)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {data.summary.currentMonthSales} sales
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Chart and Courses */}
            <div className="lg:col-span-2 space-y-8">
              {/* Earnings Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    {data.monthlyEarnings.every(m => m.earnings === 0) ? (
                      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                        No earnings data yet
                      </div>
                    ) : (
                      <div className="h-full flex items-end gap-2">
                        {data.monthlyEarnings.map((month, index) => (
                          <div
                            key={index}
                            className="flex-1 flex flex-col items-center gap-2"
                          >
                            <div className="w-full flex flex-col items-center">
                              <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                {month.earnings > 0 ? formatCurrency(month.earnings) : ''}
                              </span>
                              <div
                                className="w-full bg-emerald-500 dark:bg-emerald-600 rounded-t-sm transition-all hover:bg-emerald-600 dark:hover:bg-emerald-500"
                                style={{
                                  height: `${(month.earnings / maxMonthlyEarning) * 180}px`,
                                  minHeight: month.earnings > 0 ? '4px' : '0px',
                                }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              {month.month.split(' ')[0]}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Earnings by Course */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Earnings by Course</CardTitle>
                    <Link
                      href="/instructor/courses"
                      className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      View all courses
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {data.earningsByCourse.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No courses yet. Create a course to start earning.
                      </p>
                      <Link
                        href="/instructor/courses/new"
                        className="mt-4 inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Create Course
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {data.earningsByCourse.map((course) => (
                        <Link
                          key={course.courseId}
                          href={`/instructor/courses/${course.courseId}`}
                          className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          {course.thumbnailUrl ? (
                            <Image
                              src={course.thumbnailUrl}
                              alt={course.title}
                              width={64}
                              height={64}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                              <BookOpen className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                              {course.title}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                course.isPublished
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                  : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                              }`}>
                                {course.isPublished ? 'Published' : 'Draft'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {course.students} students
                              </span>
                              <span>{course.totalSales} sales</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900 dark:text-white">
                              {formatCurrency(course.totalEarnings)}
                            </p>
                            {course.price && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                ${course.price}/course
                              </p>
                            )}
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Transactions */}
            <div className="space-y-8">
              {/* Platform Fee Info */}
              <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-800">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Earnings Breakdown
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Gross Revenue</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(data.summary.totalGross)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Platform Fee (10%)</span>
                      <span className="text-red-600 dark:text-red-400">
                        -{formatCurrency(data.summary.totalPlatformFees)}
                      </span>
                    </div>
                    <div className="border-t border-emerald-200 dark:border-emerald-700 pt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900 dark:text-white">Your Earnings</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(data.summary.totalEarnings)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.recentTransactions.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No sales yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {data.recentTransactions.slice(0, 10).map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0"
                        >
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                            {transaction.studentAvatar ? (
                              <Image
                                src={transaction.studentAvatar}
                                alt={transaction.studentName}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 font-semibold">
                                {transaction.studentName.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {transaction.studentName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {transaction.courseTitle}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                              +{formatCurrency(transaction.earnings)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(transaction.date)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payout Info */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Payout Schedule
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Earnings are paid out monthly on the 1st of each month via the payment method on file.
                  </p>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Next Payout</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <button className="w-full mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    Manage Payment Settings
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import {
  Users,
  Map,
  Calendar,
  DollarSign,
  TrendingUp,
  UserCheck,
  Clock,
  AlertCircle,
  Loader2,
} from 'lucide-react'

interface Stats {
  users: {
    total: number
    verified: number
    newThisWeek: number
    byRole: Record<string, number>
  }
  plots: {
    total: number
    active: number
  }
  bookings: {
    total: number
    active: number
    pending: number
    newThisWeek: number
  }
  revenue: {
    total: number
  }
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ElementType
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red'
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
  }

  return (
    <div className="bg-white rounded-xl border p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const { isLoaded, isSignedIn } = useUser()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if user is admin
    async function checkAdmin() {
      try {
        const res = await fetch('/api/profile')
        if (!res.ok) {
          setIsAdmin(false)
          return
        }
        const data = await res.json()
        if (data.role && data.role.includes('ADMIN')) {
          setIsAdmin(true)
        } else {
          setIsAdmin(false)
        }
      } catch {
        setIsAdmin(false)
      }
    }

    if (isLoaded && isSignedIn) {
      checkAdmin()
    } else if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    async function fetchStats() {
      if (!isAdmin) return

      try {
        const res = await fetch('/api/admin/stats')
        if (!res.ok) {
          throw new Error('Failed to fetch stats')
        }
        const data = await res.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats')
      } finally {
        setLoading(false)
      }
    }

    if (isAdmin === true) {
      fetchStats()
    } else if (isAdmin === false) {
      router.push('/')
    }
  }, [isAdmin, router])

  // Show loading while checking auth
  if (!isLoaded || isAdmin === null) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  // Redirect handled in useEffect, show loading in meantime
  if (!isSignedIn || !isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <p className="text-red-800">{error}</p>
      </div>
    )
  }

  if (!stats) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
        <p className="text-gray-600 mt-1">
          Platform statistics and key metrics
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.users.total}
          subtitle={`${stats.users.newThisWeek} new this week`}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Plots"
          value={stats.plots.active}
          subtitle={`${stats.plots.total} total listings`}
          icon={Map}
          color="green"
        />
        <StatCard
          title="Active Bookings"
          value={stats.bookings.active}
          subtitle={`${stats.bookings.pending} pending approval`}
          icon={Calendar}
          color="yellow"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.revenue.total)}
          subtitle={`${stats.bookings.total} total bookings`}
          icon={DollarSign}
          color="purple"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Verified Users</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {stats.users.verified}
            </span>
            <span className="text-sm text-gray-500">
              / {stats.users.total} total
            </span>
          </div>
          <div className="mt-3 bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{
                width: `${stats.users.total > 0 ? (stats.users.verified / stats.users.total) * 100 : 0}%`,
              }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {stats.users.total > 0
              ? ((stats.users.verified / stats.users.total) * 100).toFixed(1)
              : 0}%
            verification rate
          </p>
        </div>

        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Pending Bookings</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {stats.bookings.pending}
            </span>
            <span className="text-sm text-gray-500">awaiting approval</span>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            {stats.bookings.newThisWeek} new bookings this week
          </p>
        </div>

        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Users by Role</h3>
          </div>
          <div className="space-y-2">
            {Object.entries(stats.users.byRole).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{role}</span>
                <span className="text-sm font-medium text-gray-900">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <a
            href="/admin/users"
            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            Manage Users
          </a>
          <a
            href="/admin/users?verified=false"
            className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-sm font-medium"
          >
            Review Unverified Users
          </a>
          <a
            href="/admin/moderation"
            className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
          >
            Moderation Queue
          </a>
        </div>
      </div>
    </div>
  )
}

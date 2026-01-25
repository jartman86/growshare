'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Search,
  Filter,
  MoreVertical,
  UserCheck,
  UserX,
  Shield,
  ShieldOff,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

interface User {
  id: string
  clerkId: string
  email: string
  username: string | null
  firstName: string
  lastName: string
  avatar: string | null
  role: string[]
  status: string
  isVerified: boolean
  verifiedAt: string | null
  totalPoints: number
  level: number
  createdAt: string
  lastLoginAt: string | null
  _count: {
    ownedPlots: number
    rentedPlots: number
    reviews: number
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

function AdminUsersContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get('status') || ''
  )
  const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || '')
  const [verifiedFilter, setVerifiedFilter] = useState(
    searchParams.get('verified') || ''
  )
  const currentPage = parseInt(searchParams.get('page') || '1')

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      params.set('page', currentPage.toString())
      params.set('limit', '20')
      if (search) params.set('search', search)
      if (statusFilter) params.set('status', statusFilter)
      if (roleFilter) params.set('role', roleFilter)
      if (verifiedFilter) params.set('verified', verifiedFilter)

      const res = await fetch(`/api/admin/users?${params}`)
      if (!res.ok) throw new Error('Failed to fetch users')

      const data = await res.json()
      setUsers(data.users)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [currentPage, search, statusFilter, roleFilter, verifiedFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set('page', '1') // Reset to first page
    router.push(`/admin/users?${params}`)
  }

  const handleAction = async (
    userId: string,
    action: string,
    role?: string
  ) => {
    setActionLoading(userId)
    setOpenMenu(null)

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action, role }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Action failed')
      }

      // Refresh the list
      fetchUsers()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <p className="text-gray-600 mt-1">
          View and manage user accounts
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border p-4 shadow-sm">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    updateFilters('search', search)
                  }
                }}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => updateFilters('status', e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="PENDING">Pending</option>
          </select>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => updateFilters('role', e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Roles</option>
            <option value="RENTER">Renter</option>
            <option value="LANDOWNER">Landowner</option>
            <option value="ADMIN">Admin</option>
          </select>

          {/* Verified Filter */}
          <select
            value={verifiedFilter}
            onChange={(e) => updateFilters('verified', e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Verification</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Filter className="h-12 w-12 mb-4" />
            <p>No users found matching your filters</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          user.avatar ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}%20${user.lastName}`
                        }
                        alt=""
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </span>
                          {user.isVerified && (
                            <UserCheck className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        user.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : user.status === 'SUSPENDED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-1">
                      {user.role.map((role) => (
                        <span
                          key={role}
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            role === 'ADMIN'
                              ? 'bg-red-100 text-red-800'
                              : role === 'LANDOWNER'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      {user._count.ownedPlots} plots, {user._count.rentedPlots}{' '}
                      bookings
                    </div>
                    <div className="text-xs">
                      Level {user.level} • {user.totalPoints} pts
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenu(openMenu === user.id ? null : user.id)
                        }
                        disabled={actionLoading === user.id}
                        className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                      >
                        {actionLoading === user.id ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <MoreVertical className="h-5 w-5 text-gray-500" />
                        )}
                      </button>

                      {openMenu === user.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                          {user.status === 'ACTIVE' ? (
                            <button
                              onClick={() => handleAction(user.id, 'suspend')}
                              className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2"
                            >
                              <UserX className="h-4 w-4" />
                              Suspend User
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAction(user.id, 'activate')}
                              className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 flex items-center gap-2"
                            >
                              <UserCheck className="h-4 w-4" />
                              Activate User
                            </button>
                          )}

                          {user.isVerified ? (
                            <button
                              onClick={() => handleAction(user.id, 'unverify')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <ShieldOff className="h-4 w-4" />
                              Remove Verification
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAction(user.id, 'verify')}
                              className="w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 flex items-center gap-2"
                            >
                              <Shield className="h-4 w-4" />
                              Verify User
                            </button>
                          )}

                          <div className="border-t my-1" />

                          {!user.role.includes('LANDOWNER') && (
                            <button
                              onClick={() =>
                                handleAction(user.id, 'addRole', 'LANDOWNER')
                              }
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              Add Landowner Role
                            </button>
                          )}
                          {user.role.includes('LANDOWNER') && (
                            <button
                              onClick={() =>
                                handleAction(user.id, 'removeRole', 'LANDOWNER')
                              }
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              Remove Landowner Role
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} users
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString())
                  params.set('page', (pagination.page - 1).toString())
                  router.push(`/admin/users?${params}`)
                }}
                disabled={pagination.page === 1}
                className="px-3 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString())
                  params.set('page', (pagination.page + 1).toString())
                  router.push(`/admin/users?${params}`)
                }}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminUsersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <AdminUsersContent />
    </Suspense>
  )
}

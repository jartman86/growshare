'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { Plus, Edit, Trash2, MapPin, DollarSign, Loader2, Eye, EyeOff } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

interface Plot {
  id: string
  title: string
  description: string
  status: string
  city: string
  state: string
  acreage: number
  pricePerMonth: number
  images: string[]
  createdAt: string
}

export default function MyPlotsPage() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useUser()
  const [plots, setPlots] = useState<Plot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
      return
    }

    if (isSignedIn) {
      fetchMyPlots()
    }
  }, [isSignedIn, isLoaded, router])

  const fetchMyPlots = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/my-plots-v2')
      if (!response.ok) throw new Error('Failed to fetch plots')

      const data = await response.json()
      setPlots(data)
    } catch (error) {
      console.error('Error fetching plots:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'DRAFT' : 'ACTIVE'
    const action = newStatus === 'ACTIVE' ? 'publish' : 'unpublish'

    if (!confirm(`Are you sure you want to ${action} this plot?`)) {
      return
    }

    setTogglingId(id)
    try {
      const response = await fetch(`/api/plots/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const data = await response.json()
        alert(data.error || `Failed to ${action} plot`)
        return
      }

      // Refresh plots
      await fetchMyPlots()
    } catch (error) {
      console.error(`Error ${action}ing plot:`, error)
      alert(`Failed to ${action} plot`)
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plot? This action cannot be undone.')) {
      return
    }

    setDeletingId(id)
    try {
      const response = await fetch(`/api/plots/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        alert(data.error || 'Failed to delete plot')
        return
      }

      // Remove from UI
      setPlots(plots.filter(plot => plot.id !== id))
    } catch (error) {
      console.error('Error deleting plot:', error)
      alert('Failed to delete plot')
    } finally {
      setDeletingId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'RENTED':
        return 'bg-blue-100 text-blue-800'
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800'
      case 'INACTIVE':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isLoaded || isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center garden-gradient-light">
          <Loader2 className="h-8 w-8 text-[#4a7c2c] animate-spin" />
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen garden-gradient-light topo-lines">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#2d5016]">My Plots</h1>
              <p className="mt-2 text-[#4a3f35]">
                Manage your land listings
              </p>
            </div>
            <Link
              href="/plots/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-[#6ba03f] to-[#4a7c2c] text-white rounded-lg hover:shadow-lg transition-all hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Create New Plot
            </Link>
          </div>

          {/* Plots Grid */}
          {plots.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-[#4a3f35] mb-2">
                No plots yet
              </h3>
              <p className="text-[#7d7875] mb-6">
                Get started by creating your first plot listing
              </p>
              <Link
                href="/plots/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-[#6ba03f] to-[#4a7c2c] text-white rounded-lg hover:shadow-lg transition-all hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                Create Your First Plot
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plots.map((plot) => (
                <div
                  key={plot.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Plot Image */}
                  <div className="relative h-48 bg-gray-200">
                    {plot.images && plot.images.length > 0 ? (
                      <img
                        src={plot.images[0]}
                        alt={plot.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#aed581] to-[#6ba03f]">
                        <MapPin className="h-12 w-12 text-white" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          plot.status
                        )}`}
                      >
                        {plot.status}
                      </span>
                    </div>
                  </div>

                  {/* Plot Details */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-[#2d5016] mb-2">
                      {plot.title}
                    </h3>
                    <p className="text-sm text-[#7d7875] mb-3 line-clamp-2">
                      {plot.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-[#4a3f35] mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-[#4a7c2c]" />
                        <span>{plot.city}, {plot.state}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-[#4a7c2c]" />
                        <span>${plot.pricePerMonth}/mo</span>
                      </div>
                    </div>

                    <div className="text-sm text-[#7d7875] mb-4">
                      {plot.acreage} acres
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Link
                          href={`/plots/${plot.id}/edit`}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#aed581] text-[#2d5016] rounded-lg hover:bg-[#9bc76f] transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(plot.id)}
                          disabled={deletingId === plot.id}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                        >
                          {deletingId === plot.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          Delete
                        </button>
                      </div>
                      <button
                        onClick={() => handleToggleStatus(plot.id, plot.status)}
                        disabled={togglingId === plot.id}
                        className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                          plot.status === 'ACTIVE'
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {togglingId === plot.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : plot.status === 'ACTIVE' ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        {plot.status === 'ACTIVE' ? 'Unpublish' : 'Publish'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

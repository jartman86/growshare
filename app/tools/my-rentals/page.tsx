import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Package,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
} from 'lucide-react'

export default function MyRentalsPage() {
  // Sample rental data - would come from backend
  const activeRentals = [
    {
      id: 'rental-1',
      toolName: 'Electric Lawn Mower',
      toolImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      ownerName: 'Sarah Chen',
      ownerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      startDate: new Date('2024-07-22'),
      endDate: new Date('2024-07-25'),
      dailyRate: 20,
      totalCost: 60,
      depositAmount: 75,
      status: 'active' as const,
      daysRemaining: 3,
    },
  ]

  const pastRentals = [
    {
      id: 'rental-2',
      toolName: 'Gas-Powered Tiller',
      toolImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
      ownerName: 'Sarah Chen',
      ownerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      startDate: new Date('2024-07-10'),
      endDate: new Date('2024-07-12'),
      returnDate: new Date('2024-07-12'),
      dailyRate: 35,
      totalCost: 70,
      depositAmount: 100,
      depositReturned: true,
      status: 'completed' as const,
      rated: true,
    },
    {
      id: 'rental-3',
      toolName: 'Soil Test Kit - Professional',
      toolImage: 'https://images.unsplash.com/photo-1592230442203-e1d0ac959f55?w=800',
      ownerName: 'Michael Rodriguez',
      ownerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      startDate: new Date('2024-06-15'),
      endDate: new Date('2024-06-18'),
      returnDate: new Date('2024-06-18'),
      dailyRate: 5,
      totalCost: 15,
      depositAmount: 30,
      depositReturned: true,
      status: 'completed' as const,
      rated: false,
    },
  ]

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-white hover:text-orange-100 mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tools
            </Link>
            <h1 className="text-4xl font-bold mb-2">My Tool Rentals</h1>
            <p className="text-xl text-orange-100">
              Track your current and past tool rentals
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Active Rentals */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Rentals</h2>
            {activeRentals.length > 0 ? (
              <div className="space-y-4">
                {activeRentals.map((rental) => (
                  <div key={rental.id} className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Tool Image */}
                      <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={rental.toolImage}
                          alt={rental.toolName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Rental Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{rental.toolName}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <img
                                src={rental.ownerAvatar}
                                alt={rental.ownerName}
                                className="w-6 h-6 rounded-full"
                              />
                              <span className="text-sm text-gray-600">Borrowed from {rental.ownerName}</span>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                            Active
                          </span>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 mb-4">
                          <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600">Rental Period</p>
                              <p className="font-semibold text-gray-900">
                                {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600">Due In</p>
                              <p className="font-semibold text-gray-900">{rental.daysRemaining} days</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600">Total Cost</p>
                              <p className="font-semibold text-gray-900">${rental.totalCost}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600">Deposit Held</p>
                              <p className="font-semibold text-gray-900">${rental.depositAmount}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors">
                            Arrange Return
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Message Owner
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                            Report Issue
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border p-12 text-center">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Rentals</h3>
                <p className="text-gray-600 mb-6">You don't have any tools currently rented</p>
                <Link
                  href="/tools"
                  className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                  Browse Tools
                </Link>
              </div>
            )}
          </div>

          {/* Past Rentals */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Rental History</h2>
            {pastRentals.length > 0 ? (
              <div className="space-y-4">
                {pastRentals.map((rental) => (
                  <div key={rental.id} className="bg-white rounded-xl border p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Tool Image */}
                      <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={rental.toolImage}
                          alt={rental.toolName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Rental Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{rental.toolName}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <img
                                src={rental.ownerAvatar}
                                alt={rental.ownerName}
                                className="w-5 h-5 rounded-full"
                              />
                              <span className="text-sm text-gray-600">Borrowed from {rental.ownerName}</span>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full">
                            Completed
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(rental.startDate)} - {formatDate(rental.endDate)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span>${rental.totalCost} total</span>
                          </div>
                          {rental.depositReturned && (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Deposit returned</span>
                            </div>
                          )}
                        </div>

                        {!rental.rated && (
                          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700 flex-1">How was your experience with this tool?</span>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                              Leave Review
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border p-12 text-center">
                <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No rental history yet</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  MapPin,
  Star,
  Sprout,
  Award,
  Package,
  Calendar,
  CheckCircle,
  Tag,
  Loader2,
  ArrowLeft,
  ShoppingCart,
  MessageSquare,
} from 'lucide-react'

interface ProduceListing {
  id: string
  productName: string
  variety: string | null
  description: string
  category: string
  quantity: number
  unit: string
  pricePerUnit: number
  status: string
  availableDate: string
  expiresDate: string | null
  deliveryMethods: string[]
  pickupLocation: string | null
  deliveryRadius: number | null
  images: string[]
  isOrganic: boolean
  isCertified: boolean
  certifications: string[]
  createdAt: string
  user: {
    id: string
    firstName: string
    lastName: string
    avatar: string | null
    isVerified: boolean
  }
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.productId as string

  const [listing, setListing] = useState<ProduceListing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    if (productId) {
      fetchListing()
    }
  }, [productId])

  const fetchListing = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/marketplace/listings/${productId}`)
      if (!response.ok) {
        if (response.status === 404) {
          setError('Product not found')
        } else {
          throw new Error('Failed to fetch listing')
        }
        return
      }
      const data = await response.json()
      setListing(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load listing')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateString))
  }

  const deliveryMethodLabels: Record<string, string> = {
    PICKUP: 'Farm Pickup',
    DELIVERY: 'Local Delivery',
    SHIPPING: 'Shipping Available',
    'CSA-BOX': 'CSA Box Subscription',
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </main>
        <Footer />
      </>
    )
  }

  if (error || !listing) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">This listing may have been removed or is no longer available.</p>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Marketplace
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Back Link */}
        <div className="bg-white border-b">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Marketplace
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="bg-white rounded-xl overflow-hidden border mb-6">
                <div className="aspect-video relative bg-gray-100">
                  {listing.images.length > 0 && listing.images[selectedImage] ? (
                    <img
                      src={listing.images[selectedImage]}
                      alt={listing.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Sprout className="h-16 w-16 text-green-300" />
                    </div>
                  )}
                  {listing.isCertified && (
                    <div className="absolute top-4 right-4">
                      <div className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                        <Award className="h-4 w-4" />
                        Certified Organic
                      </div>
                    </div>
                  )}
                  {listing.isOrganic && !listing.isCertified && (
                    <div className="absolute top-4 right-4">
                      <div className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                        <Sprout className="h-4 w-4" />
                        Organic
                      </div>
                    </div>
                  )}
                </div>
                {listing.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 p-4">
                    {listing.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 ${
                          selectedImage === index ? 'border-green-500' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${listing.productName} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="bg-white rounded-xl border p-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
                    {listing.category}
                  </span>
                  {listing.variety && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {listing.variety}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">{listing.productName}</h1>

                <p className="text-lg text-gray-700 mb-6 leading-relaxed">{listing.description}</p>

                {/* Product Details */}
                <div className="grid gap-4 sm:grid-cols-2 pt-6 border-t">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Product Details</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <dt className="text-gray-600">Available Quantity:</dt>
                        <dd className="font-medium text-gray-900">
                          {listing.quantity} {listing.unit}
                        </dd>
                      </div>
                      <div className="flex justify-between text-sm">
                        <dt className="text-gray-600">Price:</dt>
                        <dd className="font-medium text-gray-900">
                          ${listing.pricePerUnit.toFixed(2)} / {listing.unit}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Availability</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <dt className="text-gray-600">Available From:</dt>
                        <dd className="font-medium text-gray-900">
                          {formatDate(listing.availableDate)}
                        </dd>
                      </div>
                      {listing.expiresDate && (
                        <div className="flex justify-between text-sm">
                          <dt className="text-gray-600">Available Until:</dt>
                          <dd className="font-medium text-gray-900">
                            {formatDate(listing.expiresDate)}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              </div>

              {/* Seller Info */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About the Seller</h2>
                <div className="flex items-start gap-4">
                  {listing.user.avatar ? (
                    <img
                      src={listing.user.avatar}
                      alt={listing.user.firstName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-xl font-bold text-green-600">
                        {listing.user.firstName[0]}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {listing.user.firstName} {listing.user.lastName}
                    </h3>
                    {listing.user.isVerified && (
                      <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                        <CheckCircle className="h-4 w-4" />
                        Verified Seller
                      </div>
                    )}
                    {listing.pickupLocation && (
                      <div className="flex items-center gap-2 text-gray-600 mt-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{listing.pickupLocation}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                {/* Purchase Card */}
                <div className="bg-white rounded-xl border p-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    ${listing.pricePerUnit.toFixed(2)}
                    <span className="text-lg font-normal text-gray-600">/{listing.unit}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">
                    {listing.quantity} {listing.unit} available
                  </p>

                  <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors mb-3">
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </button>

                  <Link
                    href={`/messages?to=${listing.user.id}`}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    <MessageSquare className="h-5 w-5" />
                    Contact Seller
                  </Link>
                </div>

                {/* Delivery Methods */}
                <div className="bg-white rounded-xl border p-6 mt-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-green-600" />
                    Delivery Options
                  </h3>
                  <ul className="space-y-3">
                    {listing.deliveryMethods.map((method) => (
                      <li key={method} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">
                          {deliveryMethodLabels[method] || method}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {listing.pickupLocation && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs font-semibold text-gray-900 mb-1">Pickup Location:</p>
                      <p className="text-sm text-gray-600">{listing.pickupLocation}</p>
                    </div>
                  )}
                  {listing.deliveryRadius && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold text-gray-900 mb-1">Delivery Radius:</p>
                      <p className="text-sm text-gray-600">{listing.deliveryRadius} miles</p>
                    </div>
                  )}
                </div>

                {/* Certifications */}
                {(listing.isOrganic || listing.isCertified) && (
                  <div className="bg-green-50 rounded-xl border border-green-200 p-6 mt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Quality Assurance</h3>
                    <ul className="space-y-3">
                      {listing.isCertified && (
                        <li className="flex items-start gap-2 text-sm">
                          <Award className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">Certified Organic</p>
                            <p className="text-xs text-gray-600">USDA certified organic practices</p>
                          </div>
                        </li>
                      )}
                      {listing.isOrganic && !listing.isCertified && (
                        <li className="flex items-start gap-2 text-sm">
                          <Sprout className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">Organically Grown</p>
                            <p className="text-xs text-gray-600">No synthetic pesticides or fertilizers</p>
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

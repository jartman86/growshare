import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SAMPLE_PRODUCTS } from '@/lib/marketplace-data'
import { PurchaseCard } from '@/components/marketplace/purchase-card'
import {
  MapPin,
  Star,
  Sprout,
  Award,
  Package,
  Calendar,
  CheckCircle,
  Tag,
} from 'lucide-react'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params
  const product = SAMPLE_PRODUCTS.find((p) => p.id === productId)

  if (!product) {
    notFound()
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  const deliveryMethodLabels: Record<string, string> = {
    pickup: 'Farm Pickup',
    delivery: 'Local Delivery',
    shipping: 'Shipping Available',
    'csa-box': 'CSA Box Subscription',
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="bg-white rounded-xl overflow-hidden border mb-6">
                <div className="aspect-video relative">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  {product.certifiedOrganic && (
                    <div className="absolute top-4 right-4">
                      <div className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                        <Award className="h-4 w-4" />
                        Certified Organic
                      </div>
                    </div>
                  )}
                  {!product.certifiedOrganic && product.organic && (
                    <div className="absolute top-4 right-4">
                      <div className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                        <Sprout className="h-4 w-4" />
                        Organic
                      </div>
                    </div>
                  )}
                </div>
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 p-4">
                    {product.images.slice(1).map((image, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden">
                        <img src={image} alt={`${product.title} ${index + 2}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="bg-white rounded-xl border p-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                  {product.varietyName && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {product.varietyName}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

                <p className="text-lg text-gray-700 mb-6 leading-relaxed">{product.description}</p>

                {/* Tags */}
                {product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </div>
                    ))}
                  </div>
                )}

                {/* Product Details */}
                <div className="grid gap-4 sm:grid-cols-2 pt-6 border-t">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Product Details</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <dt className="text-gray-600">Available Quantity:</dt>
                        <dd className="font-medium text-gray-900">
                          {product.quantity} {product.unit}
                          {product.quantity > 1 ? 's' : ''}
                        </dd>
                      </div>
                      {product.minOrder && (
                        <div className="flex justify-between text-sm">
                          <dt className="text-gray-600">Minimum Order:</dt>
                          <dd className="font-medium text-gray-900">
                            {product.minOrder} {product.unit}
                            {product.minOrder > 1 ? 's' : ''}
                          </dd>
                        </div>
                      )}
                      {product.harvestedDate && (
                        <div className="flex justify-between text-sm">
                          <dt className="text-gray-600">Harvested:</dt>
                          <dd className="font-medium text-gray-900">
                            {formatDate(product.harvestedDate)}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Availability</h3>
                    <dl className="space-y-2">
                      {product.availableFrom && (
                        <div className="flex justify-between text-sm">
                          <dt className="text-gray-600">Available From:</dt>
                          <dd className="font-medium text-gray-900">
                            {formatDate(product.availableFrom)}
                          </dd>
                        </div>
                      )}
                      {product.availableUntil && (
                        <div className="flex justify-between text-sm">
                          <dt className="text-gray-600">Available Until:</dt>
                          <dd className="font-medium text-gray-900">
                            {formatDate(product.availableUntil)}
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
                  {product.sellerAvatar && (
                    <img
                      src={product.sellerAvatar}
                      alt={product.sellerName}
                      className="w-16 h-16 rounded-full"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{product.sellerName}</h3>
                    <div className="flex items-center gap-2 mt-1 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-gray-900">{product.sellerRating}</span>
                        <span className="text-sm text-gray-600">rating</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{product.sellerLocation}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Purchase Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <PurchaseCard product={product} />

                {/* Delivery Methods */}
                <div className="bg-white rounded-xl border p-6 mt-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-green-600" />
                    Delivery Options
                  </h3>
                  <ul className="space-y-3">
                    {product.deliveryMethods.map((method) => (
                      <li key={method} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{deliveryMethodLabels[method]}</span>
                      </li>
                    ))}
                  </ul>
                  {product.pickupLocation && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs font-semibold text-gray-900 mb-1">Pickup Location:</p>
                      <p className="text-sm text-gray-600">{product.pickupLocation}</p>
                    </div>
                  )}
                </div>

                {/* Certifications */}
                <div className="bg-green-50 rounded-xl border border-green-200 p-6 mt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Quality Assurance</h3>
                  <ul className="space-y-3">
                    {product.certifiedOrganic && (
                      <li className="flex items-start gap-2 text-sm">
                        <Award className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Certified Organic</p>
                          <p className="text-xs text-gray-600">USDA certified organic practices</p>
                        </div>
                      </li>
                    )}
                    {product.organic && !product.certifiedOrganic && (
                      <li className="flex items-start gap-2 text-sm">
                        <Sprout className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Organically Grown</p>
                          <p className="text-xs text-gray-600">No synthetic pesticides or fertilizers</p>
                        </div>
                      </li>
                    )}
                    <li className="flex items-start gap-2 text-sm">
                      <Star className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Verified Grower</p>
                        <p className="text-xs text-gray-600">GrowShare community verified</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

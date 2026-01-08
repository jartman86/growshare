'use client'

import Link from 'next/link'
import { Product } from '@/lib/marketplace-data'
import { MapPin, Star, Sprout, Award, Package, AlertCircle } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const getStatusBadge = () => {
    switch (product.status) {
      case 'available':
        return null
      case 'low-stock':
        return (
          <div className="absolute top-3 left-3">
            <div className="px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
              <AlertCircle className="h-3 w-3" />
              Low Stock
            </div>
          </div>
        )
      case 'sold-out':
        return (
          <div className="absolute top-3 left-3">
            <div className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-semibold shadow-lg">
              Sold Out
            </div>
          </div>
        )
      case 'pre-order':
        return (
          <div className="absolute top-3 left-3">
            <div className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-semibold shadow-lg">
              Pre-Order
            </div>
          </div>
        )
    }
  }

  const isAvailable = product.status === 'available' || product.status === 'low-stock'

  return (
    <Link href={`/marketplace/${product.id}`}>
      <div
        className={`bg-white rounded-xl border hover:shadow-lg transition-all cursor-pointer overflow-hidden group h-full flex flex-col ${
          !isAvailable ? 'opacity-75' : ''
        }`}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {getStatusBadge()}
          {product.certifiedOrganic && (
            <div className="absolute top-3 right-3">
              <div className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                <Award className="h-3 w-3" />
                Certified Organic
              </div>
            </div>
          )}
          {!product.certifiedOrganic && product.organic && (
            <div className="absolute top-3 right-3">
              <div className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                <Sprout className="h-3 w-3" />
                Organic
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Category */}
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
              {product.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
            {product.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">{product.description}</p>

          {/* Seller Info */}
          <div className="flex items-center gap-2 mb-3 pb-3 border-b">
            {product.sellerAvatar && (
              <img
                src={product.sellerAvatar}
                alt={product.sellerName}
                className="w-6 h-6 rounded-full"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{product.sellerName}</p>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-600">{product.sellerRating}</span>
              </div>
            </div>
          </div>

          {/* Location & Delivery */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <MapPin className="h-3 w-3" />
              <span>{product.sellerLocation}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Package className="h-3 w-3" />
              <span className="capitalize">
                {product.deliveryMethods.slice(0, 2).join(', ')}
                {product.deliveryMethods.length > 2 && ` +${product.deliveryMethods.length - 2}`}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-end justify-between pt-3 border-t">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
                <span className="text-sm font-normal text-gray-600">/{product.unit}</span>
              </p>
              {product.minOrder && (
                <p className="text-xs text-gray-500">
                  Min order: {product.minOrder} {product.unit}
                  {product.minOrder > 1 ? 's' : ''}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Available</p>
              <p className="text-sm font-semibold text-green-600">
                {product.quantity} {product.unit}
                {product.quantity > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

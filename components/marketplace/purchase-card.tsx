'use client'

import { useState } from 'react'
import { Product } from '@/lib/marketplace-data'
import { ShoppingCart, Plus, Minus, CheckCircle } from 'lucide-react'

interface PurchaseCardProps {
  product: Product
}

export function PurchaseCard({ product }: PurchaseCardProps) {
  const minQty = product.minOrder || 1
  const [quantity, setQuantity] = useState(minQty)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [isPurchased, setIsPurchased] = useState(false)

  const isAvailable = product.status === 'available' || product.status === 'low-stock'
  const canIncrease = quantity < product.quantity
  const canDecrease = quantity > minQty

  const totalPrice = product.price * quantity

  const handlePurchase = async () => {
    setIsPurchasing(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsPurchased(true)
    setIsPurchasing(false)

    // Show success message
    setTimeout(() => {
      alert(
        `🎉 Purchase successful!\n\nYou ordered ${quantity} ${product.unit}${quantity > 1 ? 's' : ''} of ${product.title} for $${totalPrice.toFixed(2)}.\n\nThe seller will contact you to arrange ${product.deliveryMethods.includes('pickup') ? 'pickup' : 'delivery'}.`
      )
    }, 100)
  }

  if (!isAvailable) {
    return (
      <div className="bg-white rounded-xl border p-6">
        <div className="text-center py-6">
          <p className="text-lg font-semibold text-gray-900 mb-2">Currently Unavailable</p>
          <p className="text-sm text-gray-600">
            {product.status === 'sold-out'
              ? 'This product is sold out. Check back soon!'
              : 'This product is available for pre-order only.'}
          </p>
        </div>
      </div>
    )
  }

  if (isPurchased) {
    return (
      <div className="bg-white rounded-xl border p-6">
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Placed!</h3>
          <p className="text-sm text-gray-600 mb-6">
            Your order has been submitted. The seller will contact you soon.
          </p>
          <button
            onClick={() => setIsPurchased(false)}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Order More
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border p-6">
      {/* Price */}
      <div className="mb-6">
        <p className="text-3xl font-bold text-gray-900">
          ${product.price.toFixed(2)}
          <span className="text-lg font-normal text-gray-600">/{product.unit}</span>
        </p>
        {product.status === 'low-stock' && (
          <p className="text-sm text-orange-600 font-medium mt-2">⚠️ Only {product.quantity} left in stock!</p>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Quantity ({product.unit}
          {quantity > 1 ? 's' : ''})
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(minQty, quantity - 1))}
            disabled={!canDecrease}
            className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value) || minQty
              setQuantity(Math.max(minQty, Math.min(product.quantity, val)))
            }}
            min={minQty}
            max={product.quantity}
            className="flex-1 h-10 text-center border border-gray-300 rounded-lg font-semibold text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
            disabled={!canIncrease}
            className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {product.minOrder && product.minOrder > 1 && (
          <p className="text-xs text-gray-500 mt-2">
            Minimum order: {product.minOrder} {product.unit}
            {product.minOrder > 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Total */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Total:</span>
          <span className="text-2xl font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Purchase Button */}
      <button
        onClick={handlePurchase}
        disabled={isPurchasing}
        className="w-full bg-green-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isPurchasing ? (
          <>Processing...</>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5" />
            Add to Order
          </>
        )}
      </button>

      {/* Info */}
      <div className="mt-4 pt-4 border-t">
        <ul className="text-xs text-gray-600 space-y-2">
          <li>✓ Secure payment processing</li>
          <li>✓ Direct from verified grower</li>
          <li>✓ Satisfaction guaranteed</li>
        </ul>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ProductCategory } from '@/lib/marketplace-data'
import { Upload, X, CheckCircle } from 'lucide-react'

export default function NewProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Vegetables' as ProductCategory,
    price: '',
    unit: 'lb',
    quantity: '',
    minOrder: '',
    organic: false,
    certifiedOrganic: false,
    deliveryMethods: [] as string[],
    pickupLocation: '',
    varietyName: '',
    tags: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const categories: ProductCategory[] = [
    'Vegetables',
    'Fruits',
    'Herbs',
    'Flowers',
    'Seeds',
    'Seedlings',
    'Value-Added',
    'Other',
  ]

  const units = ['lb', 'oz', 'bunch', 'each', 'dozen', 'pint', 'quart', 'bag', 'jar']

  const deliveryOptions = [
    { id: 'pickup', label: 'Farm Pickup' },
    { id: 'delivery', label: 'Local Delivery' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'csa-box', label: 'CSA Box' },
  ]

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = 'Product title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = 'Valid price is required'
    if (!formData.quantity || parseInt(formData.quantity) <= 0)
      newErrors.quantity = 'Valid quantity is required'
    if (formData.deliveryMethods.length === 0)
      newErrors.deliveryMethods = 'Select at least one delivery method'
    if (
      formData.deliveryMethods.includes('pickup') &&
      !formData.pickupLocation.trim()
    )
      newErrors.pickupLocation = 'Pickup location is required for farm pickup'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    alert(
      `🎉 Product listed successfully!\n\n"${formData.title}" is now live on the marketplace.\n\nYou've earned 100 points for your first listing!`
    )

    // Navigate to seller dashboard
    router.push('/dashboard/sell')
  }

  const toggleDeliveryMethod = (method: string) => {
    setFormData((prev) => ({
      ...prev,
      deliveryMethods: prev.deliveryMethods.includes(method)
        ? prev.deliveryMethods.filter((m) => m !== method)
        : [...prev.deliveryMethods, method],
    }))
    if (errors.deliveryMethods) {
      setErrors((prev) => ({ ...prev, deliveryMethods: '' }))
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">List New Product</h1>
            <p className="text-gray-600">
              Create a new marketplace listing and start selling your harvest
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>

              <div className="space-y-4">
                {/* Product Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Product Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value })
                      if (errors.title) setErrors({ ...errors, title: '' })
                    }}
                    placeholder="e.g., Heritage Tomatoes - Mixed Variety"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value })
                      if (errors.description) setErrors({ ...errors, description: '' })
                    }}
                    placeholder="Describe your product, growing methods, flavor profile, best uses..."
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                  )}
                </div>

                {/* Category & Variety */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value as ProductCategory })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Variety Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.varietyName}
                      onChange={(e) => setFormData({ ...formData, varietyName: e.target.value })}
                      placeholder="e.g., Brandywine, Cherokee Purple"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="e.g., heirloom, organic, local, fresh"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Pricing & Inventory</h2>

              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                        $
                      </span>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => {
                          setFormData({ ...formData, price: e.target.value })
                          if (errors.price) setErrors({ ...errors, price: '' })
                        }}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.price ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                  </div>

                  {/* Unit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Unit <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {units.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Available Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => {
                        setFormData({ ...formData, quantity: e.target.value })
                        if (errors.quantity) setErrors({ ...errors, quantity: '' })
                      }}
                      placeholder="0"
                      min="0"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.quantity ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.quantity && (
                      <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>
                    )}
                  </div>
                </div>

                {/* Minimum Order */}
                <div className="md:w-1/3">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Minimum Order (Optional)
                  </label>
                  <input
                    type="number"
                    value={formData.minOrder}
                    onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                    placeholder="Leave blank for no minimum"
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Certifications</h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.organic}
                    onChange={(e) => setFormData({ ...formData, organic: e.target.checked })}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Organically Grown</p>
                    <p className="text-sm text-gray-600">
                      Grown without synthetic pesticides or fertilizers
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.certifiedOrganic}
                    onChange={(e) =>
                      setFormData({ ...formData, certifiedOrganic: e.target.checked })
                    }
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">USDA Certified Organic</p>
                    <p className="text-sm text-gray-600">Official USDA organic certification</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Delivery Methods */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Delivery Methods <span className="text-red-500">*</span>
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Select all delivery methods you can offer
              </p>

              <div className="space-y-3">
                {deliveryOptions.map((option) => (
                  <label key={option.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.deliveryMethods.includes(option.id)}
                      onChange={() => toggleDeliveryMethod(option.id)}
                      className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <span className="font-medium text-gray-900">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.deliveryMethods && (
                <p className="mt-2 text-sm text-red-500">{errors.deliveryMethods}</p>
              )}

              {/* Pickup Location */}
              {formData.deliveryMethods.includes('pickup') && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Pickup Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.pickupLocation}
                    onChange={(e) => {
                      setFormData({ ...formData, pickupLocation: e.target.value })
                      if (errors.pickupLocation) setErrors({ ...errors, pickupLocation: '' })
                    }}
                    placeholder="123 Farm Road, City, State ZIP"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.pickupLocation ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.pickupLocation && (
                    <p className="mt-1 text-sm text-red-500">{errors.pickupLocation}</p>
                  )}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-green-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>Listing Product...</>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    List Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  )
}

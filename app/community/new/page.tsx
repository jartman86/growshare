'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ForumCategory } from '@/lib/community-data'
import { ArrowLeft, Send, Smile, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function NewTopicPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General Discussion' as ForumCategory,
    tags: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const categories: ForumCategory[] = [
    'General Discussion',
    'Growing Tips',
    'Pest & Disease',
    'Equipment & Tools',
    'Soil & Composting',
    'Seeds & Seedlings',
    'Harvesting & Storage',
    'Selling & Marketing',
    'Off Topic',
  ]

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters'
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    } else if (formData.content.length < 20) {
      newErrors.content = 'Content must be at least 20 characters'
    }

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
    await new Promise((resolve) => setTimeout(resolve, 1500))

    alert(
      `🎉 Topic posted successfully!\n\nYour topic "${formData.title}" is now live in the community forum.\n\nYou've earned 50 points for starting a new discussion!`
    )

    // Navigate to community page
    router.push('/community')
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Forum
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Start a New Discussion</h1>
            <p className="text-gray-600">
              Ask questions, share knowledge, or start a conversation with the community
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="bg-white rounded-xl border p-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value })
                  if (errors.title) setErrors({ ...errors, title: '' })
                }}
                placeholder="e.g., Best organic methods for controlling aphids on tomatoes?"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.title}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-600">
                Be specific and clear. A good title helps others find and answer your question.
              </p>
            </div>

            {/* Category */}
            <div className="bg-white rounded-xl border p-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as ForumCategory })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-600">
                Choose the category that best fits your topic
              </p>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl border p-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => {
                  setFormData({ ...formData, content: e.target.value })
                  if (errors.content) setErrors({ ...errors, content: '' })
                }}
                placeholder="Provide details about your question or topic. Include relevant information, your experience so far, and what you've already tried..."
                rows={10}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                  errors.content ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.content && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.content}
                </p>
              )}
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm text-gray-600">{formData.content.length} characters</p>
                <button
                  type="button"
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                >
                  <Smile className="h-4 w-4" />
                  Markdown supported
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl border p-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Tags (Optional)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., aphids, organic, pest-control (comma-separated)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="mt-2 text-sm text-gray-600">
                Add relevant tags to help others find your topic. Separate with commas.
              </p>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 mb-3">💡 Posting Guidelines</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Search before posting to avoid duplicates</li>
                <li>• Be respectful and constructive in your language</li>
                <li>• Provide context and relevant details</li>
                <li>• Use clear formatting and proper spelling</li>
                <li>• Stay on topic and relevant to growing/farming</li>
              </ul>
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
                className="flex-1 bg-purple-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>Posting...</>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Post Topic
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

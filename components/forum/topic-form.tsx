'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Loader2 } from 'lucide-react'

interface TopicFormProps {
  onClose?: () => void
  initialData?: {
    id?: string
    title?: string
    content?: string
    category?: string
    tags?: string[]
  }
  mode?: 'create' | 'edit'
}

const CATEGORIES = [
  { value: 'GENERAL_DISCUSSION', label: 'General Discussion' },
  { value: 'GROWING_TIPS', label: 'Growing Tips' },
  { value: 'PEST_DISEASE', label: 'Pest & Disease' },
  { value: 'EQUIPMENT_TOOLS', label: 'Equipment & Tools' },
  { value: 'RECIPES_COOKING', label: 'Recipes & Cooking' },
  { value: 'MARKETPLACE_HELP', label: 'Marketplace Help' },
  { value: 'INTRODUCTIONS', label: 'Introductions' },
  { value: 'EVENTS_MEETUPS', label: 'Events & Meetups' },
]

export function TopicForm({ onClose, initialData, mode = 'create' }: TopicFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    category: initialData?.category || '',
    tags: initialData?.tags?.join(', ') || '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const tags = formData.tags
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 0)

      const payload = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags,
      }

      const url = mode === 'edit' && initialData?.id
        ? `/api/forum/topics/${initialData.id}`
        : '/api/forum/topics'

      const response = await fetch(url, {
        method: mode === 'edit' ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save topic')
      }

      const topic = await response.json()

      if (onClose) {
        onClose()
      }

      router.push(`/community/${topic.id}`)
      router.refresh()
    } catch (err) {
      console.error('Error saving topic:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsSubmitting(false)
    }
  }

  const isModal = !!onClose

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="What's your question or topic?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Describe your question or share your knowledge..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="tomatoes, organic, beginner (comma-separated)"
        />
        <p className="mt-1 text-xs text-gray-500">
          Add tags to help others find your topic
        </p>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`${onClose ? 'flex-1' : 'w-full'} flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50`}
        >
          {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
          {mode === 'edit' ? 'Update Topic' : 'Post Topic'}
        </button>
      </div>
    </form>
  )

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">
              {mode === 'edit' ? 'Edit Topic' : 'New Topic'}
            </h2>
            <button
              onClick={onClose}
              type="button"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div className="p-6">{formContent}</div>
        </div>
      </div>
    )
  }

  return formContent
}

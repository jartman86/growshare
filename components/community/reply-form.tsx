'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send, Smile } from 'lucide-react'

interface ReplyFormProps {
  topicId: string
}

export function ReplyForm({ topicId }: ReplyFormProps) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      alert('Please enter a reply')
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    alert('✅ Reply posted successfully! You earned 25 points.')

    // Reset form
    setContent('')
    setIsSubmitting(false)

    // Refresh page to show new reply (in real app, would update state)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts, advice, or ask follow-up questions..."
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        />
        <p className="text-sm text-gray-600 mt-2">
          {content.length} characters • Markdown supported
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Add emoji"
          >
            <Smile className="h-5 w-5" />
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>Posting...</>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Post Reply
            </>
          )}
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Be helpful and constructive. Include details and sources when
          possible. Great replies earn upvotes and community recognition!
        </p>
      </div>
    </form>
  )
}

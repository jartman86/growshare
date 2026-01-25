'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUpload } from '@/components/ui/image-upload'
import { PenSquare, Tag, Save } from 'lucide-react'

const POST_TYPES = [
  { value: 'BLOG', label: 'Blog Post', description: 'Long-form article' },
  { value: 'TIP', label: 'Growing Tip', description: 'Quick advice' },
  { value: 'RECIPE', label: 'Recipe', description: 'Food preparation' },
  { value: 'VLOG', label: 'Video Blog', description: 'Video content' },
  { value: 'UPDATE', label: 'Update', description: 'Quick update' },
]

export default function NewPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    type: 'BLOG',
    coverImage: '',
    videoUrl: '',
    tags: '',
    status: 'PUBLISHED',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessage('Post created successfully!')
        setTimeout(() => {
          router.push(`/profile/${data.post.author.username}/posts/${data.post.slug}`)
        }, 1500)
      } else {
        const error = await response.json()
        setMessage(error.error || 'Failed to create post')
      }
    } catch (error) {
      setMessage('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenSquare className="h-5 w-5" />
                Create New Post
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Post Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Post Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {POST_TYPES.map((postType) => (
                      <button
                        key={postType.value}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, type: postType.value })
                        }
                        className={`p-3 border-2 rounded-lg text-left transition-all ${
                          formData.type === postType.value
                            ? 'border-green-600 bg-green-50 dark:bg-green-900/30'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <div className="font-semibold text-sm text-gray-900 dark:text-white">{postType.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {postType.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter a catchy title..."
                    required
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label
                    htmlFor="excerpt"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Excerpt
                  </label>
                  <textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Brief summary (shown in previews)..."
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {formData.excerpt.length}/200 characters
                  </p>
                </div>

                {/* Content */}
                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Content *
                  </label>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={12}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Write your content here... (Markdown supported)"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Tip: Use Markdown for formatting (# for headings, ** for bold, etc.)
                  </p>
                </div>

                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cover Image
                  </label>
                  <ImageUpload
                    value={formData.coverImage ? [formData.coverImage] : []}
                    onChange={(urls) => setFormData({ ...formData, coverImage: urls[0] || '' })}
                    maxImages={1}
                    folder="growshare/posts"
                  />
                </div>

                {/* Video URL (for VLOG type) */}
                {formData.type === 'VLOG' && (
                  <div>
                    <label
                      htmlFor="videoUrl"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Video URL
                    </label>
                    <input
                      type="url"
                      id="videoUrl"
                      value={formData.videoUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, videoUrl: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                )}

                {/* Tags */}
                <div>
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    <Tag className="inline h-4 w-4 mr-1" />
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="tomatoes, organic, tips (comma separated)"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Separate tags with commas to help others find your post
                  </p>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="PUBLISHED"
                        checked={formData.status === 'PUBLISHED'}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="mr-2"
                      />
                      <span>Publish Now</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="DRAFT"
                        checked={formData.status === 'DRAFT'}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="mr-2"
                      />
                      <span>Save as Draft</span>
                    </label>
                  </div>
                </div>

                {/* Message */}
                {message && (
                  <div
                    className={`p-4 rounded-lg ${
                      message.includes('success')
                        ? 'bg-green-50 text-green-800'
                        : 'bg-red-50 text-red-800'
                    }`}
                  >
                    {message}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    {loading
                      ? 'Creating...'
                      : formData.status === 'PUBLISHED'
                      ? 'Publish Post'
                      : 'Save Draft'}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  )
}

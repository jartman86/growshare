'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Send } from 'lucide-react'

interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    username: string
    firstName: string
    lastName: string
    avatar: string | null
  }
}

interface CommentSectionProps {
  postId: string
  isSignedIn: boolean
}

export function CommentSection({ postId, isSignedIn }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/comments?postId=${postId}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch {
      // Silently ignore errors fetching comments
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          content: newComment.trim(),
        }),
      })

      if (response.ok) {
        const comment = await response.json()
        setComments([comment, ...comments])
        setNewComment('')
      }
    } catch {
      // Silently ignore errors posting comment
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (date: string) => {
    const now = new Date()
    const commentDate = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: commentDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    }).format(commentDate)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Comment Form */}
        {isSignedIn ? (
          <form onSubmit={handleSubmit} className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600">
              <Link href="/sign-in" className="text-green-600 hover:text-green-700 font-medium">
                Sign in
              </Link>{' '}
              to leave a comment
            </p>
          </div>
        )}

        {/* Comments List */}
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading comments...</div>
        ) : comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 pb-4 border-b last:border-b-0">
                <Link href={`/profile/${comment.author.username}`}>
                  {comment.author.avatar ? (
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.firstName}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-white">
                        {comment.author.firstName.charAt(0)}
                        {comment.author.lastName.charAt(0)}
                      </span>
                    </div>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={`/profile/${comment.author.username}`}
                      className="font-semibold text-gray-900 hover:text-green-600"
                    >
                      {comment.author.firstName} {comment.author.lastName}
                    </Link>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap break-words">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        )}
      </CardContent>
    </Card>
  )
}

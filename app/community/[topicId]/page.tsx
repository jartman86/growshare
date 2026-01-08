import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SAMPLE_TOPICS, SAMPLE_REPLIES } from '@/lib/community-data'
import { ReplyCard } from '@/components/community/reply-card'
import { ReplyForm } from '@/components/community/reply-form'
import {
  ArrowLeft,
  Pin,
  CheckCircle,
  Eye,
  MessageCircle,
  ArrowUp,
  Tag,
  Calendar,
  Star,
} from 'lucide-react'
import Link from 'next/link'

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ topicId: string }>
}) {
  const { topicId } = await params
  const topic = SAMPLE_TOPICS.find((t) => t.id === topicId)

  if (!topic) {
    notFound()
  }

  const replies = SAMPLE_REPLIES.filter((r) => r.topicId === topicId).sort(
    (a, b) => {
      // Accepted answer first
      if (a.isAccepted && !b.isAccepted) return -1
      if (!a.isAccepted && b.isAccepted) return 1
      // Then by creation date
      return a.createdAt.getTime() - b.createdAt.getTime()
    }
  )

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Forum
          </Link>

          {/* Topic Header */}
          <div className="bg-white rounded-xl border p-8 mb-6">
            {/* Category & Status Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {topic.category}
              </span>
              {topic.isPinned && (
                <div className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  <Pin className="h-4 w-4" />
                  Pinned
                </div>
              )}
              {topic.isSolved && (
                <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  <CheckCircle className="h-4 w-4" />
                  Solved
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{topic.title}</h1>

            {/* Author Info */}
            <div className="flex items-start gap-4 mb-6">
              {topic.authorAvatar && (
                <img
                  src={topic.authorAvatar}
                  alt={topic.authorName}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-900">{topic.authorName}</p>
                  {topic.authorName === 'GrowShare Team' && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                      <Star className="h-3 w-3" />
                      Staff
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Posted {formatDate(topic.createdAt)}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <Eye className="h-4 w-4" />
                  <span>{topic.views}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <MessageCircle className="h-4 w-4" />
                  <span>{topic.replyCount}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <ArrowUp className="h-4 w-4" />
                  <span>{topic.upvotes}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{topic.content}</p>
            </div>

            {/* Tags */}
            {topic.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-6 border-t">
                {topic.tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Replies Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
            </h2>

            <div className="space-y-4">
              {replies.map((reply) => (
                <ReplyCard key={reply.id} reply={reply} />
              ))}
            </div>

            {replies.length === 0 && (
              <div className="bg-white rounded-xl border p-12 text-center">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No replies yet</h3>
                <p className="text-gray-600">Be the first to reply to this topic!</p>
              </div>
            )}
          </div>

          {/* Reply Form */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Post a Reply</h3>
            <ReplyForm topicId={topicId} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

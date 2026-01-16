import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent } from '@/components/ui/card'
import { CommentSection } from '@/components/posts/comment-section'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import {
  ArrowLeft,
  Calendar,
  Eye,
  Heart,
  Tag,
  Edit,
} from 'lucide-react'

export default async function PostPage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>
}) {
  const { username, slug } = await params
  const { userId } = await auth()

  // Fetch the post directly from database
  const post = await prisma.userPost.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          clerkId: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
          bio: true,
        },
      },
    },
  })

  if (!post) {
    notFound()
  }

  // Increment view count
  await prisma.userPost.update({
    where: { slug },
    data: { views: { increment: 1 } },
  })

  // Check if current user is the author
  const isAuthor = userId && post.author.clerkId === userId

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  return (
    <>
      <Header />

      <main className="min-h-screen topo-lines">
        {/* Cover Image */}
        {post.coverImage && (
          <div
            className="h-96 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${post.coverImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href={`/profile/${username}`}
            className="inline-flex items-center gap-2 text-[#4a3f35] hover:text-[#4a7c2c] mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {post.author.firstName}'s Profile
          </Link>

          {/* Post Header */}
          <Card className={post.coverImage ? '-mt-32 relative z-10' : ''}>
            <CardContent className="p-8">
              {/* Post Type Badge */}
              <span className="inline-block px-3 py-1 bg-[#aed581]/30 text-[#2d5016] rounded-full text-sm font-medium mb-4">
                {post.type}
              </span>

              {/* Title */}
              <h1 className="text-4xl font-bold text-[#2d5016] mb-4">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#4a3f35] mb-6 pb-6 border-b-2 border-[#aed581]/20">
                <Link
                  href={`/profile/${username}`}
                  className="flex items-center gap-2 hover:text-[#4a7c2c]"
                >
                  {post.author.avatar ? (
                    <img
                      src={post.author.avatar}
                      alt={post.author.firstName}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6ba03f] to-[#4a7c2c] flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {post.author.firstName?.charAt(0) || post.author.username?.charAt(0)?.toUpperCase() || '?'}
                        {post.author.lastName?.charAt(0) || ''}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-[#2d5016]">
                      {post.author.firstName} {post.author.lastName}
                    </div>
                    <div className="text-xs">@{username}</div>
                  </div>
                </Link>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.publishedAt || post.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {post.views} views
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {post.likes} likes
                </div>
                {isAuthor && (
                  <Link
                    href={`/posts/${slug}/edit`}
                    className="ml-auto flex items-center gap-1 text-green-600 hover:text-green-700 font-medium"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Post
                  </Link>
                )}
              </div>

              {/* Excerpt */}
              {post.excerpt && (
                <div className="text-lg text-gray-700 mb-6 italic border-l-4 border-green-500 pl-4">
                  {post.excerpt}
                </div>
              )}

              {/* Video (for VLOG type) */}
              {post.videoUrl && (
                <div className="mb-6">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    {post.videoUrl.includes('youtube.com') ||
                    post.videoUrl.includes('youtu.be') ? (
                      <iframe
                        src={post.videoUrl.replace('watch?v=', 'embed/')}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <video src={post.videoUrl} controls className="w-full h-full" />
                    )}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="prose max-w-none mb-8">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {post.content}
                </div>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="pt-6 border-t">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="h-4 w-4 text-gray-500" />
                    {post.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Author Card */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                About the Author
              </h3>
              <div className="flex items-start gap-4">
                <Link href={`/profile/${username}`}>
                  {post.author.avatar ? (
                    <img
                      src={post.author.avatar}
                      alt={post.author.firstName}
                      className="w-16 h-16 rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <span className="text-xl font-bold text-white">
                        {post.author.firstName?.charAt(0) || post.author.username?.charAt(0)?.toUpperCase() || '?'}
                        {post.author.lastName?.charAt(0) || ''}
                      </span>
                    </div>
                  )}
                </Link>
                <div className="flex-1">
                  <Link
                    href={`/profile/${username}`}
                    className="font-semibold text-gray-900 hover:text-green-600"
                  >
                    {post.author.firstName} {post.author.lastName}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">{post.author.bio}</p>
                  <Link
                    href={`/profile/${username}`}
                    className="inline-flex items-center gap-1 mt-2 text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    View Profile →
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comment Section */}
          <div className="mt-8">
            <CommentSection postId={post.id} isSignedIn={!!userId} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

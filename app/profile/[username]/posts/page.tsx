import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Calendar, Eye, Heart } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export default async function UserPostsPage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  // Fetch user and their posts
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatar: true,
    },
  })

  if (!user) {
    notFound()
  }

  const posts = await prisma.userPost.findMany({
    where: {
      authorId: user.id,
      status: 'PUBLISHED',
    },
    orderBy: { publishedAt: 'desc' },
  })

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date))
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href={`/profile/${username}`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              All Posts by {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-600 mt-2">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'} published
            </p>
          </div>

          {/* Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/profile/${username}/posts/${post.slug}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                    {post.coverImage && (
                      <div className="aspect-video bg-gray-200 overflow-hidden">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                          {post.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(post.publishedAt)}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {post.likes}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-gray-600">No posts yet.</p>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

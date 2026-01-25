import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const type = searchParams.get('type') // plots, users, marketplace, tools, forums, or all
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        plots: [],
        users: [],
        marketplace: [],
        tools: [],
        forums: [],
      })
    }

    const searchTerm = query.trim()
    const types = type ? [type] : ['plots', 'users', 'marketplace', 'tools', 'forums']

    const results: Record<string, any[]> = {
      plots: [],
      users: [],
      marketplace: [],
      tools: [],
      forums: [],
    }

    // Search in parallel
    const searches = []

    if (types.includes('plots')) {
      searches.push(
        prisma.plot
          .findMany({
            where: {
              status: { in: ['ACTIVE', 'RENTED'] },
              OR: [
                { title: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } },
                { city: { contains: searchTerm, mode: 'insensitive' } },
                { state: { contains: searchTerm, mode: 'insensitive' } },
              ],
            },
            select: {
              id: true,
              title: true,
              city: true,
              state: true,
              acreage: true,
              pricePerMonth: true,
              images: true,
              status: true,
            },
            take: limit,
            orderBy: { createdAt: 'desc' },
          })
          .then((data) => {
            results.plots = data.map((plot) => ({
              ...plot,
              type: 'plot',
              url: `/plots/${plot.id}`,
              image: plot.images?.[0] || null,
              subtitle: `${plot.city}, ${plot.state} • ${plot.acreage} acres`,
            }))
          })
      )
    }

    if (types.includes('users')) {
      searches.push(
        prisma.user
          .findMany({
            where: {
              status: 'ACTIVE',
              OR: [
                { firstName: { contains: searchTerm, mode: 'insensitive' } },
                { lastName: { contains: searchTerm, mode: 'insensitive' } },
                { username: { contains: searchTerm, mode: 'insensitive' } },
              ],
            },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              avatar: true,
              isVerified: true,
              level: true,
            },
            take: limit,
          })
          .then((data) => {
            results.users = data.map((user) => ({
              ...user,
              type: 'user',
              title: `${user.firstName} ${user.lastName}`,
              url: `/profile/${user.id}`,
              image: user.avatar,
              subtitle: user.username ? `@${user.username}` : `Level ${user.level}`,
            }))
          })
      )
    }

    if (types.includes('marketplace')) {
      searches.push(
        prisma.produceListing
          .findMany({
            where: {
              status: 'AVAILABLE',
              OR: [
                { productName: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } },
                { category: { contains: searchTerm, mode: 'insensitive' } },
              ],
            },
            select: {
              id: true,
              productName: true,
              category: true,
              pricePerUnit: true,
              unit: true,
              images: true,
            },
            take: limit,
            orderBy: { createdAt: 'desc' },
          })
          .then((data) => {
            results.marketplace = data.map((item) => ({
              id: item.id,
              type: 'marketplace',
              title: item.productName,
              url: `/marketplace/${item.id}`,
              image: item.images?.[0] || null,
              subtitle: `${item.category} • $${item.pricePerUnit}/${item.unit}`,
            }))
          })
      )
    }

    if (types.includes('tools')) {
      searches.push(
        prisma.tool
          .findMany({
            where: {
              status: 'AVAILABLE',
              OR: [
                { name: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } },
              ],
            },
            select: {
              id: true,
              name: true,
              category: true,
              dailyRate: true,
              images: true,
            },
            take: limit,
            orderBy: { createdAt: 'desc' },
          })
          .then((data) => {
            results.tools = data.map((tool) => ({
              id: tool.id,
              type: 'tool',
              title: tool.name,
              url: `/tools/${tool.id}`,
              image: tool.images?.[0] || null,
              subtitle: `${tool.category} • $${tool.dailyRate || 0}/day`,
            }))
          })
      )
    }

    if (types.includes('forums')) {
      searches.push(
        prisma.forumTopic
          .findMany({
            where: {
              OR: [
                { title: { contains: searchTerm, mode: 'insensitive' } },
                { content: { contains: searchTerm, mode: 'insensitive' } },
              ],
            },
            select: {
              id: true,
              title: true,
              category: true,
              createdAt: true,
              author: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
              _count: {
                select: { replies: true },
              },
            },
            take: limit,
            orderBy: { createdAt: 'desc' },
          })
          .then((data) => {
            results.forums = data.map((topic) => ({
              id: topic.id,
              type: 'forum',
              title: topic.title,
              url: `/community/forums/${topic.id}`,
              image: null,
              subtitle: `${topic.category} • ${topic._count.replies} replies`,
              author: `${topic.author.firstName} ${topic.author.lastName}`,
            }))
          })
      )
    }

    await Promise.all(searches)

    return NextResponse.json(results)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}

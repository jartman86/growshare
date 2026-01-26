import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ensureUser } from '@/lib/ensure-user'

// Get all reports (admin only)
export async function GET(request: NextRequest) {
  try {
    const currentUser = await ensureUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    if (!currentUser.role.includes('ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'PENDING'
    const type = searchParams.get('type')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where = {
      ...(status !== 'ALL' && { status: status as any }),
      ...(type && { type: type as any }),
    }

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        include: {
          reporter: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          plot: {
            select: {
              id: true,
              title: true,
            },
          },
          review: {
            select: {
              id: true,
              title: true,
              content: true,
            },
          },
          message: {
            select: {
              id: true,
              subject: true,
              content: true,
            },
          },
          listing: {
            select: {
              id: true,
              productName: true,
              description: true,
            },
          },
          tool: {
            select: {
              id: true,
              tool: {
                select: {
                  name: true,
                },
              },
            },
          },
          post: {
            select: {
              id: true,
              content: true,
            },
          },
          reportedUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.report.count({ where }),
    ])

    // Format reports for the frontend
    const formattedReports = reports.map((report) => {
      // Determine content title and preview based on type
      let content: { id: string; title?: string; content?: string; preview?: string } = { id: '' }

      switch (report.type) {
        case 'PLOT':
          content = {
            id: report.plot?.id || '',
            title: report.plot?.title,
          }
          break
        case 'REVIEW':
          content = {
            id: report.review?.id || '',
            title: report.review?.title || 'Review',
            content: report.review?.content,
            preview: report.review?.content?.slice(0, 100),
          }
          break
        case 'MESSAGE':
          content = {
            id: report.message?.id || '',
            title: report.message?.subject || 'Message',
            content: report.message?.content,
            preview: report.message?.content?.slice(0, 100),
          }
          break
        case 'LISTING':
          content = {
            id: report.listing?.id || '',
            title: report.listing?.productName,
            content: report.listing?.description,
            preview: report.listing?.description?.slice(0, 100),
          }
          break
        case 'TOOL':
          content = {
            id: report.tool?.id || '',
            title: report.tool?.tool?.name || 'Tool Rental',
          }
          break
        case 'FORUM_POST':
          content = {
            id: report.post?.id || '',
            title: 'Forum Post',
            content: report.post?.content,
            preview: report.post?.content?.slice(0, 100),
          }
          break
        case 'USER':
          content = {
            id: report.reportedUser?.id || '',
            title: `${report.reportedUser?.firstName || ''} ${report.reportedUser?.lastName || ''}`.trim() || 'User',
          }
          break
      }

      return {
        id: report.id,
        type: report.type,
        reason: report.reason.replace(/_/g, ' ').toLowerCase(),
        status: report.status,
        details: report.details,
        createdAt: report.createdAt.toISOString(),
        reportedBy: report.reporter,
        content,
        resolution: report.resolution,
        actionTaken: report.actionTaken,
      }
    })

    return NextResponse.json({
      reports: formattedReports,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}

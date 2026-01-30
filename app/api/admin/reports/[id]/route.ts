import { NextRequest, NextResponse } from 'next/server'
import { use } from 'react'
import { prisma } from '@/lib/db'
import { ensureUser } from '@/lib/ensure-user'

interface RouteParams {
  params: Promise<{ id: string }>
}

// Get single report
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const currentUser = await ensureUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!currentUser.role.includes('ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        reporter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            email: true,
          },
        },
        plot: true,
        review: true,
        message: true,
        listing: true,
        tool: {
          include: {
            tool: true,
          },
        },
        post: true,
        reportedUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            email: true,
          },
        },
      },
    })

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    return NextResponse.json(report)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    )
  }
}

// Update report (resolve/dismiss)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const currentUser = await ensureUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!currentUser.role.includes('ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { status, resolution, actionTaken } = body

    // Validate status
    if (status && !['PENDING', 'RESOLVED', 'DISMISSED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const report = await prisma.report.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(resolution !== undefined && { resolution }),
        ...(actionTaken !== undefined && { actionTaken }),
        ...(status && status !== 'PENDING' && {
          resolvedBy: currentUser.id,
          resolvedAt: new Date(),
        }),
      },
    })

    return NextResponse.json(report)
  } catch {
    return NextResponse.json(
      { error: 'Failed to update report' },
      { status: 500 }
    )
  }
}

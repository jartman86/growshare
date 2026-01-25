import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// GET - Get user's saved searches
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const savedSearches = await prisma.savedSearch.findMany({
      where: { userId: currentUser.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(savedSearches)
  } catch (error) {
    console.error('Error fetching saved searches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch saved searches' },
      { status: 500 }
    )
  }
}

// POST - Create a saved search
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { name, filters, notifyOnNew } = body

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search name is required' },
        { status: 400 }
      )
    }

    // Limit saved searches per user
    const searchCount = await prisma.savedSearch.count({
      where: { userId: currentUser.id },
    })

    if (searchCount >= 10) {
      return NextResponse.json(
        { error: 'Maximum of 10 saved searches allowed' },
        { status: 400 }
      )
    }

    const savedSearch = await prisma.savedSearch.create({
      data: {
        userId: currentUser.id,
        name: name.trim(),
        filters: filters || {},
        notifyOnNew: notifyOnNew || false,
      },
    })

    return NextResponse.json(savedSearch, { status: 201 })
  } catch (error) {
    console.error('Error creating saved search:', error)
    return NextResponse.json(
      { error: 'Failed to create saved search' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a saved search
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const searchId = searchParams.get('id')

    if (!searchId) {
      return NextResponse.json(
        { error: 'Search ID is required' },
        { status: 400 }
      )
    }

    const savedSearch = await prisma.savedSearch.findUnique({
      where: { id: searchId },
    })

    if (!savedSearch || savedSearch.userId !== currentUser.id) {
      return NextResponse.json(
        { error: 'Saved search not found' },
        { status: 404 }
      )
    }

    await prisma.savedSearch.delete({
      where: { id: searchId },
    })

    return NextResponse.json({
      success: true,
      message: 'Saved search deleted',
    })
  } catch (error) {
    console.error('Error deleting saved search:', error)
    return NextResponse.json(
      { error: 'Failed to delete saved search' },
      { status: 500 }
    )
  }
}

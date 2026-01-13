import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const username = url.searchParams.get('username')

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 })
    }

    // Check if username is already taken
    const existingUser = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUser && existingUser.clerkId !== userId) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 400 }
      )
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: { username },
    })

    return NextResponse.json({
      message: 'Username updated successfully! Refresh the page to see your profile link.',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
      }
    })
  } catch (error) {
    console.error('Error updating username:', error)
    return NextResponse.json({
      error: 'Failed to update username',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { username } = await request.json()

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 })
    }

    // Check if username is already taken
    const existingUser = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUser && existingUser.clerkId !== userId) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 400 }
      )
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: { username },
    })

    return NextResponse.json({
      message: 'Username updated successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
      }
    })
  } catch (error) {
    console.error('Error updating username:', error)
    return NextResponse.json({
      error: 'Failed to update username',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

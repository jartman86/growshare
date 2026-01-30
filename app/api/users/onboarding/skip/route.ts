import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureUser } from '@/lib/ensure-user'

export async function POST() {
  try {
    const currentUser = await ensureUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mark onboarding as complete without setting additional profile data
    const user = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        onboardingComplete: true,
      },
    })

    return NextResponse.json({ success: true, user })
  } catch {
    return NextResponse.json(
      { error: 'Failed to skip onboarding' },
      { status: 500 }
    )
  }
}

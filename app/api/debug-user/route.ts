import { NextResponse } from 'next/server'
import { ensureUser } from '@/lib/ensure-user'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await ensureUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' })
    }

    // Get bookings for this user
    const bookings = await prisma.booking.findMany({
      where: { renterId: user.id },
      select: { id: true, status: true }
    })

    return NextResponse.json({
      userId: user.id,
      email: user.email,
      clerkId: user.clerkId,
      bookingsCount: bookings.length,
      bookings
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) })
  }
}

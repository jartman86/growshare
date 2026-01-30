import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your webhook secret
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env.local')
  }

  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch {
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, username, first_name, last_name, image_url } = evt.data

    // Validate email exists
    const primaryEmail = email_addresses?.[0]
    if (!primaryEmail?.email_address) {
      return new Response(JSON.stringify({ error: 'No email address found' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    try {
      // Generate username from Clerk username or email
      let baseUsername = username
      if (!baseUsername) {
        // Generate from email (part before @)
        const emailPrefix = primaryEmail.email_address.split('@')[0]
        baseUsername = emailPrefix.toLowerCase().replace(/[^a-z0-9]/g, '')
      }

      // Ensure username is unique
      let finalUsername = baseUsername
      let counter = 1
      while (await prisma.user.findUnique({ where: { username: finalUsername } })) {
        finalUsername = `${baseUsername}${counter}`
        counter++
      }

      // Check email verification status from Clerk
      const isEmailVerified = primaryEmail.verification?.status === 'verified'

      // Create user in database
      const user = await prisma.user.create({
        data: {
          clerkId: id,
          email: primaryEmail.email_address,
          username: finalUsername,
          firstName: first_name || '',
          lastName: last_name || '',
          avatar: image_url,
          role: ['RENTER'], // Default role
          totalPoints: 0,
          level: 1,
          isVerified: isEmailVerified,
          verifiedAt: isEmailVerified ? new Date() : null,
        },
      })

      // Award welcome badge
      const welcomeBadge = await prisma.badge.findFirst({
        where: { name: 'Welcome to GrowShare' },
      })

      if (welcomeBadge) {
        await prisma.userBadge.create({
          data: {
            userId: user.id,
            badgeId: welcomeBadge.id,
          },
        })

        // Add points for welcome badge
        await prisma.user.update({
          where: { id: user.id },
          data: { totalPoints: { increment: welcomeBadge.points } },
        })

        // Create activity
        await prisma.userActivity.create({
          data: {
            userId: user.id,
            type: 'BADGE_EARNED',
            title: 'Welcome to GrowShare!',
            description: 'Earned your first badge',
            points: welcomeBadge.points,
          },
        })
      }

      return new Response(JSON.stringify({ success: true, userId: user.id }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    } catch {
      return new Response(JSON.stringify({ error: 'Failed to create user' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data

    // Validate email exists
    const primaryEmail = email_addresses?.[0]
    if (!primaryEmail?.email_address) {
      return new Response(JSON.stringify({ error: 'No email address found' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    try {
      // Check email verification status from Clerk
      const isEmailVerified = primaryEmail.verification?.status === 'verified'

      // Get current user to check if verification status changed
      const existingUser = await prisma.user.findUnique({
        where: { clerkId: id },
        select: { isVerified: true },
      })

      const updateData: {
        email: string
        firstName?: string
        lastName?: string
        avatar?: string
        isVerified?: boolean
        verifiedAt?: Date
      } = {
        email: primaryEmail.email_address,
        firstName: first_name || undefined,
        lastName: last_name || undefined,
        avatar: image_url || undefined,
      }

      // Update verification status if it changed to verified
      if (isEmailVerified && existingUser && !existingUser.isVerified) {
        updateData.isVerified = true
        updateData.verifiedAt = new Date()
      }

      await prisma.user.update({
        where: { clerkId: id },
        data: updateData,
      })

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    } catch {
      return new Response(JSON.stringify({ error: 'Failed to update user' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data

    try {
      await prisma.user.delete({
        where: { clerkId: id },
      })

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    } catch {
      return new Response(JSON.stringify({ error: 'Failed to delete user' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

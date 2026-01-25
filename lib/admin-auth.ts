import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

/**
 * Checks if the current user has ADMIN role.
 * For use in API routes - returns the user or null.
 */
export async function isAdmin() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      role: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  })

  if (!user || !user.role.includes('ADMIN')) {
    return null
  }

  return user
}

/**
 * Requires admin role for API routes.
 * Returns the admin user or throws an error response.
 */
export async function requireAdmin() {
  const admin = await isAdmin()

  if (!admin) {
    throw new Error('Unauthorized: Admin access required')
  }

  return admin
}

/**
 * Server component helper to check admin access.
 * Redirects to home if not an admin.
 */
export async function requireAdminPage() {
  const admin = await isAdmin()

  if (!admin) {
    redirect('/')
  }

  return admin
}

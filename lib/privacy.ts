import { prisma } from '@/lib/prisma'

/**
 * Check if viewerId is blocked by profileOwnerId
 */
export async function isBlockedBy(viewerId: string, profileOwnerId: string): Promise<boolean> {
  const block = await prisma.blockedUser.findUnique({
    where: {
      blockerId_blockedId: {
        blockerId: profileOwnerId,
        blockedId: viewerId,
      },
    },
  })
  return !!block
}

/**
 * Check if a user has blocked another user
 */
export async function hasBlocked(blockerId: string, blockedId: string): Promise<boolean> {
  const block = await prisma.blockedUser.findUnique({
    where: {
      blockerId_blockedId: {
        blockerId,
        blockedId,
      },
    },
  })
  return !!block
}

interface ProfileUser {
  id: string
  profileVisibility: string
}

interface CanViewResult {
  canView: boolean
  reason?: 'private' | 'blocked' | 'login_required'
}

/**
 * Check if a viewer can view a profile based on privacy settings
 */
export async function canViewProfile(
  viewerId: string | null,
  profileUser: ProfileUser
): Promise<CanViewResult> {
  // Public profiles visible to all
  if (profileUser.profileVisibility === 'PUBLIC') {
    return { canView: true }
  }

  // Must be logged in for non-public profiles
  if (!viewerId) {
    return { canView: false, reason: 'login_required' }
  }

  // Own profile always visible
  if (viewerId === profileUser.id) {
    return { canView: true }
  }

  // Check if blocked
  if (await isBlockedBy(viewerId, profileUser.id)) {
    return { canView: false, reason: 'blocked' }
  }

  // Private profiles - only allow if interaction exists (messages or bookings)
  if (profileUser.profileVisibility === 'PRIVATE') {
    // Check for message history
    const hasMessages = await prisma.message.findFirst({
      where: {
        OR: [
          { senderId: viewerId, receiverId: profileUser.id },
          { senderId: profileUser.id, receiverId: viewerId },
        ],
      },
    })

    if (hasMessages) {
      return { canView: true }
    }

    // Check for booking relationship
    const hasBooking = await prisma.booking.findFirst({
      where: {
        OR: [
          // Viewer booked profile owner's plot
          {
            renterId: viewerId,
            plot: { ownerId: profileUser.id },
          },
          // Profile owner booked viewer's plot
          {
            renterId: profileUser.id,
            plot: { ownerId: viewerId },
          },
        ],
      },
    })

    if (hasBooking) {
      return { canView: true }
    }

    return { canView: false, reason: 'private' }
  }

  return { canView: true }
}

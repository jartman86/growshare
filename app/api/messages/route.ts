import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { notifyNewMessage } from '@/lib/notifications'

// Send a new message
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
    const { receiverId, content, subject, bookingId } = body

    // Validate required fields
    if (!receiverId || !content) {
      return NextResponse.json(
        { error: 'Receiver ID and content are required' },
        { status: 400 }
      )
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    })

    if (!receiver) {
      return NextResponse.json(
        { error: 'Receiver not found' },
        { status: 404 }
      )
    }

    // Can't message yourself
    if (receiverId === currentUser.id) {
      return NextResponse.json(
        { error: 'You cannot message yourself' },
        { status: 400 }
      )
    }

    // Check if sender is blocked by receiver
    const isBlocked = await prisma.blockedUser.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId: receiverId,
          blockedId: currentUser.id,
        },
      },
    })

    if (isBlocked) {
      return NextResponse.json(
        { error: 'You cannot send messages to this user' },
        { status: 403 }
      )
    }

    // Check if receiver has disabled messages (unless there's an existing conversation or active booking)
    if (receiver.allowMessages === 'NONE') {
      // Check for existing conversation
      const existingConversation = await prisma.message.findFirst({
        where: {
          OR: [
            { senderId: currentUser.id, receiverId },
            { senderId: receiverId, receiverId: currentUser.id },
          ],
        },
      })

      // Check for active booking between users
      const activeBooking = await prisma.booking.findFirst({
        where: {
          OR: [
            {
              renterId: currentUser.id,
              plot: { ownerId: receiverId },
              status: { in: ['PENDING', 'APPROVED', 'ACTIVE'] },
            },
            {
              renterId: receiverId,
              plot: { ownerId: currentUser.id },
              status: { in: ['PENDING', 'APPROVED', 'ACTIVE'] },
            },
          ],
        },
      })

      if (!existingConversation && !activeBooking) {
        return NextResponse.json(
          { error: 'This user is not accepting messages' },
          { status: 403 }
        )
      }
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        senderId: currentUser.id,
        receiverId,
        content,
        subject: subject || null,
        bookingId: bookingId || null,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        booking: {
          select: {
            id: true,
            plot: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    })

    // Send notification to receiver
    try {
      await notifyNewMessage(
        receiverId,
        `${currentUser.firstName} ${currentUser.lastName}`
      )
    } catch (error) {
      console.error('Failed to send notification:', error)
    }

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

// Get user's conversations
export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams
    const otherUserId = searchParams.get('userId')

    // If specific user is requested, get conversation with that user
    if (otherUserId) {
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            {
              senderId: currentUser.id,
              receiverId: otherUserId,
            },
            {
              senderId: otherUserId,
              receiverId: currentUser.id,
            },
          ],
        },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          receiver: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          booking: {
            select: {
              id: true,
              plot: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      })

      // Mark messages from other user as read
      await prisma.message.updateMany({
        where: {
          senderId: otherUserId,
          receiverId: currentUser.id,
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      })

      return NextResponse.json(messages)
    }

    // Otherwise, get all messages involving the user
    const allMessages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUser.id },
          { receiverId: currentUser.id },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        booking: {
          select: {
            id: true,
            plot: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Group messages into conversations
    const conversationsMap = new Map<string, any>()

    allMessages.forEach((message: any) => {
      // Determine the other user in the conversation
      const otherUser = message.senderId === currentUser.id
        ? message.receiver
        : message.sender

      const conversationKey = otherUser.id

      if (!conversationsMap.has(conversationKey)) {
        conversationsMap.set(conversationKey, {
          userId: otherUser.id,
          user: otherUser,
          lastMessage: message,
          unreadCount: 0,
          messages: [],
        })
      }

      const conversation = conversationsMap.get(conversationKey)!
      conversation.messages.push(message)

      // Update last message if this one is newer
      if (new Date(message.createdAt) > new Date(conversation.lastMessage.createdAt)) {
        conversation.lastMessage = message
      }

      // Count unread messages (messages sent to current user that are unread)
      if (message.receiverId === currentUser.id && !message.isRead) {
        conversation.unreadCount++
      }
    })

    // Convert map to array and sort by last message time
    const conversations = Array.from(conversationsMap.values()).sort(
      (a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    )

    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

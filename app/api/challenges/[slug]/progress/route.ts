import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ensureUser } from '@/lib/ensure-user'

interface RouteParams {
  params: Promise<{ slug: string }>
}

// Update progress on a challenge (complete tasks)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const currentUser = await ensureUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params
    const body = await request.json()
    const { taskId, completed } = body

    if (!taskId) {
      return NextResponse.json({ error: 'taskId is required' }, { status: 400 })
    }

    const challenge = await prisma.challenge.findUnique({
      where: { slug },
    })

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    // Check if user is participating
    const participation = await prisma.challengeParticipant.findUnique({
      where: {
        challengeId_userId: {
          challengeId: challenge.id,
          userId: currentUser.id,
        },
      },
    })

    if (!participation) {
      return NextResponse.json({ error: 'You are not participating in this challenge' }, { status: 400 })
    }

    if (participation.status === 'COMPLETED') {
      return NextResponse.json({ error: 'You have already completed this challenge' }, { status: 400 })
    }

    if (participation.status === 'DROPPED') {
      return NextResponse.json({ error: 'You have dropped this challenge' }, { status: 400 })
    }

    // Parse requirements to get total tasks
    const requirements = challenge.requirements as { id?: string; title?: string; points?: number }[] | string[] | null
    let totalTasks = 0
    let taskPoints = 0

    if (Array.isArray(requirements)) {
      totalTasks = requirements.length
      // Find the task to get its points
      const taskIndex = parseInt(taskId.replace('task-', '')) - 1
      if (taskIndex >= 0 && taskIndex < requirements.length) {
        const task = requirements[taskIndex]
        if (typeof task === 'object' && task.points) {
          taskPoints = task.points
        }
      }
    }

    if (totalTasks === 0) {
      return NextResponse.json({ error: 'This challenge has no tasks to complete' }, { status: 400 })
    }

    // Update progress data
    const progressData = participation.progressData as { completedTasks?: string[] } || { completedTasks: [] }
    const completedTasks = progressData.completedTasks || []

    if (completed && !completedTasks.includes(taskId)) {
      completedTasks.push(taskId)
    } else if (!completed && completedTasks.includes(taskId)) {
      const index = completedTasks.indexOf(taskId)
      completedTasks.splice(index, 1)
    }

    // Calculate new progress percentage
    const newProgress = Math.round((completedTasks.length / totalTasks) * 100)
    const isNowCompleted = newProgress === 100

    // Update participation
    const updatedParticipation = await prisma.challengeParticipant.update({
      where: { id: participation.id },
      data: {
        progress: newProgress,
        progressData: { completedTasks },
        status: isNowCompleted ? 'COMPLETED' : 'JOINED',
        completedAt: isNowCompleted ? new Date() : null,
      },
    })

    // Award points for task completion
    if (completed && taskPoints > 0) {
      try {
        await prisma.userActivity.create({
          data: {
            userId: currentUser.id,
            type: 'CHALLENGE_TASK_COMPLETED',
            title: 'Completed a challenge task',
            description: `Completed task in ${challenge.title}`,
            points: taskPoints,
            metadata: { challengeId: challenge.id, taskId },
          },
        })

        await prisma.user.update({
          where: { id: currentUser.id },
          data: { totalPoints: { increment: taskPoints } },
        })
      } catch (error) {
        console.error('Error awarding task points:', error)
      }
    }

    // Award bonus points and badge for challenge completion
    if (isNowCompleted) {
      try {
        // Award completion points
        await prisma.userActivity.create({
          data: {
            userId: currentUser.id,
            type: 'CHALLENGE_COMPLETED',
            title: 'Completed a challenge',
            description: `Completed ${challenge.title}`,
            points: challenge.pointsReward,
            metadata: { challengeId: challenge.id, challengeTitle: challenge.title },
          },
        })

        await prisma.user.update({
          where: { id: currentUser.id },
          data: { totalPoints: { increment: challenge.pointsReward } },
        })

        // Award badge if challenge has one
        if (challenge.badgeId) {
          const existingBadge = await prisma.userBadge.findUnique({
            where: {
              userId_badgeId: {
                userId: currentUser.id,
                badgeId: challenge.badgeId,
              },
            },
          })

          if (!existingBadge) {
            await prisma.userBadge.create({
              data: {
                userId: currentUser.id,
                badgeId: challenge.badgeId,
              },
            })
          }
        }
      } catch (error) {
        console.error('Error awarding completion rewards:', error)
      }
    }

    return NextResponse.json({
      success: true,
      participation: {
        status: updatedParticipation.status.toLowerCase(),
        progress: updatedParticipation.progress,
        progressData: updatedParticipation.progressData,
        completedAt: updatedParticipation.completedAt?.toISOString(),
      },
      pointsAwarded: completed ? taskPoints : 0,
      challengeCompleted: isNowCompleted,
      completionPointsAwarded: isNowCompleted ? challenge.pointsReward : 0,
    })
  } catch (error) {
    console.error('Error updating progress:', error)
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}

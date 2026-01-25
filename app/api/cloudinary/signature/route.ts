import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateUploadParams } from '@/lib/cloudinary'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const folder = searchParams.get('folder') || 'growshare'

    // Validate folder parameter to prevent path traversal
    const validFolders = [
      'growshare',
      'growshare/plots',
      'growshare/journals',
      'growshare/produce',
      'growshare/tools',
      'growshare/avatars',
      'growshare/test',
      'growshare/verification',
      'growshare/posts',
    ]
    if (!validFolders.includes(folder)) {
      return NextResponse.json(
        { error: 'Invalid folder specified' },
        { status: 400 }
      )
    }

    const params = generateUploadParams(folder)

    return NextResponse.json(params)
  } catch (error) {
    console.error('Error generating upload signature:', error)
    return NextResponse.json(
      { error: 'Failed to generate upload signature' },
      { status: 500 }
    )
  }
}

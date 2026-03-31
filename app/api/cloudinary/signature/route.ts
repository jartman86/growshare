import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateUploadParams } from '@/lib/cloudinary'

// Allowed file types for upload
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'video/mp4',
  'video/quicktime',
  'application/pdf', // For ID verification uploads
]

// Max file size: 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const folder = searchParams.get('folder') || 'growshare'
    const fileType = searchParams.get('fileType')
    const fileSize = searchParams.get('fileSize')

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
      'growshare/courses',
    ]
    if (!validFolders.includes(folder)) {
      return NextResponse.json(
        { error: 'Invalid folder specified' },
        { status: 400 }
      )
    }

    // Validate file type if provided
    if (fileType && !ALLOWED_FILE_TYPES.includes(fileType)) {
      return NextResponse.json(
        { error: `File type '${fileType}' is not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate file size if provided
    if (fileSize) {
      const size = parseInt(fileSize, 10)
      if (isNaN(size) || size <= 0) {
        return NextResponse.json(
          { error: 'Invalid file size' },
          { status: 400 }
        )
      }
      if (size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File size exceeds maximum of ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
          { status: 400 }
        )
      }
    }

    const params = generateUploadParams(folder)

    return NextResponse.json({
      ...params,
      maxFileSize: MAX_FILE_SIZE,
      allowedTypes: ALLOWED_FILE_TYPES,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate upload signature' },
      { status: 500 }
    )
  }
}

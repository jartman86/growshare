import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary (server-side only)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface SignatureParams {
  timestamp: number
  folder?: string
  transformation?: string
}

export function generateSignature(params: SignatureParams): string {
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: params.timestamp,
      folder: params.folder || 'growshare',
    },
    process.env.CLOUDINARY_API_SECRET!
  )
  return signature
}

export function generateUploadParams(folder: string = 'growshare') {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = generateSignature({ timestamp, folder })

  return {
    timestamp,
    signature,
    folder,
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
  }
}

// Delete an image from Cloudinary (optional utility)
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result.result === 'ok'
  } catch {
    return false
  }
}

export default cloudinary

'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'

interface ImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  maxImages?: number
  folder?: string
  disabled?: boolean
}

interface UploadingFile {
  id: string
  name: string
  progress: number
}

export function ImageUpload({
  value = [],
  onChange,
  maxImages = 10,
  folder = 'growshare',
  disabled = false,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File): Promise<string | null> => {
    const fileId = Math.random().toString(36).substring(7)

    setUploadingFiles((prev) => [...prev, { id: fileId, name: file.name, progress: 0 }])

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

      if (!cloudName) {
        throw new Error('Cloudinary cloud name not configured')
      }

      // Create form data for unsigned Cloudinary upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'growshare_unsigned')
      formData.append('folder', folder)

      // Upload to Cloudinary using unsigned preset
      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json()
        console.error('Cloudinary error:', errorData)
        throw new Error(errorData.error?.message || 'Upload failed')
      }

      const data = await uploadRes.json()

      setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId))

      return data.secure_url
    } catch (err) {
      console.error('Upload error:', err)
      setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId))
      throw err
    }
  }

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      setError(null)
      const fileArray = Array.from(files)

      // Check max images limit
      const remainingSlots = maxImages - value.length
      if (remainingSlots <= 0) {
        setError(`Maximum ${maxImages} images allowed`)
        return
      }

      const filesToUpload = fileArray.slice(0, remainingSlots)

      // Validate files
      const validFiles = filesToUpload.filter((file) => {
        if (!file.type.startsWith('image/')) {
          setError('Only image files are allowed')
          return false
        }
        if (file.size > 10 * 1024 * 1024) {
          setError('Files must be less than 10MB')
          return false
        }
        return true
      })

      if (validFiles.length === 0) return

      // Upload files
      try {
        const urls = await Promise.all(
          validFiles.map((file) => uploadFile(file))
        )
        const successfulUrls = urls.filter((url): url is string => url !== null)
        onChange([...value, ...successfulUrls])
      } catch {
        setError('Failed to upload one or more images')
      }
    },
    [value, onChange, maxImages, folder]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (disabled) return
      handleFiles(e.dataTransfer.files)
    },
    [disabled, handleFiles]
  )

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
    // Reset input value to allow selecting the same file again
    e.target.value = ''
  }

  const removeImage = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index)
    onChange(newUrls)
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="flex flex-col items-center gap-2">
          <div className="p-3 bg-gray-100 rounded-full">
            <Upload className="h-6 w-6 text-gray-500" />
          </div>
          <div>
            <p className="font-medium text-gray-700">
              Drop images here or click to upload
            </p>
            <p className="text-sm text-gray-500 mt-1">
              PNG, JPG, GIF up to 10MB each. Max {maxImages} images.
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <Loader2 className="h-5 w-5 text-green-600 animate-spin" />
              <span className="text-sm text-gray-700 truncate flex-1">
                {file.name}
              </span>
              <span className="text-xs text-gray-500">Uploading...</span>
            </div>
          ))}
        </div>
      )}

      {/* Image Previews */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div
              key={url}
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
            >
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-2 left-2 px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                  Primary
                </span>
              )}
            </div>
          ))}

          {/* Add More Placeholder */}
          {value.length < maxImages && (
            <button
              type="button"
              onClick={handleClick}
              className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 hover:border-gray-400 transition-colors"
            >
              <ImageIcon className="h-8 w-8 text-gray-400" />
              <span className="text-xs text-gray-500">Add Image</span>
            </button>
          )}
        </div>
      )}

      {/* Image Count */}
      <p className="text-xs text-gray-500">
        {value.length} of {maxImages} images uploaded
      </p>
    </div>
  )
}

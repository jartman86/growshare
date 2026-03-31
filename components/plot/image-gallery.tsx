'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageGalleryProps {
  images: string[]
  title: string
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setIsLightboxOpen(true)
  }

  return (
    <>
      {/* Main Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 h-[300px] md:h-[500px]">
        {/* Large Image */}
        <div
          className="col-span-2 row-span-2 relative overflow-hidden rounded-l-lg cursor-pointer group"
          onClick={() => openLightbox(0)}
          role="button"
          tabIndex={0}
          aria-label={`View ${title} main photo`}
          onKeyDown={(e) => e.key === 'Enter' && openLightbox(0)}
        >
          <Image
            src={images[0]}
            alt={`${title} - Main photo`}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        {/* Smaller Images */}
        {images.slice(1, 5).map((image, index) => (
          <div
            key={index}
            className={cn(
              'relative overflow-hidden cursor-pointer group',
              index === 0 && 'rounded-tr-lg',
              index === 3 && 'rounded-br-lg'
            )}
            onClick={() => openLightbox(index + 1)}
            role="button"
            tabIndex={0}
            aria-label={`View photo ${index + 2} of ${title}`}
            onKeyDown={(e) => e.key === 'Enter' && openLightbox(index + 1)}
          >
            <Image
              src={image}
              alt={`${title} - Photo ${index + 2}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

            {/* Show more overlay on last image */}
            {index === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  +{images.length - 5} more
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* View All Photos Button */}
      <button
        onClick={() => openLightbox(0)}
        className="mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-900 dark:text-white"
        aria-label={`View all ${images.length} photos of ${title}`}
      >
        View all {images.length} photos
      </button>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:bg-white/10 p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-lg" aria-live="polite">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Previous Button */}
          <button
            onClick={prevImage}
            className="absolute left-4 text-white hover:bg-white/10 p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" aria-hidden="true" />
          </button>

          {/* Image */}
          <div className="relative max-h-[90vh] max-w-[90vw] w-full h-full">
            <Image
              src={images[currentIndex]}
              alt={`${title} - Photo ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {/* Next Button */}
          <button
            onClick={nextImage}
            className="absolute right-4 text-white hover:bg-white/10 p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" aria-hidden="true" />
          </button>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] px-4">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all relative',
                  currentIndex === index
                    ? 'border-white scale-110'
                    : 'border-transparent opacity-60 hover:opacity-100'
                )}
                aria-label={`View photo ${index + 1}`}
                aria-current={currentIndex === index ? 'true' : undefined}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

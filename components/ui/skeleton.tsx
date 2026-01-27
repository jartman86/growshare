'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'circular' | 'text' | 'button'
}

export function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]',
        {
          'rounded-lg': variant === 'default',
          'rounded-full': variant === 'circular',
          'rounded h-4': variant === 'text',
          'rounded-lg h-10': variant === 'button',
        },
        className
      )}
      style={{
        animation: 'shimmer 1.5s ease-in-out infinite',
      }}
      {...props}
    />
  )
}

// Card skeleton matching PlotCard structure
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-xl border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm',
        className
      )}
    >
      {/* Image skeleton */}
      <Skeleton className="aspect-video w-full rounded-lg mb-3" />

      {/* Title */}
      <Skeleton variant="text" className="h-6 w-3/4 mb-2" />

      {/* Location */}
      <Skeleton variant="text" className="h-4 w-1/2 mb-3" />

      {/* Features */}
      <div className="flex gap-2 mb-3">
        <Skeleton className="h-6 w-16 rounded" />
        <Skeleton className="h-6 w-20 rounded" />
        <Skeleton className="h-6 w-16 rounded" />
      </div>

      {/* Price and rating */}
      <div className="flex items-center justify-between pt-3 border-t dark:border-gray-700">
        <Skeleton variant="text" className="h-8 w-24" />
        <Skeleton variant="text" className="h-5 w-12" />
      </div>

      {/* Owner */}
      <div className="mt-2 pt-2 border-t dark:border-gray-700">
        <Skeleton variant="text" className="h-3 w-32" />
      </div>
    </div>
  )
}

// Product card skeleton for marketplace
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-xl border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm',
        className
      )}
    >
      {/* Image */}
      <Skeleton className="aspect-square w-full" />

      {/* Content */}
      <div className="p-4">
        {/* Category badge */}
        <Skeleton className="h-5 w-16 rounded-full mb-2" />

        {/* Title */}
        <Skeleton variant="text" className="h-5 w-full mb-1" />
        <Skeleton variant="text" className="h-5 w-2/3 mb-3" />

        {/* Price and seller */}
        <div className="flex items-center justify-between">
          <Skeleton variant="text" className="h-6 w-20" />
          <Skeleton variant="circular" className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

// Grid of card skeletons
export function CardGridSkeleton({
  count = 6,
  columns = 'default',
  cardType = 'card'
}: {
  count?: number
  columns?: 'default' | 'marketplace'
  cardType?: 'card' | 'product'
}) {
  const gridClass = columns === 'marketplace'
    ? 'grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    : 'grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'

  const CardComponent = cardType === 'product' ? ProductCardSkeleton : CardSkeleton

  return (
    <div className={gridClass}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-in fade-in slide-in-from-bottom-4"
          style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
        >
          <CardComponent />
        </div>
      ))}
    </div>
  )
}

// Text block skeleton for content areas
export function TextBlockSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn('h-4', i === lines - 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  )
}

// Stats skeleton
export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 border dark:border-gray-700">
          <Skeleton variant="text" className="h-8 w-16 mb-2" />
          <Skeleton variant="text" className="h-4 w-24" />
        </div>
      ))}
    </div>
  )
}

// Profile/avatar skeleton
export function AvatarSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }[size]

  return <Skeleton variant="circular" className={sizeClass} />
}

// List item skeleton
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b dark:border-gray-700">
      <AvatarSkeleton size="md" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="h-5 w-1/3" />
        <Skeleton variant="text" className="h-4 w-2/3" />
      </div>
      <Skeleton variant="button" className="w-20" />
    </div>
  )
}

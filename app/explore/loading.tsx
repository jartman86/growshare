import { CardGridSkeleton } from '@/components/ui/skeleton'

export default function ExploreLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search bar skeleton */}
      <div className="mb-6">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      </div>

      {/* Map skeleton */}
      <div className="h-[400px] bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse mb-8" />

      {/* Plot cards skeleton */}
      <CardGridSkeleton count={6} />
    </div>
  )
}

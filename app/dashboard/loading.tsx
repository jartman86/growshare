import { StatsSkeleton, CardGridSkeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Stats skeleton */}
      <StatsSkeleton />

      {/* Content cards skeleton */}
      <CardGridSkeleton count={6} />
    </div>
  )
}

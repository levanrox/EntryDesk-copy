import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 mb-8">
        <Skeleton className="h-8 w-[250px] sm:w-[350px]" />
        <Skeleton className="h-4 w-[200px] sm:w-[300px]" />
      </div>

      {/* Bento Grid Skeleton */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:items-start">
        <Skeleton className="h-[140px] w-full rounded-2xl" />
        <Skeleton className="h-[140px] w-full rounded-2xl" />
        <Skeleton className="h-[140px] w-full rounded-2xl lg:col-span-1 sm:col-span-2" />
        <Skeleton className="h-[140px] w-full rounded-2xl" />
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-6 w-[180px]" />
        </div>

        <div className="dashboard-surface p-2 sm:p-4 space-y-2 sm:space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border/20">
              <div className="flex items-center gap-3 w-full">
                <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                <div className="space-y-2 w-full max-w-[400px]">
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-[140px]" />
                    <Skeleton className="h-4 w-[60px] rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-[200px] sm:w-[250px]" />
                </div>
              </div>
              <Skeleton className="h-8 w-20 rounded-full shrink-0 hidden sm:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

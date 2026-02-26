import { Skeleton } from '@/components/ui/skeleton'

export default function EntriesLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <div className="flex flex-wrap items-center gap-2">
                    <Skeleton className="h-9 w-[250px] sm:w-[350px]" />
                </div>
                <Skeleton className="h-5 w-[200px] mt-2" />
            </div>
            <Skeleton className="h-10 w-[140px] rounded-md" />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="dashboard-surface p-6">
            <Skeleton className="h-4 w-[100px] mb-2" />
            <Skeleton className="h-8 w-[60px]" />
          </div>
        ))}
      </div>

      {/* Entries List Area */}
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <Skeleton className="h-7 w-[80px]" />
                <Skeleton className="h-4 w-[220px] mt-1" />
            </div>
            <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-[60px]" />
                <Skeleton className="h-10 w-[70px]" />
                <Skeleton className="h-10 w-[90px]" />
                <Skeleton className="h-10 w-[90px]" />
            </div>
        </div>
        
        {/* Table Skeleton */}
        <div className="dashboard-surface overflow-hidden">
          <div className="border-b border-black/5 px-4 py-3 dark:border-white/10 flex items-center justify-between">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-4 w-[80px]" />
          </div>
          <div className="flex flex-col">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-4 p-4 border-b border-border/20 last:border-0">
                    <div className="flex items-center gap-4 w-full">
                        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                        <div className="space-y-2 w-full max-w-[400px]">
                            <Skeleton className="h-5 w-[160px]" />
                            <div className="flex gap-2">
                                <Skeleton className="h-4 w-[100px]" />
                                <Skeleton className="h-4 w-[80px]" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Skeleton className="h-8 w-[80px] rounded-full hidden sm:block" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

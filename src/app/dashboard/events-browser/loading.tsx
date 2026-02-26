import { Skeleton } from '@/components/ui/skeleton'

export default function EventBrowserLoading() {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="space-y-2 mb-4">
          <Skeleton className="h-8 w-[150px] sm:w-[200px]" />
          <Skeleton className="h-4 w-[250px] sm:w-[350px]" />
      </div>

      <div className="space-y-4">
        {/* Approved Events */}
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-[120px]" />
            </div>
            <div className="dashboard-surface overflow-hidden">
                <div className="flex flex-col">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="group flex items-center justify-between gap-4 p-3 border-b border-border/20 last:border-0">
                            <div className="flex items-center gap-3 w-full">
                                <Skeleton className="h-8 w-8 rounded-md shrink-0" />
                                <div className="space-y-2 w-full max-w-[400px]">
                                    <div className="flex gap-2">
                                        <Skeleton className="h-4 w-[160px]" />
                                        <Skeleton className="h-3 w-[60px]" />
                                    </div>
                                    <Skeleton className="h-3 w-[220px]" />
                                </div>
                            </div>
                            <Skeleton className="h-8 w-16 rounded-md shrink-0 hidden sm:block" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
        
        {/* Active Events */}
         <div className="space-y-2">
            <div className="flex items-center gap-2 pt-2">
                <Skeleton className="h-4 w-4 rounded-md" />
                <Skeleton className="h-4 w-[100px]" />
            </div>
            <div className="dashboard-surface overflow-hidden">
                <div className="flex flex-col">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="group flex items-center justify-between gap-4 p-3 border-b border-border/20 last:border-0">
                            <div className="flex items-center gap-3 w-full">
                                <Skeleton className="h-8 w-8 rounded-md shrink-0" />
                                <div className="space-y-2 w-full max-w-[400px]">
                                    <div className="flex gap-2">
                                        <Skeleton className="h-4 w-[160px]" />
                                        <Skeleton className="h-3 w-[60px]" />
                                    </div>
                                    <Skeleton className="h-3 w-[220px]" />
                                </div>
                            </div>
                            <Skeleton className="h-8 w-20 rounded-md shrink-0 hidden sm:block" />
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </div>
  )
}

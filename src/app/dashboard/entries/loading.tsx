import { Skeleton } from '@/components/ui/skeleton'

export default function EntriesLoading() {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="space-y-2 mb-4">
          <Skeleton className="h-8 w-[150px] sm:w-[200px]" />
          <Skeleton className="h-4 w-[250px] sm:w-[350px]" />
      </div>

      <div className="space-y-4 text-left">
        <div className="dashboard-surface overflow-hidden">
          <div className="border-b border-black/5 px-4 py-2.5 dark:border-white/10 flex items-center">
              <Skeleton className="h-5 w-[120px]" />
          </div>
          <div className="flex flex-col">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="group flex items-center justify-between gap-4 p-4 border-b border-border/20 last:border-0">
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
                    <Skeleton className="h-8 w-16 rounded-full shrink-0 hidden sm:block" />
                </div>
            ))}
          </div>
        </div>
        
        <div className="dashboard-surface overflow-hidden">
          <div className="border-b border-black/5 px-4 py-2.5 dark:border-white/10 flex items-center">
              <Skeleton className="h-5 w-[120px]" />
          </div>
          <div className="flex flex-col">
            {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-4 p-4 opacity-80 border-b border-border/20 last:border-0">
                     <div className="flex items-center gap-3 w-full">
                        <Skeleton className="h-8 w-8 rounded-md shrink-0" />
                        <div className="space-y-2 w-full max-w-[400px]">
                            <div className="flex gap-2">
                                <Skeleton className="h-4 w-[160px]" />
                            </div>
                            <Skeleton className="h-3 w-[220px]" />
                        </div>
                    </div>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

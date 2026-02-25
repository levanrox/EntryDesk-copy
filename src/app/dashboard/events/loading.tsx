import { Skeleton } from '@/components/ui/skeleton'

export default function EventsLoading() {
  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="space-y-2 flex-1">
            <Skeleton className="h-8 w-[150px] sm:w-[200px]" />
            <Skeleton className="h-4 w-full max-w-[350px]" />
        </div>
        <Skeleton className="h-9 w-[120px] rounded-md hidden sm:block shrink-0" />
      </div>

      <div className="dashboard-surface p-2 sm:p-3 space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 rounded-xl border border-black/10 p-3.5 dark:border-white/10">
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
      
      <div className="pt-2">
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-5 w-[100px]" />
        </div>
        <div className="dashboard-surface p-2 sm:p-3 space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
             <div key={i} className="flex items-center justify-between gap-4 rounded-xl border border-black/10 p-3.5 dark:border-white/10 opacity-70">
               <div className="flex items-center gap-3 w-full">
                 <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                 <div className="space-y-2 w-full max-w-[400px]">
                   <Skeleton className="h-4 w-[160px]" />
                   <Skeleton className="h-3 w-[220px]" />
                 </div>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import { Skeleton } from '@/components/ui/skeleton'

export default function StudentsLoading() {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="space-y-2">
            <Skeleton className="h-8 w-[150px] sm:w-[200px]" />
            <Skeleton className="h-4 w-[250px] sm:w-[350px]" />
        </div>
        <div className="flex gap-2">
            <Skeleton className="h-9 w-[100px] rounded-md hidden sm:block" />
            <Skeleton className="h-9 w-[120px] rounded-md" />
        </div>
      </div>

      <div className="dashboard-surface p-4 sm:p-5">
        <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-9 w-[250px] rounded-md" />
            <Skeleton className="h-9 w-[80px] rounded-md" />
        </div>
        
        <div className="rounded-md border p-0 overflow-hidden">
            {/* Header row */}
            <div className="flex items-center gap-4 bg-muted/50 p-4 border-b border-border">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4 hidden sm:block" />
                <Skeleton className="h-4 w-1/4 hidden sm:block" />
            </div>
            {/* Rows */}
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border-b border-border/50 last:border-0">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4 hidden sm:block" />
                    <Skeleton className="h-4 w-1/4 hidden lg:block" />
                </div>
            ))}
        </div>
        <div className="flex items-center justify-between mt-4">
             <Skeleton className="h-4 w-[100px]" />
             <div className="flex gap-2">
                 <Skeleton className="h-8 w-8 rounded-md" />
                 <Skeleton className="h-8 w-8 rounded-md" />
                 <Skeleton className="h-8 w-8 rounded-md" />
             </div>
        </div>
      </div>
    </div>
  )
}

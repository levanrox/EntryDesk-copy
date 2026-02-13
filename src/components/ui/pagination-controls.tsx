'use client'

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAppNavigation } from '@/components/app/navigation-provider'

interface PaginationControlsProps {
  page: number
  totalPages: number
  totalCount?: number
  pageSize?: number
}

export function PaginationControls({ page, totalPages, totalCount, pageSize = 50 }: PaginationControlsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { beginNavigation } = useAppNavigation()

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", newPage.toString())
    beginNavigation()
    router.push(`?${params.toString()}`)
  }

  if (totalPages <= 1) return null

  const start = (page - 1) * pageSize + 1
  const end = totalCount ? Math.min(page * pageSize, totalCount) : page * pageSize

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(page - 1)}
        disabled={page <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      <div className="text-sm font-medium">
        {totalCount ? `${start}-${end} of ${totalCount}` : `Page ${page} of ${totalPages}`}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

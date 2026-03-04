'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import * as XLSX from 'xlsx'
import { exportEventEntries } from "@/app/dashboard/events/[id]/entries/actions"
import { toast } from "sonner"

interface ExportEntriesProps {
    eventId: string;
    searchParams: { q?: string, status?: string, coach?: string, day?: string };
}

export function ExportEntries({ eventId, searchParams }: ExportEntriesProps) {
    const [isExporting, setIsExporting] = useState(false)

    const handleExport = async () => {
        try {
            setIsExporting(true)
            const data = await exportEventEntries(eventId, searchParams)
            
            if (!data || data.length === 0) {
                toast.error("No entries found to export")
                return
            }

            const ws = XLSX.utils.json_to_sheet(data)
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, "Entries")
            XLSX.writeFile(wb, "entries_export.xlsx")
            toast.success("Export successful")
        } catch (error) {
            console.error("Export failed:", error)
            toast.error("Failed to export entries")
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <Button variant="outline" onClick={handleExport} disabled={isExporting}>
            {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            {isExporting ? "Exporting..." : "Export CSV/Excel"}
        </Button>
    )
}

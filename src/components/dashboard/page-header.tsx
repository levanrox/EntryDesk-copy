import React from 'react'

export function DashboardPageHeader({
    title,
    description,
    actions,
}: {
    title: string
    description?: string
    actions?: React.ReactNode
}) {
    return (
        <div className="flex flex-col gap-2 border-b border-border/40 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.08]">
            <div>
                <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
                {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
            </div>
            {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
    )
}

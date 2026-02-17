'use client'

import Link, { type LinkProps } from 'next/link'
import React, { type MouseEvent } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

type Props = LinkProps & {
    className?: string
    children: React.ReactNode
    icon?: React.ReactNode
}

function isModifiedEvent(event: MouseEvent) {
    const target = event.currentTarget as HTMLAnchorElement
    return (
        event.metaKey ||
        event.altKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.button !== 0 ||
        (target && target.target && target.target !== '_self')
    )
}

export function DashboardNavLink({ children, className, icon, ...props }: Props) {
    const pathname = usePathname()

    const hrefString = typeof props.href === 'string' ? props.href : undefined
    const hrefPath = hrefString ? hrefString.split('?')[0]?.split('#')[0] : undefined

    const isActive = !!hrefPath && (hrefPath === '/dashboard' ? pathname === '/dashboard' : pathname === hrefPath || pathname.startsWith(`${hrefPath}/`))

    const baseClasses =
        'dashboard-nav-item group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
    const stateClasses = isActive
        ? 'bg-primary/10 text-foreground shadow-[inset_0_0_0_1px_rgb(16_185_129_/_0.2)]'
        : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground hover:-translate-y-[1px]'

    return (
        <Link
            {...props}
            className={cn(baseClasses, stateClasses, className)}
            data-active={isActive ? 'true' : 'false'}
            aria-current={isActive ? 'page' : undefined}
            onClick={(e) => {
                props.onClick?.(e)
                if (e.defaultPrevented) return
                if (isModifiedEvent(e)) return

                if (hrefPath && hrefPath === pathname) {
                    e.preventDefault()
                    return
                }
            }}
        >
            {icon}
            {children}
        </Link>
    )
}

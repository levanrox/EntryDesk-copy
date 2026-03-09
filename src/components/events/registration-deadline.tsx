import { Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

type RegistrationDeadlineProps = {
    registrationCloseDate?: string | null
    isRegistrationOpen?: boolean | null
    todayIso?: string
    isPastEvent?: boolean
    className?: string
}

function formatDate(dateValue: string) {
    const iso = dateValue.slice(0, 10)
    const [year, month, day] = iso.split('-')

    if (!year || !month || !day) {
        return dateValue
    }

    return `${day}/${month}/${year}`
}

export function RegistrationDeadline({
    registrationCloseDate,
    isRegistrationOpen,
    todayIso,
    isPastEvent = false,
    className,
}: RegistrationDeadlineProps) {
    if (!registrationCloseDate || isPastEvent) {
        return null
    }

    const today = todayIso ?? new Date().toISOString().slice(0, 10)
    const closedByDate = registrationCloseDate < today
    const isOpen = (isRegistrationOpen ?? true) && !closedByDate

    return (
        <div className={cn('flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground', className)}>
            <Circle
                className={cn(
                    'h-2.5 w-2.5 shrink-0',
                    isOpen ? 'fill-emerald-500 text-emerald-500' : 'fill-blue-500 text-blue-500'
                )}
            />
            <span className="truncate whitespace-nowrap">
                <span className="font-medium">Last date for Registration:</span>{' '}
                {formatDate(registrationCloseDate)}
            </span>
        </div>
    )
}

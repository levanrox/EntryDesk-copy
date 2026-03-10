'use client'

import { useMemo, useState } from 'react'
import { Calendar, MapPin, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RegistrationDeadline } from '@/components/events/registration-deadline'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

type PublicEvent = {
    id: string
    title: string
    event_type: string | null
    start_date: string
    end_date?: string | null
    location: string | null
    max_participants: number | null
    description: string | null
    registration_close_date?: string | null
    is_registration_open?: boolean | null
    temporary_registration_closes_at?: string | null
}

const PREVIEW_COUNT = 3

function formatEventTypeLabel(eventType: string | null) {
    if (!eventType) {
        return 'Tournament'
    }

    const normalized = eventType.trim().toLowerCase().replace(/[_-]+/g, ' ')

    if (!normalized) {
        return 'Tournament'
    }
    if (normalized === 'test' || normalized === 'black belt test' || normalized === 'blackbelt test') {
        return 'Blackbelt Test'
    }

    return normalized.replace(/\b\w/g, (char) => char.toUpperCase())
}

export function PublicEventsSection({
    events,
    todayIso,
}: {
    events: PublicEvent[] | null
    todayIso: string
}) {
    const [showAllUpcoming, setShowAllUpcoming] = useState(false)
    const [showAllPast, setShowAllPast] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<PublicEvent | null>(null)

    const { upcomingEvents, pastEvents } = useMemo(() => {
        const today = todayIso
        const allEvents = events ?? []

        const getEffectiveEndDate = (event: PublicEvent) => event.end_date || event.start_date
        const toDateOnly = (dateValue: string) => dateValue.slice(0, 10)

        const upcoming = allEvents
            .filter((event) => toDateOnly(getEffectiveEndDate(event)) >= today)
            .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())

        const past = allEvents
            .filter((event) => toDateOnly(getEffectiveEndDate(event)) < today)
            .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())

        return {
            upcomingEvents: upcoming,
            pastEvents: past,
        }
    }, [events, todayIso])

    const visibleUpcomingEvents = showAllUpcoming ? upcomingEvents : upcomingEvents.slice(0, PREVIEW_COUNT)
    const visiblePastEvents = showAllPast ? pastEvents : pastEvents.slice(0, PREVIEW_COUNT)
    const selectedEventIsPast = !!selectedEvent && (selectedEvent.end_date || selectedEvent.start_date).slice(0, 10) < todayIso

    return (
        <>
            <div className="space-y-12">
                <EventSection
                    sectionId="upcoming-events"
                    title="Live events"
                    subtitle="Find events and login to register your team"
                    events={visibleUpcomingEvents}
                    hasAnyEvents={upcomingEvents.length > 0}
                    canViewAll={upcomingEvents.length > PREVIEW_COUNT}
                    isShowingAll={showAllUpcoming}
                    onToggleViewAll={() => setShowAllUpcoming((previous) => !previous)}
                    onViewEvent={setSelectedEvent}
                    emptyMessage="No upcoming public events currently scheduled. Check back later."
                    isPastSection={false}
                />

                <EventSection
                    title="Past events"
                    subtitle="Browse previous public events"
                    events={visiblePastEvents}
                    hasAnyEvents={pastEvents.length > 0}
                    canViewAll={pastEvents.length > PREVIEW_COUNT}
                    isShowingAll={showAllPast}
                    onToggleViewAll={() => setShowAllPast((previous) => !previous)}
                    onViewEvent={setSelectedEvent}
                    emptyMessage="No past public events available yet."
                    isPastSection={true}
                />
            </div>

            <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
                <DialogContent
                    className="gap-5 border border-border/60 bg-background/95 p-6 sm:max-w-[680px]"
                    overlayClassName="bg-black/55 backdrop-blur-md"
                >
                    {selectedEvent ? (
                        <>
                            <DialogHeader>
                                <DialogTitle className="pr-8 text-3xl font-bold tracking-tight">{selectedEvent.title}</DialogTitle>
                                <DialogDescription className="text-sm">
                                    {formatEventTypeLabel(selectedEvent.event_type)}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-3 border border-border/50 p-4 text-sm rounded-lg">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>{formatDisplayDateRange(selectedEvent.start_date, selectedEvent.end_date)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>{selectedEvent.location || 'Location to be announced'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span>{selectedEvent.max_participants ? `${selectedEvent.max_participants} max participants` : 'Open registration'}</span>
                                </div>
                                <RegistrationDeadline
                                    event={selectedEvent}
                                    todayIso={todayIso}
                                    isPastEvent={selectedEventIsPast}
                                />
                            </div>

                            <div className="space-y-2 rounded-lg border border-border/50 p-4">
                                <h4 className="text-sm font-semibold tracking-tight">Description</h4>
                                <p className="text-sm text-muted-foreground">
                                    {selectedEvent.description || 'No description provided.'}
                                </p>
                            </div>
                        </>
                    ) : null}
                </DialogContent>
            </Dialog>
        </>
    )
}

function EventSection({
    sectionId,
    title,
    subtitle,
    events,
    hasAnyEvents,
    canViewAll,
    isShowingAll,
    onToggleViewAll,
    onViewEvent,
    emptyMessage,
    isPastSection,
}: {
    sectionId?: string
    title: string
    subtitle: string
    events: PublicEvent[]
    hasAnyEvents: boolean
    canViewAll: boolean
    isShowingAll: boolean
    onToggleViewAll: () => void
    onViewEvent: (event: PublicEvent) => void
    emptyMessage: string
    isPastSection: boolean
}) {
    return (
        <section id={sectionId} className={sectionId ? 'scroll-mt-24' : undefined}>
            <div className="mb-8 text-center">
                <h2 className="mb-3 text-4xl font-bold tracking-tight">{title}</h2>
                <p className="text-muted-foreground">{subtitle}</p>
            </div>

            {hasAnyEvents ? (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => {
                            return (
                                <article
                                    key={event.id}
                                    className="flex h-full flex-col rounded-xl border border-border/50 p-6 transition-colors hover:border-border/70 dark:border-white/[0.10] dark:hover:border-white/[0.16]"
                                >
                                    <div className="mb-4 flex items-center justify-between gap-2">
                                        <h3 className="min-w-0 truncate text-xl font-semibold leading-tight">{event.title}</h3>
                                        <Badge className="shrink-0 border-0 bg-muted/30 text-foreground dark:bg-white/[0.08]">
                                            {formatEventTypeLabel(event.event_type)}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
                                            <Calendar className="h-4 w-4 shrink-0" />
                                            <span className="truncate">{formatDisplayDateRange(event.start_date, event.end_date)}</span>
                                        </div>
                                        <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
                                            <MapPin className="h-4 w-4 shrink-0" />
                                            <span className="truncate">{event.location || 'Location to be announced'}</span>
                                        </div>
                                        <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
                                            <Users className="h-4 w-4 shrink-0" />
                                            <span className="truncate">{event.max_participants ? `${event.max_participants} max participants` : 'Open registration'}</span>
                                        </div>
                                        <RegistrationDeadline
                                            className="min-w-0"
                                            event={event}
                                            isPastEvent={isPastSection}
                                        />
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="mt-6 h-11 w-full rounded-md border-border/50 bg-muted/25 dark:border-white/[0.12] dark:bg-white/[0.05] dark:hover:bg-white/[0.08]"
                                        onClick={() => onViewEvent(event)}
                                    >
                                        View event
                                    </Button>
                                </article>
                            )
                        })}
                    </div>

                    {canViewAll ? (
                        <div className="mt-6 flex justify-center">
                            <Button
                                variant="outline"
                                className="h-11 rounded-md px-6"
                                onClick={onToggleViewAll}
                            >
                                {isShowingAll ? 'Show less' : `View all ${title.toLowerCase()}`}
                            </Button>
                        </div>
                    ) : null}
                </>
            ) : (
                <div className="rounded-xl border border-border/50 p-8 text-sm text-muted-foreground dark:border-white/[0.10]">
                    {emptyMessage}
                </div>
            )}
        </section>
    )
}

function formatDisplayDate(isoDateString: string) {
    const date = new Date(isoDateString)
    if (Number.isNaN(date.getTime())) {
        return isoDateString
    }

    const day = String(date.getUTCDate()).padStart(2, '0')
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const year = date.getUTCFullYear()
    return `${day}/${month}/${year}`
}

function formatDisplayDateRange(startIsoDate: string, endIsoDate?: string | null) {
    const start = formatDisplayDate(startIsoDate)
    const effectiveEnd = endIsoDate || startIsoDate
    const end = formatDisplayDate(effectiveEnd)

    if (start === end) {
        return start
    }

    return `${start} - ${end}`
}
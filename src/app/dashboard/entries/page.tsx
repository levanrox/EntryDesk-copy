import { requireRole } from '@/lib/auth/require-role'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Calendar, ArrowRight, CheckCircle2, MapPin, ClipboardList } from 'lucide-react'
import { DashboardPageHeader } from '@/components/dashboard/page-header'
import { PaginationControls } from '@/components/ui/pagination-controls'
import { RegistrationDeadline } from '@/components/events/registration-deadline'

type ApprovedEvent = {
    id: string
    title: string
    start_date: string
    end_date: string
    location?: string | null
    description?: string | null
    registration_close_date?: string | null
    is_registration_open?: boolean | null
}

function isApprovedEvent(value: unknown): value is ApprovedEvent {
    if (!value || typeof value !== 'object') return false
    const event = value as Record<string, unknown>
    return (
        typeof event.id === 'string' &&
        typeof event.title === 'string' &&
        typeof event.start_date === 'string' &&
        typeof event.end_date === 'string'
    )
}

export default async function EntriesPage({
    searchParams,
}: {
    searchParams?: Promise<{ page?: string }>
}) {
    const { supabase, user } = await requireRole('coach', { redirectTo: '/dashboard' })
    const sp = await searchParams
    const page = Math.max(1, Number(sp?.page) || 1)
    const limit = 50
    const offset = (page - 1) * limit

    // Get Approved Events
    const { data: applications, count } = await supabase
        .from('event_applications')
        .select(`
        event_id, 
        events (
            id, 
            title, 
            start_date, 
            end_date,
            location, 
            description,
            registration_close_date,
            is_registration_open
        )
    `, { count: 'exact' })
        .eq('coach_id', user.id)
        .eq('status', 'approved')
        .range(offset, offset + limit - 1)

    const approvedEvents: ApprovedEvent[] = (applications ?? [])
        .flatMap((application) => {
            const eventsValue = application.events as unknown
            return Array.isArray(eventsValue) ? eventsValue : eventsValue ? [eventsValue] : []
        })
        .filter(isApprovedEvent)
    const todayIso = new Date().toISOString().slice(0, 10)
    const activeEvents = approvedEvents.filter((event) => event.end_date >= todayIso)
    const pastEvents = approvedEvents.filter((event) => event.end_date < todayIso)
    const totalPages = Math.ceil((count ?? 0) / limit)

    return (
        <div className="space-y-4">
            <DashboardPageHeader
                title="Entries"
                description="Select an event to manage your team's participation."
            />

            {approvedEvents.length > 0 ? (
                <div className="space-y-4">
                    <div className="dashboard-surface">
                        <div className="border-b border-black/5 px-4 py-2.5 dark:border-white/10">
                            <h3 className="text-sm font-medium">Active Events</h3>
                        </div>
                        {activeEvents.length > 0 ? (
                            <div className="dashboard-list">
                                {activeEvents.map((event) => (
                                    <Link
                                        key={event.id}
                                        href={`/dashboard/entries/${event.id}`}
                                        className="dashboard-list-item group flex items-center justify-between gap-4 p-3"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-100 dark:bg-emerald-950">
                                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium truncate">{event.title}</span>
                                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-500 font-medium">Approved</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                                    <span className="flex items-center gap-0.5">
                                                        <Calendar className="h-2.5 w-2.5" />
                                                        {new Date(event.start_date).toLocaleDateString()}
                                                    </span>
                                                    {event.location && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-0.5">
                                                                <MapPin className="h-2.5 w-2.5" />
                                                                {event.location}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                                <RegistrationDeadline
                                                    className="mt-1"
                                                    registrationCloseDate={event.registration_close_date}
                                                    isRegistrationOpen={event.is_registration_open}
                                                />
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                            Manage
                                            <ArrowRight className="ml-1 h-3 w-3" />
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="px-4 py-6 text-center text-xs text-muted-foreground">No active events</div>
                        )}
                    </div>

                    <div className="dashboard-surface">
                        <div className="border-b border-black/5 px-4 py-2.5 dark:border-white/10">
                            <h3 className="text-sm font-medium">Past Events</h3>
                        </div>
                        {pastEvents.length > 0 ? (
                            <div className="dashboard-list">
                                {pastEvents.map((event) => (
                                    <Link
                                        key={event.id}
                                        href={`/dashboard/entries/${event.id}`}
                                        className="dashboard-list-item flex items-center justify-between gap-4 p-3 opacity-85"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                                                <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium truncate">{event.title}</span>
                                                    <span className="text-[10px] text-muted-foreground font-medium">Closed</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                                    <span className="flex items-center gap-0.5">
                                                        <Calendar className="h-2.5 w-2.5" />
                                                        {new Date(event.start_date).toLocaleDateString()}
                                                    </span>
                                                    {event.location && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-0.5">
                                                                <MapPin className="h-2.5 w-2.5" />
                                                                {event.location}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium text-muted-foreground">Closed</span>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="px-4 py-6 text-center text-xs text-muted-foreground">No past events</div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="dashboard-surface">
                    <div className="py-8 text-center">
                        <ClipboardList className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                        <p className="text-sm font-medium">No approved events yet</p>
                        <p className="mt-1 text-xs text-muted-foreground">Apply to a public event, then manage entries here.</p>
                        <div className="mt-3">
                            <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                                <Link href="/dashboard/events-browser">Browse Events</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <PaginationControls page={page} totalPages={totalPages} totalCount={count ?? 0} />
        </div>
    )
}

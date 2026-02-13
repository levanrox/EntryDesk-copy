import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { AppNavLink } from '@/components/app/nav-link'
import { Badge } from '@/components/ui/badge'
import { ThemeSwitch } from '@/components/app/theme-toggle'
import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react'
import { LandingUiPreview } from '@/components/app/landing-ui-preview'

export default async function LandingPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const { data: events } = await supabase
        .from('events')
        .select('*')
        .eq('is_public', true)
        .order('start_date', { ascending: true })

    return (
        <div className="min-h-screen bg-background">
            <header className="fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur dark:border-white/[0.08]">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="relative h-8 w-8 overflow-hidden rounded-md border border-border/50 bg-background/70 dark:border-white/[0.12]">
                            <Image src="/favicon.ico" alt="EntryDesk logo" fill className="object-cover" sizes="32px" priority />
                        </div>
                        <span className="text-sm font-semibold">EntryDesk</span>
                    </Link>

                    <nav className="flex items-center gap-2">
                        <ThemeSwitch />
                        <Link href="#features" className="hidden px-3 py-2 text-sm text-muted-foreground hover:text-foreground sm:inline-flex">
                            Features
                        </Link>
                        <Link href="#events" className="hidden px-3 py-2 text-sm text-muted-foreground hover:text-foreground sm:inline-flex">
                            Events
                        </Link>
                        {user ? (
                            <AppNavLink href="/dashboard">
                                <Button size="sm">Dashboard</Button>
                            </AppNavLink>
                        ) : (
                            <AppNavLink href="/login">
                                <Button size="sm">Login / Signup</Button>
                            </AppNavLink>
                        )}
                    </nav>
                </div>
            </header>

            <section className="px-6 pb-20 pt-32">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="text-6xl font-bold tracking-tight md:text-7xl">
                        Event operations
                        <br />
                        without the chaos
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground">
                        Submit entries. Review approvals. Export results.
                        <br className="hidden sm:block" />
                        Everything you need for event day.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        {user ? (
                            <AppNavLink href="/dashboard">
                                <Button className="h-11 rounded-md px-6 text-base gap-2">
                                    Open Dashboard
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </AppNavLink>
                        ) : (
                            <AppNavLink href="/login">
                                <Button className="h-11 rounded-md px-6 text-base gap-2">
                                    Login / Signup
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </AppNavLink>
                        )}
                        <AppNavLink href="#events">
                            <Button variant="outline" className="h-11 rounded-md px-6 text-base border-border/50 bg-muted/20 hover:bg-muted/35 dark:border-white/[0.14] dark:bg-white/[0.04] dark:hover:bg-white/[0.08]">
                                Browse Events
                            </Button>
                        </AppNavLink>
                    </div>
                </div>
            </section>

            <LandingUiPreview />

            <section id="events" className="mx-auto max-w-7xl px-6 pb-20 pt-4">
                <div className="mb-12 text-center">
                    <h2 className="mb-3 text-4xl font-bold tracking-tight">Upcoming events</h2>
                    <p className="text-muted-foreground">Find events and register your team</p>
                </div>
                {events && events.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="rounded-xl border border-border/50 p-6 transition-colors hover:border-border/70 dark:border-white/[0.10] dark:hover:border-white/[0.16]"
                            >
                                <div className="mb-4 flex items-center justify-between gap-2">
                                    <h3 className="text-xl font-semibold leading-tight">{event.title}</h3>
                                    <Badge className="border-0 bg-muted/30 text-foreground dark:bg-white/[0.08]">
                                        {event.event_type
                                            ? event.event_type.replace(/[_-]+/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase())
                                            : 'Tournament'}
                                    </Badge>
                                </div>

                                <div className="mb-6 space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>{new Date(event.start_date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        <span>{event.location || 'Location to be announced'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Users className="h-4 w-4" />
                                        <span>{event.max_participants ? `${event.max_participants} max participants` : 'Open registration'}</span>
                                    </div>
                                </div>

                                <p className="mb-6 line-clamp-2 text-sm text-muted-foreground">
                                    {event.description || 'No description provided.'}
                                </p>

                                <AppNavLink href={`/login?next=/events/${event.id}`}>
                                    <Button variant="outline" className="h-11 w-full rounded-md border-border/50 bg-muted/25 dark:border-white/[0.12] dark:bg-white/[0.05] dark:hover:bg-white/[0.08]">
                                        View event
                                    </Button>
                                </AppNavLink>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-border/50 p-8 text-sm text-muted-foreground dark:border-white/[0.10]">
                        No public events currently scheduled. Check back later.
                    </div>
                )}
            </section>
        </div>
    )
}
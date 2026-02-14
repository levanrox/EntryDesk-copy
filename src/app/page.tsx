import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { AppNavLink } from '@/components/app/nav-link'
import { ArrowRight } from 'lucide-react'
import { LandingUiPreview } from '@/components/app/landing-ui-preview'
import { PublicEventsSection } from '@/components/app/public-events-section'
import { LandingHeader } from '@/components/app/landing-header'

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

    const todayIso = new Date().toISOString().slice(0, 10)

    return (
        <div className="min-h-screen bg-background">
            <LandingHeader isLoggedIn={!!user} />

            <section className="relative min-h-[88vh] overflow-hidden px-6 pb-20 pt-32">
                <Image
                    src="/Hero image.png"
                    alt="Karate athletes training"
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
                />
                <div className="absolute inset-0 bg-black/32" />
                <div className="absolute inset-0 bg-gradient-to-b from-sky-950/22 via-transparent to-background/38" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(2,6,23,0.30)_100%)]" />

                <div className="relative z-10 mx-auto max-w-4xl pt-12 text-center">
                    <h1 className="text-6xl font-bold tracking-tight text-white md:text-7xl">
                        Event operations
                        <br />
                        without the chaos
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-xl text-white/85">
                        Submit entries. Review approvals. Export results.
                        <br className="hidden sm:block" />
                        Everything you need for event day.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        {user ? (
                            <AppNavLink href="/dashboard">
                                <Button className="h-11 gap-2 rounded-md px-6 text-base">
                                    Open Dashboard
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </AppNavLink>
                        ) : (
                            <AppNavLink href="/login">
                                <Button className="h-11 gap-2 rounded-md px-6 text-base">
                                    Login / Signup
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </AppNavLink>
                        )}
                        <Button asChild variant="outline" className="h-11 rounded-md border-white/30 bg-white/10 px-6 text-base text-white hover:bg-white/20">
                            <a href="#upcoming-events">
                                Browse Events
                            </a>
                        </Button>
                    </div>
                </div>
            </section>

            <LandingUiPreview />

            <section className="mx-auto max-w-7xl px-6 pb-20 pt-4">
                <PublicEventsSection events={events ?? null} todayIso={todayIso} />
            </section>
        </div>
    )
}
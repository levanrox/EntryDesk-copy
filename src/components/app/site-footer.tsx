'use client'

import Link from 'next/link'

export function SiteFooter() {
    return (
        <footer className="border-t border-border/40 bg-background dark:border-white/[0.08]">
            <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-3 md:items-start">
                <div>
                    <div className="text-sm font-semibold">EntryDesk</div>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Lightweight event operations for coaches and organizers.
                    </p>
                </div>

                <div className="space-y-2 text-sm">
                    <div className="font-medium">Links</div>
                    <div>
                        <Link href="/#events" className="text-muted-foreground hover:text-foreground">
                            Events
                        </Link>
                    </div>
                    <div>
                        <Link href="/login" className="text-muted-foreground hover:text-foreground">
                            Login
                        </Link>
                    </div>
                    <div>
                        <a
                            href="https://github.com/ull0sm/EntryDesk"
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            GitHub
                        </a>
                    </div>
                </div>

                <div className="space-y-2 text-sm">
                    <div className="font-medium">Contact</div>
                    <a href="mailto:ullas4101997@gmail.com" className="block text-muted-foreground hover:text-foreground">
                        ullas4101997@gmail.com
                    </a>
                    <a href="mailto:hello@suprateekyawagal.in" className="block text-muted-foreground hover:text-foreground">
                        hello@suprateekyawagal.in
                    </a>
                </div>
            </div>

            <div className="border-t border-border/40 dark:border-white/[0.08]">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-xs text-muted-foreground sm:px-6">
                    <span>© {new Date().getFullYear()} EntryDesk</span>
                    <span>Next.js • Supabase • Tailwind</span>
                </div>
            </div>
        </footer>
    )
}
'use client'

import { useState, type ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, CheckCircle2, CheckSquare, Clock, ClipboardList, Download, LayoutGrid, Plus, Users } from 'lucide-react'

export function LandingUiPreview() {
    const [activeView, setActiveView] = useState<'coach' | 'organizer'>('coach')

    return (
        <section id="features" className="mx-auto max-w-7xl px-6 py-20">
            <div className="text-center">
                <h2 className="text-4xl font-bold tracking-tight">Built for coaches and organizers</h2>
                <p className="mt-3 text-xl text-muted-foreground">Different workflows, Same platform.</p>
            </div>

            <div className="mt-7 flex items-center justify-center gap-2">
                <button
                    onClick={() => setActiveView('coach')}
                    className={`rounded-md px-5 py-2.5 text-sm transition-colors ${activeView === 'coach'
                        ? 'bg-white/10 text-foreground dark:bg-white/10'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Coach
                </button>
                <button
                    onClick={() => setActiveView('organizer')}
                    className={`rounded-md px-5 py-2.5 text-sm transition-colors ${activeView === 'organizer'
                        ? 'bg-white/10 text-foreground dark:bg-white/10'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Organizer
                </button>
            </div>

            <div className="mt-8 overflow-hidden rounded-3xl border border-border/50 bg-card dark:border-white/[0.10]">
                {activeView === 'coach' ? <CoachPreview /> : <OrganizerPreview />}
            </div>
        </section>
    )
}

function CoachPreview() {
    const entryRows = [
        { athlete: 'Aarav Patil', event: 'Kata', status: 'Approved' },
        { athlete: 'Riya Nair', event: 'Kumite', status: 'Submitted' },
        { athlete: 'Vihaan Rao', event: 'Kata Team', status: 'Draft' },
    ]

    return (
        <div className="p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3 className="text-xl font-semibold">Coach dashboard</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Manage dojos, students, and entries for upcoming events.</p>
                </div>
                <Button size="sm" className="h-11 rounded-md px-5 gap-2">
                    <Plus className="h-4 w-4" />
                    Register athletes
                </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
                <MiniMetric icon={<LayoutGrid className="h-4 w-4" />} label="Dojos" value="4" />
                <MiniMetric icon={<Users className="h-4 w-4" />} label="Students" value="52" />
                <MiniMetric icon={<ClipboardList className="h-4 w-4" />} label="Entries" value="31" />
            </div>

            <div className="mt-4 rounded-2xl border border-border/50 dark:border-white/[0.10]">
                <div className="border-b border-border/50 px-5 py-3 text-sm font-medium dark:border-white/[0.10]">Recent entries</div>
                <div className="divide-y divide-border/50 dark:divide-white/[0.10]">
                    {entryRows.map((entry) => (
                        <div key={entry.athlete} className="flex items-center justify-between px-5 py-3 text-sm">
                            <div>
                                <div className="font-medium">{entry.athlete}</div>
                                <div className="text-muted-foreground">{entry.event}</div>
                            </div>
                            <Badge variant={entry.status === 'Approved' ? 'default' : 'secondary'}>{entry.status}</Badge>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function OrganizerPreview() {
    const approvalRows = [
        { dojo: 'Shinobi Dojo', student: 'Aarav Patil', category: 'Junior Kata' },
        { dojo: 'Zen Academy', student: 'Riya Nair', category: 'Senior Kumite' },
        { dojo: 'Tiger Martial Arts', student: 'Vihaan Rao', category: 'Team Kata' },
    ]

    return (
        <div className="p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3 className="text-xl font-semibold">Organizer dashboard</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Review approvals, manage events, and export finalized entries.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="h-11 rounded-md px-5 gap-2 border-border/50 bg-muted/25 dark:border-white/[0.12] dark:bg-white/[0.04] dark:hover:bg-white/[0.08]">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                    <Button size="sm" className="h-11 rounded-md px-5 gap-2">
                        <CheckSquare className="h-4 w-4" />
                        Approve queue
                    </Button>
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
                <MiniMetric icon={<Calendar className="h-4 w-4" />} label="Events" value="6" />
                <MiniMetric icon={<Clock className="h-4 w-4" />} label="Pending" value="14" />
                <MiniMetric icon={<CheckCircle2 className="h-4 w-4" />} label="Approved" value="128" />
            </div>

            <div className="mt-4 overflow-x-auto rounded-2xl border border-border/50 dark:border-white/[0.10]">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-border/50 text-muted-foreground dark:border-white/[0.10]">
                        <tr>
                            <th className="px-4 py-2 font-medium">Student</th>
                            <th className="px-4 py-2 font-medium">Category</th>
                            <th className="px-4 py-2 font-medium">Dojo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {approvalRows.map((row) => (
                            <tr key={`${row.dojo}-${row.student}`} className="border-b border-border/50 last:border-b-0 dark:border-white/[0.10]">
                                <td className="px-4 py-2.5 font-medium">{row.student}</td>
                                <td className="px-4 py-2.5 text-muted-foreground">{row.category}</td>
                                <td className="px-4 py-2.5 text-muted-foreground">{row.dojo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function MiniMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-border/50 bg-background/70 p-4 dark:border-white/[0.10]">
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-primary">{icon}</span>
                <span>{label}</span>
            </div>
            <div className="text-4xl font-semibold leading-none">{value}</div>
        </div>
    )
}
'use server'

import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth/require-role'

export async function updateEntryStatus(entryId: string, status: 'approved' | 'rejected') {
    const { supabase, user, role } = await requireRole(['organizer', 'admin'])

    // Get entry and event to verify ownership
    const { data: entry } = await supabase
        .from('entries')
        .select('event_id, events(organizer_id)')
        .eq('id', entryId)
        .single()

    if (!entry) throw new Error('Entry not found')

    // @ts-ignore
    if (role !== 'admin' && entry.events?.organizer_id !== user.id) {
        throw new Error('Unauthorized')
    }

    const { error } = await supabase
        .from('entries')
        .update({ status })
        .eq('id', entryId)

    if (error) throw new Error('Failed to update entry')

    revalidatePath(`/dashboard/events/${entry.event_id}/entries`)
    return { success: true }
}

export async function bulkUpdateEntryStatus(entryIds: string[], status: 'approved' | 'rejected') {
    const { supabase, user, role } = await requireRole(['organizer', 'admin'])
    if (entryIds.length === 0) return { success: true }

    // Optimization: Check if all entries belong to events managed by this user
    // Ideally we filter the update by event ownership directly to be safe
    // UPDATE entries SET status = $status WHERE id IN $ids AND event_id IN (SELECT id FROM events WHERE organizer_id = $uid)

    // However, supabase-js query syntax:
    // We can fetch the events for these entries to verify, or do a subquery filter if possible.
    // Simpler approach for now: Get unique event_ids for these entries, check ownership.

    // Let's rely on filter logic during update if possible? 
    // Supabase simplified: verify first.

    // For large bulk, verification of ownership implies fetching.
    // "Select event_id from entries where id in ids"
    const { data: entries } = await supabase.from('entries').select('event_id, events(organizer_id)').in('id', entryIds)

    if (!entries || (role !== 'admin' && entries.some((e: any) => e.events?.organizer_id !== user.id))) {
        throw new Error('Unauthorized or some entries invalid')
    }

    const { error } = await supabase
        .from('entries')
        .update({ status })
        .in('id', entryIds)
        .neq('status', 'draft')

    if (error) throw new Error('Failed to update entries')

    // Revalidate paths - potentially multiple if entries span events (unlikely here but good practice)
    const uniqueEventIds = Array.from(new Set(entries.map(e => e.event_id)))
    uniqueEventIds.forEach(eid => revalidatePath(`/dashboard/events/${eid}/entries`))

    return { success: true }
}

export async function exportEventEntries(eventId: string, searchParams: { q?: string, status?: string, coach?: string, day?: string }) {
    const { supabase } = await requireRole(['organizer', 'admin'])

    let query = supabase
        .from('organizer_entries_view')
        .select('*')
        .eq('event_id', eventId)
        .neq('status', 'draft')

    if (searchParams.q) {
        query = query.ilike('student_name', `%${searchParams.q}%`)
    }
    if (searchParams.status && searchParams.status !== 'all') {
        query = query.eq('status', searchParams.status)
    }
    if (searchParams.coach && searchParams.coach !== 'all') {
        query = query.eq('coach_id', searchParams.coach)
    }
    if (searchParams.day && searchParams.day !== 'all') {
        query = query.eq('event_day_id', searchParams.day)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
        console.error("Export query error:", error)
        throw new Error('Failed to fetch entries for export')
    }

    if (!data) return []

    return data.map((e: any) => ({
        'Student Name': e.student_name,
        'Rank/Belt': e.student_rank || '-',
        'Weight': e.student_weight ? `${e.student_weight} kg` : '-',
        'Dojo': e.dojo_name || '-',
        'Category': e.category_name || '-',
        'Event Day': e.event_day_name || '-',
        'Participation Type': e.participation_type,
        'Status': e.status,
        'Coach Name': e.coach_name || '-',
        'Coach Email': e.coach_email || '-',
        'Date Applied': new Date(e.created_at).toLocaleDateString()
    }))
}

'use server'

import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth/require-role'
import { addDays, format, subMinutes } from 'date-fns'

export async function createEvent(formData: FormData) {
  const { supabase, user } = await requireRole(['organizer', 'admin'])

  const title = (formData.get('title') as string)?.trim()
  const description = formData.get('description') as string
  const event_type = formData.get('event_type') as 'tournament' | 'seminar' | 'test'
  const location = (formData.get('location') as string)?.trim()
  const start_date = formData.get('start_date') as string // YYYY-MM-DD
  const end_date = formData.get('end_date') as string // YYYY-MM-DD
  const registration_close_date_raw = (formData.get('registration_close_date') as string | null)?.trim() || ''
  const registration_close_date = registration_close_date_raw || null
  const is_public = formData.get('is_public') === 'on'

  if (registration_close_date && (registration_close_date < start_date || registration_close_date > end_date)) {
    throw new Error('Registration close date must be between event start and end date')
  }

  const dedupeWindowStart = subMinutes(new Date(), 2).toISOString()
  let duplicateQuery = supabase
    .from('events')
    .select('id')
    .eq('organizer_id', user.id)
    .eq('title', title)
    .eq('event_type', event_type)
    .eq('start_date', start_date)
    .eq('end_date', end_date)
    .gte('created_at', dedupeWindowStart)
    .order('created_at', { ascending: false })
    .limit(1)

  duplicateQuery = location
    ? duplicateQuery.eq('location', location)
    : duplicateQuery.is('location', null)

  const { data: duplicateEvent, error: duplicateError } = await duplicateQuery.maybeSingle()

  if (duplicateError) {
    console.error(duplicateError)
    throw new Error('Failed to create event')
  }

  if (duplicateEvent) {
    revalidatePath('/dashboard/events')
    return { success: true, eventId: duplicateEvent.id, duplicatePrevented: true }
  }

  // Insert Event
  const { data: event, error } = await supabase
    .from('events')
    .insert({
      title,
      description,
      event_type,
      location,
      start_date,
      end_date,
      registration_close_date,
      is_public,
      organizer_id: user.id
    })
    .select()
    .single()

  if (error) {
    // Unique constraint can still race under concurrent requests; treat as duplicate.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pgCode = (error as any)?.code
    if (pgCode === '23505') {
      let existingEventQuery = supabase
        .from('events')
        .select('id')
        .eq('organizer_id', user.id)
        .eq('title', title)
        .eq('event_type', event_type)
        .eq('start_date', start_date)
        .eq('end_date', end_date)
        .order('created_at', { ascending: false })
        .limit(1)

      existingEventQuery = location
        ? existingEventQuery.eq('location', location)
        : existingEventQuery.is('location', null)

      const { data: existingEvent, error: existingEventError } = await existingEventQuery.maybeSingle()
      if (existingEventError) {
        console.error(existingEventError)
        throw new Error('Failed to create event')
      }

      if (existingEvent) {
        revalidatePath('/dashboard/events')
        return { success: true, eventId: existingEvent.id, duplicatePrevented: true }
      }
    }

    console.error(error)
    throw new Error('Failed to create event')
  }

  // Auto-generate Event Days if multi-day or single day
  if (event) {
    const start = new Date(start_date)
    const end = new Date(end_date)
    let current = start
    let dayCount = 1

    while (current <= end) {
      await supabase.from('event_days').insert({
        event_id: event.id,
        date: format(current, 'yyyy-MM-dd'),
        name: `Day ${dayCount}`
      })
      current = addDays(current, 1)
      dayCount++
    }
  }

  revalidatePath('/dashboard/events')
  return { success: true, eventId: event.id }
}

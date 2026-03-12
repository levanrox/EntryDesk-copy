import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('events')
            .select('id,title,event_type,event_level,start_date,end_date,location,description,registration_close_date,is_registration_open')
            .eq('is_public', true)
            .order('start_date', { ascending: true })

        if (error) {
            console.error('public-events query failed', error)
            return NextResponse.json({ events: [] }, { status: 500 })
        }

        return NextResponse.json(
            { events: data ?? [] },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
                },
            }
        )
    } catch {
        return NextResponse.json({ events: [] }, { status: 500 })
    }
}

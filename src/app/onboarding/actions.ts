'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const firstName = String(formData.get('first_name') ?? '').trim()
  const lastName = String(formData.get('last_name') ?? '').trim()
  const fullName = `${firstName} ${lastName}`.trim()
  const next = String(formData.get('next') ?? '/dashboard')

  if (!firstName || !lastName) {
    redirect('/onboarding?error=missing_name')
  }

  const email = user.email
  if (!email) {
    redirect('/login?error=auth_failed&tab=login')
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        email,
        full_name: fullName,
        role: 'coach',
      },
      { onConflict: 'id' }
    )

  if (profileError) {
    redirect('/onboarding?error=save_failed')
  }

  const { error: userUpdateError } = await supabase.auth.updateUser({
    data: {
      full_name: fullName,
      first_name: firstName,
      last_name: lastName,
    },
  })

  if (userUpdateError) {
    redirect('/onboarding?error=save_failed')
  }

  revalidatePath('/dashboard', 'layout')
  redirect(next.startsWith('/') ? next : '/dashboard')
}
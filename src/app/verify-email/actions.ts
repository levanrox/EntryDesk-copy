'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const authCallbackRedirectTo = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback?next=/dashboard`

function buildVerifyEmailRedirect(email: string | null | undefined, params: Record<string, string>) {
  const searchParams = new URLSearchParams()

  if (email) {
    searchParams.set('email', email)
  }

  for (const [key, value] of Object.entries(params)) {
    searchParams.set(key, value)
  }

  const query = searchParams.toString()
  return `/verify-email${query ? `?${query}` : ''}`
}

export async function resendVerificationEmail(formData: FormData) {
  const supabase = await createClient()
  const fallbackEmail = String(formData.get('email') ?? '').trim()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const email = user?.email ?? fallbackEmail

  if (!email) {
    redirect('/verify-email?error=email_required')
  }

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: authCallbackRedirectTo,
    },
  })

  if (error) {
    redirect(buildVerifyEmailRedirect(email, { error: 'resend_failed' }))
  }

  redirect(buildVerifyEmailRedirect(email, { message: 'resent' }))
}
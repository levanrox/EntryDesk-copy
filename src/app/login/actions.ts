'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (/invalid login credentials|invalid credentials/i.test(error.message)) {
      return redirect('/login?error=invalid_credentials&tab=login')
    }
    return redirect('/login?error=auth_failed&tab=login')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const first_name = formData.get('first_name') as string
  const last_name = formData.get('last_name') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: `${first_name} ${last_name}`,
      }
    }
  })

  if (error) {
    return redirect('/login?error=signup_failed&tab=register')
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=check_email&tab=login')
}

export async function loginWithGoogle() {
  const headerStore = await headers()
  const host = headerStore.get('x-forwarded-host') ?? headerStore.get('host')
  const protocol = headerStore.get('x-forwarded-proto') ?? 'https'
  const requestBaseUrl = host ? `${protocol}://${host}` : null
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? requestBaseUrl

  if (!baseUrl) {
    return redirect('/login?error=google_auth_failed&tab=login')
  }

  const callbackUrl = new URL('/auth/callback', baseUrl)
  callbackUrl.searchParams.set('next', '/dashboard')

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: callbackUrl.toString(),
    },
  })

  if (data.url) {
    redirect(data.url)
  }

  if (error) {
    return redirect('/login?error=google_auth_failed&tab=login')
  }
}

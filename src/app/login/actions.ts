'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isUserIdentityVerified } from '@/lib/auth/verification'

const authCallbackRedirectTo = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback?next=/dashboard`

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const captchaToken = formData.get('captchaToken') as string | null

  if (!captchaToken) {
    return redirect('/login?error=captcha_required&tab=login')
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: {
      captchaToken,
    },
  })

  if (error) {
    if (/captcha/i.test(error.message)) {
      return redirect('/login?error=captcha_failed&tab=login')
    }
    if (/email not confirmed|email not verified/i.test(error.message)) {
      return redirect(`/verify-email?email=${encodeURIComponent(email)}`)
    }
    if (/invalid login credentials/i.test(error.message)) {
      return redirect('/login?error=invalid_credentials&tab=login')
    }
    return redirect('/login?error=auth_failed&tab=login')
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user && !isUserIdentityVerified(user)) {
    redirect(`/verify-email?email=${encodeURIComponent(user.email ?? email)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirm_password = formData.get('confirm_password') as string
  const first_name = formData.get('first_name') as string
  const last_name = formData.get('last_name') as string
  const captchaToken = formData.get('captchaToken') as string | null

  if (password !== confirm_password) {
    return redirect('/login?error=password_mismatch&tab=register')
  }

  if (!captchaToken) {
    return redirect('/login?error=captcha_required&tab=register')
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      captchaToken,
      emailRedirectTo: authCallbackRedirectTo,
      data: {
        full_name: `${first_name} ${last_name}`,
      }
    }
  })

  if (error) {
      if (/captcha/i.test(error.message)) {
        return redirect('/login?error=captcha_failed&tab=register')
      }
      return redirect('/login?error=signup_failed&tab=register')
  }

  revalidatePath('/', 'layout')
    redirect(`/verify-email?email=${encodeURIComponent(email)}`)
}

export async function loginWithGoogle() {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
        },
      })

    if (data.url) {
      redirect(data.url)
    }

    if (error) {
       return redirect('/login?error=google_auth_failed&tab=login')
    }
}

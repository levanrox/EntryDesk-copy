import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PendingButton } from '@/components/ui/pending-button'
import { resendVerificationEmail } from './actions'
import { isUserIdentityVerified } from '@/lib/auth/verification'

type SearchParams = {
  error?: string | string[]
  message?: string | string[]
  email?: string | string[]
}

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function getErrorMessage(errorCode?: string) {
  if (!errorCode) return null
  if (errorCode === 'email_required') return 'We could not determine which email to verify. Sign in again and retry.'
  if (errorCode === 'resend_failed') return 'We could not resend the verification email right now. Please try again.'
  return errorCode
}

function getInfoMessage(messageCode?: string) {
  if (!messageCode) return null
  if (messageCode === 'resent') return 'A fresh verification email has been sent.'
  return messageCode
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams?: SearchParams | Promise<SearchParams>
}) {
  const resolvedSearchParams = await searchParams
  const queryEmail = getSingleParam(resolvedSearchParams?.email)
  const errorMessage = getErrorMessage(getSingleParam(resolvedSearchParams?.error))
  const infoMessage = getInfoMessage(getSingleParam(resolvedSearchParams?.message))

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user && isUserIdentityVerified(user)) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()

    redirect(profile ? '/dashboard' : '/onboarding')
  }

  const email = user?.email ?? queryEmail
  const refreshHref = email ? `/verify-email?email=${encodeURIComponent(email)}` : '/verify-email'

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border border-border/50 bg-card/80 p-8 shadow-sm backdrop-blur dark:border-white/[0.10]">
        <div className="mb-6 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Verification required</p>
          <h1 className="text-3xl font-semibold tracking-tight">Please verify your email</h1>
          <p className="text-sm text-muted-foreground">
            You cannot access the dashboard until your email identity is confirmed.
          </p>
        </div>

        {email ? (
          <div className="mb-4 rounded-xl border border-border/50 bg-muted/30 px-4 py-3 text-sm dark:border-white/[0.10]">
            Verification email: <span className="font-medium">{email}</span>
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mb-4 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {errorMessage}
          </div>
        ) : null}

        {infoMessage ? (
          <div className="mb-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {infoMessage}
          </div>
        ) : null}

        <form action={resendVerificationEmail} className="grid gap-4">
          <input type="hidden" name="email" value={email ?? ''} readOnly />
          <PendingButton type="submit" className="h-11 w-full" pendingText="Sending verification...">
            Resend verification email
          </PendingButton>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm">
          <Link href="/login" className="text-muted-foreground hover:text-foreground">
            Back to login
          </Link>
          <Link href={refreshHref} className="text-muted-foreground hover:text-foreground">
            Refresh status
          </Link>
        </div>
      </div>
    </main>
  )
}
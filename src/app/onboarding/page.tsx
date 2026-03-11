import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { completeOnboarding } from './actions'
import { splitFullName, deriveFullName } from '@/lib/auth/profile'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { PendingButton } from '@/components/ui/pending-button'

type SearchParams = {
  error?: string | string[]
  next?: string | string[]
}

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function getErrorMessage(errorCode?: string) {
  if (!errorCode) return null
  if (errorCode === 'missing_name') return 'Enter both first and last name to continue.'
  if (errorCode === 'save_failed') return 'We could not finish your setup. Please try again.'
  return errorCode
}

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams?: SearchParams | Promise<SearchParams>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (profile) {
    redirect('/dashboard')
  }

  const derivedName = deriveFullName(user)
  const { firstName, lastName } = splitFullName(derivedName)
  const resolvedSearchParams = await searchParams
  const errorMessage = getErrorMessage(getSingleParam(resolvedSearchParams?.error))
  const next = getSingleParam(resolvedSearchParams?.next) ?? '/dashboard'

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border border-border/50 bg-card/80 p-8 shadow-sm backdrop-blur dark:border-white/[0.10]">
        <div className="mb-6 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">First-time setup</p>
          <h1 className="text-3xl font-semibold tracking-tight">Complete your profile</h1>
          <p className="text-sm text-muted-foreground">
            Finish this once so EntryDesk can create your coach profile before you continue.
          </p>
        </div>

        {errorMessage ? (
          <div className="mb-4 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {errorMessage}
          </div>
        ) : null}

        <form action={completeOnboarding} className="grid gap-4">
          <input type="hidden" name="next" value={next.startsWith('/') ? next : '/dashboard'} />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="onboarding-first-name">First name</Label>
              <Input
                id="onboarding-first-name"
                name="first_name"
                defaultValue={firstName}
                placeholder="John"
                className="h-11 border-border/50 bg-background/70 text-sm dark:border-white/[0.10]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="onboarding-last-name">Last name</Label>
              <Input
                id="onboarding-last-name"
                name="last_name"
                defaultValue={lastName}
                placeholder="Doe"
                className="h-11 border-border/50 bg-background/70 text-sm dark:border-white/[0.10]"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="onboarding-email">Email</Label>
            <Input
              id="onboarding-email"
              value={user.email ?? ''}
              readOnly
              disabled
              className="h-11 border-border/50 bg-muted/30 text-sm dark:border-white/[0.10]"
            />
          </div>

          <PendingButton type="submit" className="mt-2 h-11 w-full" pendingText="Saving profile...">
            Continue to dashboard
          </PendingButton>
        </form>
      </div>
    </main>
  )
}
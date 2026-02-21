import { login, loginWithGoogle, signup } from './actions'
import { PendingButton } from '@/components/ui/pending-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NavigationOnPending } from '@/components/app/navigation-on-pending'
import Link from 'next/link'
import Image from 'next/image'
import { HistoryBackIconButton } from '@/components/app/history-back'
import { ThemeSwitch } from '@/components/app/theme-toggle'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'

type SearchParams = {
    error?: string | string[]
    message?: string | string[]
    tab?: string | string[]
}

function getSingleParam(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value
}

function getErrorMessage(errorCode?: string) {
    if (!errorCode) return null
    if (errorCode === 'invalid_credentials') return 'Invalid username or password.'
    if (errorCode === 'auth_failed') return 'Unable to sign in right now. Please try again.'
    if (errorCode === 'signup_failed') return 'Unable to create your account. Please review your details and retry.'
    if (errorCode === 'google_auth_failed') return 'Google sign-in could not be started. Please try again.'
    return errorCode
}

function getInfoMessage(messageCode?: string) {
    if (!messageCode) return null
    if (messageCode === 'check_email') return 'Account created. Check your email to verify and continue.'
    return messageCode
}

export default async function LoginPage({
    searchParams,
}: {
    searchParams?: SearchParams | Promise<SearchParams>
}) {
    const resolvedSearchParams = await searchParams
    const errorCode = getSingleParam(resolvedSearchParams?.error)
    const messageCode = getSingleParam(resolvedSearchParams?.message)
    const tabParam = getSingleParam(resolvedSearchParams?.tab)

    const initialTab = tabParam === 'register' ? 'register' : 'login'
    const errorMessage = getErrorMessage(errorCode)
    const infoMessage = getInfoMessage(messageCode)

    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (user) {
        redirect('/dashboard')
    }

    const features = ['Entry approvals', 'Student registration', 'Event exports', 'Coach workflows']

    return (
        <div className="min-h-screen bg-background">
            <header className="fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur dark:border-white/[0.08]">
                <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between px-8">
                    <div className="flex items-center gap-3">
                        <HistoryBackIconButton fallbackHref="/" />
                        <Link href="/" className="flex items-center gap-2">
                            <div className="relative h-8 w-8 overflow-hidden rounded-md border border-border/50 bg-background/70 dark:border-white/[0.12]">
                                <Image src="/favicon.ico" alt="EntryDesk logo" fill className="object-cover" sizes="32px" priority />
                            </div>
                            <span className="text-sm font-semibold">EntryDesk</span>
                        </Link>
                    </div>
                    <ThemeSwitch />
                </div>
            </header>

            <main className="grid w-full max-w-[1600px] mx-auto gap-10 px-8 pb-16 pt-28 lg:grid-cols-[1.1fr_460px] lg:items-start">
                <section>
                    <Badge variant="secondary" className="mb-5">Secure Access</Badge>
                    <h1 className="text-5xl font-bold tracking-tight md:text-6xl">Login or register</h1>
                    <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
                        One clean place for coaches and organizers to run event operations without noise.
                    </p>

                    <div className="mt-7 flex flex-wrap gap-2">
                        {features.map((feature) => (
                            <Badge key={feature} className="border-0 bg-muted/30 text-foreground dark:bg-white/[0.08]">
                                {feature}
                            </Badge>
                        ))}
                    </div>

                    <div className="mt-8 hidden max-w-2xl rounded-2xl border border-border/50 dark:border-white/[0.10] lg:block">
                        <div className="grid grid-cols-2 border-b border-border/50 px-5 py-3 text-sm text-muted-foreground dark:border-white/[0.10]">
                            <span>Role</span>
                            <span>Main workflow</span>
                        </div>
                        <div className="grid grid-cols-2 border-b border-border/50 px-5 py-3 dark:border-white/[0.10]">
                            <span className="font-medium">Coach</span>
                            <span className="text-muted-foreground">Register athletes, create and submit entries</span>
                        </div>
                        <div className="grid grid-cols-2 px-5 py-3">
                            <span className="font-medium">Organizer</span>
                            <span className="text-muted-foreground">Review approvals, manage events, export lists</span>
                        </div>
                    </div>
                </section>

                <section className="mx-auto w-full max-w-[460px] rounded-3xl border border-border/50 bg-card/70 p-6 shadow-sm backdrop-blur dark:border-white/[0.10] sm:p-8 lg:mx-0 lg:max-w-none">
                    {errorMessage ? (
                        <div className="mb-4 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200">
                            {errorMessage}
                        </div>
                    ) : null}

                    {infoMessage ? (
                        <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-200">
                            {infoMessage}
                        </div>
                    ) : null}

                    <div className="mb-5">
                        <h2 className="text-2xl font-semibold tracking-tight">Welcome to EntryDesk</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Continue with email and password, or use Google.</p>
                    </div>

                    <Tabs defaultValue={initialTab} className="w-full">
                        <TabsList className="mb-5 grid h-10 w-full grid-cols-2 rounded-md border border-border/50 bg-muted/30 p-1 dark:border-white/[0.10] dark:bg-white/[0.04]">
                            <TabsTrigger
                                value="login"
                                className="h-8 rounded-sm text-sm data-[state=active]:bg-background/90 data-[state=active]:shadow-none dark:data-[state=active]:bg-white/[0.12]"
                            >
                                Login
                            </TabsTrigger>
                            <TabsTrigger
                                value="register"
                                className="h-8 rounded-sm text-sm data-[state=active]:bg-background/90 data-[state=active]:shadow-none dark:data-[state=active]:bg-white/[0.12]"
                            >
                                Register
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="login" className="mt-0">
                            <form action={login} className="grid gap-4">
                                <NavigationOnPending title="Please wait while we log you in" />
                                <div className="space-y-2">
                                    <Label htmlFor="login-email">Email</Label>
                                    <Input
                                        id="login-email"
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className="h-11 border-border/50 bg-background/70 text-sm dark:border-white/[0.10]"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="login-password">Password</Label>
                                        <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <Input
                                        id="login-password"
                                        name="password"
                                        type="password"
                                        className="h-11 border-border/50 bg-background/70 text-sm dark:border-white/[0.10]"
                                        required
                                    />
                                </div>
                                <PendingButton type="submit" className="mt-1 h-11 w-full gap-2 text-sm" pendingText="Signing in...">
                                    Sign in
                                    <ArrowRight className="h-4 w-4" />
                                </PendingButton>
                            </form>
                        </TabsContent>

                        <TabsContent value="register" className="mt-0">
                            <form action={signup} className="grid gap-4">
                                <NavigationOnPending title="Creating your account" />
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="first-name">First name</Label>
                                        <Input
                                            id="first-name"
                                            name="first_name"
                                            placeholder="John"
                                            className="h-11 border-border/50 bg-background/70 text-sm dark:border-white/[0.10]"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="last-name">Last name</Label>
                                        <Input
                                            id="last-name"
                                            name="last_name"
                                            placeholder="Doe"
                                            className="h-11 border-border/50 bg-background/70 text-sm dark:border-white/[0.10]"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="register-email">Email</Label>
                                    <Input
                                        id="register-email"
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className="h-11 border-border/50 bg-background/70 text-sm dark:border-white/[0.10]"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="register-password">Password</Label>
                                    <Input
                                        id="register-password"
                                        name="password"
                                        type="password"
                                        className="h-11 border-border/50 bg-background/70 text-sm dark:border-white/[0.10]"
                                        required
                                    />
                                </div>
                                <PendingButton type="submit" className="mt-1 h-11 w-full text-sm" pendingText="Creating account...">
                                    Create account
                                </PendingButton>
                            </form>
                        </TabsContent>
                    </Tabs>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border/50 dark:border-white/[0.10]" />
                        </div>
                        <div className="relative z-10 flex justify-center">
                            <span className="bg-background px-3 py-1 text-xs uppercase tracking-wide text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <form action={loginWithGoogle}>
                        <NavigationOnPending title="Connecting to Google" />
                        <PendingButton
                            variant="outline"
                            type="submit"
                            className="h-11 w-full border-border/50 bg-muted/20 text-sm hover:bg-muted/35 dark:border-white/[0.12] dark:bg-white/[0.05] dark:hover:bg-white/[0.08]"
                            pendingText="Opening Google..."
                        >
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                            </svg>
                            Google
                        </PendingButton>
                    </form>

                    <p className="mt-5 text-xs text-muted-foreground">By continuing, you agree to our Terms of Service.</p>
                </section>
            </main>
        </div>
    )
}
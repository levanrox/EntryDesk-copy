import type { User } from '@supabase/supabase-js'

export function isUserIdentityVerified(user: User | null | undefined) {
    if (!user) return false
    if (user.email_confirmed_at) return true

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const provider = (user as any)?.app_metadata?.provider as string | undefined
    if (provider && provider !== 'email') {
        return true
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const identities = (user as any)?.identities as Array<any> | undefined

    return Boolean(
        identities?.some((identity) => {
            if (identity?.provider && identity.provider !== 'email') {
                return true
            }

            return identity?.identity_data?.email_verified === true
        })
    )
}
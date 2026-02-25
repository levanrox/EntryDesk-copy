import type { User } from '@supabase/supabase-js'

const ROLE_LIKE_NAMES = new Set(['coach', 'organizer', 'admin'])

export function looksLikeRoleName(value: string | null | undefined) {
    if (!value) return false
    return ROLE_LIKE_NAMES.has(value.trim().toLowerCase())
}

function normalizeCandidate(value: unknown): string | null {
    if (typeof value !== 'string') return null
    const trimmed = value.trim()
    if (!trimmed) return null
    if (looksLikeRoleName(trimmed)) return null
    return trimmed
}

/**
 * Best-effort human display name.
 * For Google OAuth, Supabase may store the name in either user_metadata or identities[].identity_data.
 */
export function deriveFullName(user: User): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const meta = (user as any)?.user_metadata as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const identityData = (user as any)?.identities?.[0]?.identity_data as any

    const candidates: Array<string | null> = [
        normalizeCandidate(meta?.full_name),
        normalizeCandidate(meta?.name),
        normalizeCandidate(meta?.display_name),
        normalizeCandidate(identityData?.full_name),
        normalizeCandidate(identityData?.name),
        normalizeCandidate(
            typeof identityData?.given_name === 'string' || typeof identityData?.family_name === 'string'
                ? `${identityData?.given_name ?? ''} ${identityData?.family_name ?? ''}`
                : null
        ),
    ]

    for (const candidate of candidates) {
        if (candidate) return candidate
    }

    const email = user.email
    if (email) {
        return email.split('@')[0]
    }

    return 'User'
}

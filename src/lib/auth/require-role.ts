import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { deriveFullName, looksLikeRoleName } from '@/lib/auth/profile'

export type UserRole = 'organizer' | 'coach' | 'admin'

type GetUserProfileOptions = {
    createIfMissing?: boolean
}

async function fetchUserProfile({ createIfMissing = true }: GetUserProfileOptions = {}) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Ensure we have a profile row for FK + RLS checks.
    // Supabase Auth does not auto-create rows in public.profiles.
    const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id, role, full_name, email')
        .eq('id', user.id)
        .maybeSingle()

    if (profileError) {
        throw new Error(profileError.message)
    }

    let profile = existingProfile

    if (!profile && createIfMissing) {
        const email = user.email
        if (!email) {
            throw new Error('Missing email on user; cannot create profile')
        }

        const fullName = deriveFullName(user)

        const { error: createProfileError } = await supabase
            .from('profiles')
            .insert({ id: user.id, email, role: 'coach', full_name: fullName })

        if (createProfileError) {
            throw new Error(createProfileError.message)
        }

        const { data: createdProfile, error: createdProfileError } = await supabase
            .from('profiles')
            .select('id, role, full_name, email')
            .eq('id', user.id)
            .single()

        if (createdProfileError) {
            throw new Error(createdProfileError.message)
        }

        profile = createdProfile
    } else {
        // If the profile was auto-created earlier with a placeholder name, sync it
        // from Google identity / user_metadata when available.
        const desiredFullName = deriveFullName(user)
        const emailLocalPart = user.email ? user.email.split('@')[0] : null
        const currentFullName = profile.full_name

        const currentLooksAuto =
            !currentFullName ||
            looksLikeRoleName(currentFullName) ||
            (emailLocalPart ? currentFullName === emailLocalPart : false)

        if (currentLooksAuto && desiredFullName && desiredFullName !== currentFullName) {
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ full_name: desiredFullName })
                .eq('id', user.id)

            if (!updateError) {
                profile = { ...profile, full_name: desiredFullName }
            }
        }
    }

    const role = (profile?.role as UserRole) || 'coach'

    return { supabase, user, profile, role }
}

export const getUserProfile = cache(async () => fetchUserProfile())

export const getUserProfileWithoutAutoCreate = cache(async () =>
    fetchUserProfile({ createIfMissing: false })
)

export async function requireRole(
    allowed: UserRole | UserRole[],
    options?: { redirectTo?: string }
) {
    const { supabase, user, profile, role } = await getUserProfile()
    const allowedRoles = Array.isArray(allowed) ? allowed : [allowed]

    if (!allowedRoles.includes(role)) {
        if (options?.redirectTo) {
            redirect(options.redirectTo)
        }
        throw new Error('Unauthorized')
    }

    return { supabase, user, profile, role }
}

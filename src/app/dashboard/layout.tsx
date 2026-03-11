import { getUserProfileWithoutAutoCreate } from '@/lib/auth/require-role'
import { ResponsiveDashboardFrame } from '@/components/dashboard/responsive-dashboard-frame'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile, role } = await getUserProfileWithoutAutoCreate()

  if (!profile) {
    redirect('/onboarding')
  }

  const roleLabel = role === 'organizer' ? 'Organizer' : role === 'admin' ? 'Admin' : 'Coach'

  return (
    <ResponsiveDashboardFrame
      role={role}
      roleLabel={roleLabel}
      profileFullName={profile?.full_name ?? null}
      userEmail={user.email || ''}
    >
      {children}
    </ResponsiveDashboardFrame>
  )
}

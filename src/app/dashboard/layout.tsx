import { getUserProfile } from '@/lib/auth/require-role'
import { ResponsiveDashboardFrame } from '@/components/dashboard/responsive-dashboard-frame'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile, role } = await getUserProfile()

  // If no profile exists (e.g. first login), we should probably guide them to setup
  // For now, let's assume profile is created on signup trigger or similar
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

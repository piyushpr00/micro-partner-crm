import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PartnerSidebar } from '@/components/layout/PartnerSidebar'
import { Topbar } from '@/components/layout/Topbar'

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role ?? 'partner'
  if (role === 'admin' || role === 'leader') redirect('/dashboard')

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F0F4FA' }}>
      <PartnerSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

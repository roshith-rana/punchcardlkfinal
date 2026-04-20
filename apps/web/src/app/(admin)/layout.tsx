import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminTopbar } from '@/components/admin/AdminTopbar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Get business info for this admin
  const { data: businessUser } = await supabase
    .from('business_users')
    .select('id, role, business_id, businesses(id, name, logo_url)')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()

  if (!businessUser || businessUser.role !== 'admin') redirect('/auth/login')

  const business = businessUser.businesses as { id: string; name: string; logo_url: string | null } | null

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar
        businessName={business?.name ?? 'My Business'}
        businessLogoUrl={business?.logo_url ?? null}
        businessId={businessUser.business_id}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopbar userEmail={user.email ?? ''} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

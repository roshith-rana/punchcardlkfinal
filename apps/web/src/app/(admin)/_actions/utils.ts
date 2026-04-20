'use server'

import { createClient } from '@/lib/supabase/server'

export async function getAdminBusinessId(): Promise<{ businessId: string; userId: string; businessUserId: string } | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('business_users')
    .select('id, business_id')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .eq('is_active', true)
    .single()

  if (!data) return null
  return { businessId: data.business_id, userId: user.id, businessUserId: data.id }
}

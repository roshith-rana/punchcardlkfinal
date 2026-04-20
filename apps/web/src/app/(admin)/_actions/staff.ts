'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getAdminBusinessId } from './utils'

export async function getStaffList() {
  const auth = await getAdminBusinessId()
  if (!auth) return { data: null, error: 'Unauthorized' }
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('business_users')
    .select(`
      id,
      role,
      is_active,
      created_at,
      user_id,
      users!inner(id, mobile_number, first_name, last_name),
      staff_outlet_assignments(outlet_id, outlets(id, name))
    `)
    .eq('business_id', auth.businessId)
    .eq('role', 'staff')
    .order('created_at', { ascending: false })

  return { data, error: error?.message ?? null }
}

export async function getStaffMember(businessUserId: string) {
  const auth = await getAdminBusinessId()
  if (!auth) return { data: null, error: 'Unauthorized' }
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('business_users')
    .select(`
      id, role, is_active, user_id,
      users!inner(id, mobile_number, first_name, last_name),
      staff_outlet_assignments(outlet_id)
    `)
    .eq('id', businessUserId)
    .eq('business_id', auth.businessId)
    .single()

  return { data, error: error?.message ?? null }
}

export async function inviteStaff(formData: FormData) {
  const auth = await getAdminBusinessId()
  if (!auth) return { error: 'Unauthorized' }

  const supabase = await createClient()
  const email = formData.get('email') as string
  const firstName = formData.get('first_name') as string
  const lastName = formData.get('last_name') as string
  const outletIds = formData.getAll('outlet_ids') as string[]

  // Use admin client for inviteUserByEmail
  const { createSupabaseAdminClient } = await import('@punchcard/supabase/server')
  const adminClient = createSupabaseAdminClient()

  const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
    data: { first_name: firstName, last_name: lastName },
  })

  if (inviteError || !inviteData?.user) return { error: inviteError?.message ?? 'Failed to invite user' }

  // Upsert user profile
  await supabase.from('users').upsert({
    id: inviteData.user.id,
    mobile_number: email, // email used as placeholder until they log in
    first_name: firstName || null,
    last_name: lastName || null,
  }, { onConflict: 'id' })

  // Insert business_users
  const { data: bu, error: buError } = await supabase
    .from('business_users')
    .insert({ business_id: auth.businessId, user_id: inviteData.user.id, role: 'staff', is_active: true })
    .select('id')
    .single()

  if (buError || !bu) return { error: buError?.message ?? 'Failed to create staff record' }

  // Assign outlets
  if (outletIds.length > 0) {
    await supabase.from('staff_outlet_assignments').insert(
      outletIds.map((outletId) => ({ business_user_id: bu.id, outlet_id: outletId }))
    )
  }

  revalidatePath('/admin/staff')
  return { error: null }
}

export async function updateStaffOutlets(businessUserId: string, outletIds: string[]) {
  const auth = await getAdminBusinessId()
  if (!auth) return { error: 'Unauthorized' }
  const supabase = await createClient()

  // Verify belongs to this business
  const { data: bu } = await supabase
    .from('business_users')
    .select('id')
    .eq('id', businessUserId)
    .eq('business_id', auth.businessId)
    .single()

  if (!bu) return { error: 'Staff member not found' }

  await supabase.from('staff_outlet_assignments').delete().eq('business_user_id', businessUserId)
  if (outletIds.length > 0) {
    await supabase.from('staff_outlet_assignments').insert(
      outletIds.map((outletId) => ({ business_user_id: businessUserId, outlet_id: outletId }))
    )
  }

  revalidatePath('/admin/staff')
  return { error: null }
}

export async function toggleStaffActive(businessUserId: string, isActive: boolean) {
  const auth = await getAdminBusinessId()
  if (!auth) return { error: 'Unauthorized' }
  const supabase = await createClient()

  const { error } = await supabase
    .from('business_users')
    .update({ is_active: isActive })
    .eq('id', businessUserId)
    .eq('business_id', auth.businessId)

  revalidatePath('/admin/staff')
  return { error: error?.message ?? null }
}

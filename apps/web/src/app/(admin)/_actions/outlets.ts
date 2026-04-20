'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getAdminBusinessId } from './utils'

export async function getOutlets() {
  const auth = await getAdminBusinessId()
  if (!auth) return { data: null, error: 'Unauthorized' }
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('outlets')
    .select('*')
    .eq('business_id', auth.businessId)
    .order('created_at', { ascending: false })

  return { data, error: error?.message ?? null }
}

export async function getOutlet(outletId: string) {
  const auth = await getAdminBusinessId()
  if (!auth) return { data: null, error: 'Unauthorized' }
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('outlets')
    .select('*')
    .eq('id', outletId)
    .eq('business_id', auth.businessId)
    .single()

  return { data: data ?? null, error: error?.message ?? null }
}

export async function createOutlet(formData: FormData) {
  const auth = await getAdminBusinessId()
  if (!auth) return { error: 'Unauthorized' }
  const supabase = await createClient()

  const { error } = await supabase.from('outlets').insert({
    business_id: auth.businessId,
    name: formData.get('name') as string,
    address: (formData.get('address') as string) || null,
    is_active: true,
  })

  revalidatePath('/admin/outlets')
  return { error: error?.message ?? null }
}

export async function updateOutlet(outletId: string, formData: FormData) {
  const auth = await getAdminBusinessId()
  if (!auth) return { error: 'Unauthorized' }
  const supabase = await createClient()

  const { error } = await supabase
    .from('outlets')
    .update({
      name: formData.get('name') as string,
      address: (formData.get('address') as string) || null,
    })
    .eq('id', outletId)
    .eq('business_id', auth.businessId)

  revalidatePath('/admin/outlets')
  return { error: error?.message ?? null }
}

export async function toggleOutletActive(outletId: string, isActive: boolean) {
  const auth = await getAdminBusinessId()
  if (!auth) return { error: 'Unauthorized' }
  const supabase = await createClient()

  const { error } = await supabase
    .from('outlets')
    .update({ is_active: isActive })
    .eq('id', outletId)
    .eq('business_id', auth.businessId)

  revalidatePath('/admin/outlets')
  return { error: error?.message ?? null }
}

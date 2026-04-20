'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getAdminBusinessId } from './utils'

export async function getBusinessSettings() {
  const auth = await getAdminBusinessId()
  if (!auth) return { data: null, error: 'Unauthorized' }
  const supabase = await createClient()

  const { data: business, error } = await supabase
    .from('businesses')
    .select('id, name, contact_email, contact_phone, address, logo_url')
    .eq('id', auth.businessId)
    .single()

  const { data: recipients } = await supabase
    .from('report_recipients')
    .select('id, email, is_active')
    .eq('business_id', auth.businessId)
    .order('created_at')

  return { data: { business, recipients: recipients ?? [] }, error: error?.message ?? null }
}

export async function updateBusinessProfile(formData: FormData) {
  const auth = await getAdminBusinessId()
  if (!auth) return { error: 'Unauthorized' }
  const supabase = await createClient()

  const { error } = await supabase
    .from('businesses')
    .update({
      name: formData.get('name') as string,
      contact_email: (formData.get('contact_email') as string) || null,
      contact_phone: (formData.get('contact_phone') as string) || null,
      address: (formData.get('address') as string) || null,
      logo_url: (formData.get('logo_url') as string) || null,
    })
    .eq('id', auth.businessId)

  revalidatePath('/admin/settings')
  revalidatePath('/admin', 'layout')
  return { error: error?.message ?? null }
}

export async function addReportRecipient(email: string) {
  const auth = await getAdminBusinessId()
  if (!auth) return { error: 'Unauthorized' }
  const supabase = await createClient()

  const { error } = await supabase.from('report_recipients').insert({
    business_id: auth.businessId,
    email,
    is_active: true,
  })

  revalidatePath('/admin/settings')
  return { error: error?.message ?? null }
}

export async function removeReportRecipient(recipientId: string) {
  const auth = await getAdminBusinessId()
  if (!auth) return { error: 'Unauthorized' }
  const supabase = await createClient()

  const { error } = await supabase
    .from('report_recipients')
    .delete()
    .eq('id', recipientId)
    .eq('business_id', auth.businessId)

  revalidatePath('/admin/settings')
  return { error: error?.message ?? null }
}

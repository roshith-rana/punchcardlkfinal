'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getAdminBusinessId } from './utils'

export async function getCards() {
  const auth = await getAdminBusinessId()
  if (!auth) return { data: null, error: 'Unauthorized' }
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('loyalty_cards')
    .select('*')
    .eq('business_id', auth.businessId)
    .order('created_at', { ascending: false })

  return { data, error: error?.message ?? null }
}

export async function getCard(cardId: string) {
  const auth = await getAdminBusinessId()
  if (!auth) return { data: null, error: 'Unauthorized' }
  const supabase = await createClient()

  const { data: card, error } = await supabase
    .from('loyalty_cards')
    .select('*')
    .eq('id', cardId)
    .eq('business_id', auth.businessId)
    .single()

  if (error || !card) return { data: null, error: error?.message ?? 'Card not found' }

  const { data: cardOutlets } = await supabase
    .from('loyalty_card_outlets')
    .select('outlet_id')
    .eq('loyalty_card_id', cardId)

  return { data: { ...card, outlet_ids: (cardOutlets ?? []).map((o: { outlet_id: string }) => o.outlet_id) }, error: null }
}

export async function createCard(formData: FormData) {
  const auth = await getAdminBusinessId()
  if (!auth) return { error: 'Unauthorized' }
  const supabase = await createClient()

  const outletScope = formData.get('outlet_scope') as string
  const selectedOutlets = formData.getAll('outlet_ids') as string[]

  const { data: card, error } = await supabase
    .from('loyalty_cards')
    .insert({
      business_id: auth.businessId,
      name: formData.get('name') as string,
      description: (formData.get('description') as string) || null,
      image_url: (formData.get('image_url') as string) || null,
      stamps_required: parseInt(formData.get('stamps_required') as string),
      reward_title: formData.get('reward_title') as string,
      reward_description: (formData.get('reward_description') as string) || null,
      max_stamps_per_visit: parseInt(formData.get('max_stamps_per_visit') as string) || 1,
      collect_bill_value: formData.get('collect_bill_value') === 'true',
      terms_and_conditions: (formData.get('terms_and_conditions') as string) || null,
      is_active: formData.get('is_active') !== 'false',
      start_date: (formData.get('start_date') as string) || null,
      end_date: (formData.get('end_date') as string) || null,
      outlet_scope: outletScope || 'all',
      redemption_scope: (formData.get('redemption_scope') as string) || 'all',
      auto_renew: formData.get('auto_renew') === 'true',
    })
    .select('id')
    .single()

  if (error || !card) return { error: error?.message ?? 'Failed to create card' }

  if (outletScope === 'selected' && selectedOutlets.length > 0) {
    await supabase.from('loyalty_card_outlets').insert(
      selectedOutlets.map((outletId) => ({ loyalty_card_id: card.id, outlet_id: outletId }))
    )
  }

  revalidatePath('/admin/cards')
  return { error: null, cardId: card.id }
}

export async function updateCard(cardId: string, formData: FormData) {
  const auth = await getAdminBusinessId()
  if (!auth) return { error: 'Unauthorized' }
  const supabase = await createClient()

  // Verify ownership
  const { data: existing } = await supabase
    .from('loyalty_cards')
    .select('id')
    .eq('id', cardId)
    .eq('business_id', auth.businessId)
    .single()

  if (!existing) return { error: 'Card not found' }

  const outletScope = formData.get('outlet_scope') as string
  const selectedOutlets = formData.getAll('outlet_ids') as string[]

  const { error } = await supabase
    .from('loyalty_cards')
    .update({
      name: formData.get('name') as string,
      description: (formData.get('description') as string) || null,
      image_url: (formData.get('image_url') as string) || null,
      stamps_required: parseInt(formData.get('stamps_required') as string),
      reward_title: formData.get('reward_title') as string,
      reward_description: (formData.get('reward_description') as string) || null,
      max_stamps_per_visit: parseInt(formData.get('max_stamps_per_visit') as string) || 1,
      collect_bill_value: formData.get('collect_bill_value') === 'true',
      terms_and_conditions: (formData.get('terms_and_conditions') as string) || null,
      is_active: formData.get('is_active') !== 'false',
      start_date: (formData.get('start_date') as string) || null,
      end_date: (formData.get('end_date') as string) || null,
      outlet_scope: outletScope || 'all',
      redemption_scope: (formData.get('redemption_scope') as string) || 'all',
      auto_renew: formData.get('auto_renew') === 'true',
    })
    .eq('id', cardId)

  if (error) return { error: error.message }

  // Sync outlet assignments
  await supabase.from('loyalty_card_outlets').delete().eq('loyalty_card_id', cardId)
  if (outletScope === 'selected' && selectedOutlets.length > 0) {
    await supabase.from('loyalty_card_outlets').insert(
      selectedOutlets.map((outletId) => ({ loyalty_card_id: cardId, outlet_id: outletId }))
    )
  }

  revalidatePath('/admin/cards')
  revalidatePath(`/admin/cards/${cardId}/edit`)
  return { error: null }
}

export async function toggleCardActive(cardId: string, isActive: boolean) {
  const auth = await getAdminBusinessId()
  if (!auth) return { error: 'Unauthorized' }
  const supabase = await createClient()

  const { error } = await supabase
    .from('loyalty_cards')
    .update({ is_active: isActive })
    .eq('id', cardId)
    .eq('business_id', auth.businessId)

  revalidatePath('/admin/cards')
  return { error: error?.message ?? null }
}

'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getAdminBusinessId } from './utils'
import { formatPhoneNumberSL } from '@punchcard/utils'

export async function getCustomers(search?: string) {
  const auth = await getAdminBusinessId()
  if (!auth) return { data: null, error: 'Unauthorized' }
  const supabase = await createClient()

  let query = supabase
    .from('customer_business_profiles')
    .select(`
      id, visit_count, total_stamps_earned, total_rewards_redeemed, last_visit_at, created_at,
      users!inner(id, mobile_number, first_name, last_name)
    `)
    .eq('business_id', auth.businessId)
    .order('last_visit_at', { ascending: false, nullsFirst: false })

  const { data, error } = await query
  if (error) return { data: null, error: error.message }

  if (search) {
    const s = search.toLowerCase()
    const filtered = (data ?? []).filter((row: unknown) => {
      const r = row as { users: { first_name?: string | null; last_name?: string | null; mobile_number: string } }
      const fullName = `${r.users.first_name ?? ''} ${r.users.last_name ?? ''}`.toLowerCase()
      return fullName.includes(s) || r.users.mobile_number.includes(s)
    })
    return { data: filtered, error: null }
  }

  return { data, error: null }
}

export async function getCustomerProfile(profileId: string) {
  const auth = await getAdminBusinessId()
  if (!auth) return { data: null, error: 'Unauthorized' }
  const supabase = await createClient()

  const { data: profile, error: profileError } = await supabase
    .from('customer_business_profiles')
    .select(`*, users!inner(id, mobile_number, first_name, last_name, birthday)`)
    .eq('id', profileId)
    .eq('business_id', auth.businessId)
    .single()

  if (profileError || !profile) return { data: null, error: profileError?.message ?? 'Not found' }

  const userId = (profile as unknown as { users: { id: string } }).users.id

  const { data: cards } = await supabase
    .from('customer_cards')
    .select(`*, loyalty_cards(name, stamps_required, reward_title)`)
    .eq('user_id', userId)
    .eq('business_id', auth.businessId)
    .order('created_at', { ascending: false })

  const { data: transactions } = await supabase
    .from('transactions')
    .select(`
      id, transaction_type, quantity, bill_value, created_at,
      outlets(name),
      loyalty_cards(name),
      business_users!staff_business_user_id(users!inner(first_name, last_name))
    `)
    .eq('user_id', userId)
    .eq('business_id', auth.businessId)
    .order('created_at', { ascending: false })
    .limit(100)

  return { data: { profile, cards: cards ?? [], transactions: transactions ?? [] }, error: null }
}

export async function addCustomer(formData: FormData) {
  const auth = await getAdminBusinessId()
  if (!auth) return { error: 'Unauthorized' }
  const supabase = await createClient()

  const rawPhone = formData.get('mobile_number') as string
  const phone = formatPhoneNumberSL(rawPhone)
  const firstName = formData.get('first_name') as string
  const lastName = (formData.get('last_name') as string) || null
  const birthday = (formData.get('birthday') as string) || null
  const notes = (formData.get('notes') as string) || null
  const cardId = (formData.get('card_id') as string) || null

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('mobile_number', phone)
    .single()

  let userId: string

  if (existingUser) {
    userId = existingUser.id
  } else {
    // Create auth user via admin client
    const { createSupabaseAdminClient } = await import('@punchcard/supabase/server')
    const adminClient = createSupabaseAdminClient()

    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      phone,
      phone_confirm: true,
    })

    if (authError || !authUser?.user) return { error: authError?.message ?? 'Failed to create user' }

    userId = authUser.user.id

    await supabase.from('users').upsert({
      id: userId,
      mobile_number: phone,
      first_name: firstName || null,
      last_name: lastName,
      birthday: birthday || null,
    }, { onConflict: 'id' })
  }

  // Upsert customer_business_profiles
  const { data: existingProfile } = await supabase
    .from('customer_business_profiles')
    .select('id')
    .eq('user_id', userId)
    .eq('business_id', auth.businessId)
    .single()

  if (existingProfile) {
    return { error: 'This customer already has a profile for your business.' }
  }

  const { error: profileError } = await supabase.from('customer_business_profiles').insert({
    business_id: auth.businessId,
    user_id: userId,
    notes,
    birthday: birthday || null,
  })

  if (profileError) return { error: profileError.message }

  // Optionally issue a card
  if (cardId) {
    await supabase.from('customer_cards').insert({
      user_id: userId,
      loyalty_card_id: cardId,
      business_id: auth.businessId,
      stamps_collected: 0,
      status: 'active',
    })
  }

  // Fire-and-forget: call send-invite-sms edge function
  supabase.functions.invoke('send-invite-sms', {
    body: { phone, businessName: 'your loyalty program' },
  }).catch(() => {}) // ignore errors

  revalidatePath('/admin/customers')
  return { error: null, userId }
}

export async function updateCustomerNotes(profileId: string, notes: string) {
  const auth = await getAdminBusinessId()
  if (!auth) return { error: 'Unauthorized' }
  const supabase = await createClient()

  const { error } = await supabase
    .from('customer_business_profiles')
    .update({ notes })
    .eq('id', profileId)
    .eq('business_id', auth.businessId)

  revalidatePath(`/admin/customers/${profileId}`)
  return { error: error?.message ?? null }
}

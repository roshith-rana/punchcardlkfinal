'use server'

import { createClient } from '@/lib/supabase/server'
import { getAdminBusinessId } from './utils'

export async function getDashboardStats() {
  const auth = await getAdminBusinessId()
  if (!auth) return { data: null, error: 'Unauthorized' }
  const supabase = await createClient()

  const [
    { count: totalCustomers },
    { count: activeCards },
    { data: stampData },
    { data: redeemData },
    { data: recentTransactions },
  ] = await Promise.all([
    supabase
      .from('customer_business_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', auth.businessId),
    supabase
      .from('loyalty_cards')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', auth.businessId)
      .eq('is_active', true),
    supabase
      .from('transactions')
      .select('quantity')
      .eq('business_id', auth.businessId)
      .eq('transaction_type', 'stamp'),
    supabase
      .from('transactions')
      .select('id')
      .eq('business_id', auth.businessId)
      .eq('transaction_type', 'redeem'),
    supabase
      .from('transactions')
      .select(`
        id, transaction_type, quantity, created_at,
        outlets(name),
        loyalty_cards(name),
        users!user_id(first_name, last_name, mobile_number),
        business_users!staff_business_user_id(users!inner(first_name, last_name))
      `)
      .eq('business_id', auth.businessId)
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const totalStamps = (stampData ?? []).reduce((s: number, t: { quantity: number }) => s + t.quantity, 0)
  const totalRedemptions = (redeemData ?? []).length

  return {
    data: {
      totalCustomers: totalCustomers ?? 0,
      activeCards: activeCards ?? 0,
      totalStamps,
      totalRedemptions,
      recentTransactions: recentTransactions ?? [],
    },
    error: null,
  }
}

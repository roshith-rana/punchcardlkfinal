'use server'

import { createClient } from '@/lib/supabase/server'
import { getAdminBusinessId } from './utils'

export async function getReportData(startDate: string, endDate: string) {
  const auth = await getAdminBusinessId()
  if (!auth) return { data: null, error: 'Unauthorized' }
  const supabase = await createClient()

  const { data: transactions, error } = await supabase
    .from('transactions')
    .select(`
      id, transaction_type, quantity, created_at,
      outlets(name),
      loyalty_cards(name),
      users!user_id(id, first_name, last_name),
      business_users!staff_business_user_id(id, users!inner(first_name, last_name))
    `)
    .eq('business_id', auth.businessId)
    .gte('created_at', startDate)
    .lte('created_at', endDate + 'T23:59:59.999Z')

  if (error) return { data: null, error: error.message }

  const txns = (transactions ?? []) as Array<{
    id: string
    transaction_type: string
    quantity: number
    created_at: string
    outlets: { name: string } | null
    loyalty_cards: { name: string } | null
    users: { id: string; first_name?: string | null; last_name?: string | null } | null
    business_users: { id: string; users: { first_name?: string | null; last_name?: string | null } } | null
  }>

  const stamps = txns.filter((t) => t.transaction_type === 'stamp')
  const redemptions = txns.filter((t) => t.transaction_type === 'redeem')
  const uniqueCustomers = new Set(txns.map((t) => t.users?.id).filter(Boolean)).size

  // Staff breakdown
  const staffMap = new Map<string, { name: string; stamps: number; redemptions: number; customers: Set<string> }>()
  for (const t of txns) {
    const sid = t.business_users?.id
    if (!sid) continue
    if (!staffMap.has(sid)) {
      const bu = t.business_users
      staffMap.set(sid, {
        name: `${bu?.users.first_name ?? ''} ${bu?.users.last_name ?? ''}`.trim() || 'Unknown',
        stamps: 0,
        redemptions: 0,
        customers: new Set(),
      })
    }
    const entry = staffMap.get(sid)!
    if (t.transaction_type === 'stamp') entry.stamps += t.quantity
    else entry.redemptions++
    if (t.users?.id) entry.customers.add(t.users.id)
  }

  const staffActivity = Array.from(staffMap.entries()).map(([id, v]) => ({
    id,
    name: v.name,
    stamps: v.stamps,
    redemptions: v.redemptions,
    customersServed: v.customers.size,
  }))

  // Top customers
  const customerMap = new Map<string, { name: string; visits: number; stamps: number; rewards: number }>()
  for (const t of txns) {
    const uid = t.users?.id
    if (!uid) continue
    if (!customerMap.has(uid)) {
      customerMap.set(uid, {
        name: `${t.users?.first_name ?? ''} ${t.users?.last_name ?? ''}`.trim() || 'Customer',
        visits: 0, stamps: 0, rewards: 0,
      })
    }
    const c = customerMap.get(uid)!
    c.visits++
    if (t.transaction_type === 'stamp') c.stamps += t.quantity
    else c.rewards++
  }

  const topCustomers = Array.from(customerMap.values())
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 10)

  // Daily breakdown
  const dailyMap = new Map<string, { stamps: number; redemptions: number }>()
  for (const t of txns) {
    const day = t.created_at.slice(0, 10)
    if (!dailyMap.has(day)) dailyMap.set(day, { stamps: 0, redemptions: 0 })
    const d = dailyMap.get(day)!
    if (t.transaction_type === 'stamp') d.stamps += t.quantity
    else d.redemptions++
  }

  const dailyData = Array.from(dailyMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, v]) => ({ date, ...v }))

  return {
    data: {
      totalTransactions: txns.length,
      totalStamps: stamps.reduce((s, t) => s + t.quantity, 0),
      totalRedemptions: redemptions.length,
      totalCustomersServed: uniqueCustomers,
      staffActivity,
      topCustomers,
      dailyData,
    },
    error: null,
  }
}

'use client'

import { useState, useTransition } from 'react'
import { updateCustomerNotes } from '@/app/(admin)/_actions/customers'
import { formatRelativeTime } from '@punchcard/utils'

type ProfileData = {
  profile: {
    id: string
    visit_count: number
    total_stamps_earned: number
    total_rewards_redeemed: number
    total_cards_issued: number
    first_visit_at: string | null
    last_visit_at: string | null
    notes: string | null
    birthday: string | null
    users: {
      id: string
      mobile_number: string
      first_name?: string | null
      last_name?: string | null
      birthday?: string | null
    } | null
  }
  cards: Array<{
    id: string
    stamps_collected: number
    status: string
    cycle_number: number
    issued_at: string
    redeemed_at: string | null
    loyalty_cards: { name: string; stamps_required: number; reward_title: string } | null
  }>
  transactions: Array<{
    id: string
    transaction_type: string
    quantity: number
    bill_value: number | null
    created_at: string
    outlets: { name: string } | null
    loyalty_cards: { name: string } | null
    business_users: { users: { first_name?: string | null; last_name?: string | null } } | null
  }>
}

export function CustomerProfileView({ data, profileId }: { data: ProfileData; profileId: string }) {
  const { profile, cards, transactions } = data
  const [notes, setNotes] = useState(profile.notes ?? '')
  const [editingNotes, setEditingNotes] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [saveMsg, setSaveMsg] = useState<string | null>(null)

  const user = profile.users
  const name = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Customer'

  function saveNotes() {
    startTransition(() => {
      void (async () => {
        const result = await updateCustomerNotes(profileId, notes)
        setSaveMsg(result.error ? `Error: ${result.error}` : 'Notes saved')
        setEditingNotes(false)
        setTimeout(() => setSaveMsg(null), 2000)
      })()
    })
  }

  const activeCards = cards.filter((c) => ['active', 'reward_available'].includes(c.status))
  const historyCards = cards.filter((c) => ['completed', 'redeemed'].includes(c.status))

  return (
    <div className="space-y-6">
      {/* Customer info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{user?.mobile_number}</p>
            {profile.birthday && <p className="text-sm text-gray-500">Birthday: {new Date(profile.birthday).toLocaleDateString('en-LK')}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Visits', value: profile.visit_count },
            { label: 'Stamps Earned', value: profile.total_stamps_earned },
            { label: 'Rewards Redeemed', value: profile.total_rewards_redeemed },
            { label: 'Cards Issued', value: profile.total_cards_issued },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {profile.first_visit_at && (
          <p className="text-xs text-gray-500 mt-4">
            First visit: {new Date(profile.first_visit_at).toLocaleDateString('en-LK')} ·{' '}
            Last visit: {profile.last_visit_at ? formatRelativeTime(profile.last_visit_at) : 'Never'}
          </p>
        )}
      </div>

      {/* Notes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Notes</h3>
          {!editingNotes ? (
            <button onClick={() => setEditingNotes(true)} className="text-sm text-indigo-600 hover:text-indigo-800">Edit</button>
          ) : (
            <div className="flex gap-2">
              <button onClick={saveNotes} disabled={isPending} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">{isPending ? 'Saving...' : 'Save'}</button>
              <button onClick={() => setEditingNotes(false)} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
            </div>
          )}
        </div>
        {saveMsg && <p className="text-xs text-green-600 mb-2">{saveMsg}</p>}
        {editingNotes ? (
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        ) : (
          <p className="text-sm text-gray-600">{notes || <span className="text-gray-400 italic">No notes</span>}</p>
        )}
      </div>

      {/* Active cards */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Active Cards</h3>
        {activeCards.length === 0 ? (
          <p className="text-sm text-gray-500">No active cards.</p>
        ) : (
          <div className="space-y-3">
            {activeCards.map((card) => {
              const lc = card.loyalty_cards
              const progress = lc ? (card.stamps_collected / lc.stamps_required) * 100 : 0
              return (
                <div key={card.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{lc?.name}</p>
                      <p className="text-xs text-gray-500">Reward: {lc?.reward_title}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      card.status === 'reward_available' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {card.status === 'reward_available' ? 'Reward ready!' : `Cycle ${card.cycle_number}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${Math.min(100, progress)}%` }} />
                    </div>
                    <span className="text-xs text-gray-600 flex-shrink-0">
                      {card.stamps_collected}/{lc?.stamps_required} stamps
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Card history */}
      {historyCards.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Card History</h3>
          <div className="space-y-2">
            {historyCards.map((card) => (
              <div key={card.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm text-gray-800">{card.loyalty_cards?.name}</p>
                  <p className="text-xs text-gray-500">Issued {new Date(card.issued_at).toLocaleDateString('en-LK')}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{card.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction history */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Transaction History</h3>
        </div>
        {transactions.length === 0 ? (
          <p className="px-6 py-8 text-sm text-gray-500 text-center">No transactions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {['Date', 'Type', 'Qty', 'Card', 'Outlet', 'Staff'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(t.created_at).toLocaleDateString('en-LK')}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        t.transaction_type === 'stamp' ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {t.transaction_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{t.loyalty_cards?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{t.outlets?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {t.business_users?.users
                        ? `${t.business_users.users.first_name ?? ''} ${t.business_users.users.last_name ?? ''}`.trim() || '—'
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

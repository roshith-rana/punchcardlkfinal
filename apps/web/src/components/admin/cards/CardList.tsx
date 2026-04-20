'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Toggle } from '@/components/admin/Toggle'
import { toggleCardActive } from '@/app/(admin)/_actions/cards'
import type { LoyaltyCard } from '@punchcard/types'

interface CardListProps {
  cards: LoyaltyCard[]
}

export function CardList({ cards }: CardListProps) {
  if (cards.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500 text-sm">No loyalty cards yet.</p>
        <Link
          href="/admin/cards/new"
          className="mt-4 inline-flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
        >
          + Create your first card
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Card Name', 'Stamps Required', 'Reward', 'Outlets', 'Auto-renew', 'Active', 'Created', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cards.map((card) => (
              <CardRow key={card.id} card={card} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CardRow({ card }: { card: LoyaltyCard }) {
  const [active, setActive] = useState(card.is_active)

  async function handleToggle(val: boolean) {
    setActive(val)
    await toggleCardActive(card.id, val)
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">
        <div className="text-sm font-medium text-gray-900">{card.name}</div>
        {card.description && <div className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">{card.description}</div>}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{card.stamps_required}</td>
      <td className="px-4 py-3 text-sm text-gray-700 max-w-[180px] truncate">{card.reward_title}</td>
      <td className="px-4 py-3 text-sm text-gray-700">
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
          card.outlet_scope === 'all' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'
        }`}>
          {card.outlet_scope === 'all' ? 'All outlets' : 'Selected'}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {card.auto_renew
          ? <span className="text-green-600 font-medium">Yes</span>
          : <span className="text-gray-400">No</span>}
      </td>
      <td className="px-4 py-3">
        <Toggle checked={active} onChange={handleToggle} />
      </td>
      <td className="px-4 py-3 text-xs text-gray-500">
        {new Date(card.created_at).toLocaleDateString('en-LK')}
      </td>
      <td className="px-4 py-3">
        <Link href={`/admin/cards/${card.id}/edit`} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
          Edit
        </Link>
      </td>
    </tr>
  )
}

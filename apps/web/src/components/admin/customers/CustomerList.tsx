'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SearchInput } from '@/components/admin/SearchInput'
import { formatRelativeTime } from '@punchcard/utils'

type CustomerRow = {
  id: string
  visit_count: number
  total_stamps_earned: number
  total_rewards_redeemed: number
  last_visit_at: string | null
  users: {
    id: string
    mobile_number: string
    first_name?: string | null
    last_name?: string | null
  } | null
}

export function CustomerList({ customers }: { customers: CustomerRow[] }) {
  const [search, setSearch] = useState('')

  const filtered = search
    ? customers.filter((c) => {
        const name = `${c.users?.first_name ?? ''} ${c.users?.last_name ?? ''}`.toLowerCase()
        return name.includes(search.toLowerCase()) || (c.users?.mobile_number ?? '').includes(search)
      })
    : customers

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SearchInput placeholder="Search by name or phone..." onSearch={setSearch} />
        <p className="text-sm text-gray-500">{filtered.length} customer{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-sm">
            {search ? 'No customers match your search.' : 'No customers yet. Add your first customer to get started.'}
          </p>
          {!search && (
            <Link href="/admin/customers/new" className="mt-4 inline-flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
              + Add Customer
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Name', 'Mobile', 'Visits', 'Stamps', 'Rewards', 'Last Visit', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {[c.users?.first_name, c.users?.last_name].filter(Boolean).join(' ') || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.users?.mobile_number ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{c.visit_count}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{c.total_stamps_earned}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{c.total_rewards_redeemed}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {c.last_visit_at ? formatRelativeTime(c.last_visit_at) : 'Never'}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/customers/${c.id}`} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

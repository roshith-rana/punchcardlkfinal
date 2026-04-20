'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { FormField } from '@/components/admin/FormField'
import { addCustomer } from '@/app/(admin)/_actions/customers'
import type { LoyaltyCard } from '@punchcard/types'

export function AddCustomerForm({ activeCards }: { activeCards: LoyaltyCard[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(() => {
      void (async () => {
        const result = await addCustomer(formData)
        if (result.error) setError(result.error)
        else {
          setSuccess(true)
          setTimeout(() => router.push('/admin/customers'), 1000)
        }
      })()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">Customer added! Redirecting...</div>}

      <div className="grid grid-cols-2 gap-4">
        <FormField label="First Name" required>
          <input name="first_name" required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </FormField>
        <FormField label="Last Name">
          <input name="last_name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </FormField>
      </div>

      <FormField label="Mobile Number" required hint="Format: 071 234 5678 or +94711234567">
        <input name="mobile_number" type="tel" required placeholder="071 234 5678"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </FormField>

      <FormField label="Birthday">
        <input name="birthday" type="date"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </FormField>

      <FormField label="Notes">
        <textarea name="notes" rows={2}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </FormField>

      {activeCards.length > 0 && (
        <FormField label="Issue Loyalty Card (optional)">
          <select name="card_id"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">— Don't issue a card yet —</option>
            {activeCards.map((card) => (
              <option key={card.id} value={card.id}>{card.name}</option>
            ))}
          </select>
        </FormField>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isPending || success}
          className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50">
          {isPending ? 'Adding...' : 'Add Customer'}
        </button>
        <button type="button" onClick={() => router.push('/admin/customers')}
          className="px-6 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </form>
  )
}

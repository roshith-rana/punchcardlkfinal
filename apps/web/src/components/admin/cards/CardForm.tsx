'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { FormField } from '@/components/admin/FormField'
import { Toggle } from '@/components/admin/Toggle'
import { createCard, updateCard } from '@/app/(admin)/_actions/cards'
import type { LoyaltyCard, Outlet } from '@punchcard/types'

interface CardFormProps {
  card?: LoyaltyCard & { outlet_ids?: string[] }
  outlets: Outlet[]
}

export function CardForm({ card, outlets }: CardFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [outletScope, setOutletScope] = useState<'all' | 'selected'>(card?.outlet_scope as 'all' | 'selected' ?? 'all')
  const [redemptionScope, setRedemptionScope] = useState<'all' | 'selected'>(card?.redemption_scope as 'all' | 'selected' ?? 'all')
  const [selectedOutlets, setSelectedOutlets] = useState<string[]>(card?.outlet_ids ?? [])
  const [isActive, setIsActive] = useState(card?.is_active ?? true)
  const [collectBillValue, setCollectBillValue] = useState(card?.collect_bill_value ?? false)
  const [autoRenew, setAutoRenew] = useState(card?.auto_renew ?? false)

  function toggleOutlet(id: string) {
    setSelectedOutlets((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    formData.set('outlet_scope', outletScope)
    formData.set('redemption_scope', redemptionScope)
    formData.set('is_active', String(isActive))
    formData.set('collect_bill_value', String(collectBillValue))
    formData.set('auto_renew', String(autoRenew))
    // Remove and re-add outlet_ids cleanly
    formData.delete('outlet_ids')
    selectedOutlets.forEach((id) => formData.append('outlet_ids', id))

    startTransition(() => {
      void (async () => {
        const result = card
          ? await updateCard(card.id, formData)
          : await createCard(formData)

        if (result.error) {
          setError(result.error)
        } else {
          setSuccess(true)
          setTimeout(() => router.push('/admin/cards'), 800)
        }
      })()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">
          Card saved successfully! Redirecting...
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h3 className="font-semibold text-gray-900">Card Details</h3>

        <FormField label="Card Name" required>
          <input name="name" defaultValue={card?.name} required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </FormField>

        <FormField label="Description">
          <textarea name="description" defaultValue={card?.description ?? ''} rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </FormField>

        <FormField label="Card Image URL" hint="Image upload coming soon — paste a URL for now">
          <input name="image_url" type="url" defaultValue={card?.image_url ?? ''}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Stamps Required" required>
            <input name="stamps_required" type="number" min={1} defaultValue={card?.stamps_required ?? 10} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </FormField>
          <FormField label="Max Stamps Per Visit">
            <input name="max_stamps_per_visit" type="number" min={1} defaultValue={card?.max_stamps_per_visit ?? 1}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </FormField>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h3 className="font-semibold text-gray-900">Reward</h3>

        <FormField label="Reward Title" required>
          <input name="reward_title" defaultValue={card?.reward_title} required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </FormField>

        <FormField label="Reward Description">
          <textarea name="reward_description" defaultValue={card?.reward_description ?? ''} rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </FormField>

        <FormField label="Terms & Conditions">
          <textarea name="terms_and_conditions" defaultValue={card?.terms_and_conditions ?? ''} rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </FormField>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h3 className="font-semibold text-gray-900">Validity</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Start Date">
            <input name="start_date" type="date" defaultValue={card?.start_date ?? ''}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </FormField>
          <FormField label="End Date">
            <input name="end_date" type="date" defaultValue={card?.end_date ?? ''}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </FormField>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h3 className="font-semibold text-gray-900">Outlet Scope</h3>

        <div className="space-y-2">
          {(['all', 'selected'] as const).map((val) => (
            <label key={val} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" checked={outletScope === val} onChange={() => setOutletScope(val)}
                className="text-indigo-600" />
              <span className="text-sm text-gray-700">
                {val === 'all' ? 'All outlets' : 'Selected outlets only'}
              </span>
            </label>
          ))}
        </div>

        {outletScope === 'selected' && (
          <div className="space-y-2 pl-4 border-l-2 border-indigo-100">
            {outlets.length === 0 ? (
              <p className="text-sm text-gray-500">No outlets configured yet. <a href="/admin/outlets/new" className="text-indigo-600 hover:underline">Add an outlet first.</a></p>
            ) : (
              outlets.map((outlet) => (
                <label key={outlet.id} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={selectedOutlets.includes(outlet.id)}
                    onChange={() => toggleOutlet(outlet.id)} className="text-indigo-600 rounded" />
                  <span className="text-sm text-gray-700">{outlet.name}</span>
                </label>
              ))
            )}
          </div>
        )}

        <div className="pt-2 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-2">Redemption Scope</p>
          {(['all', 'selected'] as const).map((val) => (
            <label key={val} className="flex items-center gap-3 cursor-pointer mb-2">
              <input type="radio" checked={redemptionScope === val} onChange={() => setRedemptionScope(val)}
                className="text-indigo-600" />
              <span className="text-sm text-gray-700">
                {val === 'all' ? 'All permitted outlets' : 'Selected outlet only'}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Options</h3>
        <div className="space-y-4">
          <Toggle checked={isActive} onChange={setIsActive} label="Active" />
          <Toggle checked={collectBillValue} onChange={setCollectBillValue} label="Collect bill value on stamp" />
          <div>
            <Toggle checked={autoRenew} onChange={setAutoRenew} label="Auto-renew" />
            <p className="text-xs text-gray-500 mt-1 ml-12">Automatically issue a new card after the reward is redeemed</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending || success}
          className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Saving...' : card ? 'Update Card' : 'Create Card'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/cards')}
          className="px-6 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

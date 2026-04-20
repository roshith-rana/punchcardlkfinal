'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { FormField } from '@/components/admin/FormField'
import { updateStaffOutlets } from '@/app/(admin)/_actions/staff'
import type { Outlet } from '@punchcard/types'

interface EditStaffFormProps {
  businessUserId: string
  outlets: Outlet[]
  assignedOutletIds: string[]
}

export function EditStaffForm({ businessUserId, outlets, assignedOutletIds }: EditStaffFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<string[]>(assignedOutletIds)

  function toggleOutlet(id: string) {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    startTransition(() => {
      void (async () => {
        const result = await updateStaffOutlets(businessUserId, selected)
        if (result.error) setError(result.error)
        else router.push('/admin/staff')
      })()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">{error}</div>}

      <FormField label="Assigned Outlets">
        {outlets.length === 0 ? (
          <p className="text-sm text-gray-500">No outlets configured.</p>
        ) : (
          <div className="space-y-2 mt-1">
            {outlets.map((o) => (
              <label key={o.id} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={selected.includes(o.id)} onChange={() => toggleOutlet(o.id)}
                  className="text-indigo-600 rounded" />
                <span className="text-sm text-gray-700">{o.name}{!o.is_active ? ' (inactive)' : ''}</span>
              </label>
            ))}
          </div>
        )}
      </FormField>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isPending}
          className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50">
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
        <button type="button" onClick={() => router.push('/admin/staff')}
          className="px-6 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </form>
  )
}

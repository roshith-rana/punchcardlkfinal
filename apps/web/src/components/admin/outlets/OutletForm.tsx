'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { FormField } from '@/components/admin/FormField'
import { createOutlet, updateOutlet } from '@/app/(admin)/_actions/outlets'
import type { Outlet } from '@punchcard/types'

export function OutletForm({ outlet }: { outlet?: Outlet }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(() => {
      void (async () => {
        const result = outlet
          ? await updateOutlet(outlet.id, formData)
          : await createOutlet(formData)
        if (result.error) setError(result.error)
        else router.push('/admin/outlets')
      })()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">{error}</div>}
      <FormField label="Outlet Name" required>
        <input name="name" defaultValue={outlet?.name} required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </FormField>
      <FormField label="Address">
        <input name="address" defaultValue={outlet?.address ?? ''}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </FormField>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isPending}
          className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50">
          {isPending ? 'Saving...' : outlet ? 'Update Outlet' : 'Create Outlet'}
        </button>
        <button type="button" onClick={() => router.push('/admin/outlets')}
          className="px-6 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </form>
  )
}

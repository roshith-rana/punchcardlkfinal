'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { FormField } from '@/components/admin/FormField'
import { inviteStaff } from '@/app/(admin)/_actions/staff'
import type { Outlet } from '@punchcard/types'

export function InviteStaffForm({ outlets }: { outlets: Outlet[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [selectedOutlets, setSelectedOutlets] = useState<string[]>([])

  function toggleOutlet(id: string) {
    setSelectedOutlets((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    formData.delete('outlet_ids')
    selectedOutlets.forEach((id) => formData.append('outlet_ids', id))

    startTransition(() => {
      void (async () => {
        const result = await inviteStaff(formData)
        if (result.error) setError(result.error)
        else {
          setSuccess(true)
          setTimeout(() => router.push('/admin/staff'), 1200)
        }
      })()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">Invite sent! Redirecting...</div>}

      <div className="bg-blue-50 rounded-lg px-4 py-3 text-sm text-blue-700">
        An invitation email will be sent to the staff member to set up their account.
      </div>

      <FormField label="Email Address" required>
        <input name="email" type="email" required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="First Name">
          <input name="first_name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </FormField>
        <FormField label="Last Name">
          <input name="last_name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </FormField>
      </div>

      <FormField label="Assign to Outlets">
        {outlets.length === 0 ? (
          <p className="text-sm text-gray-500">No outlets yet. <a href="/admin/outlets/new" className="text-indigo-600">Add an outlet first.</a></p>
        ) : (
          <div className="space-y-2 mt-1">
            {outlets.map((o) => (
              <label key={o.id} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={selectedOutlets.includes(o.id)} onChange={() => toggleOutlet(o.id)}
                  className="text-indigo-600 rounded" />
                <span className="text-sm text-gray-700">{o.name}</span>
              </label>
            ))}
          </div>
        )}
      </FormField>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isPending || success}
          className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50">
          {isPending ? 'Sending invite...' : 'Send Invite'}
        </button>
        <button type="button" onClick={() => router.push('/admin/staff')}
          className="px-6 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </form>
  )
}

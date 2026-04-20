'use client'

import { useState, useTransition } from 'react'
import { FormField } from '@/components/admin/FormField'
import { updateBusinessProfile, addReportRecipient, removeReportRecipient } from '@/app/(admin)/_actions/settings'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'

type SettingsData = {
  business: {
    id: string
    name: string
    contact_email: string | null
    contact_phone: string | null
    address: string | null
    logo_url: string | null
  } | null
  recipients: Array<{ id: string; email: string; is_active: boolean }>
}

export function SettingsView({ data }: { data: SettingsData }) {
  const [isPending, startTransition] = useTransition()
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [newEmail, setNewEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [recipients, setRecipients] = useState(data.recipients)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  async function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setProfileMsg(null)
    const formData = new FormData(e.currentTarget)
    startTransition(() => {
      void (async () => {
        const result = await updateBusinessProfile(formData)
        setProfileMsg(result.error
          ? { type: 'error', text: result.error }
          : { type: 'success', text: 'Business profile updated.' })
        setTimeout(() => setProfileMsg(null), 3000)
      })()
    })
  }

  async function handleAddEmail() {
    setEmailError(null)
    if (!newEmail.includes('@')) { setEmailError('Enter a valid email address.'); return }
    startTransition(() => {
      void (async () => {
        const result = await addReportRecipient(newEmail)
        if (result.error) setEmailError(result.error)
        else {
          setRecipients((r) => [...r, { id: Date.now().toString(), email: newEmail, is_active: true }])
          setNewEmail('')
        }
      })()
    })
  }

  async function handleDelete(id: string) {
    startTransition(() => {
      void (async () => {
        await removeReportRecipient(id)
        setRecipients((r) => r.filter((x) => x.id !== id))
        setDeleteId(null)
      })()
    })
  }

  const biz = data.business

  return (
    <div className="space-y-8">
      {/* Business profile */}
      <form onSubmit={handleProfileSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h3 className="font-semibold text-gray-900">Business Profile</h3>

        {profileMsg && (
          <div className={`rounded-lg px-4 py-3 text-sm ${profileMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {profileMsg.text}
          </div>
        )}

        <FormField label="Business Name" required>
          <input name="name" defaultValue={biz?.name ?? ''} required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Contact Email">
            <input name="contact_email" type="email" defaultValue={biz?.contact_email ?? ''}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </FormField>
          <FormField label="Contact Phone">
            <input name="contact_phone" defaultValue={biz?.contact_phone ?? ''}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </FormField>
        </div>

        <FormField label="Address">
          <input name="address" defaultValue={biz?.address ?? ''}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </FormField>

        <FormField label="Logo URL" hint="Image upload coming soon — paste a URL for now">
          <input name="logo_url" type="url" defaultValue={biz?.logo_url ?? ''}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </FormField>

        <button type="submit" disabled={isPending}
          className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50">
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* Report recipients */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Daily Report Recipients</h3>
        <p className="text-sm text-gray-500">These email addresses will receive the daily activity report.</p>

        <div className="space-y-2">
          {recipients.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No recipients yet.</p>
          ) : (
            recipients.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-800">{r.email}</span>
                <button onClick={() => setDeleteId(r.id)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="email@example.com"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddEmail() } }}
          />
          <button onClick={handleAddEmail} disabled={isPending || !newEmail}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50">
            Add
          </button>
        </div>
        {emailError && <p className="text-xs text-red-600">{emailError}</p>}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Remove recipient"
        message="Are you sure you want to remove this email from daily reports?"
        confirmLabel="Remove"
        danger
        onConfirm={() => deleteId && handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}

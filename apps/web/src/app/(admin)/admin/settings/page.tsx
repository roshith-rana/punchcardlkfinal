import { getBusinessSettings } from '@/app/(admin)/_actions/settings'
import { PageHeader } from '@/components/admin/PageHeader'
import { SettingsView } from '@/components/admin/settings/SettingsView'

export default async function SettingsPage() {
  const { data } = await getBusinessSettings()

  return (
    <div className="max-w-2xl">
      <PageHeader title="Settings" />
      <SettingsView data={data ?? { business: null, recipients: [] }} />
    </div>
  )
}

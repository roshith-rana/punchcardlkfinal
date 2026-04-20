import { PageHeader } from '@/components/admin/PageHeader'
import { OutletForm } from '@/components/admin/outlets/OutletForm'

export default function NewOutletPage() {
  return (
    <div className="max-w-xl">
      <PageHeader title="New Outlet" />
      <OutletForm />
    </div>
  )
}

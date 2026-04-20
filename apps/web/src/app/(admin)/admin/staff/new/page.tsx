import { getOutlets } from '@/app/(admin)/_actions/outlets'
import { PageHeader } from '@/components/admin/PageHeader'
import { InviteStaffForm } from '@/components/admin/staff/InviteStaffForm'

export default async function NewStaffPage() {
  const { data: outlets } = await getOutlets()
  return (
    <div className="max-w-xl">
      <PageHeader title="Add Staff Member" />
      <InviteStaffForm outlets={outlets ?? []} />
    </div>
  )
}

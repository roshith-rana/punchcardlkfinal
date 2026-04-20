import { getStaffList } from '@/app/(admin)/_actions/staff'
import { PageHeader } from '@/components/admin/PageHeader'
import { StaffList } from '@/components/admin/staff/StaffList'

export default async function StaffPage() {
  const { data: staff } = await getStaffList()

  return (
    <div>
      <PageHeader
        title="Staff"
        description="Manage staff accounts and outlet assignments"
        actionLabel="Add Staff"
        actionHref="/admin/staff/new"
      />
      <StaffList staff={staff ?? []} />
    </div>
  )
}

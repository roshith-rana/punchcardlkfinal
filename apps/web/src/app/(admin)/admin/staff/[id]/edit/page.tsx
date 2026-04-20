import { notFound } from 'next/navigation'
import { getStaffMember } from '@/app/(admin)/_actions/staff'
import { getOutlets } from '@/app/(admin)/_actions/outlets'
import { PageHeader } from '@/components/admin/PageHeader'
import { EditStaffForm } from '@/components/admin/staff/EditStaffForm'

export default async function EditStaffPage({ params }: { params: { id: string } }) {
  const [{ data: member }, { data: outlets }] = await Promise.all([
    getStaffMember(params.id),
    getOutlets(),
  ])
  if (!member) notFound()

  const assignedOutletIds = (member as unknown as { staff_outlet_assignments: Array<{ outlet_id: string }> })
    .staff_outlet_assignments.map((a) => a.outlet_id)

  return (
    <div className="max-w-xl">
      <PageHeader title="Edit Staff Member" />
      <EditStaffForm
        businessUserId={member.id}
        outlets={outlets ?? []}
        assignedOutletIds={assignedOutletIds}
      />
    </div>
  )
}

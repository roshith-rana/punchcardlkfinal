import { getOutlets } from '@/app/(admin)/_actions/outlets'
import { PageHeader } from '@/components/admin/PageHeader'
import { OutletList } from '@/components/admin/outlets/OutletList'

export default async function OutletsPage() {
  const { data: outlets } = await getOutlets()

  return (
    <div>
      <PageHeader
        title="Outlets"
        description="Manage your business locations"
        actionLabel="New Outlet"
        actionHref="/admin/outlets/new"
      />
      <OutletList outlets={outlets ?? []} />
    </div>
  )
}

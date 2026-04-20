import { notFound } from 'next/navigation'
import { getOutlet } from '@/app/(admin)/_actions/outlets'
import { PageHeader } from '@/components/admin/PageHeader'
import { OutletForm } from '@/components/admin/outlets/OutletForm'

export default async function EditOutletPage({ params }: { params: { id: string } }) {
  const { data: outlet } = await getOutlet(params.id)
  if (!outlet) notFound()

  return (
    <div className="max-w-xl">
      <PageHeader title={`Edit: ${outlet.name}`} />
      <OutletForm outlet={outlet} />
    </div>
  )
}

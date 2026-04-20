import { getOutlets } from '@/app/(admin)/_actions/outlets'
import { PageHeader } from '@/components/admin/PageHeader'
import { CardForm } from '@/components/admin/cards/CardForm'

export default async function NewCardPage() {
  const { data: outlets } = await getOutlets()

  return (
    <div className="max-w-3xl">
      <PageHeader title="New Loyalty Card" />
      <CardForm outlets={outlets ?? []} />
    </div>
  )
}

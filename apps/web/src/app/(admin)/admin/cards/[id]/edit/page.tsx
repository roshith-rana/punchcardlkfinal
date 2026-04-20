import { notFound } from 'next/navigation'
import { getCard } from '@/app/(admin)/_actions/cards'
import { getOutlets } from '@/app/(admin)/_actions/outlets'
import { PageHeader } from '@/components/admin/PageHeader'
import { CardForm } from '@/components/admin/cards/CardForm'

export default async function EditCardPage({ params }: { params: { id: string } }) {
  const [{ data: card }, { data: outlets }] = await Promise.all([
    getCard(params.id),
    getOutlets(),
  ])

  if (!card) notFound()

  return (
    <div className="max-w-3xl">
      <PageHeader title={`Edit: ${card.name}`} />
      <CardForm card={card as Parameters<typeof CardForm>[0]['card']} outlets={outlets ?? []} />
    </div>
  )
}

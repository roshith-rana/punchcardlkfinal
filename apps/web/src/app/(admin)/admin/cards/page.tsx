import Link from 'next/link'
import { getCards } from '@/app/(admin)/_actions/cards'
import { PageHeader } from '@/components/admin/PageHeader'
import { CardList } from '@/components/admin/cards/CardList'
import type { LoyaltyCard } from '@punchcard/types'

export default async function CardsPage() {
  const { data: cards } = await getCards()

  return (
    <div>
      <PageHeader
        title="Loyalty Cards"
        description="Manage your loyalty card programs"
        actionLabel="New Card"
        actionHref="/admin/cards/new"
      />
      <CardList cards={(cards ?? []) as LoyaltyCard[]} />
    </div>
  )
}

import { getCards } from '@/app/(admin)/_actions/cards'
import { PageHeader } from '@/components/admin/PageHeader'
import { AddCustomerForm } from '@/components/admin/customers/AddCustomerForm'
import type { LoyaltyCard } from '@punchcard/types'

export default async function NewCustomerPage() {
  const { data: cards } = await getCards()
  const activeCards = ((cards ?? []) as LoyaltyCard[]).filter((c) => c.is_active)

  return (
    <div className="max-w-xl">
      <PageHeader title="Add Customer" />
      <AddCustomerForm activeCards={activeCards} />
    </div>
  )
}

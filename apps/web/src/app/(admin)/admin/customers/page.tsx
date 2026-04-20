import { getCustomers } from '@/app/(admin)/_actions/customers'
import { getCards } from '@/app/(admin)/_actions/cards'
import { PageHeader } from '@/components/admin/PageHeader'
import { CustomerList } from '@/components/admin/customers/CustomerList'

export default async function CustomersPage() {
  const [{ data: customers }, { data: cards }] = await Promise.all([
    getCustomers(),
    getCards(),
  ])

  return (
    <div>
      <PageHeader
        title="Customers"
        description="View and manage your loyalty program customers"
        actionLabel="Add Customer"
        actionHref="/admin/customers/new"
      />
      <CustomerList customers={customers ?? []} />
    </div>
  )
}

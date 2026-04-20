import { notFound } from 'next/navigation'
import { getCustomerProfile } from '@/app/(admin)/_actions/customers'
import { PageHeader } from '@/components/admin/PageHeader'
import { CustomerProfileView } from '@/components/admin/customers/CustomerProfileView'

export default async function CustomerProfilePage({ params }: { params: { id: string } }) {
  const { data } = await getCustomerProfile(params.id)
  if (!data) notFound()

  return (
    <div>
      <PageHeader title="Customer Profile" />
      <CustomerProfileView data={data as Parameters<typeof CustomerProfileView>[0]['data']} profileId={params.id} />
    </div>
  )
}

import { getDashboardStats } from '@/app/(admin)/_actions/dashboard'
import { StatCard } from '@/components/admin/StatCard'
import { PageHeader } from '@/components/admin/PageHeader'
import { formatRelativeTime } from '@punchcard/utils'

export default async function DashboardPage() {
  const { data } = await getDashboardStats()

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your loyalty program" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Customers" value={data?.totalCustomers ?? 0} color="indigo" />
        <StatCard label="Active Cards" value={data?.activeCards ?? 0} color="green" />
        <StatCard label="Total Stamps Issued" value={data?.totalStamps ?? 0} color="yellow" />
        <StatCard label="Rewards Redeemed" value={data?.totalRedemptions ?? 0} color="red" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        {!data?.recentTransactions?.length ? (
          <div className="px-6 py-12 text-center text-sm text-gray-500">
            No transactions yet. Start stamping loyalty cards!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {['Customer', 'Card', 'Action', 'Outlet', 'Staff', 'Time'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(data.recentTransactions as Array<{
                  id: string
                  transaction_type: string
                  quantity: number
                  created_at: string
                  outlets: { name: string } | null
                  loyalty_cards: { name: string } | null
                  users: { first_name?: string | null; last_name?: string | null; mobile_number: string } | null
                  business_users: { users: { first_name?: string | null; last_name?: string | null } } | null
                }>).map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {t.users?.first_name || t.users?.last_name
                        ? `${t.users.first_name ?? ''} ${t.users.last_name ?? ''}`.trim()
                        : t.users?.mobile_number ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{t.loyalty_cards?.name ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        t.transaction_type === 'stamp'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {t.transaction_type === 'stamp' ? `+${t.quantity} stamp${t.quantity !== 1 ? 's' : ''}` : 'Redeemed'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{t.outlets?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {t.business_users?.users
                        ? `${t.business_users.users.first_name ?? ''} ${t.business_users.users.last_name ?? ''}`.trim() || '—'
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatRelativeTime(t.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">Welcome back, {user?.email}</p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder stat cards */}
        {['Total Customers', 'Active Cards', 'Stamps This Month'].map((stat) => (
          <div key={stat} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="text-sm font-medium text-gray-500 truncate">{stat}</div>
              <div className="mt-1 text-3xl font-semibold text-gray-900">—</div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-gray-500">
        Full dashboard coming in Phase 2.
      </p>
    </div>
  )
}

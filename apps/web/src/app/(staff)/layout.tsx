import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/staff-login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <span className="font-bold text-indigo-600">PunchCard LK</span>
            <span className="text-sm text-gray-500">Staff Portal</span>
          </div>
        </div>
      </nav>
      <main className="max-w-2xl mx-auto py-6 px-4">{children}</main>
    </div>
  )
}

'use client'

import { usePathname } from 'next/navigation'

const ROUTE_TITLES: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/cards': 'Loyalty Cards',
  '/admin/customers': 'Customers',
  '/admin/staff': 'Staff',
  '/admin/outlets': 'Outlets',
  '/admin/reports': 'Reports',
  '/admin/settings': 'Settings',
}

function getPageTitle(pathname: string): string {
  if (pathname === '/admin/dashboard') return 'Dashboard'
  for (const [route, title] of Object.entries(ROUTE_TITLES)) {
    if (pathname.startsWith(route)) return title
  }
  return 'Admin'
}

export function AdminTopbar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const title = getPageTitle(pathname)

  return (
    <header className="flex-shrink-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-900 pl-10 lg:pl-0">{title}</h1>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
          <span className="text-xs font-medium text-indigo-700">
            {userEmail.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="hidden sm:block text-sm text-gray-600 max-w-[200px] truncate">{userEmail}</span>
      </div>
    </header>
  )
}

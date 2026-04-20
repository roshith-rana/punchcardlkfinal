'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: '⊞' },
  { label: 'Loyalty Cards', href: '/admin/cards', icon: '◈' },
  { label: 'Customers', href: '/admin/customers', icon: '◎' },
  { label: 'Staff', href: '/admin/staff', icon: '◑' },
  { label: 'Outlets', href: '/admin/outlets', icon: '◉' },
  { label: 'Reports', href: '/admin/reports', icon: '▦' },
  { label: 'Settings', href: '/admin/settings', icon: '⚙' },
]

interface AdminSidebarProps {
  businessName: string
  businessLogoUrl: string | null
  businessId: string
}

export function AdminSidebar({ businessName, businessLogoUrl }: AdminSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const initials = businessName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const sidebarContent = (
    <div className={`flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-200 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Business header */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center overflow-hidden">
          {businessLogoUrl ? (
            <img src={businessLogoUrl} alt={businessName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-sm font-bold">{initials}</span>
          )}
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{businessName}</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex flex-shrink-0 w-6 h-6 items-center justify-center text-gray-400 hover:text-gray-600 rounded"
          aria-label="Toggle sidebar"
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 py-3 border-t border-gray-100">
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors`}
          >
            <span className="text-base flex-shrink-0">⎋</span>
            {!collapsed && <span>Sign out</span>}
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">{sidebarContent}</div>

      {/* Mobile hamburger */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-50 w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm"
        >
          ☰
        </button>

        {/* Mobile overlay */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-50 flex">
              <div className="w-64 flex flex-col h-full bg-white border-r border-gray-200">
                {/* Business header */}
                <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center overflow-hidden">
                    {businessLogoUrl ? (
                      <img src={businessLogoUrl} alt={businessName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-sm font-bold">{initials}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{businessName}</p>
                    <p className="text-xs text-gray-500">Admin</p>
                  </div>
                  <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
                  {NAV_ITEMS.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(item.href + '/')
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        onClick={() => setMobileOpen(false)}
                      >
                        <span className="text-base flex-shrink-0">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </nav>
                <div className="px-2 py-3 border-t border-gray-100">
                  <form action="/api/auth/signout" method="POST">
                    <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600">
                      <span>⎋</span><span>Sign out</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

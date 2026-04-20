'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Toggle } from '@/components/admin/Toggle'
import { toggleStaffActive } from '@/app/(admin)/_actions/staff'

type StaffRow = {
  id: string
  is_active: boolean
  users: Array<{ first_name?: string | null; last_name?: string | null; mobile_number: string }>
  staff_outlet_assignments: Array<{ outlets: { id: string; name: string } | null }>
}

export function StaffList({ staff }: { staff: StaffRow[] }) {
  if (staff.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500 text-sm">No staff members yet.</p>
        <Link href="/admin/staff/new" className="mt-4 inline-flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
          + Add first staff member
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Name', 'Contact', 'Assigned Outlets', 'Active', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {staff.map((s) => <StaffRow key={s.id} member={s} />)}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StaffRow({ member }: { member: StaffRow }) {
  const [active, setActive] = useState(member.is_active)

  async function handleToggle(val: boolean) {
    setActive(val)
    await toggleStaffActive(member.id, val)
  }

  const user = member.users[0]
  const name = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || '—'
  const outlets = member.staff_outlet_assignments
    .map((a) => a.outlets?.name)
    .filter(Boolean)
    .join(', ') || 'None assigned'

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 text-sm font-medium text-gray-900">{name}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{user?.mobile_number ?? '—'}</td>
      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">{outlets}</td>
      <td className="px-4 py-3"><Toggle checked={active} onChange={handleToggle} /></td>
      <td className="px-4 py-3">
        <Link href={`/admin/staff/${member.id}/edit`} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Edit</Link>
      </td>
    </tr>
  )
}

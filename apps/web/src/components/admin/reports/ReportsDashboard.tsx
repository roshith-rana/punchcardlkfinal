'use client'

import { useState, useEffect, useTransition } from 'react'
import { StatCard } from '@/components/admin/StatCard'
import { getReportData } from '@/app/(admin)/_actions/reports'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

function toDateStr(d: Date) {
  return d.toISOString().slice(0, 10)
}

export function ReportsDashboard() {
  const today = new Date()
  const defaultStart = new Date(today)
  defaultStart.setDate(today.getDate() - 29)

  const [startDate, setStartDate] = useState(toDateStr(defaultStart))
  const [endDate, setEndDate] = useState(toDateStr(today))
  const [data, setData] = useState<Awaited<ReturnType<typeof getReportData>>['data']>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(() => {
      void (async () => {
        const result = await getReportData(startDate, endDate)
        setData(result.data)
      })()
    })
  }, [startDate, endDate])

  return (
    <div className="space-y-6">
      {/* Date range */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">From</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} max={endDate}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">To</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate} max={toDateStr(today)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        {isPending && <span className="text-sm text-gray-400">Loading...</span>}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Stamps" value={data?.totalStamps ?? 0} color="indigo" />
        <StatCard label="Rewards Redeemed" value={data?.totalRedemptions ?? 0} color="green" />
        <StatCard label="Customers Served" value={data?.totalCustomersServed ?? 0} color="yellow" />
        <StatCard label="Total Transactions" value={data?.totalTransactions ?? 0} />
      </div>

      {/* Chart */}
      {data?.dailyData && data.dailyData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Daily Stamps</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.dailyData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip formatter={(v) => [v, 'Stamps']} labelFormatter={(l) => `Date: ${l}`} />
              <Bar dataKey="stamps" fill="#4f46e5" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Staff activity */}
      {data?.staffActivity && data.staffActivity.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Staff Activity</h3>
          </div>
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {['Staff Member', 'Stamps Issued', 'Rewards Redeemed', 'Customers Served'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.staffActivity.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{s.stamps}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{s.redemptions}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{s.customersServed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Top customers */}
      {data?.topCustomers && data.topCustomers.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Top Customers</h3>
          </div>
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {['Customer', 'Visits', 'Stamps', 'Rewards'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.topCustomers.map((c, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{c.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{c.visits}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{c.stamps}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{c.rewards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isPending && data?.totalTransactions === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-sm">No transactions in this date range.</p>
        </div>
      )}
    </div>
  )
}

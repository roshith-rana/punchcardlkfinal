interface StatCardProps {
  label: string
  value: string | number
  subtext?: string
  color?: 'indigo' | 'green' | 'yellow' | 'red'
}

export function StatCard({ label, value, subtext, color = 'indigo' }: StatCardProps) {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-700',
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    red: 'bg-red-50 text-red-700',
  }
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {subtext && <p className={`mt-1 text-xs font-medium px-2 py-0.5 rounded-full inline-block ${colorMap[color]}`}>{subtext}</p>}
    </div>
  )
}

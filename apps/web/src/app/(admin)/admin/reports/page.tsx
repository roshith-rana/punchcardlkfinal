import { PageHeader } from '@/components/admin/PageHeader'
import { ReportsDashboard } from '@/components/admin/reports/ReportsDashboard'

export default function ReportsPage() {
  return (
    <div>
      <PageHeader title="Reports" description="Activity analytics for your loyalty program" />
      <ReportsDashboard />
    </div>
  )
}

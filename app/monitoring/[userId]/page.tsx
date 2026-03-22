import { EmployeeMonitoringDetail } from "@/components/monitoring/employee-detail"
import { Layout } from "@/components/layout"

export default async function EmployeeMonitoringPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params

  return (
    <Layout>
      <EmployeeMonitoringDetail userId={userId} />
    </Layout>
  )
}

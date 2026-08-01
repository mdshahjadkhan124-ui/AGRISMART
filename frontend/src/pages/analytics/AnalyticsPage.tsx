import { useMyAnalytics } from '@/features/analytics/hooks'
import StatTile from '@/components/common/StatTile'
import CountBarChart from '@/components/common/CountBarChart'
import TrendLineChart from '@/components/common/TrendLineChart'
import type {
  ExpertAnalytics,
  FarmerAnalytics,
  GovAnalytics,
  OfficerAnalytics,
  SellerAnalytics,
  SuperAdminAnalytics,
} from '@/features/analytics/types'

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useMyAnalytics()

  if (isLoading) return <p className="text-muted-foreground p-8 text-sm">Loading analytics…</p>
  if (!analytics) return <p className="text-muted-foreground p-8 text-sm">No analytics available.</p>

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">Analytics</h1>

      {analytics.role === 'farmer' && <FarmerAnalyticsView data={analytics.data as FarmerAnalytics} />}
      {analytics.role === 'expert' && <ExpertAnalyticsView data={analytics.data as ExpertAnalytics} />}
      {analytics.role === 'seller' && <SellerAnalyticsView data={analytics.data as SellerAnalytics} />}
      {analytics.role === 'officer' && <OfficerAnalyticsView data={analytics.data as OfficerAnalytics} />}
      {analytics.role === 'gov_admin' && <GovAnalyticsView data={analytics.data as GovAnalytics} />}
      {analytics.role === 'super_admin' && <SuperAdminAnalyticsView data={analytics.data as SuperAdminAnalytics} />}
    </div>
  )
}

function FarmerAnalyticsView({ data }: { data: FarmerAnalytics }) {
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <StatTile label="Farms" value={data.farmCount} />
        <StatTile label="Orders" value={data.ordersCount} />
        <StatTile label="Appointments" value={data.appointmentsCount} />
      </div>
      <TrendLineChart title="Soil health trend" data={data.soilHealthTrend} />
      <CountBarChart title="Disease reports by status" counts={data.diseaseReportsByStatus} />
    </>
  )
}

function ExpertAnalyticsView({ data }: { data: ExpertAnalytics }) {
  return (
    <>
      <StatTile label="Disease reports resolved" value={data.diseaseReportsResolved} />
      <CountBarChart title="Appointments by status" counts={data.appointmentsByStatus} />
    </>
  )
}

function SellerAnalyticsView({ data }: { data: SellerAnalytics }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <StatTile label="Products listed" value={data.productCount} />
        <StatTile label="Revenue (delivered)" value={`₹${data.totalRevenueInr.toLocaleString('en-IN')}`} />
      </div>
      <CountBarChart title="Orders by status" counts={data.ordersByStatus} />
    </>
  )
}

function OfficerAnalyticsView({ data }: { data: OfficerAnalytics }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <StatTile label="Registered farmers" value={data.totalFarmers} />
        <StatTile label="Farms" value={data.totalFarms} />
      </div>
      <CountBarChart title="Disease reports by status (all regions)" counts={data.diseaseReportsByStatus} />
    </>
  )
}

function GovAnalyticsView({ data }: { data: GovAnalytics }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <StatTile label="Active schemes" value={data.activeSchemesCount} />
        <StatTile label="Total schemes" value={data.totalSchemesCount} />
      </div>
      <CountBarChart title="Schemes by category" counts={data.schemesByCategory} />
    </>
  )
}

function SuperAdminAnalyticsView({ data }: { data: SuperAdminAnalytics }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Farms" value={data.totalFarms} />
        <StatTile label="Orders" value={data.totalOrders} />
        <StatTile label="Appointments" value={data.totalAppointments} />
        <StatTile label="Disease reports" value={data.totalDiseaseReports} />
      </div>
      <StatTile label="Revenue (delivered)" value={`₹${data.totalRevenueInr.toLocaleString('en-IN')}`} />
      <CountBarChart title="Users by role" counts={data.usersByRole} />
    </>
  )
}

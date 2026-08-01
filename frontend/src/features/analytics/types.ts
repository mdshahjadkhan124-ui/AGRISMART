import type { Role } from '@/features/auth/types'

export interface FarmerAnalytics {
  farmCount: number
  soilHealthTrend: { date: string; score: number }[]
  diseaseReportsByStatus: Record<string, number>
  ordersCount: number
  appointmentsCount: number
}

export interface ExpertAnalytics {
  appointmentsByStatus: Record<string, number>
  diseaseReportsResolved: number
}

export interface SellerAnalytics {
  productCount: number
  ordersByStatus: Record<string, number>
  totalRevenueInr: number
}

export interface OfficerAnalytics {
  totalFarmers: number
  totalFarms: number
  diseaseReportsByStatus: Record<string, number>
}

export interface GovAnalytics {
  schemesByCategory: Record<string, number>
  activeSchemesCount: number
  totalSchemesCount: number
}

export interface SuperAdminAnalytics {
  usersByRole: Record<string, number>
  totalFarms: number
  totalOrders: number
  totalAppointments: number
  totalDiseaseReports: number
  totalRevenueInr: number
}

export type AnyAnalytics = FarmerAnalytics | ExpertAnalytics | SellerAnalytics | OfficerAnalytics | GovAnalytics | SuperAdminAnalytics

export interface AnalyticsResponse {
  role: Role
  data: AnyAnalytics
}

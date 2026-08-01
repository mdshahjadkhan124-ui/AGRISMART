import { Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'
import UnauthorizedPage from '@/pages/UnauthorizedPage'
import DashboardPage from '@/pages/DashboardPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import FarmsListPage from '@/pages/farms/FarmsListPage'
import FarmDetailPage from '@/pages/farms/FarmDetailPage'
import ProfilePage from '@/pages/profile/ProfilePage'
import CropSuggestionPage from '@/pages/advisory/CropSuggestionPage'
import FertilizerRecommendationPage from '@/pages/advisory/FertilizerRecommendationPage'
import DiseaseReportsPage from '@/pages/diseaseReports/DiseaseReportsPage'
import DiseaseReportDetailPage from '@/pages/diseaseReports/DiseaseReportDetailPage'
import DiseaseQueuePage from '@/pages/expert/DiseaseQueuePage'
import ExpertsListPage from '@/pages/experts/ExpertsListPage'
import ExpertDetailPage from '@/pages/experts/ExpertDetailPage'
import ExpertProfilePage from '@/pages/experts/ExpertProfilePage'
import AppointmentsListPage from '@/pages/appointments/AppointmentsListPage'
import AppointmentDetailPage from '@/pages/appointments/AppointmentDetailPage'
import MarketplacePage from '@/pages/marketplace/MarketplacePage'
import ProductDetailPage from '@/pages/marketplace/ProductDetailPage'
import OrdersPage from '@/pages/orders/OrdersPage'
import OrderDetailPage from '@/pages/orders/OrderDetailPage'
import SellerProductsPage from '@/pages/seller/SellerProductsPage'
import SellerOrdersPage from '@/pages/seller/SellerOrdersPage'
import SchemesPage from '@/pages/schemes/SchemesPage'
import SchemeDetailPage from '@/pages/schemes/SchemeDetailPage'
import GovSchemesAdminPage from '@/pages/gov/GovSchemesAdminPage'
import AnalyticsPage from '@/pages/analytics/AnalyticsPage'
import AdminUsersPage from '@/pages/admin/AdminUsersPage'
import AdminAuditLogsPage from '@/pages/admin/AdminAuditLogsPage'
import ProtectedRoute from './ProtectedRoute'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/schemes" element={<SchemesPage />} />
        <Route path="/schemes/:id" element={<SchemeDetailPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['farmer']} />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/farms" element={<FarmsListPage />} />
        <Route path="/farms/:farmId" element={<FarmDetailPage />} />
        <Route path="/crop-suggestion" element={<CropSuggestionPage />} />
        <Route path="/fertilizer-recommendation" element={<FertilizerRecommendationPage />} />
        <Route path="/disease-reports" element={<DiseaseReportsPage />} />
        <Route path="/disease-reports/:id" element={<DiseaseReportDetailPage />} />
        <Route path="/experts" element={<ExpertsListPage />} />
        <Route path="/experts/:id" element={<ExpertDetailPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/marketplace/:id" element={<ProductDetailPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['expert', 'super_admin']} />}>
        <Route path="/expert/disease-queue" element={<DiseaseQueuePage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['expert']} />}>
        <Route path="/expert/profile" element={<ExpertProfilePage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['farmer', 'expert']} />}>
        <Route path="/appointments" element={<AppointmentsListPage />} />
        <Route path="/appointments/:id" element={<AppointmentDetailPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['seller']} />}>
        <Route path="/seller/products" element={<SellerProductsPage />} />
        <Route path="/seller/orders" element={<SellerOrdersPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['gov_admin', 'super_admin']} />}>
        <Route path="/admin/schemes" element={<GovSchemesAdminPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['super_admin']} />}>
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

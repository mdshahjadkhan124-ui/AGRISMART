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
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['farmer']} />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/farms" element={<FarmsListPage />} />
        <Route path="/farms/:farmId" element={<FarmDetailPage />} />
        <Route path="/crop-suggestion" element={<CropSuggestionPage />} />
        <Route path="/fertilizer-recommendation" element={<FertilizerRecommendationPage />} />
        <Route path="/disease-reports" element={<DiseaseReportsPage />} />
        <Route path="/disease-reports/:id" element={<DiseaseReportDetailPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['expert', 'super_admin']} />}>
        <Route path="/expert/disease-queue" element={<DiseaseQueuePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

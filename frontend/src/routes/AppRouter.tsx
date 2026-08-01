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
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sprout,
  User,
  Leaf,
  FlaskConical,
  Bug,
  Stethoscope,
  CalendarClock,
  Store,
  Package,
  Landmark,
  BarChart3,
} from 'lucide-react'
import { useAppSelector } from '@/app/hooks'
import { useMyAnalytics } from '@/features/analytics/hooks'
import type { FarmerAnalytics } from '@/features/analytics/types'
import { Button } from '@/components/ui/button'
import StatTile from '@/components/common/StatTile'
import QuickActionCard from '@/components/common/QuickActionCard'

const farmerActions = [
  { to: '/farms', title: 'My Farms', description: 'Manage your farm profiles and land records', icon: Sprout },
  { to: '/profile', title: 'My Profile', description: 'Update your personal and contact details', icon: User },
  {
    to: '/crop-suggestion',
    title: 'Crop Suggestion',
    description: 'Get AI-backed crop recommendations for your soil',
    icon: Leaf,
  },
  {
    to: '/fertilizer-recommendation',
    title: 'Fertilizer Recommendation',
    description: 'Optimal fertilizer dosage for your crop',
    icon: FlaskConical,
  },
  { to: '/disease-reports', title: 'Disease Reports', description: 'Report and track crop disease diagnoses', icon: Bug },
  { to: '/experts', title: 'Find an Expert', description: 'Book a consultation with an agri expert', icon: Stethoscope },
  {
    to: '/appointments',
    title: 'My Appointments',
    description: 'View upcoming and past consultations',
    icon: CalendarClock,
  },
  { to: '/marketplace', title: 'Marketplace', description: 'Browse seeds, tools and supplies', icon: Store },
  { to: '/orders', title: 'My Orders', description: 'Track your marketplace purchases', icon: Package },
  {
    to: '/schemes',
    title: 'Government Schemes',
    description: 'Explore schemes you may be eligible for',
    icon: Landmark,
  },
  { to: '/analytics', title: 'My Analytics', description: 'See trends across your farms and activity', icon: BarChart3 },
]

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user)

  if (!user) return null

  if (user.role === 'farmer') return <FarmerDashboard name={user.name} />

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">Quick links</h1>

      {user.role === 'expert' && (
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/appointments">Consultation Requests</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/expert/disease-queue">Disease Report Queue</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/expert/profile">My Expert Profile</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/analytics">My Analytics</Link>
          </Button>
        </div>
      )}

      {user.role === 'seller' && (
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/seller/products">My Products</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/seller/orders">Orders</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/analytics">My Analytics</Link>
          </Button>
        </div>
      )}

      {(user.role === 'gov_admin' || user.role === 'super_admin') && (
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/admin/schemes">Manage Schemes</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/schemes">View Schemes</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/analytics">Analytics</Link>
          </Button>
        </div>
      )}

      {user.role === 'super_admin' && (
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/admin/users">Manage Users</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/audit-logs">Audit Logs</Link>
          </Button>
        </div>
      )}

      {user.role === 'officer' && (
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/analytics">Regional Analytics</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

function FarmerDashboard({ name }: { name: string }) {
  const { data: analytics, isLoading } = useMyAnalytics()
  const stats = analytics?.data as FarmerAnalytics | undefined
  const firstName = name.split(' ')[0]

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 p-6 sm:p-8">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
          Welcome back, {firstName}
        </h1>
        <p className="text-muted-foreground mt-1">Here's what's happening across your farms today.</p>
      </motion.div>

      <motion.div className="grid grid-cols-1 gap-4 sm:grid-cols-3" variants={listVariants} initial="hidden" animate="show">
        <motion.div variants={itemVariants}>
          <StatTile label="Farms" value={isLoading ? '—' : (stats?.farmCount ?? 0)} icon={Sprout} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatTile label="Orders" value={isLoading ? '—' : (stats?.ordersCount ?? 0)} icon={Package} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatTile label="Appointments" value={isLoading ? '—' : (stats?.appointmentsCount ?? 0)} icon={CalendarClock} />
        </motion.div>
      </motion.div>

      <div>
        <h2 className="text-foreground mb-3 text-lg font-semibold">Quick actions</h2>
        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={listVariants}
          initial="hidden"
          animate="show"
        >
          {farmerActions.map((action) => (
            <motion.div key={action.to + action.title} variants={itemVariants}>
              <QuickActionCard {...action} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

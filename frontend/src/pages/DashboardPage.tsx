import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { logout } from '@/features/auth/authSlice'
import { Button } from '@/components/ui/button'
import type { Role } from '@/features/auth/types'

const roleLabels: Record<Role, string> = {
  farmer: 'Farmer',
  expert: 'Agricultural Expert',
  officer: 'Agricultural Officer',
  seller: 'Marketplace Seller',
  gov_admin: 'Government Administrator',
  super_admin: 'Super Administrator',
}

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)

  if (!user) return null

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome, {user.name}</h1>
          <p className="text-muted-foreground">
            Signed in as <span className="font-medium">{roleLabels[user.role]}</span>
          </p>
        </div>
        <Button variant="outline" onClick={() => dispatch(logout())}>
          Log out
        </Button>
      </div>

      {user.role === 'farmer' && (
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/farms">My Farms</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/profile">My Profile</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/crop-suggestion">Crop Suggestion</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/fertilizer-recommendation">Fertilizer Recommendation</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/disease-reports">Disease Reports</Link>
          </Button>
        </div>
      )}

      {user.role === 'expert' && (
        <div className="flex gap-3">
          <Button asChild>
            <Link to="/expert/disease-queue">Disease Report Queue</Link>
          </Button>
        </div>
      )}

      {user.role !== 'farmer' && user.role !== 'expert' && (
        <p className="text-muted-foreground text-sm">
          Role-specific features for {roleLabels[user.role]} land in the phases that follow.
        </p>
      )}
    </div>
  )
}

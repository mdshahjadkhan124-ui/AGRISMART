import { Link } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const isAuthenticated = useAppSelector((state) => state.auth.status === 'authenticated')

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-3xl font-semibold">AgriSmart</h1>
      <p className="text-muted-foreground max-w-md">
        A role-based agricultural advisory platform: rule-based crop and fertilizer guidance, soil health
        scoring, expert consultations, a marketplace, and government scheme discovery — all in one place.
      </p>
      <Button asChild>
        <Link to={isAuthenticated ? '/dashboard' : '/login'}>Get Started</Link>
      </Button>
      {!isAuthenticated && (
        <p className="text-muted-foreground text-sm">
          <Link to="/login" className="text-primary underline-offset-4 hover:underline">
            Log in
          </Link>{' '}
          or{' '}
          <Link to="/register" className="text-primary underline-offset-4 hover:underline">
            create an account
          </Link>
        </p>
      )}
    </div>
  )
}

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { login } from '@/features/auth/authSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SiteHeader from '@/components/layout/SiteHeader'
import GoogleSignInButton from '@/features/auth/GoogleSignInButton'

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { status, error } = useAppSelector((state) => state.auth)

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) })

  useEffect(() => {
    if (status === 'authenticated') {
      const redirectTo = location.state?.from ?? '/dashboard'
      navigate(redirectTo, { replace: true })
    }
  }, [status, navigate, location.state])

  const onSubmit = (values) => {
    dispatch(login(values))
  }

  return (
    <div className="bg-background min-h-svh">
      <SiteHeader />

      <div className="grid min-h-[calc(100svh-4rem)] lg:grid-cols-2">
        {/* Editorial topper panel */}
        <div className="bg-ink relative hidden flex-col justify-between overflow-hidden p-10 lg:flex xl:p-16">
          <p className="eyebrow text-white/50">AgriSmart Account</p>
          <div className="flex flex-col gap-6">
            <h1 className="headline max-w-md text-4xl text-white xl:text-5xl">
              Welcome back to your advisory workspace.
            </h1>
            <p className="max-w-sm text-base leading-relaxed text-white/60">
              Sign in to manage your farms, review recommendations, track orders, and stay connected with
              experts and schemes relevant to you.
            </p>
          </div>
          <div className="border-primary/60 border-l-2 pl-4">
            <p className="text-sm leading-relaxed text-white/50">
              &ldquo;Rule-based guidance grounded in soil health data, not guesswork.&rdquo;
            </p>
          </div>
        </div>

        {/* Form panel */}
        <div className="flex items-center justify-center px-4 py-16 sm:px-8">
          <div className="w-full max-w-sm">
            <p className="eyebrow text-primary">Sign In</p>
            <h2 className="headline text-foreground mt-2 text-3xl">Access your account</h2>
            <p className="text-muted-foreground mt-2 text-sm">Enter your credentials to continue.</p>

            <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" {...registerField('email')} />
                {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" autoComplete="current-password" {...registerField('password')} />
                {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button type="submit" disabled={status === 'loading'} size="lg" className="mt-2 w-full">
                {status === 'loading' ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="border-border h-px flex-1 border-t" />
              <span className="eyebrow">Or</span>
              <div className="border-border h-px flex-1 border-t" />
            </div>

            <GoogleSignInButton />

            <p className="text-muted-foreground mt-6 text-sm">
              No account?{' '}
              <Link to="/register" className="text-primary font-medium underline-offset-4 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

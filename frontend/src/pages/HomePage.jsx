import { Link } from 'react-router-dom'
import { Leaf, FlaskConical, Stethoscope, Store, Landmark, Bug, ArrowRight } from 'lucide-react'
import { useAppSelector } from '@/app/hooks'
import { Button } from '@/components/ui/button'
import SiteHeader from '@/components/layout/SiteHeader'

const pillars = [
  { icon: Leaf, label: 'Crop Suggestion' },
  { icon: FlaskConical, label: 'Fertilizer Guidance' },
  { icon: Bug, label: 'Disease Diagnosis' },
  { icon: Stethoscope, label: 'Expert Consultations' },
]

const offerings = [
  {
    icon: Leaf,
    title: 'Advisory',
    description: 'Rule-based crop and fertilizer recommendations calibrated to your soil health data.',
  },
  {
    icon: Stethoscope,
    title: 'Expert Network',
    description: 'Book consultations with verified agricultural experts for hands-on diagnosis and advice.',
  },
  {
    icon: Store,
    title: 'Marketplace',
    description: 'Source seeds, tools, and supplies directly from sellers, with orders tracked end to end.',
  },
  {
    icon: Landmark,
    title: 'Government Schemes',
    description: 'Discover and track eligibility for schemes relevant to your farm and region.',
  },
]

export default function HomePage() {
  const isAuthenticated = useAppSelector((state) => state.auth.status === 'authenticated')

  return (
    <div className="bg-background min-h-svh">
      <SiteHeader />

      <main>
        {/* Hero / topper */}
        <section className="border-border border-b">
          <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:py-24">
            <div className="flex flex-col justify-center gap-6 lg:col-span-7">
              <p className="eyebrow text-primary">Agricultural Advisory Platform</p>
              <h1 className="headline text-4xl sm:text-5xl lg:text-[3.4rem]">
                Evidence-based guidance for the modern farm.
              </h1>
              <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
                AgriSmart brings rule-based crop and fertilizer guidance, soil health scoring, expert
                consultations, a marketplace, and government scheme discovery together in one disciplined
                platform — built for farmers, experts, sellers, and officers alike.
              </p>
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <Button size="lg" asChild>
                  <Link to={isAuthenticated ? '/dashboard' : '/register'}>
                    {isAuthenticated ? 'Go to dashboard' : 'Get started'}
                  </Link>
                </Button>
                {!isAuthenticated && (
                  <Link
                    to="/login"
                    className="decoration-primary text-foreground hover:text-primary text-sm font-semibold underline decoration-2 underline-offset-4 transition-colors"
                  >
                    Sign in to your account
                  </Link>
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="border-border bg-surface relative grid h-full grid-cols-2 grid-rows-2 gap-px border">
                {pillars.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="bg-card flex flex-col justify-between gap-6 p-6 sm:p-8"
                  >
                    <Icon className="text-primary size-7" strokeWidth={1.5} />
                    <p className="text-foreground text-sm font-semibold tracking-tight">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Offerings */}
        <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
          <div className="mb-12 flex flex-col gap-3 sm:mb-16">
            <p className="eyebrow text-primary">What AgriSmart Offers</p>
            <h2 className="headline text-foreground text-3xl sm:text-4xl">
              One platform, every stage of the season.
            </h2>
          </div>

          <div className="border-border grid grid-cols-1 border-t sm:grid-cols-2 lg:grid-cols-4">
            {offerings.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="border-border flex flex-col gap-4 border-r border-b p-8 first:sm:border-l"
              >
                <Icon className="text-primary size-6" strokeWidth={1.5} />
                <h3 className="text-foreground text-lg font-semibold tracking-tight">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        {!isAuthenticated && (
          <section className="bg-ink border-border border-t">
            <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
              <h2 className="headline max-w-xl text-3xl text-white sm:text-4xl">
                Create your account and get advisory guidance today.
              </h2>
              <div className="flex flex-wrap items-center gap-6">
                <Button size="lg" asChild>
                  <Link to="/register">Create account</Link>
                </Button>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-sm font-semibold text-white/80 transition-colors hover:text-white"
                >
                  Log in <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="border-border border-t">
        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">
          <p className="text-muted-foreground text-xs tracking-wide">
            &copy; {new Date().getFullYear()} AgriSmart. Agricultural advisory platform.
          </p>
        </div>
      </footer>
    </div>
  )
}

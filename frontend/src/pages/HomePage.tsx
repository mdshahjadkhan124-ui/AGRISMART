import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-3xl font-semibold">AgriSmart</h1>
      <p className="text-muted-foreground max-w-md">
        Smart Crop Advisory System — scaffolding is live. Backend, database, and
        feature modules land in the phases that follow.
      </p>
      <Button>Get Started</Button>
    </div>
  )
}

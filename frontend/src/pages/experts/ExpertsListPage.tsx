import { Link } from 'react-router-dom'
import { useExperts } from '@/features/experts/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function ExpertsListPage() {
  const { data: experts, isLoading } = useExperts()

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold">Find an Expert</h1>
        <p className="text-muted-foreground text-sm">Browse agricultural experts and book a consultation.</p>
      </div>

      {isLoading && <p className="text-muted-foreground text-sm">Loading experts…</p>}
      {experts && experts.length === 0 && <p className="text-muted-foreground text-sm">No experts available yet.</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        {experts?.map((expert) => (
          <Link key={expert._id} to={`/experts/${expert._id}`}>
            <Card className="hover:border-primary transition-colors">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base">{expert.user.name}</CardTitle>
                {expert.isAvailable ? (
                  <Badge>Available</Badge>
                ) : (
                  <Badge variant="secondary">Unavailable</Badge>
                )}
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <p className="text-muted-foreground text-sm">
                  {expert.specialization || 'General agricultural expert'} · {expert.experienceYears} yrs experience
                </p>
                <Badge variant="secondary" className="w-fit">
                  Free · Government subsidized
                </Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

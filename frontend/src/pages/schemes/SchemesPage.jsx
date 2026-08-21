import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSchemes } from '@/features/schemes/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export default function SchemesPage() {
  const [search, setSearch] = useState('')
  const { data: schemes, isLoading } = useSchemes({ search: search || undefined })

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold">Government Schemes</h1>
        <p className="text-muted-foreground text-sm">Subsidies, loans, insurance, and training programs for farmers.</p>
      </div>

      <Input placeholder="Search schemes…" value={search} onChange={(e) => setSearch(e.target.value)} />

      {isLoading && <p className="text-muted-foreground text-sm">Loading schemes…</p>}
      {schemes && schemes.length === 0 && <p className="text-muted-foreground text-sm">No schemes found.</p>}

      <div className="flex flex-col gap-3">
        {schemes?.map((scheme) => (
          <Link key={scheme._id} to={`/schemes/${scheme._id}`}>
            <Card className="hover:border-primary transition-colors">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base">{scheme.title}</CardTitle>
                <Badge variant="secondary">{scheme.category}</Badge>
              </CardHeader>
              <CardContent className="text-muted-foreground line-clamp-2 text-sm">{scheme.description}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

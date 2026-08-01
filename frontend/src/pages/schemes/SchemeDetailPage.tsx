import { useParams } from 'react-router-dom'
import { useScheme } from '@/features/schemes/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function SchemeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: scheme, isLoading } = useScheme(id as string)

  if (isLoading) return <p className="text-muted-foreground p-8 text-sm">Loading scheme…</p>
  if (!scheme) return <p className="text-muted-foreground p-8 text-sm">Scheme not found.</p>

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 p-8">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-semibold">{scheme.title}</h1>
        <Badge variant="secondary">{scheme.category}</Badge>
      </div>
      <p className="text-muted-foreground text-sm">{scheme.state}</p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Description</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">{scheme.description}</CardContent>
      </Card>

      {scheme.eligibility && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Eligibility</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">{scheme.eligibility}</CardContent>
        </Card>
      )}

      {scheme.applicationLink && (
        <Button asChild>
          <a href={scheme.applicationLink} target="_blank" rel="noreferrer">
            Apply
          </a>
        </Button>
      )}
    </div>
  )
}

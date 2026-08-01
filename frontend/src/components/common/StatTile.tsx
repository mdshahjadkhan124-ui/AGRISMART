import { Card, CardContent } from '@/components/ui/card'

interface StatTileProps {
  label: string
  value: string | number
}

export default function StatTile({ label, value }: StatTileProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-muted-foreground text-sm">{label}</p>
      </CardContent>
    </Card>
  )
}

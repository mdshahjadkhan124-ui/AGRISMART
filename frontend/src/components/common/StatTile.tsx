import type { LucideIcon } from 'lucide-react'

interface StatTileProps {
  label: string
  value: string | number
  icon?: LucideIcon
}

export default function StatTile({ label, value, icon: Icon }: StatTileProps) {
  return (
    <div className="border-t-2 border-primary bg-card px-5 py-6">
      <div className="flex items-start justify-between gap-3">
        <p className="text-4xl font-bold tracking-tight text-foreground tabular-nums sm:text-5xl">{value}</p>
        {Icon && <Icon className="mt-1 size-5 shrink-0 text-muted-foreground" />}
      </div>
      <p className="eyebrow mt-2">{label}</p>
    </div>
  )
}

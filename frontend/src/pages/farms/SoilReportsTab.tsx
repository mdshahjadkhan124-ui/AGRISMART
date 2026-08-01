import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAddSoilReport, useLatestSoilReport, useSoilReports } from '@/features/farms/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { SoilHealthLabel } from '@/features/farms/types'

const soilReportSchema = z.object({
  nitrogen: z.coerce.number().min(0),
  phosphorus: z.coerce.number().min(0),
  potassium: z.coerce.number().min(0),
  ph: z.coerce.number().min(0).max(14),
  organicCarbon: z.coerce.number().min(0).max(100).optional(),
  moisturePercent: z.coerce.number().min(0).max(100).optional(),
})

type SoilReportInput = z.input<typeof soilReportSchema>
type SoilReportValues = z.output<typeof soilReportSchema>

const labelVariant: Record<SoilHealthLabel, 'default' | 'secondary' | 'destructive'> = {
  Excellent: 'default',
  Good: 'default',
  Fair: 'secondary',
  Poor: 'destructive',
}

export default function SoilReportsTab({ farmId }: { farmId: string }) {
  const latest = useLatestSoilReport(farmId)
  const history = useSoilReports(farmId)
  const addReport = useAddSoilReport(farmId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SoilReportInput, unknown, SoilReportValues>({ resolver: zodResolver(soilReportSchema) })

  const onSubmit = (values: SoilReportValues) => {
    addReport.mutate(values, { onSuccess: () => reset() })
  }

  return (
    <div className="flex flex-col gap-4 pt-4">
      {latest.data && (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Latest soil health</CardTitle>
            <Badge variant={labelVariant[latest.data.healthLabel]}>
              {latest.data.healthLabel} ({latest.data.healthScore}/100)
            </Badge>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground list-inside list-disc text-sm">
              {latest.data.recommendations.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Log a soil test</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nitrogen">Nitrogen (kg/ha)</Label>
              <Input id="nitrogen" type="number" step="0.1" {...register('nitrogen')} />
              {errors.nitrogen && <p className="text-destructive text-sm">{errors.nitrogen.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phosphorus">Phosphorus (kg/ha)</Label>
              <Input id="phosphorus" type="number" step="0.1" {...register('phosphorus')} />
              {errors.phosphorus && <p className="text-destructive text-sm">{errors.phosphorus.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="potassium">Potassium (kg/ha)</Label>
              <Input id="potassium" type="number" step="0.1" {...register('potassium')} />
              {errors.potassium && <p className="text-destructive text-sm">{errors.potassium.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ph">pH</Label>
              <Input id="ph" type="number" step="0.1" {...register('ph')} />
              {errors.ph && <p className="text-destructive text-sm">{errors.ph.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="organicCarbon">Organic carbon % (optional)</Label>
              <Input id="organicCarbon" type="number" step="0.01" {...register('organicCarbon')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="moisturePercent">Moisture % (optional)</Label>
              <Input id="moisturePercent" type="number" step="0.1" {...register('moisturePercent')} />
            </div>
            {addReport.isError && (
              <p className="text-destructive col-span-2 text-sm">Couldn't save the report. Check your inputs.</p>
            )}
            <Button type="submit" className="col-span-2" disabled={addReport.isPending}>
              {addReport.isPending ? 'Saving…' : 'Save soil report'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {history.data && history.data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">History</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {history.data.map((report) => (
              <div key={report._id} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{new Date(report.testedAt).toLocaleDateString()}</span>
                <Badge variant={labelVariant[report.healthLabel]}>
                  {report.healthLabel} ({report.healthScore})
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

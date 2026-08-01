import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateFertilizerRecommendation } from '@/features/fertilizer/hooks'
import { useFarms } from '@/features/farms/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { NutrientLevel } from '@/features/fertilizer/types'

const schema = z
  .object({
    farmId: z.string().trim().optional(),
    nitrogen: z.coerce.number().min(0).optional(),
    phosphorus: z.coerce.number().min(0).optional(),
    potassium: z.coerce.number().min(0).optional(),
    ph: z.coerce.number().min(0).max(14).optional(),
  })
  .refine((data) => Boolean(data.farmId) || [data.nitrogen, data.phosphorus, data.potassium, data.ph].every((v) => v != null), {
    message: 'Pick a farm, or enter nitrogen, phosphorus, potassium, and pH directly.',
    path: ['farmId'],
  })

type FormInput = z.input<typeof schema>
type FormValues = z.output<typeof schema>

const levelVariant: Record<NutrientLevel, 'default' | 'secondary' | 'destructive'> = {
  Low: 'destructive',
  Medium: 'secondary',
  High: 'default',
}

export default function FertilizerRecommendationPage() {
  const { data: farms } = useFarms()
  const createRecommendation = useCreateFertilizerRecommendation()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormInput, unknown, FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = (values: FormValues) => {
    createRecommendation.mutate(values)
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold">Fertilizer Recommendation</h1>
        <p className="text-muted-foreground text-sm">
          Pick a farm to use its latest soil report, or enter nutrient levels directly, to get a fertilizer and
          dosage recommendation.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            {farms && farms.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <Label>Use a farm's latest soil report (optional)</Label>
                <Select value={watch('farmId') ?? ''} onValueChange={(v) => setValue('farmId', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="None — enter values manually" />
                  </SelectTrigger>
                  <SelectContent>
                    {farms.map((farm) => (
                      <SelectItem key={farm._id} value={farm._id}>
                        {farm.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nitrogen">Nitrogen (kg/ha)</Label>
                <Input id="nitrogen" type="number" step="0.1" {...register('nitrogen')} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phosphorus">Phosphorus (kg/ha)</Label>
                <Input id="phosphorus" type="number" step="0.1" {...register('phosphorus')} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="potassium">Potassium (kg/ha)</Label>
                <Input id="potassium" type="number" step="0.1" {...register('potassium')} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ph">Soil pH</Label>
                <Input id="ph" type="number" step="0.1" {...register('ph')} />
              </div>
            </div>
            {errors.farmId && <p className="text-destructive text-sm">{errors.farmId.message}</p>}
            {createRecommendation.isError && (
              <p className="text-destructive text-sm">Couldn't generate a recommendation. Check your inputs.</p>
            )}
            <Button type="submit" disabled={createRecommendation.isPending}>
              {createRecommendation.isPending ? 'Calculating…' : 'Get recommendation'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {createRecommendation.data && (
        <div className="flex flex-col gap-3">
          {(['nitrogen', 'phosphorus', 'potassium'] as const).map((key) => {
            const rec = createRecommendation.data.nutrients[key]
            return (
              <Card key={key}>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="text-base capitalize">{key}</CardTitle>
                  <Badge variant={levelVariant[rec.level]}>{rec.level}</Badge>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                  {rec.dosageKgPerAcre > 0 ? (
                    <p>
                      Apply <span className="text-foreground font-medium">{rec.fertilizer}</span> —{' '}
                      {rec.dosageKgPerAcre} kg/acre
                    </p>
                  ) : (
                    <p className="text-foreground font-medium">No fertilizer needed</p>
                  )}
                  <p className="mt-1">{rec.note}</p>
                </CardContent>
              </Card>
            )
          })}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Soil pH</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              {createRecommendation.data.phAmendment.dosageKgPerAcre > 0 ? (
                <p>
                  Apply <span className="text-foreground font-medium">{createRecommendation.data.phAmendment.amendment}</span>{' '}
                  — {createRecommendation.data.phAmendment.dosageKgPerAcre} kg/acre
                </p>
              ) : (
                <p className="text-foreground font-medium">No amendment needed</p>
              )}
              <p className="mt-1">{createRecommendation.data.phAmendment.note}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

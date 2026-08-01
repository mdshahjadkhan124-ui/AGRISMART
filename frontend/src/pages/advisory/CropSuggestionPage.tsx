import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateCropSuggestion } from '@/features/cropSuggestion/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const schema = z.object({
  n: z.coerce.number().min(0),
  p: z.coerce.number().min(0),
  k: z.coerce.number().min(0),
  temperature: z.coerce.number().min(-10).max(60),
  humidity: z.coerce.number().min(0).max(100),
  ph: z.coerce.number().min(0).max(14),
  rainfall: z.coerce.number().min(0),
})

type FormInput = z.input<typeof schema>
type FormValues = z.output<typeof schema>

function scoreVariant(score: number): 'default' | 'secondary' | 'destructive' {
  if (score >= 70) return 'default'
  if (score >= 40) return 'secondary'
  return 'destructive'
}

export default function CropSuggestionPage() {
  const createSuggestion = useCreateCropSuggestion()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput, unknown, FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = (values: FormValues) => {
    createSuggestion.mutate(values)
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold">Crop Suggestion</h1>
        <p className="text-muted-foreground text-sm">
          Enter your soil and climate readings to see which crops suit your conditions best, ranked by a
          rule-based match against known crop requirements.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="n">Nitrogen (kg/ha)</Label>
              <Input id="n" type="number" step="0.1" {...register('n')} />
              {errors.n && <p className="text-destructive text-sm">{errors.n.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="p">Phosphorus (kg/ha)</Label>
              <Input id="p" type="number" step="0.1" {...register('p')} />
              {errors.p && <p className="text-destructive text-sm">{errors.p.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="k">Potassium (kg/ha)</Label>
              <Input id="k" type="number" step="0.1" {...register('k')} />
              {errors.k && <p className="text-destructive text-sm">{errors.k.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ph">Soil pH</Label>
              <Input id="ph" type="number" step="0.1" {...register('ph')} />
              {errors.ph && <p className="text-destructive text-sm">{errors.ph.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="temperature">Avg. temperature (°C)</Label>
              <Input id="temperature" type="number" step="0.1" {...register('temperature')} />
              {errors.temperature && <p className="text-destructive text-sm">{errors.temperature.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="humidity">Avg. humidity (%)</Label>
              <Input id="humidity" type="number" step="0.1" {...register('humidity')} />
              {errors.humidity && <p className="text-destructive text-sm">{errors.humidity.message}</p>}
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="rainfall">Seasonal rainfall (mm)</Label>
              <Input id="rainfall" type="number" step="0.1" {...register('rainfall')} />
              {errors.rainfall && <p className="text-destructive text-sm">{errors.rainfall.message}</p>}
            </div>
            {createSuggestion.isError && (
              <p className="text-destructive col-span-2 text-sm">Couldn't generate suggestions. Check your inputs.</p>
            )}
            <Button type="submit" className="col-span-2" disabled={createSuggestion.isPending}>
              {createSuggestion.isPending ? 'Matching…' : 'Suggest crops'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {createSuggestion.data && (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-medium">Top matches</h2>
          {createSuggestion.data.results.map((result) => (
            <Card key={result.cropName}>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base">
                  {result.cropName} <span className="text-muted-foreground font-normal">· {result.season}</span>
                </CardTitle>
                <Badge variant={scoreVariant(result.score)}>{result.score}% match</Badge>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                <p>
                  Water need: {result.waterRequirement} · Expected yield: {result.expectedYieldPerAcre}/acre · Est.
                  profit: ₹{result.expectedProfitPerAcreInr.toLocaleString('en-IN')}/acre
                </p>
                {result.outOfRangeFactors.length > 0 && (
                  <p className="mt-1">Outside ideal range: {result.outOfRangeFactors.join(', ')}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

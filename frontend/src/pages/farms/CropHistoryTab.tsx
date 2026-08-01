import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAddCropHistory, useCropHistory } from '@/features/farms/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const seasons = ['kharif', 'rabi', 'zaid', 'perennial'] as const

const cropHistorySchema = z.object({
  cropName: z.string().trim().min(1, 'Crop name is required').max(100),
  season: z.enum(seasons),
  sowingDate: z.string().optional(),
  harvestDate: z.string().optional(),
  yieldQuantityKg: z.coerce.number().min(0).optional(),
  notes: z.string().trim().max(500).optional(),
})

type CropHistoryInput = z.input<typeof cropHistorySchema>
type CropHistoryValues = z.output<typeof cropHistorySchema>

export default function CropHistoryTab({ farmId }: { farmId: string }) {
  const { data: entries, isLoading } = useCropHistory(farmId)
  const addEntry = useAddCropHistory(farmId)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CropHistoryInput, unknown, CropHistoryValues>({
    resolver: zodResolver(cropHistorySchema),
    defaultValues: { season: 'kharif' },
  })

  const onSubmit = (values: CropHistoryValues) => {
    addEntry.mutate(values, { onSuccess: () => reset() })
  }

  return (
    <div className="flex flex-col gap-4 pt-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add a past crop</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cropName">Crop</Label>
                <Input id="cropName" {...register('cropName')} />
                {errors.cropName && <p className="text-destructive text-sm">{errors.cropName.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Season</Label>
                <Select value={watch('season')} onValueChange={(v) => setValue('season', v as CropHistoryValues['season'])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {seasons.map((season) => (
                      <SelectItem key={season} value={season}>
                        {season}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sowingDate">Sowing date</Label>
                <Input id="sowingDate" type="date" {...register('sowingDate')} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="harvestDate">Harvest date</Label>
                <Input id="harvestDate" type="date" {...register('harvestDate')} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="yieldQuantityKg">Yield (kg, optional)</Label>
                <Input id="yieldQuantityKg" type="number" step="0.1" {...register('yieldQuantityKg')} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" rows={2} {...register('notes')} />
            </div>
            {addEntry.isError && <p className="text-destructive text-sm">Couldn't save this entry. Try again.</p>}
            <Button type="submit" disabled={addEntry.isPending}>
              {addEntry.isPending ? 'Saving…' : 'Add to history'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && <p className="text-muted-foreground text-sm">Loading crop history…</p>}
      {entries && entries.length === 0 && <p className="text-muted-foreground text-sm">No crop history yet.</p>}

      {entries?.map((entry) => (
        <Card key={entry._id}>
          <CardHeader>
            <CardTitle className="text-base">
              {entry.cropName} · <span className="text-muted-foreground font-normal capitalize">{entry.season}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            {entry.sowingDate && <>Sown {new Date(entry.sowingDate).toLocaleDateString()} </>}
            {entry.harvestDate && <>· Harvested {new Date(entry.harvestDate).toLocaleDateString()} </>}
            {entry.yieldQuantityKg != null && <>· Yield {entry.yieldQuantityKg} kg</>}
            {entry.notes && <p className="mt-1">{entry.notes}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

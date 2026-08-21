import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useFarms, useCreateFarm } from '@/features/farms/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const soilTypes = ['alluvial', 'black', 'red', 'laterite', 'arid', 'saline', 'peaty', 'forest', 'other']
const irrigationTypes = ['canal', 'borewell', 'drip', 'sprinkler', 'rainfed', 'other']

const createFarmSchema = z.object({
  name: z.string().trim().min(1, 'Farm name is required').max(100),
  areaAcres: z.coerce.number().positive('Area must be greater than 0'),
  soilType: z.enum(soilTypes),
  irrigationType: z.enum(irrigationTypes),
})

export default function FarmsListPage() {
  const [showForm, setShowForm] = useState(false)
  const { data: farms, isLoading } = useFarms()
  const createFarm = useCreateFarm()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createFarmSchema),
    defaultValues: { soilType: 'other', irrigationType: 'rainfed' },
  })

  const onSubmit = (values) => {
    createFarm.mutate(values, {
      onSuccess: () => {
        reset()
        setShowForm(false)
      },
    })
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Farms</h1>
        <Button onClick={() => setShowForm((v) => !v)}>{showForm ? 'Cancel' : 'Add Farm'}</Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">New farm</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Farm name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="areaAcres">Area (acres)</Label>
                <Input id="areaAcres" type="number" step="0.01" {...register('areaAcres')} />
                {errors.areaAcres && <p className="text-destructive text-sm">{errors.areaAcres.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Soil type</Label>
                <Select value={watch('soilType')} onValueChange={(v) => setValue('soilType', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {soilTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Irrigation type</Label>
                <Select
                  value={watch('irrigationType')}
                  onValueChange={(v) => setValue('irrigationType', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {irrigationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {createFarm.isError && <p className="text-destructive text-sm">Couldn't create the farm. Try again.</p>}
              <Button type="submit" disabled={createFarm.isPending}>
                {createFarm.isPending ? 'Creating…' : 'Create farm'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading && <p className="text-muted-foreground text-sm">Loading farms…</p>}

      {farms && farms.length === 0 && (
        <p className="text-muted-foreground text-sm">No farms yet — add your first one above.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {farms?.map((farm) => (
          <Link key={farm._id} to={`/farms/${farm._id}`}>
            <Card className="hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="text-base">{farm.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                {farm.areaAcres} acres · {farm.soilType} soil · {farm.irrigationType} irrigation
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useActivities, useAddActivity, useDeleteActivity } from '@/features/farms/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const activityTypes = [
  'sowing',
  'irrigation',
  'fertilizing',
  'pesticide_spray',
  'weeding',
  'harvesting',
  'soil_testing',
  'other',
] as const

const activitySchema = z.object({
  activityType: z.enum(activityTypes),
  title: z.string().trim().min(1, 'Title is required').max(150),
  description: z.string().trim().max(1000).optional(),
  date: z.string().optional(),
  costInr: z.coerce.number().min(0).optional(),
})

type ActivityInput = z.input<typeof activitySchema>
type ActivityValues = z.output<typeof activitySchema>

export default function ActivitiesTab({ farmId }: { farmId: string }) {
  const { data: activities, isLoading } = useActivities(farmId)
  const addActivity = useAddActivity(farmId)
  const deleteActivity = useDeleteActivity(farmId)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ActivityInput, unknown, ActivityValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: { activityType: 'other' },
  })

  const onSubmit = (values: ActivityValues) => {
    addActivity.mutate(values, { onSuccess: () => reset() })
  }

  return (
    <div className="flex flex-col gap-4 pt-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Log an activity</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Type</Label>
                <Select
                  value={watch('activityType')}
                  onValueChange={(v) => setValue('activityType', v as ActivityValues['activityType'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" {...register('date')} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register('title')} />
              {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Notes (optional)</Label>
              <Textarea id="description" rows={2} {...register('description')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="costInr">Cost in ₹ (optional)</Label>
              <Input id="costInr" type="number" step="0.01" {...register('costInr')} />
            </div>
            {addActivity.isError && <p className="text-destructive text-sm">Couldn't log this activity. Try again.</p>}
            <Button type="submit" disabled={addActivity.isPending}>
              {addActivity.isPending ? 'Saving…' : 'Log activity'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && <p className="text-muted-foreground text-sm">Loading activities…</p>}
      {activities && activities.length === 0 && <p className="text-muted-foreground text-sm">No activities logged yet.</p>}

      {activities?.map((activity) => (
        <Card key={activity._id}>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">
              {activity.title}{' '}
              <span className="text-muted-foreground font-normal capitalize">· {activity.activityType.replace('_', ' ')}</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteActivity.mutate(activity._id)}
              disabled={deleteActivity.isPending}
            >
              Delete
            </Button>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            {new Date(activity.date).toLocaleDateString()}
            {activity.costInr != null && <> · ₹{activity.costInr}</>}
            {activity.description && <p className="mt-1">{activity.description}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

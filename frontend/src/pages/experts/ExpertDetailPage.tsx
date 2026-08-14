import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useParams } from 'react-router-dom'
import { useExpert } from '@/features/experts/hooks'
import { useBookAppointment } from '@/features/appointments/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const meetingTypes = ['chat', 'audio', 'video'] as const

const bookingSchema = z.object({
  requestedDate: z.string().min(1, 'Pick a date and time'),
  meetingType: z.enum(meetingTypes),
  reason: z.string().trim().min(1, 'Describe what you need help with').max(1000),
})

type BookingValues = z.infer<typeof bookingSchema>

export default function ExpertDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: expert, isLoading } = useExpert(id as string)
  const bookAppointment = useBookAppointment()
  const [booked, setBooked] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingValues>({ resolver: zodResolver(bookingSchema), defaultValues: { meetingType: 'chat' } })

  if (isLoading) return <p className="text-muted-foreground p-8 text-sm">Loading expert…</p>
  if (!expert) return <p className="text-muted-foreground p-8 text-sm">Expert not found.</p>

  const onSubmit = (values: BookingValues) => {
    bookAppointment.mutate(
      { expertId: expert.user._id, requestedDate: new Date(values.requestedDate).toISOString(), reason: values.reason, meetingType: values.meetingType },
      { onSuccess: () => setBooked(true) }
    )
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold">{expert.user.name}</h1>
        <p className="text-muted-foreground text-sm">
          {expert.specialization || 'General agricultural expert'} · {expert.experienceYears} yrs experience
          {expert.consultationFeeInr > 0 && <> · ₹{expert.consultationFeeInr}/session</>}
        </p>
      </div>

      {expert.bio && (
        <Card>
          <CardContent className="text-muted-foreground pt-6 text-sm">{expert.bio}</CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Book a consultation</CardTitle>
        </CardHeader>
        <CardContent>
          {booked ? (
            <p className="text-sm text-green-600 dark:text-green-500">
              Request sent — you'll see it under "My Appointments" once the expert responds.
            </p>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="requestedDate">Preferred date & time</Label>
                <Input id="requestedDate" type="datetime-local" {...register('requestedDate')} />
                {errors.requestedDate && <p className="text-destructive text-sm">{errors.requestedDate.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Meeting type</Label>
                <Select value={watch('meetingType')} onValueChange={(v) => setValue('meetingType', v as BookingValues['meetingType'])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {meetingTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="reason">What do you need help with?</Label>
                <Textarea id="reason" rows={3} {...register('reason')} />
                {errors.reason && <p className="text-destructive text-sm">{errors.reason.message}</p>}
              </div>
              {bookAppointment.isError && (
                <p className="text-destructive text-sm">Couldn't book the appointment. Try again.</p>
              )}
              <Button type="submit" disabled={bookAppointment.isPending}>
                {bookAppointment.isPending ? 'Requesting…' : 'Request appointment'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { useMyAppointments } from '@/features/appointments/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { AppointmentStatus } from '@/features/appointments/types'

const statusVariant: Record<AppointmentStatus, 'secondary' | 'default' | 'destructive'> = {
  pending: 'secondary',
  confirmed: 'default',
  completed: 'default',
  rejected: 'destructive',
  cancelled: 'destructive',
}

export default function AppointmentsListPage() {
  const role = useAppSelector((state) => state.auth.user?.role)
  const { data: appointments, isLoading } = useMyAppointments()

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold">{role === 'expert' ? 'Consultation Requests' : 'My Appointments'}</h1>
        <p className="text-muted-foreground text-sm">
          {role === 'expert' ? 'Farmers waiting for your response.' : 'Your booked expert consultations.'}
        </p>
      </div>

      {isLoading && <p className="text-muted-foreground text-sm">Loading…</p>}
      {appointments && appointments.length === 0 && <p className="text-muted-foreground text-sm">Nothing here yet.</p>}

      <div className="flex flex-col gap-3">
        {appointments?.map((appointment) => (
          <Link key={appointment._id} to={`/appointments/${appointment._id}`}>
            <Card className="hover:border-primary transition-colors">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base">
                  {role === 'expert' ? appointment.farmer.name : appointment.expert.name}
                </CardTitle>
                <Badge variant={statusVariant[appointment.status]}>{appointment.status}</Badge>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                {new Date(appointment.requestedDate).toLocaleString()} · {appointment.meetingType}
                <p className="mt-1 line-clamp-1">{appointment.reason}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

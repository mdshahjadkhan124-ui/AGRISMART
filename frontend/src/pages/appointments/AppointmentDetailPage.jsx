import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import {
  useAppointment,
  useCallInfo,
  useMessages,
  useSendMessage,
  useTypingIndicator,
  useUpdateAppointmentStatus,
} from '@/features/appointments/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const statusVariant = {
  pending: 'secondary',
  confirmed: 'default',
  completed: 'default',
  rejected: 'destructive',
  cancelled: 'destructive',
}

function ChatPanel({ appointmentId }) {
  const userId = useAppSelector((state) => state.auth.user?.id)
  const { data: messages } = useMessages(appointmentId)
  const sendMessage = useSendMessage(appointmentId)
  const { otherTyping, notifyTyping } = useTypingIndicator(appointmentId)
  const [text, setText] = useState('')

  const onSend = () => {
    if (!text.trim()) return
    sendMessage.mutate(text, { onSuccess: () => setText('') })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex max-h-72 flex-col gap-2 overflow-y-auto">
          {messages?.length === 0 && <p className="text-muted-foreground text-sm">No messages yet.</p>}
          {messages?.map((message) => (
            <div
              key={message._id}
              className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                message.sender === userId ? 'bg-primary text-primary-foreground self-end' : 'bg-muted self-start'
              }`}
            >
              {message.text}
            </div>
          ))}
          {otherTyping && <p className="text-muted-foreground text-xs">Typing…</p>}
        </div>
        <div className="flex gap-2">
          <Input
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              notifyTyping()
            }}
            onKeyDown={(e) => e.key === 'Enter' && onSend()}
            placeholder="Type a message…"
          />
          <Button onClick={onSend} disabled={sendMessage.isPending}>
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function CallPanel({ appointmentId }) {
  const [show, setShow] = useState(false)
  const { data: call } = useCallInfo(appointmentId)

  if (!show) {
    return (
      <Button variant="outline" onClick={() => setShow(true)}>
        Start {call?.meetingType ?? ''} call
      </Button>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Call</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        <p>Room: {call?.roomId}</p>
        <p className="mt-1">{call?.note}</p>
      </CardContent>
    </Card>
  )
}

export default function AppointmentDetailPage() {
  const { id } = useParams()
  const role = useAppSelector((state) => state.auth.user?.role)
  const { data: appointment, isLoading } = useAppointment(id)
  const updateStatus = useUpdateAppointmentStatus(id)

  if (isLoading) return <p className="text-muted-foreground p-8 text-sm">Loading…</p>
  if (!appointment) return <p className="text-muted-foreground p-8 text-sm">Appointment not found.</p>

  const isExpert = role === 'expert'
  const canAct = appointment.status === 'pending' || appointment.status === 'confirmed'

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{isExpert ? appointment.farmer.name : appointment.expert.name}</h1>
          <p className="text-muted-foreground text-sm">
            {new Date(appointment.requestedDate).toLocaleString()} · {appointment.meetingType}
          </p>
        </div>
        <Badge variant={statusVariant[appointment.status]}>{appointment.status}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reason</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">{appointment.reason}</CardContent>
      </Card>

      {appointment.expertNotes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Expert notes</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">{appointment.expertNotes}</CardContent>
        </Card>
      )}

      {canAct && (
        <div className="flex flex-wrap gap-2">
          {appointment.status === 'pending' && isExpert && (
            <>
              <Button onClick={() => updateStatus.mutate({ status: 'confirmed' })} disabled={updateStatus.isPending}>
                Confirm
              </Button>
              <Button
                variant="outline"
                onClick={() => updateStatus.mutate({ status: 'rejected' })}
                disabled={updateStatus.isPending}
              >
                Decline
              </Button>
            </>
          )}
          {appointment.status === 'confirmed' && isExpert && (
            <Button onClick={() => updateStatus.mutate({ status: 'completed' })} disabled={updateStatus.isPending}>
              Mark completed
            </Button>
          )}
          {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
            <Button
              variant="outline"
              onClick={() => updateStatus.mutate({ status: 'cancelled' })}
              disabled={updateStatus.isPending}
            >
              Cancel
            </Button>
          )}
        </div>
      )}

      {(appointment.status === 'confirmed' || appointment.status === 'completed') && (
        <>
          <CallPanel appointmentId={appointment._id} />
          <ChatPanel appointmentId={appointment._id} />
        </>
      )}
    </div>
  )
}

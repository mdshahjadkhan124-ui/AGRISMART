import { useEffect, useRef, useState } from 'react'
import { useAppDispatch } from '@/app/hooks'
import { useMutationCompat } from '@/app/rtkQueryCompat'
import { getSocket } from '@/lib/socket'
import {
  appointmentsApi,
  useBookAppointmentMutation,
  useGetMyAppointmentsQuery,
  useGetAppointmentQuery,
  useUpdateAppointmentStatusMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
  useGetCallInfoQuery,
} from './api'

export function useMyAppointments() {
  return useGetMyAppointmentsQuery()
}

export function useAppointment(id) {
  return useGetAppointmentQuery(id, { skip: !id })
}

export function useBookAppointment() {
  return useMutationCompat(useBookAppointmentMutation())
}

export function useUpdateAppointmentStatus(id) {
  const [trigger, state] = useUpdateAppointmentStatusMutation()
  return useMutationCompat([(arg) => trigger({ id, ...arg }), state])
}

// Joins the appointment's chat room over the socket (server re-checks
// ownership on every join) and appends messages pushed in real time.
// Falls back to a slow poll in case the socket isn't connected — the REST
// endpoint stays the source of truth either way.
export function useMessages(appointmentId) {
  const dispatch = useAppDispatch()
  const query = useGetMessagesQuery(appointmentId, { skip: !appointmentId, pollingInterval: 15000 })

  useEffect(() => {
    if (!appointmentId) return
    const socket = getSocket()
    if (!socket) return

    socket.emit('chat:join', appointmentId)

    const onMessage = (message) => {
      if (message.appointment !== appointmentId) return
      dispatch(
        appointmentsApi.util.updateQueryData('getMessages', appointmentId, (current) => {
          if (current.some((m) => m._id === message._id)) return
          current.push(message)
        })
      )
    }

    socket.on('chat:message', onMessage)
    return () => {
      socket.off('chat:message', onMessage)
    }
  }, [appointmentId, dispatch])

  return query
}

export function useSendMessage(appointmentId) {
  const [trigger, state] = useSendMessageMutation()
  return useMutationCompat([(text) => trigger({ appointmentId, text }), state])
}

// Lightweight typing indicator: emits while the user types (throttled) and
// tracks whether the other participant is currently typing. Pure socket
// traffic — no REST call, so it stays outside RTK Query entirely.
export function useTypingIndicator(appointmentId) {
  const [otherTyping, setOtherTyping] = useState(false)
  const timeoutRef = useRef(undefined)
  const lastEmitRef = useRef(0)

  useEffect(() => {
    if (!appointmentId) return
    const socket = getSocket()
    if (!socket) return

    const onTyping = () => {
      setOtherTyping(true)
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setOtherTyping(false), 3000)
    }

    socket.on('chat:typing', onTyping)
    return () => {
      socket.off('chat:typing', onTyping)
      clearTimeout(timeoutRef.current)
    }
  }, [appointmentId])

  const notifyTyping = () => {
    const now = Date.now()
    if (now - lastEmitRef.current < 1500) return
    lastEmitRef.current = now
    getSocket()?.emit('chat:typing', { appointmentId })
  }

  return { otherTyping, notifyTyping }
}

export function useCallInfo(appointmentId) {
  return useGetCallInfoQuery(appointmentId, { skip: !appointmentId })
}

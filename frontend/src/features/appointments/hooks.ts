import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getSocket } from '@/lib/socket'
import * as api from './api'
import type { ChatMessage } from './types'

export function useMyAppointments() {
  return useQuery({ queryKey: ['appointments'], queryFn: api.listMyAppointments })
}

export function useAppointment(id: string) {
  return useQuery({ queryKey: ['appointments', id], queryFn: () => api.getAppointment(id), enabled: Boolean(id) })
}

export function useBookAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.bookAppointment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] }),
  })
}

export function useUpdateAppointmentStatus(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ status, expertNotes }: { status: string; expertNotes?: string }) =>
      api.updateAppointmentStatus(id, status, expertNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['appointments', id] })
    },
  })
}

const messagesKey = (appointmentId: string) => ['appointments', appointmentId, 'messages']

// Joins the appointment's chat room over the socket (server re-checks
// ownership on every join) and appends messages pushed in real time.
// Falls back to a slow poll in case the socket isn't connected — the REST
// endpoint stays the source of truth either way.
export function useMessages(appointmentId: string) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: messagesKey(appointmentId),
    queryFn: () => api.listMessages(appointmentId),
    enabled: Boolean(appointmentId),
    refetchInterval: 15000,
  })

  useEffect(() => {
    if (!appointmentId) return
    const socket = getSocket()
    if (!socket) return

    socket.emit('chat:join', appointmentId)

    const onMessage = (message: ChatMessage) => {
      if (message.appointment !== appointmentId) return
      queryClient.setQueryData<ChatMessage[] | undefined>(messagesKey(appointmentId), (current) => {
        if (!current) return current
        if (current.some((m) => m._id === message._id)) return current
        return [...current, message]
      })
    }

    socket.on('chat:message', onMessage)
    return () => {
      socket.off('chat:message', onMessage)
    }
  }, [appointmentId, queryClient])

  return query
}

export function useSendMessage(appointmentId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (text: string) => api.sendMessage(appointmentId, text),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: messagesKey(appointmentId) }),
  })
}

// Lightweight typing indicator: emits while the user types (throttled) and
// tracks whether the other participant is currently typing.
export function useTypingIndicator(appointmentId: string) {
  const [otherTyping, setOtherTyping] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
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

export function useCallInfo(appointmentId: string) {
  return useQuery({
    queryKey: ['appointments', appointmentId, 'call'],
    queryFn: () => api.getCallInfo(appointmentId),
    enabled: Boolean(appointmentId),
  })
}

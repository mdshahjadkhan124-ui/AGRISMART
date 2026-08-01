import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from './api'

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

export function useMessages(appointmentId: string) {
  return useQuery({
    queryKey: ['appointments', appointmentId, 'messages'],
    queryFn: () => api.listMessages(appointmentId),
    enabled: Boolean(appointmentId),
    refetchInterval: 5000,
  })
}

export function useSendMessage(appointmentId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (text: string) => api.sendMessage(appointmentId, text),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments', appointmentId, 'messages'] }),
  })
}

export function useCallInfo(appointmentId: string) {
  return useQuery({
    queryKey: ['appointments', appointmentId, 'call'],
    queryFn: () => api.getCallInfo(appointmentId),
    enabled: Boolean(appointmentId),
  })
}

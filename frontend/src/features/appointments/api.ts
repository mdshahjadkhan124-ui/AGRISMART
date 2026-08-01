import { api } from '@/lib/axios'
import type { Appointment, BookAppointmentInput, CallInfo, ChatMessage } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export async function bookAppointment(input: BookAppointmentInput) {
  const res = await api.post<ApiEnvelope<{ appointment: Appointment }>>('/appointments', input)
  return res.data.data.appointment
}

export async function listMyAppointments() {
  const res = await api.get<ApiEnvelope<{ appointments: Appointment[] }>>('/appointments')
  return res.data.data.appointments
}

export async function getAppointment(id: string) {
  const res = await api.get<ApiEnvelope<{ appointment: Appointment }>>(`/appointments/${id}`)
  return res.data.data.appointment
}

export async function updateAppointmentStatus(id: string, status: string, expertNotes?: string) {
  const res = await api.put<ApiEnvelope<{ appointment: Appointment }>>(`/appointments/${id}/status`, {
    status,
    expertNotes,
  })
  return res.data.data.appointment
}

export async function listMessages(appointmentId: string) {
  const res = await api.get<ApiEnvelope<{ messages: ChatMessage[] }>>(`/appointments/${appointmentId}/messages`)
  return res.data.data.messages
}

export async function sendMessage(appointmentId: string, text: string) {
  const res = await api.post<ApiEnvelope<{ message: ChatMessage }>>(`/appointments/${appointmentId}/messages`, { text })
  return res.data.data.message
}

export async function getCallInfo(appointmentId: string) {
  const res = await api.get<ApiEnvelope<{ call: CallInfo }>>(`/appointments/${appointmentId}/call`)
  return res.data.data.call
}

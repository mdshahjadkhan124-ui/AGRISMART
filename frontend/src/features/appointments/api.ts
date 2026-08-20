import { apiSlice } from '@/app/apiSlice'
import type { Appointment, BookAppointmentInput, CallInfo, ChatMessage } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export const appointmentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    bookAppointment: builder.mutation<Appointment, BookAppointmentInput>({
      query: (input) => ({ url: '/appointments', method: 'POST', body: input }),
      transformResponse: (res: ApiEnvelope<{ appointment: Appointment }>) => res.data.appointment,
      invalidatesTags: [{ type: 'Appointment', id: 'LIST' }],
    }),
    getMyAppointments: builder.query<Appointment[], void>({
      query: () => '/appointments',
      transformResponse: (res: ApiEnvelope<{ appointments: Appointment[] }>) => res.data.appointments,
      providesTags: (result) =>
        result
          ? [...result.map((a) => ({ type: 'Appointment' as const, id: a._id })), { type: 'Appointment' as const, id: 'LIST' }]
          : [{ type: 'Appointment' as const, id: 'LIST' }],
    }),
    getAppointment: builder.query<Appointment, string>({
      query: (id) => `/appointments/${id}`,
      transformResponse: (res: ApiEnvelope<{ appointment: Appointment }>) => res.data.appointment,
      providesTags: (_result, _error, id) => [{ type: 'Appointment', id }],
    }),
    updateAppointmentStatus: builder.mutation<Appointment, { id: string; status: string; expertNotes?: string }>({
      query: ({ id, status, expertNotes }) => ({ url: `/appointments/${id}/status`, method: 'PUT', body: { status, expertNotes } }),
      transformResponse: (res: ApiEnvelope<{ appointment: Appointment }>) => res.data.appointment,
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Appointment', id }, { type: 'Appointment', id: 'LIST' }],
    }),
    getMessages: builder.query<ChatMessage[], string>({
      query: (appointmentId) => `/appointments/${appointmentId}/messages`,
      transformResponse: (res: ApiEnvelope<{ messages: ChatMessage[] }>) => res.data.messages,
      providesTags: (_result, _error, appointmentId) => [{ type: 'Message', id: appointmentId }],
    }),
    sendMessage: builder.mutation<ChatMessage, { appointmentId: string; text: string }>({
      query: ({ appointmentId, text }) => ({ url: `/appointments/${appointmentId}/messages`, method: 'POST', body: { text } }),
      transformResponse: (res: ApiEnvelope<{ message: ChatMessage }>) => res.data.message,
      invalidatesTags: (_result, _error, { appointmentId }) => [{ type: 'Message', id: appointmentId }],
    }),
    getCallInfo: builder.query<CallInfo, string>({
      query: (appointmentId) => `/appointments/${appointmentId}/call`,
      transformResponse: (res: ApiEnvelope<{ call: CallInfo }>) => res.data.call,
    }),
  }),
})

export const {
  useBookAppointmentMutation,
  useGetMyAppointmentsQuery,
  useGetAppointmentQuery,
  useUpdateAppointmentStatusMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
  useGetCallInfoQuery,
} = appointmentsApi

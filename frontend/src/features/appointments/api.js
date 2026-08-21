import { apiSlice } from '@/app/apiSlice'

export const appointmentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    bookAppointment: builder.mutation({
      query: (input) => ({ url: '/appointments', method: 'POST', body: input }),
      transformResponse: (res) => res.data.appointment,
      invalidatesTags: [{ type: 'Appointment', id: 'LIST' }],
    }),
    getMyAppointments: builder.query({
      query: () => '/appointments',
      transformResponse: (res) => res.data.appointments,
      providesTags: (result) =>
        result
          ? [...result.map((a) => ({ type: 'Appointment', id: a._id })), { type: 'Appointment', id: 'LIST' }]
          : [{ type: 'Appointment', id: 'LIST' }],
    }),
    getAppointment: builder.query({
      query: (id) => `/appointments/${id}`,
      transformResponse: (res) => res.data.appointment,
      providesTags: (_result, _error, id) => [{ type: 'Appointment', id }],
    }),
    updateAppointmentStatus: builder.mutation({
      query: ({ id, status, expertNotes }) => ({ url: `/appointments/${id}/status`, method: 'PUT', body: { status, expertNotes } }),
      transformResponse: (res) => res.data.appointment,
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Appointment', id }, { type: 'Appointment', id: 'LIST' }],
    }),
    getMessages: builder.query({
      query: (appointmentId) => `/appointments/${appointmentId}/messages`,
      transformResponse: (res) => res.data.messages,
      providesTags: (_result, _error, appointmentId) => [{ type: 'Message', id: appointmentId }],
    }),
    sendMessage: builder.mutation({
      query: ({ appointmentId, text }) => ({ url: `/appointments/${appointmentId}/messages`, method: 'POST', body: { text } }),
      transformResponse: (res) => res.data.message,
      invalidatesTags: (_result, _error, { appointmentId }) => [{ type: 'Message', id: appointmentId }],
    }),
    getCallInfo: builder.query({
      query: (appointmentId) => `/appointments/${appointmentId}/call`,
      transformResponse: (res) => res.data.call,
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

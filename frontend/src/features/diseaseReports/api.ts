import { apiSlice } from '@/app/apiSlice'
import type { CreateDiseaseReportInput, DiseaseReport, RespondInput } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

function toFormData(input: CreateDiseaseReportInput) {
  const formData = new FormData()
  formData.append('cropName', input.cropName)
  formData.append('symptoms', input.symptoms)
  if (input.farmId) formData.append('farmId', input.farmId)
  formData.append('image', input.image)
  return formData
}

export const diseaseReportsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyDiseaseReports: builder.query<DiseaseReport[], void>({
      query: () => '/disease-reports',
      transformResponse: (res: ApiEnvelope<{ reports: DiseaseReport[] }>) => res.data.reports,
      providesTags: (result) =>
        result
          ? [...result.map((r) => ({ type: 'DiseaseReport' as const, id: r._id })), { type: 'DiseaseReport' as const, id: 'LIST' }]
          : [{ type: 'DiseaseReport' as const, id: 'LIST' }],
    }),
    getMyDiseaseReport: builder.query<DiseaseReport, string>({
      query: (id) => `/disease-reports/${id}`,
      transformResponse: (res: ApiEnvelope<{ report: DiseaseReport }>) => res.data.report,
      providesTags: (_result, _error, id) => [{ type: 'DiseaseReport', id }],
    }),
    createDiseaseReport: builder.mutation<DiseaseReport, CreateDiseaseReportInput>({
      // Passing a FormData body straight through — fetchBaseQuery uses the
      // Fetch API, which (like the browser) sets the multipart Content-Type
      // with boundary automatically as long as we never set it ourselves.
      query: (input) => ({ url: '/disease-reports', method: 'POST', body: toFormData(input) }),
      transformResponse: (res: ApiEnvelope<{ report: DiseaseReport }>) => res.data.report,
      invalidatesTags: [{ type: 'DiseaseReport', id: 'LIST' }],
    }),
    getDiseaseQueue: builder.query<DiseaseReport[], void>({
      query: () => '/disease-reports/queue',
      transformResponse: (res: ApiEnvelope<{ reports: DiseaseReport[] }>) => res.data.reports,
      providesTags: ['DiseaseQueue'],
    }),
    respondToDiseaseReport: builder.mutation<DiseaseReport, { id: string; input: RespondInput }>({
      query: ({ id, input }) => ({ url: `/disease-reports/${id}/respond`, method: 'PUT', body: input }),
      transformResponse: (res: ApiEnvelope<{ report: DiseaseReport }>) => res.data.report,
      invalidatesTags: ['DiseaseQueue'],
    }),
  }),
})

export const {
  useGetMyDiseaseReportsQuery,
  useGetMyDiseaseReportQuery,
  useCreateDiseaseReportMutation,
  useGetDiseaseQueueQuery,
  useRespondToDiseaseReportMutation,
} = diseaseReportsApi

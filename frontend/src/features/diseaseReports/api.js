import { apiSlice } from '@/app/apiSlice'

function toFormData(input) {
  const formData = new FormData()
  formData.append('cropName', input.cropName)
  formData.append('symptoms', input.symptoms)
  if (input.farmId) formData.append('farmId', input.farmId)
  formData.append('image', input.image)
  return formData
}

export const diseaseReportsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyDiseaseReports: builder.query({
      query: () => '/disease-reports',
      transformResponse: (res) => res.data.reports,
      providesTags: (result) =>
        result
          ? [...result.map((r) => ({ type: 'DiseaseReport', id: r._id })), { type: 'DiseaseReport', id: 'LIST' }]
          : [{ type: 'DiseaseReport', id: 'LIST' }],
    }),
    getMyDiseaseReport: builder.query({
      query: (id) => `/disease-reports/${id}`,
      transformResponse: (res) => res.data.report,
      providesTags: (_result, _error, id) => [{ type: 'DiseaseReport', id }],
    }),
    createDiseaseReport: builder.mutation({
      // Passing a FormData body straight through — fetchBaseQuery uses the
      // Fetch API, which (like the browser) sets the multipart Content-Type
      // with boundary automatically as long as we never set it ourselves.
      query: (input) => ({ url: '/disease-reports', method: 'POST', body: toFormData(input) }),
      transformResponse: (res) => res.data.report,
      invalidatesTags: [{ type: 'DiseaseReport', id: 'LIST' }],
    }),
    getDiseaseQueue: builder.query({
      query: () => '/disease-reports/queue',
      transformResponse: (res) => res.data.reports,
      providesTags: ['DiseaseQueue'],
    }),
    respondToDiseaseReport: builder.mutation({
      query: ({ id, input }) => ({ url: `/disease-reports/${id}/respond`, method: 'PUT', body: input }),
      transformResponse: (res) => res.data.report,
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

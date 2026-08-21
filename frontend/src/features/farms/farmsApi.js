import { apiSlice } from '@/app/apiSlice'

export const farmsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFarms: builder.query({
      query: () => '/farms',
      transformResponse: (res) => res.data.farms,
      providesTags: (result) =>
        result
          ? [...result.map((f) => ({ type: 'Farm', id: f._id })), { type: 'Farm', id: 'LIST' }]
          : [{ type: 'Farm', id: 'LIST' }],
    }),
    getFarm: builder.query({
      query: (farmId) => `/farms/${farmId}`,
      transformResponse: (res) => res.data.farm,
      providesTags: (_result, _error, farmId) => [{ type: 'Farm', id: farmId }],
    }),
    createFarm: builder.mutation({
      query: (input) => ({ url: '/farms', method: 'POST', body: input }),
      transformResponse: (res) => res.data.farm,
      invalidatesTags: [{ type: 'Farm', id: 'LIST' }],
    }),
    updateFarm: builder.mutation({
      query: ({ farmId, input }) => ({ url: `/farms/${farmId}`, method: 'PUT', body: input }),
      transformResponse: (res) => res.data.farm,
      invalidatesTags: (_result, _error, { farmId }) => [{ type: 'Farm', id: farmId }, { type: 'Farm', id: 'LIST' }],
    }),
    deleteFarm: builder.mutation({
      query: (farmId) => ({ url: `/farms/${farmId}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Farm', id: 'LIST' }],
    }),

    getCropHistory: builder.query({
      query: (farmId) => `/farms/${farmId}/crop-history`,
      transformResponse: (res) => res.data.cropHistory,
      providesTags: (_result, _error, farmId) => [{ type: 'CropHistory', id: farmId }],
    }),
    addCropHistory: builder.mutation({
      query: ({ farmId, input }) => ({ url: `/farms/${farmId}/crop-history`, method: 'POST', body: input }),
      transformResponse: (res) => res.data.entry,
      invalidatesTags: (_result, _error, { farmId }) => [{ type: 'CropHistory', id: farmId }],
    }),

    getSoilReports: builder.query({
      query: (farmId) => `/farms/${farmId}/soil-reports`,
      transformResponse: (res) => res.data.soilReports,
      providesTags: (_result, _error, farmId) => [{ type: 'SoilReport', id: farmId }],
    }),
    getLatestSoilReport: builder.query({
      query: (farmId) => `/farms/${farmId}/soil-reports/latest`,
      transformResponse: (res) => res.data.report,
      providesTags: (_result, _error, farmId) => [{ type: 'SoilReport', id: `${farmId}-latest` }],
    }),
    addSoilReport: builder.mutation({
      query: ({ farmId, input }) => ({ url: `/farms/${farmId}/soil-reports`, method: 'POST', body: input }),
      transformResponse: (res) => res.data.report,
      invalidatesTags: (_result, _error, { farmId }) => [
        { type: 'SoilReport', id: farmId },
        { type: 'SoilReport', id: `${farmId}-latest` },
      ],
    }),

    getActivities: builder.query({
      query: (farmId) => `/farms/${farmId}/activities`,
      transformResponse: (res) => res.data.activities,
      providesTags: (_result, _error, farmId) => [{ type: 'Activity', id: farmId }],
    }),
    addActivity: builder.mutation({
      query: ({ farmId, input }) => ({ url: `/farms/${farmId}/activities`, method: 'POST', body: input }),
      transformResponse: (res) => res.data.activity,
      invalidatesTags: (_result, _error, { farmId }) => [{ type: 'Activity', id: farmId }],
    }),
    deleteActivity: builder.mutation({
      query: ({ farmId, activityId }) => ({ url: `/farms/${farmId}/activities/${activityId}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, { farmId }) => [{ type: 'Activity', id: farmId }],
    }),
  }),
})

export const {
  useGetFarmsQuery,
  useGetFarmQuery,
  useCreateFarmMutation,
  useUpdateFarmMutation,
  useDeleteFarmMutation,
  useGetCropHistoryQuery,
  useAddCropHistoryMutation,
  useGetSoilReportsQuery,
  useGetLatestSoilReportQuery,
  useAddSoilReportMutation,
  useGetActivitiesQuery,
  useAddActivityMutation,
  useDeleteActivityMutation,
} = farmsApi

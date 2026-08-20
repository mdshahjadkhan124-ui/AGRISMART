import { apiSlice } from '@/app/apiSlice'
import type { CropHistoryEntry, Farm, FarmActivityEntry, SoilReport } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export type CreateFarmInput = Pick<Farm, 'name' | 'areaAcres' | 'soilType' | 'irrigationType'> & {
  location?: Farm['location']
}
export type AddCropHistoryInput = Pick<CropHistoryEntry, 'cropName' | 'season'> &
  Partial<Pick<CropHistoryEntry, 'sowingDate' | 'harvestDate' | 'yieldQuantityKg' | 'notes'>>
export type AddSoilReportInput = Pick<SoilReport, 'nitrogen' | 'phosphorus' | 'potassium' | 'ph'> &
  Partial<Pick<SoilReport, 'organicCarbon' | 'moisturePercent'>>
export type AddActivityInput = Pick<FarmActivityEntry, 'activityType' | 'title'> &
  Partial<Pick<FarmActivityEntry, 'description' | 'date' | 'costInr'>>

export const farmsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFarms: builder.query<Farm[], void>({
      query: () => '/farms',
      transformResponse: (res: ApiEnvelope<{ farms: Farm[] }>) => res.data.farms,
      providesTags: (result) =>
        result
          ? [...result.map((f) => ({ type: 'Farm' as const, id: f._id })), { type: 'Farm' as const, id: 'LIST' }]
          : [{ type: 'Farm' as const, id: 'LIST' }],
    }),
    getFarm: builder.query<Farm, string>({
      query: (farmId) => `/farms/${farmId}`,
      transformResponse: (res: ApiEnvelope<{ farm: Farm }>) => res.data.farm,
      providesTags: (_result, _error, farmId) => [{ type: 'Farm', id: farmId }],
    }),
    createFarm: builder.mutation<Farm, CreateFarmInput>({
      query: (input) => ({ url: '/farms', method: 'POST', body: input }),
      transformResponse: (res: ApiEnvelope<{ farm: Farm }>) => res.data.farm,
      invalidatesTags: [{ type: 'Farm', id: 'LIST' }],
    }),
    updateFarm: builder.mutation<Farm, { farmId: string; input: Partial<CreateFarmInput> }>({
      query: ({ farmId, input }) => ({ url: `/farms/${farmId}`, method: 'PUT', body: input }),
      transformResponse: (res: ApiEnvelope<{ farm: Farm }>) => res.data.farm,
      invalidatesTags: (_result, _error, { farmId }) => [{ type: 'Farm', id: farmId }, { type: 'Farm', id: 'LIST' }],
    }),
    deleteFarm: builder.mutation<void, string>({
      query: (farmId) => ({ url: `/farms/${farmId}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Farm', id: 'LIST' }],
    }),

    getCropHistory: builder.query<CropHistoryEntry[], string>({
      query: (farmId) => `/farms/${farmId}/crop-history`,
      transformResponse: (res: ApiEnvelope<{ cropHistory: CropHistoryEntry[] }>) => res.data.cropHistory,
      providesTags: (_result, _error, farmId) => [{ type: 'CropHistory', id: farmId }],
    }),
    addCropHistory: builder.mutation<CropHistoryEntry, { farmId: string; input: AddCropHistoryInput }>({
      query: ({ farmId, input }) => ({ url: `/farms/${farmId}/crop-history`, method: 'POST', body: input }),
      transformResponse: (res: ApiEnvelope<{ entry: CropHistoryEntry }>) => res.data.entry,
      invalidatesTags: (_result, _error, { farmId }) => [{ type: 'CropHistory', id: farmId }],
    }),

    getSoilReports: builder.query<SoilReport[], string>({
      query: (farmId) => `/farms/${farmId}/soil-reports`,
      transformResponse: (res: ApiEnvelope<{ soilReports: SoilReport[] }>) => res.data.soilReports,
      providesTags: (_result, _error, farmId) => [{ type: 'SoilReport', id: farmId }],
    }),
    getLatestSoilReport: builder.query<SoilReport, string>({
      query: (farmId) => `/farms/${farmId}/soil-reports/latest`,
      transformResponse: (res: ApiEnvelope<{ report: SoilReport }>) => res.data.report,
      providesTags: (_result, _error, farmId) => [{ type: 'SoilReport', id: `${farmId}-latest` }],
    }),
    addSoilReport: builder.mutation<SoilReport, { farmId: string; input: AddSoilReportInput }>({
      query: ({ farmId, input }) => ({ url: `/farms/${farmId}/soil-reports`, method: 'POST', body: input }),
      transformResponse: (res: ApiEnvelope<{ report: SoilReport }>) => res.data.report,
      invalidatesTags: (_result, _error, { farmId }) => [
        { type: 'SoilReport', id: farmId },
        { type: 'SoilReport', id: `${farmId}-latest` },
      ],
    }),

    getActivities: builder.query<FarmActivityEntry[], string>({
      query: (farmId) => `/farms/${farmId}/activities`,
      transformResponse: (res: ApiEnvelope<{ activities: FarmActivityEntry[] }>) => res.data.activities,
      providesTags: (_result, _error, farmId) => [{ type: 'Activity', id: farmId }],
    }),
    addActivity: builder.mutation<FarmActivityEntry, { farmId: string; input: AddActivityInput }>({
      query: ({ farmId, input }) => ({ url: `/farms/${farmId}/activities`, method: 'POST', body: input }),
      transformResponse: (res: ApiEnvelope<{ activity: FarmActivityEntry }>) => res.data.activity,
      invalidatesTags: (_result, _error, { farmId }) => [{ type: 'Activity', id: farmId }],
    }),
    deleteActivity: builder.mutation<void, { farmId: string; activityId: string }>({
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

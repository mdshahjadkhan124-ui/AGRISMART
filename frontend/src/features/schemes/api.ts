import { apiSlice } from '@/app/apiSlice'
import type { GovernmentScheme, SchemeInput } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

type SchemeParams = { category?: string; state?: string; search?: string; includeInactive?: boolean }

export const schemesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSchemes: builder.query<GovernmentScheme[], SchemeParams | void>({
      query: (params) => ({ url: '/schemes', params: params ?? {} }),
      transformResponse: (res: ApiEnvelope<{ schemes: GovernmentScheme[] }>) => res.data.schemes,
      providesTags: (result) =>
        result
          ? [...result.map((s) => ({ type: 'Scheme' as const, id: s._id })), { type: 'Scheme' as const, id: 'LIST' }]
          : [{ type: 'Scheme' as const, id: 'LIST' }],
    }),
    getScheme: builder.query<GovernmentScheme, string>({
      query: (id) => `/schemes/${id}`,
      transformResponse: (res: ApiEnvelope<{ scheme: GovernmentScheme }>) => res.data.scheme,
      providesTags: (_result, _error, id) => [{ type: 'Scheme', id }],
    }),
    createScheme: builder.mutation<GovernmentScheme, SchemeInput>({
      query: (input) => ({ url: '/schemes', method: 'POST', body: input }),
      transformResponse: (res: ApiEnvelope<{ scheme: GovernmentScheme }>) => res.data.scheme,
      invalidatesTags: [{ type: 'Scheme', id: 'LIST' }],
    }),
    updateScheme: builder.mutation<GovernmentScheme, { id: string; input: Partial<SchemeInput> }>({
      query: ({ id, input }) => ({ url: `/schemes/${id}`, method: 'PUT', body: input }),
      transformResponse: (res: ApiEnvelope<{ scheme: GovernmentScheme }>) => res.data.scheme,
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Scheme', id }, { type: 'Scheme', id: 'LIST' }],
    }),
    deleteScheme: builder.mutation<void, string>({
      query: (id) => ({ url: `/schemes/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Scheme', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetSchemesQuery,
  useGetSchemeQuery,
  useCreateSchemeMutation,
  useUpdateSchemeMutation,
  useDeleteSchemeMutation,
} = schemesApi

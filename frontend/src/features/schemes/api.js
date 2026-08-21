import { apiSlice } from '@/app/apiSlice'

export const schemesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSchemes: builder.query({
      query: (params) => ({ url: '/schemes', params: params ?? {} }),
      transformResponse: (res) => res.data.schemes,
      providesTags: (result) =>
        result
          ? [...result.map((s) => ({ type: 'Scheme', id: s._id })), { type: 'Scheme', id: 'LIST' }]
          : [{ type: 'Scheme', id: 'LIST' }],
    }),
    getScheme: builder.query({
      query: (id) => `/schemes/${id}`,
      transformResponse: (res) => res.data.scheme,
      providesTags: (_result, _error, id) => [{ type: 'Scheme', id }],
    }),
    createScheme: builder.mutation({
      query: (input) => ({ url: '/schemes', method: 'POST', body: input }),
      transformResponse: (res) => res.data.scheme,
      invalidatesTags: [{ type: 'Scheme', id: 'LIST' }],
    }),
    updateScheme: builder.mutation({
      query: ({ id, input }) => ({ url: `/schemes/${id}`, method: 'PUT', body: input }),
      transformResponse: (res) => res.data.scheme,
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Scheme', id }, { type: 'Scheme', id: 'LIST' }],
    }),
    deleteScheme: builder.mutation({
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

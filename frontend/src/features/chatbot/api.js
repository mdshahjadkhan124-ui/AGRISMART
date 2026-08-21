import { apiSlice } from '@/app/apiSlice'

export const chatbotApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    queryChatbot: builder.mutation({
      query: ({ message, lang }) => ({ url: '/chatbot/query', method: 'POST', body: { message, lang } }),
      transformResponse: (res) => res.data,
    }),
  }),
})

export const { useQueryChatbotMutation } = chatbotApi

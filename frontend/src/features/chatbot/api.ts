import { apiSlice } from '@/app/apiSlice'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export interface ChatbotResult {
  matched: boolean
  id: string | null
  answer: string
}

export const chatbotApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    queryChatbot: builder.mutation<ChatbotResult, { message: string; lang: 'en' | 'hi' }>({
      query: ({ message, lang }) => ({ url: '/chatbot/query', method: 'POST', body: { message, lang } }),
      transformResponse: (res: ApiEnvelope<ChatbotResult>) => res.data,
    }),
  }),
})

export const { useQueryChatbotMutation } = chatbotApi

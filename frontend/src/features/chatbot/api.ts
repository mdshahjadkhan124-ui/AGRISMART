import { api } from '@/lib/axios'

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

export async function queryChatbot(message: string, lang: 'en' | 'hi') {
  const res = await api.post<ApiEnvelope<ChatbotResult>>('/chatbot/query', { message, lang })
  return res.data.data
}

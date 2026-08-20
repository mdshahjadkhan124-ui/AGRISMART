import { useMutationCompat } from '@/app/rtkQueryCompat'
import { useQueryChatbotMutation } from './api'
import type { ChatbotResult } from './api'

export function useQueryChatbot(lang: 'en' | 'hi') {
  const [trigger, state] = useQueryChatbotMutation()
  return useMutationCompat<string, ChatbotResult>([(message: string) => trigger({ message, lang }), state])
}

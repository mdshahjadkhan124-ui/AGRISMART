import { useMutationCompat } from '@/app/rtkQueryCompat'
import { useQueryChatbotMutation } from './api'

export function useQueryChatbot(lang) {
  const [trigger, state] = useQueryChatbotMutation()
  return useMutationCompat([(message) => trigger({ message, lang }), state])
}

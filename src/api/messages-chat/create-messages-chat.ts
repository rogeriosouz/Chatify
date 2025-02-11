import { api } from '@/lib/api'

interface CreateMessageChatRequest {
  chatId: string
  message: string
}

export async function createMessageChat({
  chatId,
  message,
}: CreateMessageChatRequest) {
  const { data } = await api.post('/messages-chat', { chatId, message })

  return data
}

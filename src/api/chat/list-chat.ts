import { api } from '@/lib/api'

type ListChatRequest = {
  chatId: string
}

export async function listChat({ chatId }: ListChatRequest) {
  const { data } = await api.get(`/chats/${chatId}`)

  return data
}

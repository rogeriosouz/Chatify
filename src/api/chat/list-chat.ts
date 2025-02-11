import { api } from '@/lib/api'

type ListChatRequest = {
  friendId: string
}

export async function listChat({ friendId }: ListChatRequest) {
  const { data } = await api.get(`/chats/${friendId}`)

  return data
}

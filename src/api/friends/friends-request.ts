import { api } from '@/lib/api'

export interface Friends {
  id: string
  userId: string
  nameFriend: string
  friendId: string
  status: string | null
  createdAt: string
}

export interface FriendsRequesType {
  friendsRequest: Friends[]
}

export async function friendsRequest() {
  const { data } = await api.get('/friends-request')

  return data
}

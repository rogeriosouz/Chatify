import { api } from '@/lib/api'

interface AddFriendsRequest {
  nameFriend: string
}

export async function addFriends({ nameFriend }: AddFriendsRequest) {
  const { data } = await api.post('/friends-request', {
    nameFriend,
  })

  return data
}

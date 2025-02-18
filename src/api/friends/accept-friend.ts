import { api } from '@/lib/api'

interface AcceptFriendRequest {
  friendId: string
}

export async function acceptFriend({ friendId }: AcceptFriendRequest) {
  const { data } = await api.post('/accept-friend', {
    friendId,
  })

  return data
}

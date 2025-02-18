import { api } from '@/lib/api'

interface RefuseFriendRequest {
  friendId: string
}

export async function refuseFriend({ friendId }: RefuseFriendRequest) {
  const { data } = await api.post('/refuse-friend', {
    friendId,
  })

  return data
}

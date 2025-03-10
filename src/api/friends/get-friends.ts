import { api } from '@/lib/api'

interface GetFriendsRequest {
  search?: string
}

export async function getFriends({ search }: GetFriendsRequest) {
  if (!search) {
    const { data } = await api.get(`/friends`)

    return data
  }

  const { data } = await api.get(`/friends?search=${search}`)

  return data
}

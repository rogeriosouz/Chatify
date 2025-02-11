import { api } from '@/lib/api'

export async function getFriends() {
  const { data } = await api.get('/friends')

  return data
}

import { api } from '@/lib/api'

export async function refreshToken() {
  const { data } = await api.patch('/auth/refresh-token')

  return data
}

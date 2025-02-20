import { api } from '@/lib/api'

interface GetUserRequest {
  nameUser: string
}

export async function getUser({ nameUser }: GetUserRequest) {
  const { data } = await api.get(`/get-user/${nameUser}`)

  return data
}

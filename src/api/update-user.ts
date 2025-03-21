import { api } from '@/lib/api'

interface UpdateUserRequest {
  name?: string
  imageUrl?: string
}

export async function updateUser({ name, imageUrl }: UpdateUserRequest) {
  const { data } = await api.put('/update-user', { name, imageUrl })

  return data
}

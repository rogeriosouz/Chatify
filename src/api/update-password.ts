import { api } from '@/lib/api'

interface UpdatePasswordRequest {
  password: string
  newPassword: string
}

export async function updatePassword({
  password,
  newPassword,
}: UpdatePasswordRequest) {
  const { data } = await api.patch('/update-password', {
    password,
    newPassword,
  })

  return data
}

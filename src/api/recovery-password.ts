import { api } from '@/lib/api'

interface RecoveryPasswordRequest {
  token: string
  newPassword: string
}

export async function recoveryPassword({
  token,
  newPassword,
}: RecoveryPasswordRequest) {
  const { data } = await api.post('/auth/recovery-password', {
    token,
    newPassword,
  })

  return data
}

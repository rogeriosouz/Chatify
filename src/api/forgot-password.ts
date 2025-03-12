import { api } from '@/lib/api'

interface ForgotPasswordRequest {
  email: string
}

export async function forgotPassword({ email }: ForgotPasswordRequest) {
  const { data } = await api.post('/auth/forgot-password', { email })

  return data
}

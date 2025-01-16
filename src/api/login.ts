import { api } from '@/lib/api'

interface LoginRequest {
  email: string
  password: string
}

export async function login({ email, password }: LoginRequest) {
  const { data } = await api.post('/auth/authentication', {
    email,
    password,
  })

  return data
}

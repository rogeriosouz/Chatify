import { api } from '@/lib/api'

interface RegisterRequest {
  name: string
  email: string
  password: string
}

export async function register({ name, email, password }: RegisterRequest) {
  const { data } = await api.post('/auth/register', {
    name,
    email,
    password,
  })

  return data
}

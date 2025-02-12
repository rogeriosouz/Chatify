'use server'
import { cookies } from 'next/headers'

export async function deleteCookieServer(name: string) {
  const cookie = await cookies()

  cookie.set({
    name,
    value: '',
    expires: new Date(0),
    path: '/',
  })
}

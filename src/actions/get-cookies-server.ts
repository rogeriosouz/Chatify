'use server'
import { cookies } from 'next/headers'

export async function getCookieServer(name: string) {
  const cookie = (await cookies()).get(name)

  return cookie
}

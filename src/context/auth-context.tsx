'use client'
import { deleteCookieServer } from '@/actions/deleteCookieServer'
import { login } from '@/api/login'
import { api } from '@/lib/api'
import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import { decode } from 'jsonwebtoken'
import { useRouter } from 'next/navigation'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { toast } from 'sonner'
import { ZodError } from 'zod'

export type User = {
  id: string
  email: string
  name: string
}

export type JwtResponse = {
  exp: number
  user: User
}

type AuthContextType = {
  user: null | User
  status: 'pending' | 'success' | 'error' | 'idle'
  isAuthenticated: boolean
  logout: () => void
  signin: ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => Promise<void>
}

const UseAuthContext = createContext({} as AuthContextType)

export function AuthContextProvider({ children }: { children: ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  const [user, setUser] = useState<null | User>(null)
  const [status, setStatus] = useState<
    'pending' | 'success' | 'error' | 'idle'
  >('idle')

  const { push } = useRouter()

  const token = getCookie('auth-token:front-token')
  useEffect(() => {
    if (token) {
      const { user } = decode(token as string) as JwtResponse
      setUser({
        id: user.id,
        email: user.email,
        name: user.name,
      })
    }
  }, [token])

  async function signin({
    email,
    password,
  }: {
    email: string
    password: string
  }) {
    setStatus('pending')
    try {
      const data = await login({
        email,
        password,
      })

      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
      })

      const { exp } = decode(data.token) as JwtResponse
      const expirationTimestampInSeconds = exp
      const currentTimestampInSeconds = Math.floor(Date.now() / 1000)

      const timeRemainingInSeconds =
        expirationTimestampInSeconds - currentTimestampInSeconds
      const timeRemainingInMilliseconds = timeRemainingInSeconds * 1000

      const expires = new Date(Date.now() + timeRemainingInMilliseconds)

      api.defaults.headers.authorization = `Bearer ${data.token}`

      setCookie('auth-token:front-token', data.token, {
        expires,
      })

      toast.success('Success authenticated', {
        className: '!w-[400px] !h-[70px] !bg-green-500 !text-black',
      })

      setTimeout(() => {
        push('/')
        setStatus('success')
      }, 1000)
    } catch (error) {
      console.log(error)
      setStatus('error')
      const err = error as {
        response: { data: { statusCode: number; message: string } }
      }

      if (error instanceof ZodError) {
        toast.error('Invalid credential', {
          className: '!w-[400px] !h-[70px] !bg-red-500 !text-white',
        })

        return
      }
      toast.error(err.response.data.message, {
        className: '!w-[400px] !h-[70px] !bg-red-500 !text-white',
      })
    }
  }

  function logout() {
    if (user) {
      localStorage.setItem('usersOnline', JSON.stringify([]))
      deleteCookie('auth-token:front-token')
      deleteCookieServer('refreshToken')

      push('/auth/login')
    }
  }

  const isAuthenticated = !!user

  const values = {
    user,
    signin,
    status,
    isAuthenticated,
    logout,
  }

  return (
    <UseAuthContext.Provider value={values}>{children}</UseAuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(UseAuthContext)

  return context
}
